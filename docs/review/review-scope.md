# 独立レビューの範囲（Pump On !）

## 目的
院内配布・公開の前に、要件の充足、医療内容の妥当性、英語表現の自然さ、アプリの不具合を、作成に関わっていない立場で確かめる。

## 入力
- 要件: docs/requirements.md ／ 設計: docs/design.md ／ 執筆ルール: docs/content-guidelines.md
- 根拠: docs/research/01_perfusion_communication.md（表現）、02_clinical_reference.md（臨床値）、03_ios_pwa_capabilities.md（iPhone）
- 教材: app/src/content/（phases.ts、phrases/*.ts、dialogues/*.ts、cases/*.ts、glossary.ts、sources.ts）
- アプリ: app/src/（engine/、store/、components/、screens/）
- 監修用一覧: `cd app && npm run review-sheet` → docs/review/content-review.csv / .md

## 観点（優先順）
1. 臨床内容の安全性: 危険な誤り（数値・手順・薬剤・役割分担）、research/02 の範囲外の値、日本の運用（臨床工学技士法38条）との齟齬、断定しすぎ
2. 英語: 不自然・直訳調・誤用、聞き違えやすい語の扱い、地域差の誤り、evidence（verbatim/observed/constructed）の付け方の誤り
3. 要件充足: requirements.md の「必須」を1つずつ
4. 不具合: 画面遷移・採点・復習間隔・シミュレーター進行・iPhone 固有の制約（research/03）
