# 設計書: Pump On !（CPB英会話シミュレーター）

対応する要件定義書: docs/requirements.md

## 1. コンセプト

「手術の流れ（タイムライン）」を軸に、各シーンで **聞く → 選ぶ → 話す → 流れの中で会話する** の順に負荷を上げる。
最終ゴールはシミュレーター（症例を通しで進め、相手の英語に即答する）で、シーン学習・ドリル・復習はすべてそのための部品。

```
基本（手術室英語の型: closed-loop・数字・聞き返し）
  ↓
シーン学習（解説 → フレーズ → 会話 → ドリル）× 手術の流れ12シーン + トラブル6シーン
  ↓
シミュレーター（症例を通しで / シーン単位で）── 振り返り → 復習（間隔反復）へ自動登録
```

## 2. 技術スタック

| 区分 | 採用 | 理由 |
|------|------|------|
| 言語 / フレームワーク | TypeScript 5.9 + React 19 + Vite 7 | ユーザーの既存教材（CIEDs問題集）と同系統。安定版で揃える（Vite 8 / TS 7 は採用見送り、下記） |
| スタイル | Tailwind CSS 4（@tailwindcss/vite）＋ CSS 変数のデザイントークン | 一貫した余白・色。ダークテーマ（シミュレーターのコンソール表示）を変数で切替 |
| ルーティング | wouter 3（ハッシュ方式） | 1.5KB。GitHub Pages のサブパスでもリロードで 404 にならない |
| 状態・保存 | zustand 5 + persist（localStorage、キー `pumpon:v1`） | 学習記録は小さい（数百KB未満）。書き出し/読み込みで退避 |
| PWA | vite-plugin-pwa 1.3（generateSW、更新は「更新ボタン」方式） | Service Worker と manifest を自動生成。シミュレーター中に勝手に再読込しない |
| 音声 | Web Speech API（speechSynthesis / SpeechRecognition）、MediaRecorder、Web Audio（効果音・環境音を合成） | 音声ファイル不要でオフライン動作。音声認識は使える端末のみ |
| アイコン | lucide-react 0.577（同梱、外部通信なし） | UI アイコン |
| テスト / lint | Vitest 4、ESLint 9 + typescript-eslint + react-hooks | 教材整合性・エンジン（復習・採点・数値読み上げ）を自動検証 |

依存はすべて npm でバンドルし、実行時の外部通信はゼロにする（CDN・外部フォント・解析タグなし）。

## 3. ディレクトリ構成

```
Pump On!/
├─ docs/            requirements.md, design.md, content-guidelines.md, research/
├─ design/icon/     Codex 生成のアイコン候補と採用版
└─ app/             Vite プロジェクト（node_modules は node_modules.nosync への symlink: iCloud 同期対策）
   ├─ index.html
   ├─ public/       icons/, apple-touch-icon.png, favicon.svg
   ├─ scripts/      export-review-sheet.mjs（監修用一覧の書き出し）
   ├─ src/
   │  ├─ main.tsx, App.tsx（タブ＋ルート）
   │  ├─ styles/index.css（Tailwind とトークン）
   │  ├─ content/   types.ts, roles.ts, phases.ts, sources.ts, glossary.ts,
   │  │             phrases/<phase>.ts, dialogues/<phase>.ts, cases/<case>.ts, index.ts
   │  ├─ engine/    speech.ts, tts-normalize.ts, recognition.ts, recorder.ts, sfx.ts,
   │  │             srs.ts, drills.ts, match.ts, numbers.ts, scoring.ts, xp.ts, badges.ts, sim.ts
   │  ├─ store/     progress.ts, settings.ts
   │  ├─ components/ 共通UI（AudioButton, PhraseCard, RoleChip, StatusPill, NoteList, HudPanel, ProgressRing, Sheet, Toast …）
   │  └─ screens/   Home, Learn, Phase, Drill, Dialogue, SimList, SimPlay, SimDebrief, Review, Progress,
   │                Settings, Glossary, Numbers, Sources, Onboarding
   └─ tests/        content.test.ts, srs.test.ts, match.test.ts, numbers.test.ts, drills.test.ts, sim.test.ts
```

## 4. データモデル（教材）

教材は `src/content/` の型付き TS ファイル。実行時に生成しない。全項目に監修状態を持たせる。

```ts
type RoleId = 'surgeon' | 'assistant' | 'anesthesiologist' | 'perfusionist' | 'nurse' | 'team';
// 学習者は常に perfusionist（あなた）
type Register = 'simple' | 'natural' | 'shorthand';   // 簡単 / 自然（標準） / 現場の短縮形
type Region = 'common' | 'US' | 'UK' | 'AU' | 'EU';
type NoteKind = 'facility' | 'region' | 'caution' | 'verify' | 'tip';
// facility=施設差あり, region=地域差, caution=安全上の注意, verify=要確認（根拠未確認）, tip=学習のコツ
type ReviewStatus = 'ai-draft' | 'needs-check' | 'reviewed';
// ai-draft=AI下書き・臨床未監修（初期値）, needs-check=要確認を含む, reviewed=監修済み（監修者のみが変更）

interface Phase {
  id: PhaseId; order: number; group: 'basics' | 'flow' | 'trouble';
  titleJa: string; titleEn: string; summary: string;        // 1行
  overview: string[];      // 何が起きているか・誰が誰に何を伝えるか（日本語）
  keyPoints: string[];     // コミュニケーション上・安全上の要点
  listenFor: Keyword[];    // このシーンでよく聞く語
  sources: SourceId[]; status: ReviewStatus;
}

interface Phrase {
  id: string; phase: PhaseId;
  speaker: RoleId; to: RoleId | 'all';
  en: string;              // 代表表現（自然な標準形）。表示用
  tts?: string;            // 読み上げ用（数値・略語の現場読み。省略時は自動正規化）
  ja: string; when: string;
  variants: Variant[];     // { en, register, region?, note?, tts? }
  replies: Reply[];        // 典型的な返答（closed-loop の復唱を含む） { role, en, ja, tts? }
  keywords: Keyword[];     // 聞き取るべき語・数値 { en, ja, kind: 'term'|'number'|'time' }
  notes?: Note[];          // { kind, text, sources? }
  level: 1 | 2 | 3;        // 1=基本 2=標準 3=実践（短縮形・速い会話）
  sources?: SourceId[]; status: ReviewStatus;
}

interface Dialogue {
  id: string; phase: PhaseId; title: string; setting: string;   // 状況（日本語）
  lines: { role: RoleId; en: string; ja: string; tts?: string; phraseId?: string }[];
  level: 1 | 2 | 3; notes?: Note[]; status: ReviewStatus;
}

interface SimCase {
  id: string; titleJa: string; titleEn: string; difficulty: 1 | 2 | 3; minutes: number;
  synopsis: string; patient: string;  // 架空
  tags: ('standard' | 'trouble')[];
  initialHud: HudState; beats: Beat[]; notes?: Note[]; sources?: SourceId[]; status: ReviewStatus;
}
interface Beat {
  id: string; phase: PhaseId; clock?: string;      // 模擬時刻 "09:42"
  narration?: string;                              // 状況（日本語）
  hud?: Partial<HudState>;                         // この時点の表示の変化
  lines?: DialogueLine[];                          // 相手の発話（音声で流れる）
  task?: RespondTask | CatchTask | SpeakTask;
}
// respond: 状況に合う返答を選ぶ（正解1つ、誤答は「数値違い」「安全でない」「復唱なし」「不自然」などに理由付き）
// catch:   聞こえた数値・語を選ぶ
// speak:   自分で言う（音声認識 or 録音して自己評価）。keywords で自動判定
```

整合性テスト（tests/content.test.ts）: ID 重複なし、参照（phraseId / SourceId / PhaseId）の切れなし、respond の正解はちょうど1つ、
catch の正解が選択肢に含まれる、speak の keywords が target に含まれる、`en` に日本語が混ざらない、全項目に status がある。

## 5. 学習データ（端末内）

```ts
interface ProgressState {
  version: 1;
  xp: number; streak: { current: number; best: number; lastDay: string /* YYYY-MM-DD */ };
  daily: Record<string /*day*/, number /*xp*/>;
  phrases: Record<string, { box: 0|1|2|3|4|5|6; due: string; seen: number; right: number; wrong: number; last: string }>;
  phases: Record<PhaseId, { drillBest: number; drillRuns: number; dialogueDone: string[] }>;
  sims: Record<string, { bestScore: number; runs: number; bestRank: string; modes: string[] }>;
  counters: { closedLoop: number; numbersRight: number; spoken: number; sessions: number };
  badges: Record<string, string /*取得日*/>;
  onboarded: boolean;
}
```

- 復習（Leitner 方式）: box 1→1日, 2→2日, 3→4日, 4→8日, 5→16日, 6→32日。正解で+1、不正解で box 1（翌日）。初出は box 0（当日中）。
- シーン習熟度 = そのシーンのフレーズの box 平均 / 6（未学習は0）。
- XP: ドリル正解 +10、シミュレーター課題 +15（リアルOR は×1.5）、発話練習 +5、復習 +5、デイリー目標（既定 50XP）達成で +20。
- レベル: 累積XP の閾値で 8 段階（Priming Rookie → … → Chief Perfusionist）。
- 書き出し: JSON をダウンロード（共有シートが使えれば共有）。読み込み: ファイル選択。

## 6. 主要な処理フロー

- **シーン学習**: Learn（手術の流れマップ）→ Phase 画面（解説 / フレーズ / 会話 / ドリル）。フレーズカードは再生・変種（簡単/自然/短縮）・返答・注記を展開表示。
- **会話（ロールプレイ）**: 相手の行は自動再生し、自分（perfusionist）の行で一時停止 → お手本を聞く/自分で言う/録音して聞き比べ → 次へ。字幕（英/日）の表示を切替。
- **ドリル**: フレーズから問題を生成（聞いて意味 / 状況から英語 / 数値キャッチ / 相手の発話に正しい返答 / 短縮形の意味 / 会話の並べ替え / 発話）。結果で復習データと XP を更新。
- **シミュレーター**: 症例とモード（ガイド / スタンダード / リアルOR）を選ぶ → ビートごとに「状況（日本語）→ モニター表示更新 → 相手の発話（音声・字幕はモード次第）→ 課題 → フィードバック」。終了で振り返り（得点・ランク・聞き逃し・言えなかった表現）→ 間違えたフレーズを復習へ。シーン単位の短縮版（標準症例の該当シーンのみ）も遊べる。
  - ガイド: 英語字幕＋日本語訳、ゆっくり、時間制限なし、ヒントあり
  - スタンダード: 英語字幕は音声のあと、日本語はフィードバック時、通常速度
  - リアルOR: 音声のみ（再生し直しは1回まで）、時間制限、手術室の環境音（任意）
- **数値キャッチ（ミニゲーム）**: 流量・圧・ACT・温度・時刻・Hb・K・投与量などを現場の読み方で読み上げ、近い数値（15/50、4.5/5.4 など）から選ぶ。値はランダムだが表示範囲は現実的な範囲に限定し「例」と明示。
- **復習**: 期限の来たフレーズを最大20件。相手のフレーズは聞き取り型、自分のフレーズは「日本語→英語（選ぶ/言う）」型。

## 7. 画面 / インターフェース一覧

| 画面 | 役割 |
|---|---|
| オンボーディング（初回） | アプリの説明、4つの学び方、教育用の注意（監修状態の意味・数値は例）、音声テスト（iOS の音声を有効化） |
| ホーム（タブ） | 連続日数・今日の目標・レベル、続きから、今日の復習件数、おすすめの次のシーン、シミュレーターへの近道 |
| 学ぶ（タブ） | 手術の流れマップ（送血＝赤/脱血＝青の回路線でシーンをつなぐ縦タイムライン）、トラブル対応、基本、用語集、数値キャッチ |
| シーン | 解説 / フレーズ / 会話 / ドリル の4区分 |
| ドリル | 8〜10問、問題形式を混在 |
| シミュレーター（タブ） | 症例一覧（難易度・所要時間・ベスト）→ プレイ（上: 人工心肺コンソール風モニター、中: 交信ログ、下: 課題パネル）→ 振り返り |
| 復習（タブ） | 期限件数、開始、苦手一覧 |
| 記録（タブ） | レベル・XP・習熟度・バッジ・学習カレンダー、設定への入口 |
| 設定 | 音声（話者ごとの声・速度・テスト）、字幕の既定、環境音、音声認識の使用、データ（書き出し/読み込み/初期化）、このアプリについて（注意・監修状態・根拠一覧・版） |

デザイン: 明るい面（学習）と暗いコンソール（シミュレーター）の2面構成。色は ネイビー #0B1F3A・ティール #12B5A6（主色）・
送血赤 #F0435A・脱血青 #3D8BFF・注意アンバー。話者は色とアイコンで区別。和文はOS標準フォント、数値は等幅数字。
iPhone のセーフエリアに対応し、タップ領域は 44pt 以上。動きを減らす設定ではアニメーションを止める。

## 8. 音声まわり

- 読み上げ: 話者ごとに声を割り当て（外科医・麻酔科医・看護師・自分）。端末の英語音声（en-US/en-GB/en-AU 等）から自動選択、設定で変更可。
  初回はユーザー操作の中で無音の発話を行い iOS の制限を解除。`onend` が来ない場合に備え文字数からのタイムアウトで次へ進める。
- 読み上げ用正規化（tts-normalize）: 略語（ACT→"A C T"、CVP→"C V P" 等）と数値の現場読み（ACT 480→"four eighty"、09:42→"nine forty-two"、4.5→"four point five"）。教材側の `tts` が最優先。
- 音声認識: 使える端末でのみ有効化（設定で ON/OFF）。正規化（数字⇔英単語・略語）したうえで keywords の網羅率と語の一致率で判定。使えない端末は「録音→お手本と聞き比べ→自己評価（できた/おしい/もう一回）」。
- 効果音・環境音: Web Audio で合成（ファイルなし）。消音設定を尊重。

## 9. 医学的正確性の担保

- 教材の初期状態はすべて `ai-draft`（画面に「AI下書き・臨床未監修」を常時表示）。根拠未確認の内容は `verify` 注記で「要確認」。
- 会話中の数値は例であることをシーン解説・シミュレーター冒頭に明示。施設差（例: 昇圧薬を誰が投与するか、心筋保護液の種類と間隔）は `facility` 注記。
- 根拠一覧（sources.ts）は docs/research の出典と対応させ、アプリ内「根拠・出典」画面で表示。
- 監修用一覧: `npm run review-sheet` で全教材を CSV（BOM付きUTF-8）と Markdown に書き出し、監修者が status を付け直せるようにする。

## 10. タスク分解

| # | タスク | 依存 | 対象ファイル | 受け入れ条件 |
|---|--------|------|--------------|--------------|
| 1 | 雛形（Vite/React/TS/Tailwind/PWA/Vitest/ESLint）、タブとルート、デザイントークン | なし | app/ 直下設定, src/main.tsx, App.tsx, styles/ | build/typecheck/lint/test が通り、5タブが表示される |
| 2 | 教材の型・roles・phases 骨格・sources・整合性テスト | 1 | content/types.ts, roles.ts, phases.ts, sources.ts, index.ts, tests/content.test.ts | テストが通る |
| 3 | 教材執筆（フレーズ・会話）A: 基本〜冷却 / B: 遮断〜プロタミン / C: トラブル6種＋用語集 | 2, 調査01/02 | content/phrases/*, content/dialogues/*, content/glossary.ts（グループごとに別ファイル） | 整合性テストが通る。各フレーズに変種・返答・キーワード・注記・status |
| 4 | エンジン（speech/tts-normalize/recognition/recorder/sfx/srs/drills/match/numbers/scoring/xp/badges/sim）＋単体テスト | 2 | engine/*, tests/* | テストが通る |
| 5 | 共通コンポーネントと学習画面（Home/Learn/Phase/Drill/Dialogue） | 1,2,4 | components/*, screens/ 該当 | 主要操作がブラウザで動く |
| 6 | シミュレーター（症例データ3本以上・SimList/SimPlay/HUD/Debrief） | 3,4,5 | content/cases/*, screens/Sim*, components/HudPanel | 標準症例を最後まで通せる。3モード動作 |
| 7 | 復習・記録・設定・オンボーディング・根拠・用語集・数値キャッチ | 4,5 | screens/ 該当, store/* | 操作が動き、書き出し/読み込みが往復する |
| 8 | PWA 仕上げ（アイコン、manifest、更新通知、セーフエリア、オフライン） | 1, アイコン | public/*, vite.config.ts, index.html | iOS シミュレータでホーム画面追加→オフライン起動 |
| 9 | 監修用一覧の書き出しスクリプト | 3 | scripts/export-review-sheet.mjs | CSV/MD が出力される |
| 10 | 統合検証 → 独立レビュー → 修正 → 完了報告 | 全部 | — | 「完成」条件を満たす |

並列: #3（教材, 3体）と #4/#5（コード, メイン）は対象ファイルが重ならないので同時に進める。

## 11. 検証方法

- ビルド: `cd app && npm run build`
- 型チェック / lint: `npm run typecheck` / `npm run lint`
- テスト: `npm test`（教材整合性・復習・採点・数値読み上げ・ドリル生成・シミュレーター進行）
- 起動確認: `npm run preview` をブラウザ（デスクトップ幅・iPhone 幅）で全画面を操作。iOS シミュレータ（iPhone, iOS 27）の Safari で http://localhost:4173 を開き、表示・音声・ホーム画面追加・オフライン起動を確認
- 外部通信ゼロ: dist 内に `http://` `https://` の外部参照がないことを grep で確認（自サイト内の相対参照のみ）
- iCloud 重複ファイル: `find app/src -name "* 2.*"` が0件

## 12. 検討した代替案

- Vite 8 / TypeScript 7 / Vitest 5 / ESLint 10（2026-10 時点の最新）: 却下。メジャー更新直後で、既存教材と同じ安定構成のほうが保守と検証が確実。将来の更新は容易。
- ネイティブ（SwiftUI）/ Capacitor: 今回はユーザー選択により PWA。音声まわりを engine/ に閉じ込め、将来ネイティブプラグインに差し替えられるようにする。
- 音声ファイルの事前生成（macOS の say 等）: 却下。合成音声の再配布ライセンスが不明確で、容量も増える。端末の音声合成を使う。
- 生成AIによる自由会話: 却下（実行時に正解・数値を生成しない方針。コストと正確性の問題）。
- 単一HTML（vite-plugin-singlefile）: 却下。PWA（Service Worker・manifest・アイコン）には通常の静的サイト構成が適する。
