# Pump On !（CPB英会話シミュレーター）— プロジェクトの作業メモ

臨床工学技士向けの人工心肺（CPB）英会話トレーニング PWA。iPhone の「ホーム画面に追加」で使う前提。
要件: docs/requirements.md ／ 設計: docs/design.md ／ 教材の執筆ルール: docs/content-guidelines.md ／ 根拠: docs/research/01〜03

## 構成と検証

- アプリは `app/`（Vite 7 + React 19 + TS 5.9 + Tailwind 4 + vite-plugin-pwa）。`app/dist` は生成物なので直接編集しない。
- 検証: `cd app && npm run check`（型チェック・lint・テスト・ビルド）。教材を触ったら最低限 `npx vitest run tests/content.test.ts`。
- node は `/usr/local/bin/node`。dev/preview は 127.0.0.1 で待ち受ける（iOS シミュレータの Safari は IPv4 で繋ぐため。`localhost` だと IPv6 のみになることがある）。
- iCloud 同期下: `node_modules` は `node_modules.nosync` への symlink。`npm install` 後は必ず `bash scripts/fix-nosync.sh`。

## 教材のルール（要点）

- 臨床の数値・手順・薬剤を創作しない。docs/research/02 の範囲内の「例」だけ。施設差が大きい値は `facility` 注記。
- 表現の裏付けを `evidence` で区別（verbatim / observed / constructed）。constructed は `verify` 注記＋`status: 'needs-check'`。
- `status: 'reviewed'` は監修者が確認したものだけ。AI は付けない。
- 日本の運用（回路からの薬剤投与には医師の具体的な指示が必要＝臨床工学技士法38条）と違う英語表現には必ず注記。
- 症例の課題（cases/*.ts）は可能な限り `phraseIds` でフレーズと結び、間違えたら復習に入るようにする。

## iPhone（iOS 26/27）の注意（docs/research/03 より）

- 音声認識はホーム画面アプリで不安定 → 既定オフ（設定で試験的にオン）。発話は「録音」「入力（キーボードの音声入力）」が主。
- 録音の `MediaRecorder.start()` はタップ処理の中で同期的に呼ぶ（recorder.ts の prepareMic → 2回目のタップで録音）。
- Web Audio の効果音は消音スイッチで鳴らない／TTS 後に鳴らなくなる報告あり（効果音・環境音はおまけ扱い）。
- `pt-safe` / `pb-safe` は他の padding-top/bottom と同じ要素に付けない（非レイヤーCSSが Tailwind を上書きする）。
- iOS シミュレータの画面取得は数秒遅れることがある。操作のあと少し待ってから撮る。
