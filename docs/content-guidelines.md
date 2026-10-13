# 教材の執筆ルール（Pump On !）

対象: `app/src/content/phrases/*.ts`、`app/src/content/dialogues/*.ts`、`app/src/content/cases/*.ts`、`app/src/content/glossary.ts`
型: `app/src/content/types.ts`（必ず読む）／手本: `phrases/basics.ts`・`dialogues/basics.ts`
根拠: `docs/research/01_perfusion_communication.md`（表現）、`docs/research/02_clinical_reference.md`（臨床値）
出典ID: `app/src/content/sources.ts` の `SOURCES` のキー（存在しない ID は型エラーになる）

## 1. 大原則

1. **臨床内容を創作しない。** 数値・手順・薬剤・機器設定は research/02 に書かれた範囲だけを使う。research/02 で「未確認」「施設差 大」とされた値（ACT の測定間隔、血液心筋保護の初回量、hot shot の条件、離脱の流量の刻み、送血圧アラーム値、テストドースの量など）は、会話の中で使うなら必ず「例」と分かる注記（`facility`）を付け、一般論として断定しない。
2. **表現を創作したら、そう書く。** research/01 で文言を確認できた表現は `evidence: 'verbatim'`（確度 高）か `'observed'`（確度 中: 動画の自動字幕・実務者報告）。見つからなかった表現は、自然な英語でも `evidence: 'constructed'` とし、`notes` に `verify`（要確認）を1つ付け、`status: 'needs-check'` にする。
3. **status は AI が `reviewed` にしない。** 既定は `ai-draft`。`constructed` の代表表現、または `verify` 注記を含む項目は `needs-check`。
4. **日本の運用と違うところは必ず注記する。** 特に、日本では臨床工学技士が回路から薬剤を注入するには医師の具体的な指示が必要（臨床工学技士法38条、`ce-law`）。米国流の「I'm going to give …」（自分の判断で投与を宣言）を教える場合は、日本向けの「May I give …?」（許可を求める）を並べ、`facility` 注記で違いを説明する。
5. **患者情報は扱わない。** 症例・名前はすべて架空。実在の人物・施設名は書かない。

## 2. フレーズ（Phrase）の書き方

| 項目 | ルール |
|---|---|
| `id` | `<シーン略号>-<2桁>`。略号: basics=`bas`、prebypass=`pre`、cannulation=`can`、initiation=`ini`、venting=`ven`、cooling=`coo`、crossclamp=`xcl`、cardioplegia=`ple`、onbypass=`onb`、rewarming=`rew`、deairing=`dea`、weaning=`wea`、protamine=`pro`、t-pressure=`tpr`、t-air=`tai`、t-drainage=`tdr`、t-oxygenator=`tox`、t-power=`tpw`、t-anticoag=`tac` |
| `en` | 現場で自然な標準形（natural）。短く。数値は数字（`480`、`4.5`、`09:42`）。文末にピリオド。指示は命令形や "Can we …?" でよい |
| `tts` | 自動の読み上げ（engine/tts-normalize.ts）で不自然になるときだけ。3桁の数値（480→four eighty）、時刻（09:42→nine forty-two）、ACT・CVP などの略語、pleg→pledge は自動で直る |
| `ja` | 自然な日本語の意味。直訳しない |
| `when` | 使う場面を日本語1文で（誰が・どの瞬間に） |
| `variants` | 同じ意味の別表現。**`simple`（初心者でも言える基本形）を1つ以上**。現場で本当に使う短縮形があれば `shorthand`（`evidence` 必須）。地域差は `region` と `note`。代表表現と同じ文は入れない |
| `replies` | 典型的な返答。**内容のある復唱**（数値・時刻・動作を繰り返す）にする。"OK." だけの返答は入れない。相手→あなた の指示なら、あなた（perfusionist）の復唱を最初に |
| `keywords` | 聞き取るべき語・数値。数値・時刻は `kind: 'number' / 'time'` にし、**`en` に含まれる表記と同じ文字列**にする（例: `en` が "ACT is 480." なら keyword は "480"）。ドリルの「数値キャッチ」に使われる |
| `notes` | `facility`（施設差あり）、`region`（地域差）、`caution`（安全上の注意）、`verify`（要確認）、`tip`（学習のコツ）。1〜3個。長文にしない（1〜2文） |
| `level` | 1=基本（短い指示・復唱）、2=標準（数値・時刻つき、2往復）、3=実践（短縮形・トラブル・言い返し） |
| `speaker` / `to` | 学習者は perfusionist。相手の発話（聞き取り用）と自分の発話（話す用）を両方入れる。目安は半々 |
| `sources` | 根拠にした出典ID。`verbatim`/`observed` には必ず付ける |

フレーズ同士は**別の伝達行為**にする（同じ意味のものは variants にまとめる）。ドリルでは同じシーンの他のフレーズが誤答の選択肢になるため、意味が重なると問題が成立しない。

### 2.1 英語の質

- 直訳調を避ける（× "Please execute the cross-clamp." ○ "Clamp on."）。
- 丁寧さは短さを損なわない範囲で（"…, please." / "Can we …?"）。
- 米英の違いは variants と region で（anesthesiologist/anaesthetist、OR/theatre、TEE/TOE、phenylephrine "Neo"/metaraminol）。
- 聞き違えやすい語（on/off、vent＝人工呼吸器/LVベント、protamine/Prolene、back up/back on、pump off/pump suckers off）は `tip` で触れる。
- 単位は現場どおり省略してよい（"Flow down to 500." "Mean is 60."）。

## 3. 会話（Dialogue）

- 1シーンに1〜2本。4〜8行。状況（`setting`）は日本語2〜3文。
- 行は可能な限りそのシーンのフレーズ（`phraseId` で参照）か、その返答で組み立てる。
- perfusionist の行を最低2つ入れる（ロールプレイで「あなたの番」になる）。
- 数値は research/02 の範囲内の「例」。会話の `notes` に `facility` 注記で「数値は例」と書く必要はない（画面に常時表示している）が、施設差の大きい運用（例: サッカーを止めるタイミングの実態差）は注記する。

## 4. 用語集（GlossaryEntry）

- `term`（英語）、`aka`（略語・別名）、`ja`、`desc`（日本語1〜2文）、`category`。
- 短縮形（pleg, crit, Neo, mics, cc's, XC, lpm, naso など）は、research/01 で確認できないものに `verify` 注記を付ける。

## 5. 自己チェック（提出前）

- `cd app && npx tsc -p tsconfig.json` と `npx vitest run tests/content.test.ts` が通る
- 数値は research/02 の範囲内か、`facility` 注記つきの「例」になっているか
- `constructed` の代表表現に `verify` 注記と `status: 'needs-check'` があるか
- 日本の運用と違う表現（薬剤投与など）に注記があるか
