# Pump On! 教材根拠調査 01：人工心肺（CPB）中の英語コミュニケーション表現

- 作成日・参照日: 2026-10-12
- 位置づけ: **AI下書き・臨床未監修**。教材の文言として確定する前に、臨床工学技士・心臓外科医・麻酔科医の監修が必要。動画の自動字幕から拾った表現は、人が音声を聞いて確認する必要がある。
- 対象: 英語圏（米・英・豪NZ・欧州）の心臓手術室で、perfusionist（体外循環技士）が外科医・麻酔科医・看護師と交わす表現

---

## 0. 結論（3行）

1. 一次資料で一字一句確認できた現場表現の中心は次の3つ。米VA病院の手術録音から作られた指示と応答の対（"Start bypass"→"Full flow"、"Clamp on, flow up"→"Flow back up"、"Pump flow down"→"Half flow"、"Stop pump suckers"→"Pump suckers off"）[1]、蘭の64項目[5]、豪NZの技士によるインシデント報告[11]。
2. 自然な会話の流れは、AmSECTが台本を作ったチーム訓練動画[2]と米国養成校の模擬手術室の実演[18]で確認した。どちらも量・時刻・単位を付けて復唱している（自動字幕から起こしたため、音声での確認が必要）。
3. 地域差は職名・場所・薬剤・単位に集中している。ベントの開始停止、除細動、ペーシング、遮断時刻の口頭報告、離脱後の「give 100」は、逐語の出典が見つからないか、あっても弱い。

---

## 1. 方法と凡例

### 1.1 当たった情報源
- 査読論文: Europe PMC の全文検索で "going on bypass"、"clamp on"、"pump suckers"、"half flow"、"hot shot"、"venous air lock"、"closed-loop communication"、"metaraminol" などを検索し、PMC の本文で文脈を確認した。
- 学会の基準・指針: AmSECT 2017（2023年改訂の変更点表も確認）、ANZCP 2022、英国 SCPS/ACTA/SCTS 2016、SCPS Code of Practice 2019、EACTS/EACTAIC/EBCP 2024。
- 実務者の資料: ANZCP の PIRS-2（体外循環インシデント報告、2014〜2026年、公開PDF 166件）を全文検索した。ANZBP の研修評価表も見た。
- 動画: YouTube の自動字幕（ASR）を取得して読んだ。
  - AmSECT/ICEBP のチーム訓練動画（2013年制作、台本あり）
  - Quinnipiac 大学の体外循環養成課程の模擬手術室での実演（2025年）
  - UNMC（ネブラスカ大）の講義（2018年）
  - CTSNet に掲載された英国サウサンプトンの外科医の講義（2019年）
  - MGH の心臓外科レジデント講義（2020年）
- 入手できなかったもの: Wadhera 2010 [6] と Hazlehurst 2007 [7] の本文（出版社サイトが403のため抄録のみ）、Reddit r/perfusion（403）、Gravlee と Ghosh/Falter/Perrino の教科書本文。

### 1.2 凡例
- **確度**
  - 高: 査読論文・学会基準・学会公開文書で文言を直接確認した（報告書式の「確定」に相当）
  - 中: 台本付きの学会動画・教育機関動画の自動字幕で確認した、または実務者報告の間接話法で確認した（準一次。音声での確認待ち）
  - 低: 字幕の聞き取りが不確実、情報源が非公式な1件だけ、または語を推定で補っている（要確認）
- **[ASR]**: YouTube 自動字幕からの起こし。[ ]内は調査者が補った語・直した語（例: 字幕 "Hein"→[heparin]）。字幕には話者名が付かないため、[ASR] 行の「話者→相手」は動画の文脈から調査者が推定した。
- **種別**
  - simple: 完全な文で、平易な言い方
  - natural: 現場で自然に使う丁寧表現・口語
  - shorthand: 短縮形・符丁
- **地域の略号**: US＝米国、UK＝英国、AUS/NZ＝豪州・NZ、NL＝オランダ（蘭語を英訳したもの）、EU＝欧州の指針
- 臨床数値は出典の記載をそのまま写したメモで、本教材の推奨値ではない。
- 「（記述）」は会話の逐語ではなく、報告や論文の地の文。

---

## 2. 全フェーズに共通するルール

| # | English | 日本語の意味 | 話者→相手 | 典型的な返答 | 種別 | 地域・施設差 | 出典 | 確度 |
|---|---|---|---|---|---|---|---|---|
| X-01 | （定義）"the sender gives a message, and the recipient repeats it" | closed-loop：送り手が伝え、受け手が復唱する | 全員 | — | simple | EU指針。チーム運営の要件として記載 | [8] | 高 |
| X-02 | （規定）"acknowledge verbal commands, verify the content, and reduce ambiguity" | 指示を受けたと示し、内容を確かめ、曖昧さを減らす | 全員 | — | simple | US は Guideline 3.2（should）。AUS/NZ は Standard 3.2（shall、"at all times in the operating theatre"） | [9][10] | 高 |
| X-03 | "Administer heparin" → "heparin is in" | 内容のある復唱の例。"yes"・"OK" だけの返答は内容のない復唱として区別する | 外科医→麻酔科医 | "heparin is in" | simple | NL。名前を呼んで伝えた交換は 6.5% にとどまった | [5] | 高 |
| X-04 | （説明）"you have to say what you hear" | 聞こえたとおりに復唱すれば、間違っていても訂正してもらえる | 技士の指導方針 | — | natural | US | [18][ASR] | 中 |
| X-05 | "LV vent's off, O-F-F" | on と off は手術室で聞き違えやすいので、off は綴りで言う | 技士→外科医 | — | natural | US | [18][ASR] | 中 |
| X-06 | （行動指針）"Ask other OR team members to be quiet during critical communications" | 重要な伝達中は周囲に静かにしてもらう | 全員 | — | simple | US | [4] | 高 |
| X-07 | （規定）checklists "in a read-verify manner" | チェックリストは読み上げて確認する方式で、2人で行う | 技士 | — | simple | US Guideline 5.1 | [9] | 高 |
| X-08 | "Anesthesia, just verifying the ventilation is off." | 相手を役職名（Anesthesia）で呼んで確認する | 技士→麻酔科医 | "Ventilation's off." | natural | US | [18][ASR] | 中 |
| X-09 | （説明）surgeons may give "a circle in the air" | 慣れた外科医は手振りで指示することがある | 外科医→技士 | — | — | US（講師の説明） | [19][ASR] | 低 |
| X-10 | （解説）"please and thank you"… "not a replacement for good communication" | 丁寧さは大事だが、正確な伝達の代わりにはならない | — | — | — | 動画の解説者 | [2][ASR] | 中 |
| X-11 | （規定）引き継ぎは "a set handoff protocol e.g. SBAR" | 技士交代時は SBAR などの決まった形で引き継ぐ | 技士→技士 | — | simple | US Std 3.2、AUS/NZ Std 3.3 | [9][10] | 高 |

研究知見（参考）:
- 蘭の6例のCABG録画では、復唱の形は次の割合だった [5]（高）。復唱のうち内容のあるものは 55%。
  - open loop（返答なし）: 27%
  - call-back（受け手が復唱）: 60%
  - closed loop（送り手が最後に締める）: 7.7%
  - series（3者以上の連鎖）: 5.4%
- Mayo Clinic は CPB 中の重要事象8つに定型の口頭プロトコルを導入した。1例あたりのコミュニケーション破綻は 11.5 回から 7.3 回に減った [6]（抄録で確認。8事象の名前と文言は本文未入手）。

---

## 3. フェーズ別の表現

### P1 人工心肺前（ブリーフィング・タイムアウト・ヘパリン・ACT・ポンプサッカー）

| # | English | 日本語の意味 | 話者→相手 | 典型的な返答 | 種別 | 地域・施設差 | 出典 | 確度 |
|---|---|---|---|---|---|---|---|---|
| P1-01 | "My name is Bill, I'm the perfusionist today." | ブリーフィングでの自己紹介 | 技士→チーム | 看護師 "I'm going to be circulating." | natural | US。circulating＝外回り | [2]術前ブリーフィング改善版[ASR] | 中 |
| P1-02 | "BSA of about 1.7… target [flow] will be 4.1" | 体表面積と目標流量を共有する | 技士→チーム | — | natural | 管理計画をブリーフィングで伝えることは US Std 3.1・AUS/NZ Std 3.1 が規定。字幕は "target floor" | [2][ASR], [9][10] | 中 |
| P1-03 | "Start time-out." | タイムアウト開始 | 外科医→全員 | 各職種が確認 | shorthand | US（VA Boston の手術録音から抽出した文言） | [1] | 高 |
| P1-04 | "Pump checklist complete." | 人工心肺チェックリスト完了 | 技士→全員 | — | shorthand | US。EACTS は人工心肺前チェックリストの完了をタイムアウトで確認するよう記載 | [1][8] | 高 |
| P1-05 | "Give heparin." | ヘパリンを投与して | 外科医→麻酔科医 | "Heparin given." | shorthand | US | [1] | 高 |
| P1-06 | "Could you give the heparin, please?" | ヘパリンをお願いします（丁寧） | 外科医→麻酔科医 | "21,000 units of [heparin] going in at 8:45." → "That's 21,000 units of [heparin] at 8:45." | natural | US。量と時刻を添えて宣言し、相手が復唱する | [2]CPB開始・改善版[ASR] | 中 |
| P1-07 | "How's your ACT?" | ACTはどう？ | 外科医→技士 | "ACT is good. Stopped at 485." | natural | US | [18][ASR] | 中 |
| P1-08 | "ACT Check" | ACTを測って | 外科医→技士 | "ACT on target" | shorthand | US | [1] | 高 |
| P1-09 | "Here's your ACT sample." | ACT用の検体です | 麻酔科医→技士 | "Great, thank you…" | natural | US。この動画では麻酔科が採血している | [2][ASR] | 中 |
| P1-10 | "The ACT just stopped at 280 seconds. I recommend giving another 10,000 units…" | ACTが足りないので追加ヘパリンを提案する | 技士→外科医・麻酔科医 | "10,000 units of [heparin] just went in at 8:58." → "That's 10,000 units at 8:58." | natural | US | [2][ASR] | 中 |
| P1-11 | "Are you ready to cannulate?" | カニュレーションしてよいか | 外科医→技士 | "One moment. The ACT is 400 seconds and rising…" | natural | US | [2][ASR] | 中 |
| P1-12 | （記述）surgeon "asked whether he could cannulate" | カニュレーションの可否を聞く | 外科医→技士 | 技士 "replied that ACT was still not above 300"。のちに "confirmed that cannulation could commence" | — | 英国の教育誌に載った小児例（施設の国は記載なし）。文中は "operating theatre"、"consultant anaesthetist" | [16] | 高（逐語ではなく報告） |
| P1-13 | "Can we have the pump suckers, please?" | ポンプサッカーを回してください | 外科医→技士 | "Suckers are on, sir." | natural | US | [2][ASR] | 中 |
| P1-14 | （記述）"the surgeon asked for the sucker to be turned on" | サッカー開始の依頼 | 外科医→技士 | 回路を逆に付けていて "the sucker was blowing instead of sucking" | — | AUS/NZ | [11]2016 Circuit-error | 中 |
| P1-15 | "Test suction" / "Suction is adequate" | 吸引テスト／吸引良好 | 外科医↔技士 | — | simple | NL。同施設の項目は "ACT is sufficient for cannulation (>300)/blue suction is on"（青はサッカーの色分け） | [5] | 高 |
| P1-16 | （施設差）サッカーを回し始めるACT | — | — | — | — | AUS/NZ のある施設は "at 300s it is commonplace for cardiotomy suckers to be turned on"、別施設は 400 s で開始。NL は >300 | [11]2016 Coagulation, 2024 Communication; [5] | 中 |
| P1-17 | "just turn on cardiotomy" / "just go on bypass" | ACTが届かないのに外科医が急かす | 外科医→技士 | 技士は ACT が 400 s を超えるまで "refused" | natural | AUS/NZ。言い返す場面の教材候補 | [11]2024 Coagulation (Heparinisation) | 中 |
| P1-18 | "Any nursing concerns?" / "Instrument count complete" | 看護側の懸念確認／器械カウント完了 | 外科医→看護師／看護師→全員 | — | shorthand | US | [1] | 高 |

### P2 カニュレーション（降圧依頼・ラインの切り離し・送血圧の確認・接続・空気抜き）

| # | English | 日本語の意味 | 話者→相手 | 典型的な返答 | 種別 | 地域・施設差 | 出典 | 確度 |
|---|---|---|---|---|---|---|---|---|
| P2-01 | "Let's cannulate." | カニュレーションを始める | 外科医→全員 | — | shorthand | US | [1] | 高 |
| P2-02 | "Prepare for cannulation"（項目名） | 送血管を入れる準備。麻酔科に血圧管理を求め、全員に注意を促す | 外科医→麻酔科医・全員 | 一貫して返答のない open loop だった | simple | NL | [5] | 高 |
| P2-03 | （行動指針）"Use closed-loop communication during lines clamping and blood pressure management" | ラインの鉗子操作と血圧管理は closed-loop で | 外科医↔麻酔科医↔技士 | — | simple | US。"Managing patient's blood pressure before cannulation" も重要な伝達として挙げている | [4] | 高 |
| P2-04 | （数値メモ）"systolic pressure should be 90–100 mm Hg" | 送血管挿入時の収縮期血圧の目安 | — | — | — | インドの総説。施設差あり | [28] | 高（出典記載の数値） |
| P2-05 | "Can I divide your lines?" | 回路（A-Vループ）を切り離してよいか | 外科医→技士 | （了承） | natural | US。NL でも "Divide the arterial and venous line" を重要項目にしている | [2][ASR], [5] | 中 |
| P2-06 | （講義）切り離しの前に "the pump is off and the venous lines are clamped" を技士に確かめる | ライン分割前の確認 | 外科医→技士 | — | — | UK | [20][ASR] | 中 |
| P2-07 | "Hey, you've got your arterial line." | 送血ラインをつないだので確認して | 外科医→技士 | "I got a good pulse down here. I'm going to test the line." | natural | US | [2][ASR] | 中 |
| P2-08 | "Good line pressure. Line test is good." | 送血圧良好、ラインテスト良好 | 技士→外科医 | — | natural | US | [2][ASR] | 中 |
| P2-09 | "a good swing and a good pressure" | 送血圧に拍動の振れ（swing）があり、圧も適正 | 外科医が技士に確かめる2点 | — | shorthand（swing） | UK の外科医の講義。AUS/NZ の報告にも "Line pressure 60mmHg, swing great" | [20][ASR], [11]2018 Coagulation | 中 |
| P2-10 | （記述）"line pressure matched the arterial pressure… [pulsatility] visible in the line"（原文の綴りは "pulsitility"） | 送血ライン圧が動脈圧と一致し、拍動が見える | 技士（記録） | — | simple | AUS/NZ | [11]2016 Cannulation | 中 |
| P2-11 | "push or bump the line" / "check arterial patency" | 送血ラインを少し押す／真腔に入っているか確かめる | 外科医→技士 | 技士は "Give 100 cc's. Give 50 cc's." ほど送り、圧の上がり方を見る | shorthand | US（養成校講師） | [19][ASR] | 中 |
| P2-12 | "kindly come around" | （接続前に）送血ライン先端の空気を押し出して | 外科医→技士 | — | natural | UK。講義の字幕1件のみ | [20][ASR] | 低 |
| P2-13 | （記述）"approx 300ml was transfused as requested by anaesthesia" | 麻酔科の依頼で送血管から補液した | 麻酔科医→技士 | — | — | AUS/NZ。ポンプの血を入れることを transfuse と言う | [11]2016 Cannulation | 中 |
| P2-14 | "Hey, give me the venous first." | 先に脱血管を入れる（血圧が高い時など） | 外科医→技士 | — | natural | US（講師が外科医の発話例として紹介） | [19][ASR] | 中 |
| P2-15 | "You've got your venous line." | 脱血ラインをつないだ | 外科医→技士 | "Okay, thanks." | natural | US | [2][ASR] | 中 |
| P2-16 | "Arterial cannula" / "Venous cannula" / "Antegrade cannula" | 各カニューレの挿入完了（手順の区切り） | 外科医→全員 | — | shorthand | US | [1] | 高 |
| P2-17 | "Clamp removed from arterial canule" / "Sufficient pulsation and line pressure" | 鉗子解除／拍動と送血圧の確認 | 外科医↔技士 | — | simple | NL（英訳。canule は原文の綴り） | [5] | 高 |
| P2-18 | "I'll give Neo if necessary to keep the pressure stable." | 必要なら Neo（フェニレフリン）で血圧を保つ | 麻酔科医→外科医・技士 | "Okay, thanks." | natural（Neo は shorthand） | US | [2][ASR], [30] | 中 |
| P2-19 | "the pressure [has dropped] to about a mean of 50… we're giving some [phenylephrine]" | 平均圧が50まで下がり、フェニレフリン投与中 | 麻酔科医→技士 | "I'm going to start to VAP just a little bit…" | natural | US | [2][ASR] | 中 |
| P2-20 | "total of about 80 mics so far" | ここまで合計約80 µg | 麻酔科医→技士 | — | shorthand（mics＝micrograms） | US | [2][ASR] | 中 |
| P2-21 | "Permission to start retrograde autologous priming (RAP)" / "RAP is complete" | RAP開始の許可／完了 | 技士→外科医・麻酔科医 | — | simple | NL | [5] | 高 |
| P2-22 | "wrapping… or vapping" | RAP・VAP の略語を動詞として使う | 技士の口語 | — | shorthand | US（養成校講師） | [19][ASR] | 低 |

### P3 CPB開始（going on bypass、full flow、換気停止、脱血の報告、VAVD）

| # | English | 日本語の意味 | 話者→相手 | 典型的な返答 | 種別 | 地域・施設差 | 出典 | 確度 |
|---|---|---|---|---|---|---|---|---|
| P3-01 | "Start bypass." | 体外循環を開始して | 外科医→技士 | "Full flow." | shorthand | US | [1] | 高 |
| P3-02 | "Ready for bypass." / "Go on bypass." | 準備完了／開始して | 技士→外科医／外科医→技士 | "We're going on bypass." | natural | US | [18][ASR] | 中 |
| P3-03 | "Venous line is open. Arterial line's open." | 脱血・送血ラインを開放した | 技士→全員（実況） | — | simple | US | [18][ASR] | 中 |
| P3-04 | "I have forward flow, coming up on bypass." | 送血が出ている、流量を上げている | 技士→全員 | — | natural | US | [18][ASR] | 中 |
| P3-05 | "Let me know when you get to full flow." | フルフローになったら教えて（換気停止のため） | 麻酔科医→技士（話者は推定） | "…I'm at full flow." | natural | US。推奨行動は "Keep ventilator turned on until perfusionist announces 'full flow'" | [18][ASR], [4] | 中（推奨行動は高） |
| P3-06 | "…we're going on bypass." / "34° please" | 開始する／34℃で | 技士→全員／外科医→技士 | "Coming up to full flow… we are cooling to 34°." | natural | US | [2][ASR] | 中 |
| P3-07 | "You want to turn your lungs off?" | 換気を止めてください | 技士→麻酔科医 | "Lungs are off." | natural | US。MGH の講義でも "you can turn the lungs off" | [2][ASR], [21][ASR] | 中 |
| P3-08 | "Vent's off, gas is off." | 人工呼吸器停止・吸入麻酔停止 | 麻酔科医→技士（話者は推定） | — | shorthand（vent＝ventilator） | US。LVベントと同じ語なので紛らわしい（P4参照） | [18][ASR] | 中 |
| P3-09 | "I've got sweep on, anesthesia, and isoflurane on at 1%." | 人工肺のガス（sweep）を開始し、回路側でイソフルラン1% | 技士→麻酔科医 | — | natural | US | [18][ASR] | 中 |
| P3-10 | "Got nice empty heart." / "Heart's emptying out." | 心臓が虚脱し、脱血良好 | 技士→外科医 | — | natural | US | [18][ASR] | 中 |
| P3-11 | "How's your bypass?" | 体外循環の状態は？ | 外科医→技士 | "Bypass is good. My venous return looks good." | natural | US | [2][ASR] | 中 |
| P3-12 | "Heart looks a little full." | 心臓が少し張っている（脱血不足） | 外科医→技士 | 外科医 "let me adjust the [IVC cannula]…" → "Did that get you some drainage back?" → "It did… my level's getting a little better." | natural | US | [2][ASR] | 中 |
| P3-13 | （記述）"We had kept the ventilator going throughout until full flows achieved." | フルフローまで換気を続けた | — | — | simple | AUS/NZ | [11]2021 Venous_Reservoir | 中 |
| P3-14 | （記述）"Poor venous drainage reported to surgeon… Requested to use VAVD" | 脱血不良を外科医に報告し、陰圧脱血を依頼 | 技士→外科医 | — | — | AUS/NZ | [11]2026 VAVD_Staffing | 中 |
| P3-15 | （数値メモ）"up to 60 millimeters of mercury suction" | MGH の陰圧脱血の上限（講義での発言） | — | — | — | US（1施設） | [21][ASR] | 低 |
| P3-16 | "Start ECC" / "Indicate ECC temperature" / "Full flow achieved" / "(Do not) adjust artificial breathing" | 開始／温度の宣言／フルフロー到達／換気を（調整しない）調整する | 外科医・技士・麻酔科医 | — | simple | NL（ECC＝extracorporeal circulation） | [5] | 高 |
| P3-17 | （チェック表）"Discontinue ventilation and inhalation drugs to patient's lungs" | 開始後5分以内に確認する項目 | 麻酔科医 | — | simple | US の教科書 | [22] | 高 |

### P4 ベント（LVベント・ルートベントの開始・調整・停止）

| # | English | 日本語の意味 | 話者→相手 | 典型的な返答 | 種別 | 地域・施設差 | 出典 | 確度 |
|---|---|---|---|---|---|---|---|---|
| P4-01 | "Testing root vent." … "And off." | ルートベントを試しに回して止める | 技士→外科医 | "Off." | shorthand | US | [18][ASR] | 中 |
| P4-02 | "Fill [up] the heart for the LV vent." | LVベントを入れるので心臓を満たして | 外科医→技士 | "Volume is going in." | natural | US | [18][ASR] | 中 |
| P4-03 | "Hold there for a second." | そのまま保って | 外科医→技士 | "Holding." | natural | US | [18][ASR] | 中 |
| P4-04 | "LV vent is in. Go ahead and drain out." | ベントが入った、脱血を再開して | 外科医→技士 | "Draining out." | natural | US | [18][ASR] | 中 |
| P4-05 | "Root vent can go on." | ルートベントを回してよい | 外科医→技士 | "Root vent's coming on." | natural | US | [18][ASR] | 中 |
| P4-06 | "LV vent on." | LVベント開始 | 外科医→技士 | "LV vent is on." | shorthand | US | [18][ASR] | 中 |
| P4-07 | "I got good return on the vent." | ベントの引きが良い | 技士→外科医 | — | natural | US | [18][ASR] | 中 |
| P4-08 | "LV vent's off, O-F-F" | 停止は綴りで言う（X-05参照） | 技士→外科医 | — | natural | US | [18][ASR] | 中 |
| P4-09 | "Vent off" / "Vent back on" | 胸骨切開時に人工呼吸器を止める／再開する | 外科医→麻酔科医 | "Vent on" | shorthand | US。vent が人工呼吸器を指す例 | [1] | 高 |
| P4-10 | "make sure the white is on" | 白（ベントの色）を回して | 外科医→技士 | — | shorthand | US（MGH は blue/orange/yellow/white で venous/suckers/vents を色分けと説明）。NL は "blue suction"、"Suck yellow" | [21][ASR], [5] | 低（色は施設固有） |
| P4-11 | （記述）"turns off suckers/vents at appropriate times" | プロタミン時にサッカーとベントを止める | 技士 | — | — | AUS/NZ の研修評価表 | [12] | 高 |

### P5 冷却

| # | English | 日本語の意味 | 話者→相手 | 典型的な返答 | 種別 | 地域・施設差 | 出典 | 確度 |
|---|---|---|---|---|---|---|---|---|
| P5-01 | "34° please" | 34℃まで冷却して | 外科医→技士 | "…we are cooling to 34°." | natural | US | [2][ASR] | 中 |
| P5-02 | "start to drift the patient" | 能動的に冷やさず、自然に下げる | 技士の口語 | — | shorthand（drift） | US（養成校講師） | [19][ASR] | 中 |
| P5-03 | "Indicate ECC temperature" | 体外循環の温度を宣言する | 技士→外科医 | — | simple | NL | [5] | 高 |
| P5-04 | （記述）"naso temp 34 degs" / "Cooled to 32C" | 鼻咽頭温34℃／32℃まで冷却 | 技士（記録） | — | shorthand（naso） | AUS/NZ | [11]2016 Circuit-disruption, 2021 Coagulation | 中 |
| P5-05 | "[cooled to] 18 degrees" | 解離で循環停止を見込んだ冷却 | 外科医→技士 | — | — | US（台本動画） | [2]大動脈解離[ASR] | 低 |

### P6 大動脈遮断（遮断前の減流量・遮断の宣言・時刻）

| # | English | 日本語の意味 | 話者→相手 | 典型的な返答 | 種別 | 地域・施設差 | 出典 | 確度 |
|---|---|---|---|---|---|---|---|---|
| P6-01 | "Cross clamp." | 遮断に移る | 外科医→全員 | — | shorthand | US | [1] | 高 |
| P6-02 | "Flow down." | 流量を下げて | 外科医→技士 | "Pump flow down." | shorthand | US | [1] | 高 |
| P6-03 | "Clamp on, flow up." | 遮断した、流量を戻して | 外科医→技士 | "Flow back up." | shorthand | US | [1] | 高 |
| P6-04 | "Ready for cross clamp." | 遮断の準備はいいか | 外科医→技士 | "Ready for cross clamp." | natural | US | [18][ASR] | 中 |
| P6-05 | "[Flow] down." → "Okay, flow's coming down." → "Clamp is on. Back up." → "Clamp on. Coming back up." | 減流量・遮断・流量復帰の一連の closed loop | 外科医↔技士 | — | shorthand | US | [18][ASR] | 中 |
| P6-06 | "You ready for a cross clamp?" | 遮断していいか | 外科医→技士 | "Yes sir, bypass looks good… I think we're okay to cross." | natural | US | [2][ASR] | 中 |
| P6-07 | "Drop your flow [to] 500, please." | 流量を500（mL/分）に下げて | 外科医→技士 | "[Flow's at] 500, sir." → "Clamp's on, back up." | natural | US。単位は言わない | [2][ASR] | 中（字幕がやや不明瞭） |
| P6-08 | "…asking them to come down on the flows" | （遮断前に）技士に流量を下げてもらう | 外科医→技士 | — | natural | US（MGH の講義） | [21][ASR] | 中 |
| P6-09 | "Low flow" → "Aortic cross clamp placed" → "Normal flow" | 低流量→遮断→流量復帰 | 外科医↔技士↔麻酔科医 | — | simple | NL。遮断は前後どちらでも言葉にされていた | [5] | 高 |
| P6-10 | （記録）"10:14 XCLAMP on" | 遮断時刻の記録の書き方 | 技士（記録） | — | shorthand（XCLAMP） | AUS/NZ | [11]2018 Coagulation | 中 |

### P7 心筋保護（順行性・逆行性、初回量・追加量、ルート圧・冠静脈洞圧、追加時刻の通知、心停止の確認、hot shot）

| # | English | 日本語の意味 | 話者→相手 | 典型的な返答 | 種別 | 地域・施設差 | 出典 | 確度 |
|---|---|---|---|---|---|---|---|---|
| P7-01 | "Start antegrade." | 順行性の心筋保護を開始して | 外科医→技士 | "Cardioplegia flowing." | shorthand | US | [1] | 高 |
| P7-02 | "Give one liter [antegrade cardioplegia], please." | 順行性で1L | 外科医→技士 | "Giving one liter of [antegrade cardioplegia]." | natural | US。字幕は "integrated cardia"（短縮して言っている可能性あり、要確認） | [18][ASR] | 中 |
| P7-03 | "Deliver your [pleg] antegrade, please… [8]00 cc's" | 順行性で800 mL | 外科医→技士 | "…giving antegrade cardioplegia, 800 cc's total." | shorthand | US。字幕は "PL an grade" と不明瞭 | [2][ASR] | 低（"pleg" という語は要聴取確認） |
| P7-04 | "Got good flows and good pressure on the [cardioplegia]." | 注入の流量・圧ともに良好 | 技士→外科医 | — | natural | US | [18][ASR] | 中 |
| P7-05 | "Starting to see ST changes." / "Looks like we have quiescence on the EKG." | ST変化が出てきた→心電図が静止 | 技士・麻酔科医→外科医 | — | natural | US（EKG は米国の言い方。英国は ECG） | [18][ASR] | 中 |
| P7-06 | "How much was that?" | （停止までに）何mL入った？ | 外科医→技士 | "That was one-third dose." → "Go to a liter." → "Going to a liter." | natural | US | [18][ASR] | 中 |
| P7-07 | "[Cardioplegia]'s in, and off." | 注入完了、停止 | 技士→外科医 | "And off." | shorthand | US | [18][ASR] | 中 |
| P7-08 | "…let me know again every 15 minutes." | 15分ごとに知らせて | 外科医→技士 | "I'll let you know in 15 minutes, sir." | natural | US | [2][ASR] | 中 |
| P7-09 | "Pressure in root is adequate" / "Flow is adequate" / "Heart is still" | ルート圧・流量が適正／心臓が静止 | 技士↔外科医 | — | simple | NL | [5] | 高 |
| P7-10 | "Last cardioplegia administered 15 minutes ago" / "…20 minutes ago" | 前回投与から15分／20分たった | 技士→外科医・麻酔科医 | — | simple | NL（追加投与の時期の通知） | [5] | 高 |
| P7-11 | "Cardioplegia circulating for 2 minutes" / "Stop cardioplegia" | 注入2分経過／停止 | 技士↔外科医 | — | simple | NL | [5] | 高 |
| P7-12 | "we're gonna run retro"（趣旨） | 逆行性に切り替える | 外科医→技士 | — | shorthand（retro） | US（講師が外科医の指示の例として挙げた） | [19]Maintenance[ASR] | 低 |
| P7-13 | （数値メモ）順行性は "aortic root … at a pressure of 60–100 mmHg"。逆行性は "coronary sinus pressure between 30 and 50 mmHg"（200–400 mL/min） | 報告されるルート圧・冠静脈洞圧の目安 | — | — | — | EU 指針 | [8] | 高（出典記載の数値） |
| P7-14 | "hot shot" | 遮断解除前の温血心筋保護（terminal warm blood cardioplegia） | 外科医↔技士 | — | shorthand | UK・US の論文題名で使われる。AUS/NZ の報告にも "hot shot prior to cross clamp removal"、"Hot shot initiated" | [33], [11]2016 Circuit-disruption, 2018 Coagulation | 高（用語）／中（会話） |
| P7-15 | "plege" / "'plegia" / "pleged" | cardioplegia の短縮形、動詞としての使用（"maintenance 'plegia dose"、"heart not pleged"） | 技士の口語・記述 | — | shorthand | AUS/NZ。編集者が "[cardio]plege" と補っている | [11]2015 Pump-Servoregulation-1, 2016 Drug-Medication, 2018 Coagulation, 2019 Cardioplegia | 中 |
| P7-16 | "hey, I don't have a good line pressure or I've got a lot of dose in and I still have activity" | 圧が出ない／量が入っても電気活動が残る、と伝える | 技士→外科医 | — | natural | US（技士の説明） | [18][ASR] | 中 |
| P7-17 | （研究知見）心筋保護の管理中、外科医と技士の言語交換は6類型に分かれる | — | — | — | — | US（抄録のみ） | [7] | 高（概念） |

### P8 CPB中の管理（血圧・流量・薬剤・血液ガス・Hb/Hct・K・血糖・ACT・リザーバーレベル）

| # | English | 日本語の意味 | 話者→相手 | 典型的な返答 | 種別 | 地域・施設差 | 出典 | 確度 |
|---|---|---|---|---|---|---|---|---|
| P8-01 | "I'm going to treat this hypotension with some phenylephrine." | 低血圧にフェニレフリンを使う | 技士→外科医・麻酔科医 | "Thank you." → "That's 100 mics of phenylephrine." | natural | US（技士がサンプリング用マニホールドから投与すると説明） | [18][ASR] | 中 |
| P8-02 | "Neo" | フェニレフリン（Neo-Synephrine）の通称 | — | — | shorthand | US | [30], [2] | 中 |
| P8-03 | （記述）"Metaraminol was administered as required by the perfusionist to achieve the target MAP." | 技士がメタラミノールで目標MAPを保った | 技士 | — | — | AUS（Monash 大の研究プロトコル） | [17] | 高 |
| P8-04 | （記述）"Metaraminol given due to low BP (30mmHg)" | 低血圧のためメタラミノール | 技士（記録） | — | — | AUS/NZ | [11]2018 Coagulation | 中 |
| P8-05 | （規定）"administer drugs in strict accordance with local guidelines" | 英国の clinical perfusion scientist は院内規定と個別指示書（PSD）に沿って薬剤を投与する | — | — | — | UK | [14] | 高 |
| P8-06 | （規定）目標の流量・血圧から外れたら "communicated to the physician-in-charge" | 逸脱は担当医に報告する | 技士→担当医 | — | — | US Guideline 10.1・11.1。AUS/NZ は "to the clinical team" | [9][10] | 高 |
| P8-07 | （規定）予測希釈後のHb/Hctを "communicate to the surgical team prior to initiating CPB" | 開始前に予測希釈Hb/Hctを伝える | 技士→外科チーム | — | — | US Std 13.3、AUS/NZ Std 12.3 | [9][10] | 高 |
| P8-08 | "Everything looking okay?" | 問題ない？ | 外科医→技士 | "Everything's looking good." | natural | US | [18][ASR] | 中 |
| P8-09 | （記述）"Noticed a decrease in volume. Asked the surgeon if the heart was distending… if the heart was raised" | リザーバーの量が減った→心臓が張っていないか、持ち上げていないかを外科医に確認 | 技士→外科医 | "…and it was."（持ち上げていた） | natural | AUS/NZ | [11]2015 Hypo-hyper_perfusion | 中 |
| P8-10 | "My level's getting a little better." | リザーバーのレベルが戻ってきた | 技士→外科医 | — | natural | US（level＝リザーバーレベル） | [2][ASR] | 中 |
| P8-11 | （記述）"Blood gas returned a K of 8.3 and a glucose of 17" | 血液ガスの結果（K・血糖） | 技士（記述） | — | shorthand | AUS/NZ。血糖の単位は書かれていない（値から mmol/L と推定、要確認） | [11]2020 Cardioplegia | 中 |
| P8-12 | （記録）"ACT 539, heparin 1200UI added" | ACT値と追加ヘパリン | 技士（記録） | — | shorthand | AUS/NZ | [11]2018 Coagulation | 中 |
| P8-13 | （単位）"Hct: 20%-25%"、"K+: 4.0-5.0 mEq/L" | 米国式の単位（離脱前の目安） | — | — | — | US の教科書 | [22] | 高（出典記載の数値） |
| P8-14 | （記録）"Hb 102, HCT 31.4" / "Hct of 0.38 to 0.26" | Hb は g/L。Hct は%でも小数でも書く | — | — | — | AUS/NZ | [11]2018 Coagulation, 2017 Oxygenator | 中 |
| P8-15 | （調査）緊急時に伝える項目（低血圧なら "vasopressor dose and blood pressure"） | 7つの重大事象ごとに伝えるべき項目 | 技士→チーム | — | — | US（MUSC の調査） | [25] | 中 |

### P9 復温

| # | English | 日本語の意味 | 話者→相手 | 典型的な返答 | 種別 | 地域・施設差 | 出典 | 確度 |
|---|---|---|---|---|---|---|---|---|
| P9-01 | （記述）"Inability to rewarm… when asked to by surgeon" | 外科医の復温指示に応えられなかった | 外科医→技士 | — | — | AUS/NZ | [11]2021 Heater_Cooler_Degradation | 中 |
| P9-02 | （記述）"Rewarmed and came off Bypass fine." | 復温して問題なく離脱した | — | — | natural | AUS/NZ | [11]2021 Coagulation | 中 |
| P9-03 | （記述）"we weren't fully warm" | まだ十分に温まっていない | — | — | natural | AUS/NZ | [11]2020 Cardioplegia | 中 |
| P9-04 | （講義）復温は離脱のため、空気抜きは遮断解除のため（趣旨） | 手順の順番の覚え方 | — | — | — | UK | [20][ASR] | 低 |
| P9-05 | "Patient body temperature is adequate" | 体温は適正 | 技士→外科医・麻酔科医 | — | simple | NL | [5] | 高 |
| P9-06 | （チェック表）"Rewarming completed: nasopharyngeal temperature 36-37°C" | 離脱準備の項目 | — | — | — | US の教科書 | [22] | 高（出典記載の数値） |

### P10 空気抜き（de-airing）・遮断解除・体内除細動

| # | English | 日本語の意味 | 話者→相手 | 典型的な返答 | 種別 | 地域・施設差 | 出典 | 確度 |
|---|---|---|---|---|---|---|---|---|
| P10-01 | "head up, volume and ventilate" | （空気抜き）頭を上げ、心臓を満たし、換気する | 外科医→麻酔科医・技士 | — | shorthand | US（MGH の講義）。その場で「head down では？」と議論になった。教科書は遮断解除前を head down と記載。施設差 | [21][ASR], [22] | 中 |
| P10-02 | "…get the volume out and stop [manually] ventilating and then bring down the flow" | ボリュームを抜き、換気を止め、流量を下げる | 外科医→技士・麻酔科医 | — | natural | US。字幕は "mentally" | [21][ASR] | 中 |
| P10-03 | "…cross clamp can come off and then you can get the flows back up" | 遮断解除→流量を戻す | 外科医→技士 | — | natural | US | [21][ASR] | 中 |
| P10-04 | "foam in the dome" | 経食道心エコーで左房の天井に泡（空気） | エコー担当→外科医 | — | shorthand（スラング） | US（MGH） | [21][ASR] | 低 |
| P10-05 | "Low flow" → "Aortic cross clamp removed" → "Normal flow" | 遮断解除のときの流量操作 | 外科医↔技士 | — | simple | NL | [5] | 高 |
| P10-06 | （記録）"12:31 - XCLAMP off" | 遮断解除時刻の記録 | 技士（記録） | — | shorthand | AUS/NZ | [11]2018 Coagulation | 中 |
| P10-07 | （教科書）"internal paddles"、"starting energies of 5 to 10 J" | 体内除細動は内部パドルで、成人は5–10 Jから | — | — | — | US の教科書 | [22] | 高（出典記載の数値） |
| P10-08 | （教科書）"lungs ventilated to promote clearance of air" / "patient is placed head down" | 空気抜きのための換気と頭低位 | — | — | — | US の教科書 | [22] | 高 |

### P11 離脱（換気再開、減流量、half flow、off bypass、ボリューム、CVP・PAP）

| # | English | 日本語の意味 | 話者→相手 | 典型的な返答 | 種別 | 地域・施設差 | 出典 | 確度 |
|---|---|---|---|---|---|---|---|---|
| P11-01 | "Wean pump." | 離脱を始める | 外科医→全員 | — | shorthand | US | [1] | 高 |
| P11-02 | "Restart vent." | 換気を再開して | 外科医→麻酔科医 | "Vent on." | shorthand | US（vent＝ventilator） | [1] | 高 |
| P11-03 | "Pump flow down." | 流量を下げて | 外科医→技士 | "Half flow." | shorthand | US | [1] | 高 |
| P11-04 | "Come off pump." | 離脱して（ポンプ停止） | 外科医→技士 | "We are off pump." | shorthand | US | [1] | 高 |
| P11-05 | "Continue artificial breathing" / "Artificial breathing is on" / "Permission to reduce flow" | 換気を続ける／換気再開を確認／減流量の許可 | 外科医↔麻酔科医↔技士 | — | simple | NL（英訳。英語圏の会話では ventilation が普通と思われるが未確認） | [5] | 高（項目として） |
| P11-06 | "ECC at 1 L index" → "ECC at 1/2 L index" → "Stop ECC" | 流量係数1→0.5へ段階的に下げ、停止 | 技士→全員 | — | simple | NL（流量を係数で読む） | [5] | 高 |
| P11-07 | "Heart rhythm is adequate" / "Heart function is adequate" / "Heart filling is adequate" | 調律・心機能・充満の確認 | 外科医・麻酔科医↔技士 | — | simple | NL | [5] | 高 |
| P11-08 | （記述）"weaned from 4.0 lpm to 2.0 lpm… 2.0lpm half flow… waiting for the anaesthetist to get the pressure up" | 4.0→2.0 L/分（半量）で、麻酔科が血圧を上げるのを待つ | 技士 | — | natural | AUS/NZ | [11]2022 Air-Entrainment-Intra-Op | 中 |
| P11-09 | "…before we come down and off" | 流量を下げて離脱する前に | 技士の口語 | — | natural | US（養成校講師） | [19][ASR] | 中 |
| P11-10 | （記述）"At half flow, it was determined that full bypass should be resumed" | 半量の時点でフルに戻すと判断 | — | — | — | AUS/NZ | [11]2015 Circuit-Disruption-3 | 中 |
| P11-11 | （記述）"Came off bypass… went into VF… so back on" | 離脱後にVFとなり再開（back on） | — | — | shorthand（back on） | AUS/NZ | [11]2020 Cardioplegia | 中 |
| P11-12 | （研究）部分流量なのに人工呼吸器が止まっていたら警告する | 換気再開の忘れを防ぐ | — | — | — | US | [27] | 高 |
| P11-13 | （指針）離脱前のチェックリストを推奨 | — | — | — | — | EU | [8] | 高 |
| P11-14 | （研修評価表）"ventilator status, ECG and rhythm/rate, pacemaker"、"VAVD off, clamping lines, shunts closed"、"anticipates need to transfuse, or return onto bypass" | 離脱時の確認と、離脱後の返血・再開の見込み | 技士 | — | — | AUS/NZ | [12] | 高 |
| P11-15 | （教科書）"restored by transfusion of perfusate through the aortic inflow line" | 送血管から灌流液を入れて前負荷を整える | 技士 | — | — | US | [22] | 高 |
| P11-16 | "…you have more volume to give, make sure you check…" | 離脱後に追加でボリュームを入れるときは、送血管内の空気を確認 | 講義 | — | natural | US | [21][ASR] | 中 |
| P11-17 | （チェック表）"use pacing if necessary"、"Transducers re-zeroed"、"TEE … out of freeze mode" | 離脱準備の項目 | — | — | — | US の教科書 | [22] | 高 |

### P12 プロタミン（テストドーズ、開始の宣言、サッカー停止、抜去、残血の返血）

| # | English | 日本語の意味 | 話者→相手 | 典型的な返答 | 種別 | 地域・施設差 | 出典 | 確度 |
|---|---|---|---|---|---|---|---|---|
| P12-01 | "Start protamine." | プロタミン開始 | 外科医→麻酔科医 | "Protamine is going in." | shorthand | US | [1] | 高 |
| P12-02 | "Stop pump suckers." | ポンプサッカーを止めて | 外科医→技士 | "Pump suckers off." | shorthand | US | [1] | 高 |
| P12-03 | （規定）"Cardiotomy suction shall be discontinued at the onset of protamine administration" | プロタミン開始の時点で吸引を止める | — | — | — | US Std 12.1、AUS/NZ Std 8.6 | [9][10] | 高 |
| P12-04 | （QI）"terminating cardiotomy suction before protamine administration (including a test dose)" | テストドーズを含め、プロタミンの前に吸引を止める | — | — | — | US（ミシガン州の品質改善） | [23] | 高 |
| P12-05 | "test dose" | 全量の約10%を先に入れる | 麻酔科医 | — | shorthand | US。"Ten percent… often used as a 'test dose'" | [24] | 高 |
| P12-06 | （記述）"Protamine was started and the suckers were turned off." | 開始→サッカー停止 | — | — | natural | AUS/NZ | [11]2021 Coagulation | 中 |
| P12-07 | （施設差）"keep the pump suckers on until 1/3 of the protamine dose" / "turn off pump suckers at 50% protamine" | 1/3 または 50% までサッカーを使う施設もある | — | — | — | AUS/NZ。規定とずれている例として報告 | [11]2024 Coagulation (Protamine), (Protamine)_2 | 中 |
| P12-08 | "Administer protamine" → "Root needle removed" → "Venous canule removed" → "Withdraw blood from venous line" → "Protamine at 1/3" → "Stop blue suction" | 抜去と吸引停止の順序の例 | 外科医↔技士↔麻酔科医 | — | simple | NL | [5] | 高 |
| P12-09 | "Blood volume left in pump" → "Empty pump" → "Pump is completely empty" → "Arterial canule removed" → "Protamine complete" | 残血量の報告→返血→送血管抜去→プロタミン完了 | 技士→外科医・麻酔科医 | — | simple | NL | [5] | 高 |
| P12-10 | （記述）"transfused with enough blood from the pump… The remainder… sent to the cell saver" | 必要な量だけポンプから返血し、残りはセルセーバーへ | 技士 | — | — | AUS/NZ | [11]2024 Coagulation (Communication), 2021 Coagulation | 中 |
| P12-11 | "[Is your] pump sucker still on? …purge on? How much [protamine]'s in?" | 指導者が学生に確認を迫る | 指導者→技士 | — | natural | US | [19][ASR] | 低 |
| P12-12 | （聞き違い事例）"a request for prolene was misheard" | Prolene（縫合糸）をプロタミンと聞き違えた可能性 | 外科医→麻酔科医 | 麻酔科チームが "announced they were giving protamine"。体外循環中だったため技士側がすぐ指摘 | — | AUS/NZ | [11]2016 Drug-Medication | 中 |

### P13 トラブル対応

| # | English | 日本語の意味 | 話者→相手 | 典型的な返答 | 種別 | 地域・施設差 | 出典 | 確度 |
|---|---|---|---|---|---|---|---|---|
| P13-01 | （教科書）解離の徴候 "persistently low systemic arterial pressure"、送血圧は "inappropriately high" | 解離のときに伝える内容 | — | — | — | US | [22] | 高 |
| P13-02 | （調査）解離では "line pressure and arterial blood pressure" を伝える | — | 技士→チーム | — | — | US（MUSC） | [25] | 中 |
| P13-03 | "my [line] pressure is high" / "I can't [flow] higher than 1.5 liters a minute" | 送血圧が高い／1.5 L/分以上流せない | 技士→外科医 | 外科医 "I don't see anything on the field." | natural | US（台本動画） | [2]大動脈解離[ASR] | 低 |
| P13-04 | "Do we have a dissection? Can you look at the echo?" | 解離か？エコーで見て | 外科医→麻酔科医 | "…definitely a flap in the ascending aorta" | natural | US | [2][ASR] | 低 |
| P13-05 | "go back on in the groin" | 鼠径（大腿動脈）送血でやり直す | 外科医→技士 | — | natural | US | [2][ASR] | 低 |
| P13-06 | （記述）"line pressure had dropped to less than 20… no longer [pulsatility]." / "The surgical team was notified."（原文の綴りは "pulsitility"） | 送血圧の低下と拍動消失を報告 | 技士→外科チーム | 麻酔科が "a TOE probe in to check for dissection" | — | AUS/NZ | [11]2016 Cannulation | 中 |
| P13-07 | "give the volume back to the patient from the venous line" | （開始直後に解離を疑ったら）脱血側から返血して立て直す | 外科医→技士 | — | natural | US（MGH の講義） | [21][ASR] | 中 |
| P13-08 | （教科書）"this is called air lock" | 脱血ラインに空気が入り、脱血が止まる状態＝air lock | — | — | shorthand | US | [22] | 高 |
| P13-09 | （記述）"forming an air lock. Informed the surgeon." / asked "was an air lock" | エアロックを報告・確認 | 技士→外科医 | 外科医は "the venous line was completely empty" と応答 | natural | AUS/NZ | [11]2016 Circuit-disruption | 中 |
| P13-10 | "pump off" | ポンプ停止 | 外科医→技士 | 技士は流量ゼロにして送血ラインを鉗子で止めた | shorthand | AUS/NZ（外科医が小声で求めた） | [11]2016 Circuit-disruption | 中 |
| P13-11 | "I can refill the venous line from my end" / "disconnect the venous line from the cannula and I will refill the line" | 脱血ラインを回路側から満たし直す | 技士→外科医 | "the line is disconnected" | natural | AUS/NZ | [11]2016 Circuit-disruption | 中 |
| P13-12 | （記述）"I immediately informed the surgeon… that there was air in the line" | 空気混入をすぐ報告 | 技士→外科医 | — | — | AUS/NZ | [11]2015 Air-in-Circuit-2 | 中 |
| P13-13 | （調査）空気塞栓では "visible air and pump off" を伝える | — | 技士→チーム | — | — | US | [25] | 中 |
| P13-14 | （教科書）大量空気塞栓の初期対応 "immediate cessation of CPB"、"steep Trendelenburg position" など | — | — | — | — | US | [22] | 高 |
| P13-15 | （研究）危機チェックリスト5種（CPB Failure、Systemic Air Embolism、Venous Air Lock、Protamine Reaction、Heparin Resistance）と読み上げ役（"reader"） | 読み上げ役を決めて手順を進める | — | — | — | US | [26] | 高 |
| P13-16 | （記述）"the low level alarm sounded" / "the surgeon asked for pump sucker high" | 低レベルアラーム／サッカーを強くして | 外科医→技士 | — | shorthand（pump sucker high） | AUS/NZ | [11]2016 Circuit-disruption, 2019 Hypoperfusion | 中 |
| P13-17 | （規定）"Level sensor… with an alarmed automatic pump cut out"、arterial line の "Bubble detector" | アラームで自動停止するレベルセンサー・気泡検出器 | — | — | — | UK | [13] | 高 |
| P13-18 | （記述）"the surgical registrar announced the blood was very dark" | 開始直後に血が暗い（ガス流量がゼロだった） | 外科医（registrar）→技士 | — | natural | AUS/NZ | [11]2022 Hypoxia | 中 |
| P13-19 | （記述）"change out the Oxygenator" / "An oxygenator change-out kit and spare arterial pump were brought into the operating room" | 人工肺の交換（change-out） | — | — | shorthand | AUS/NZ。報告は PRONTO 法 [34] を紹介 | [11]2015 Oxygenator-1, 2017 Oxygenator, 2021 Coagulation_2_Oxygenator_Changeout | 中 |
| P13-20 | （記述）"Called for help - hit the emergency call" / "commenced brief hand cranking" | 応援要請／ハンドクランク開始 | 技士 | — | natural | AUS/NZ | [11]2015 Electrical | 中 |
| P13-21 | （記述）"Grabbed the hand crank and [hand] cranked until help arrived."（原文は "hank cranked"） | 応援が来るまで手回しした | 技士 | — | natural | AUS/NZ | [11]2016 Electrical-electronic | 中 |
| P13-22 | （規定）"Hand cranks shall be readily available" / "Handcranks must be instantly available" | ハンドクランクの常備 | — | — | — | US Std 6.9、UK | [9][13] | 高 |
| P13-23 | （調査）人工肺不全は "pO2 and oxygen saturation"、ポンプ不全は "pump flow" を伝える | — | 技士→チーム | — | — | US | [25] | 中 |
| P13-24 | "the sucker was blowing instead of sucking" | サッカーが逆送している（吹いている） | 外科医→技士 | — | natural | AUS/NZ | [11]2016 Circuit-error | 中 |
| P13-25 | （チェック表）"Is arterial perfusate oxygenated?"、"Is blood draining to the pump/oxygenator's venous reservoir?" | 開始直後の確認 | — | — | simple | US の教科書 | [22] | 高 |
| P13-26 | （行動指針）"Use 'crisis' check list for heparin resistance" | ヘパリン抵抗性には危機チェックリスト | — | — | — | US | [4] | 高 |
| P13-27 | （講義）surgeons "will make those commands… and expect you to repeat those back" | 外科医は指示を出し、復唱を求める | 外科医→技士 | — | — | US（養成校講師） | [19]Maintenance[ASR] | 低 |

### 補足：看護師とのやり取り（集まった例は少ない）

| # | English | 日本語の意味 | 話者→相手 | 典型的な返答 | 種別 | 地域・施設差 | 出典 | 確度 |
|---|---|---|---|---|---|---|---|---|
| N-01 | "I'm going to be circulating." | 外回りを担当します | 看護師→チーム | — | natural | US | [2][ASR] | 中 |
| N-02 | （解説）"the scrub practitioner tried to give him lines" | 器械出しが技士にラインを渡そうとしたが、技士は気づかなかった（悪い例） | 器械出し→技士 | — | — | 解説者の用語は英国式の scrub practitioner | [2]CPB開始・不良例[ASR] | 中 |
| N-03 | （記述）"did my occlusion tests with a scrub nurse dividing the lines" | 器械出し看護師がラインを切り離す間に、技士がオクルージョンを確認した | 看護師・技士 | — | — | AUS/NZ | [11]2022 servoregulation | 中 |
| N-04 | （行動指針）"scrub nurse handling clamp to surgeon means that the next step is aorta clamping" | 器械出しが鉗子を渡したら次は遮断、という非言語の合図 | 看護師→外科医 | — | — | US | [4] | 高 |

---

## 4. 数値の読み上げ方

| 項目 | 実例（出典の表記） | 読み方・聞き取りの要点 | 出典 | 確度 |
|---|---|---|---|---|
| ヘパリン量と時刻 | "21,000 units of [heparin] going in at 8:45" / "…just went in at 8:58" | 量・薬剤・時刻を1文で言い、相手が同じ形で復唱する。字幕の表記は "8:45 a.m."、"858"（読みは "eight fifty-eight" のような区切り読みと推定） | [2][ASR] | 中 |
| ACT | "Stopped at 485" / "400 seconds and rising" / "just stopped at 280 seconds" | 秒は付けても省いてもよい。"stopped at"（測定終了値）と "and rising"（測定中）を区別する | [18][2] | 中 |
| 流量（mL/分） | "Drop your flow [to] 500" | 単位を言わない。遮断前の減流量の文脈で 500 mL/分と理解する | [2][ASR] | 中 |
| 流量（係数・L/分） | "an index of two" / "1.5 liters a minute" / 記録 "4 lpm"、"2.0lpm half flow"、"3 liter index" / NL "1 L index → 1/2 L index" | 米国は index（係数）で言うことがある。豪NZの記録は lpm。蘭は係数で段階的に下げる | [2][11][5] | 中〜高 |
| 血圧 | "a mean of about 80" / "about a mean of 50" / "[from] mean in the 40s… [to] the 60s" | "mean" を前に置く。幅は "in the 40s"、"in the 60s" と言う | [2][18] | 中 |
| 送血ライン圧 | 記録 "Line pressure 60mmHg, swing great" | 数値に swing（拍動）の評価を添える | [11] | 中 |
| 容量 | "800 cc's" / "one liter" / "one-third dose" / "Give 100 cc's" / 記録 "approx 300ml" | 米国の口語は cc's。全量に対する割合（one-third dose）でも言う | [2][18][19][11] | 中 |
| 薬剤 | "100 mics of phenylephrine" / "about 80 mics so far" | mics＝micrograms。合計量（so far）も言う | [18][2] | 中 |
| 温度 | "34° please" / "cooling to 34°" / 記録 "naso temp 34 degs"、"Cooled to 32C" | degrees は省くことがある。naso＝鼻咽頭温 | [2][11] | 中 |
| 時間・間隔 | "every 15 minutes" / "in 15 minutes" / "Last cardioplegia administered 15 minutes ago" | 追加投与までの間隔を予告する／経過を伝える | [2][5] | 中〜高 |
| 吸入麻酔 | "isoflurane on at 1%" | "on at ○%" の形 | [18] | 中 |
| 検査値（豪NZ） | "K of 8.3"、"glucose of 17"、"Hb 102"、"HCT 31.4"、"Hct of 0.38" | Hb は g/L（102＝10.2 g/dL 相当）。Hct は%でも小数でも書く。血糖は mmol/L と推定（要確認） | [11] | 中 |
| 検査値（英） | "PaCO2 (kPa) 5.0"、"Hb (g L-1) 171"、"35 to 40 mm Hg (4.6-5.2 kPa)" | 血液ガスは kPa。mmHg と併記する論文もある | [31][32] | 高 |
| 検査値（米） | "Hct: 20%-25%"、"K+: 4.0-5.0 mEq/L"、血糖 mg/dL | Hct は%、K は mEq/L、血糖は mg/dL | [22] | 高 |

---

## 5. 地域・施設による違い

| 観点 | 米国 | 英国 | 豪州・NZ | その他・備考 | 出典 |
|---|---|---|---|---|---|
| 職名 | perfusionist | clinical perfusion scientist（"also known as" clinical perfusionist） | perfusionist | — | [9][14][15][10] |
| 手術室 | operating room／OR | operating theatre(s)。英国の基準文書には "operating room" もある | ANZCP の基準は "operating theatre"。PIRS 166ファイル（重複を含む）のうち theatre を含むもの33件、operating room を含むもの9件（本調査で集計） | — | [9][15][13][10][11] |
| 麻酔科医 | anesthesiologist。役職名で "Anesthesia" と呼びかける | anaesthetist（"consultant anaesthetist"） | anaesthetist／anesthetist（PIRS で33件、anesthesiologist は4件） | — | [2][18][16][11] |
| 医師の職位 | fellow／resident（"Surgical Fellow"） | consultant／registrar | consultant／registrar（"Surgical Registrar"） | — | [4][16][11] |
| 経食道心エコー | TEE | TOE | TOE（PIRS で TOE 4件、TEE 0件） | EU 指針も TOE | [4][22][11][8] |
| 器械出し・外回り | scrub nurse、circulating／circulator | scrub practitioner、operating department practitioner（ODP） | scrub nurse、"the scrub" | — | [2][15][11] |
| 昇圧薬（ボーラス） | phenylephrine＝"Neo"。麻酔科も技士も投与する（動画で両方を確認） | metaraminol ボーラス（英国症例）。技士は院内規定・PSDに沿って投与 | metaraminol を技士が投与（研究プロトコル、インシデント報告） | 誰が投与するかは施設の運用次第。教材では固定しない | [2][18][30][31][14][17][11] |
| 単位 | Hct %、K mEq/L、血糖 mg/dL、ガス mmHg | Hb g/L、ガス kPa | Hb g/L、Hct は%または小数、ガス mmHg（"pO2 600 mmHg"） | — | [22][31][32][11] |
| 送血圧の拍動 | "good pulse"、"good line pressure" | "good swing" | "swing great"、"pulsatility" | 英・豪で swing を確認したが、例は少ない | [2][20][11] |
| 補液の動詞 | "Give 100 cc's"、"give the volume back" | — | "transfused"（麻酔科の依頼で送血管から） | — | [19][21][11][12] |
| 懐中電灯 | "flashlight"（AmSECT のチェック項目） | "Battery powered Torch" | — | 停電時の確認項目 | [9][13] |
| closed-loop の位置づけ | Guideline（should） | 英国の監視基準は "high level of communication" を求める | Standard（shall、at all times） | EACTS は定義を記載 | [9][13][10][8] |
| サッカーを止める時期 | 規定は「プロタミン開始時」。米国の調査では開始前に止める施設は41.4%（PIRS の論評が Lohbusch 2023 を引用） | — | 規定は「開始時」。実際には1/3や50%の施設もある | NL は "Protamine at 1/3" → "Stop blue suction" | [9][23][11][10][5] |
| ACT の閾値 | MGH の講義は「400以上」。学生向け入門書は ">480 per most institutions" | 小児例。ACT が300を超えるまで待ち、370で開始した（報告からの読み取り） | サッカーは300 s、開始は400 s。別施設は CPB の閾値480 s | NL はカニュレーション >300、ECC >400 | [21][29][16][11][5] |
| 回路の色分け | MGH: venous 青、suckers 橙・黄、vents 白（対応は字幕からの推定） | — | 報告中に "yellow line" | NL: "blue suction"、"suck yellow" | [21][11][5] |

### 資料どうしの食い違い
- **遮断解除前の頭位**: MGH の講義（2020年、レジデント）は "head up, volume and ventilate"。その場で指導医から「head down では」と質問が出た。Kaplan の教科書（2008年）は遮断解除前を "head down" と記載している [21][22]。新しいのは講義、権威があるのは教科書だが、講義の場自体が施設差を示している。教材では「外科医の指示に従う」として扱い、両方の言い方を聞き取り教材にするのが安全。
- **サッカーを止める時期**: 学会基準（AmSECT 2017 Std 12.1、ANZCP 2022 Std 8.6）は「プロタミン開始時」。豪NZの現場報告（2024年）には1/3や50%の運用があり、報告者自身が「規定からの逸脱」と書いている [9][10][11]。基準の方が権威がある。
- **closed-loop の拘束力**: AmSECT は Guideline 3.2（推奨）、ANZCP は Standard 3.2（必須）[9][10]。AmSECT 2023年改訂の変更点表に 3.2 の変更は見当たらなかった（2023年版の本文は未確認）。

---

## 6. 聞き取りで重要な語・聞き違いやすい語

| 語・対 | 注意点 | 出典 |
|---|---|---|
| on / off | 手術室では聞き分けにくい。off を "O-F-F" と綴って言う技士もいる | [18] |
| vent（人工呼吸器）/ vent（LV・ルートベント） | "Vent off"・"Restart vent" は人工呼吸器のこと。"LV vent on" はベントのこと | [1][18] |
| protamine / Prolene | 聞き違いの実例がある。体外循環中のプロタミン宣言には技士がすぐ異議を唱える | [11]2016 Drug-Medication |
| flow down / flow up | 遮断の前後で必ず対で出る（"Clamp on, flow up"） | [1][18] |
| full flow / half flow | 開始時の合図（換気停止）と、離脱途中の段階 | [1][4] |
| clamp on / clamp off、"XCLAMP" | 遮断と解除。記録では XCLAMP on/off | [1][11] |
| back up / back on | back up＝流量を戻す。back on＝体外循環を再開する | [18][11] |
| pump off / pump suckers off | 前者はポンプ停止（緊急）、後者はサッカー停止（プロタミン） | [11][1] |
| level | リザーバーのレベル（"my level's getting a little better"、"low level alarm"） | [2][11] |
| swing / pulse / pulsatility | 送血ライン圧の拍動 | [20][2][11] |
| drift | 能動的に冷やさない冷却 | [19] |
| hot shot、retro、root、antegrade | 心筋保護の方法を表す語 | [33][19][8][1] |
| air lock、"dark" blood、change-out、hand crank | トラブル対応の中心となる語 | [22][11] |
| mics、cc's、index、lpm、kPa | 単位の短縮形と地域による違い | [18][2][11][31] |
| registrar、consultant、TOE、theatre | 英・豪NZの職名・用語 | [11][16] |

---

## 7. 確度が低い領域・未確認（推測）の一覧

| 表現・領域 | 状況 | 必要な確認 |
|---|---|---|
| "pleg"（米国の短縮形） | AmSECT 動画の字幕に "PL" とあるだけ。豪NZでは "plege"・"'plegia" を確認済み | 動画 [2] の 4:55 前後を人が聞いて確認する |
| "crit"（Hct の短縮形） | 出典が見つからない。未確認（推測） | 現役の技士に聞き取る、実際の録音で確認する |
| 体内除細動の掛け声（"charging"、"clear"、"ten joules" など） | 未確認（推測）。エネルギー（成人5–10 Jから）だけ [22] で確認 | 心臓外科・麻酔科の監修 |
| ペーシングの指示（"pacing on" など） | 未確認（推測）。概念だけ [22] で確認 | 監修 |
| 遮断時刻・遮断時間の口頭報告（"clamp on at…"、"cross-clamp time…"） | 記録の書き方 [11] と、前後で言葉にすること [5] は確認。口頭の決まり文句は未確認（推測） | 録音・現場の聞き取り |
| 離脱時刻の宣言（"off bypass at…"） | 未確認（推測） | 同上 |
| 離脱後の "give 100" | 送血ライン試験での "Give 100 cc's" [19]、補液依頼の記述 [11]、教科書の送血管からの補液 [22] はある。離脱後の決まり文句としては未確認 | 同上 |
| CVP・PAP・尿量・BIS・SvO2 の口頭報告 | 言い方は未確認。確認項目としては [22][9] にある | 同上 |
| 換気再開・肺の加圧の言い方（"give a breath"、"Valsalva" など） | 未確認（推測）。概念は [22][21] | 同上 |
| "come around"（英国） | 字幕1件だけ（低） | 英国の技士に確認 |
| 英・豪での昇圧薬の略称 | PIRS に "Aramine" は見つからず（"metaraminol" は1件） | 現場への聞き取り |
| Wadhera 2010 の8事象と文言 | 本文が入手できなかった（出版社サイトが403） | 図書館経由で本文を入手する |
| Hazlehurst 2007 の発話例 | 同上 | 同上 |
| 実務者フォーラム（Reddit 等） | 取得できなかった（403） | 必要ならブラウザで閲覧する |
| 教科書（Gravlee、Ghosh/Falter/Perrino） | 本文は未確認 | 院内・図書館で確認 |
| 自動字幕由来の表現全般（[ASR] の付いた行） | 台本や講義の内容としては信頼できるが、語の誤認識がありうる | 動画 [2][18][19][20][21] を音声で聞き直す |

---

## 8. 教材設計への示唆

1. **3往復を1単位にする**: 依頼→数値・時刻付きの復唱→確認、を最小単位にする（P1-06、P6-05、P7-06 の型）。返答では「内容のある復唱（"heparin is in"）」と「内容のない返事（"OK"）」の違いを教える [5]。
2. **数値は単位なしで聞き取る練習を**: "500"（mL/分）、"an index of two"、"mics"、"stopped at 485"、"8:58" のように単位が省かれる。地域による単位の切り替え（mmHg/kPa、g/dL・%/g/L・小数）も練習問題にする。
3. **聞き違いやすい語の練習**: on/off、vent（人工呼吸器）/vent（ベント）、protamine/Prolene、flow up/down、back up/back on。綴りで言う "O-F-F" の技術を教える [18][11]。
4. **地域別の音声パックを用意する**: 米（OR、anesthesiologist、Neo、TEE、fellow）と英・豪NZ（theatre、anaesthetist、metaraminol、TOE、registrar・consultant、clinical perfusion scientist）を分ける。
5. **言い返す練習**: ACT が足りないのに外科医が急かす、プロタミン開始なのにサッカーを続けたがる、体外循環中にプロタミンが宣言される。どれも豪NZの実例が根拠になる [11]。
6. **トラブル場面は「誰が・何を・どの数値で」の型にする**: MUSC の調査で挙がった項目 [25] と、読み上げ役（reader）を決める危機チェックリスト [26] を骨組みにする。
7. **出典ラベルをアプリに持たせる**: 中・低の行（特に [ASR]）は「聴取確認待ち」として、監修が済むまで本番の教材文に使わない。

---

## 9. 出典一覧（参照日はすべて 2026-10-12）

1. Tarola CL, Quin JA, Haime ME, et al. Computer-Assisted Process Modeling to Enhance Intraoperative Safety in Cardiac Surgery. *JAMA Surg.* 2016;151(12):1183-1186. https://pmc.ncbi.nlm.nih.gov/articles/PMC5177530/ （Table の注記: "All commands are derived from the natural operating language of the surgeons"。VA Boston）
2. AmSECT／ICEBP. Cardiac Surgery Team Simulation Videos（2013年制作。制作年は [3] による）。一覧: https://amsect.org/events-education/simulation-videos/cardiac-surgery-team-simulation-videos 。自動字幕を取得した動画は次の4本。
   - Initiation of CPB – Improved: https://youtu.be/Fj2nlbmQl1I
   - Initiation of CPB – Poor: https://youtu.be/KuMHC9KxgTc
   - Preoperative Briefing – Improved: https://youtu.be/l98D6izEajA
   - Intraoperative Aortic Dissection: https://youtu.be/-Lq6nIvviy0
3. Dias RD, Riley W, Shann K, et al. A tool to assess nontechnical skills of perfusionists in the cardiac operating room. *J Thorac Cardiovasc Surg.* 2023;165(4):1462-1469. https://pmc.ncbi.nlm.nih.gov/articles/PMC8720321/
4. Dias RD, Zenati MA, Conboy HM, et al. Dissecting Cardiac Surgery: A Video-based Recall Protocol to Elucidate Team Cognitive Processes in the Operating Room. *Ann Surg.* 2021;274(2):e181-e186. https://pmc.ncbi.nlm.nih.gov/articles/PMC7241253/
5. de Lind van Wijngaarden RAF, Siregar S, Legué J, et al. Developing a Quality Standard for Verbal Communication During CABG Procedures. *Semin Thorac Cardiovasc Surg.* 2019;31(3):383-391. doi:10.1053/j.semtcvs.2018.12.001。CC BY の PDF: https://repository.tudelft.nl/file/File_18958ef7-ef12-4f52-987a-b062183f0d7e （Leiden。Table 3 の項目は英訳）
6. Wadhera RK, Parker SH, Burkhart HM, et al. Is the "sterile cockpit" concept applicable to cardiovascular surgery critical intervals or critical events? *J Thorac Cardiovasc Surg.* 2010;139(2):312-319. https://pubmed.ncbi.nlm.nih.gov/20106395/ （抄録のみ確認）
7. Hazlehurst B, McMullen CK, Gorman PN. Distributed cognition in the heart room. *J Biomed Inform.* 2007;40(5):539-551. https://pubmed.ncbi.nlm.nih.gov/17368112/ （抄録のみ確認）
8. Wahba A, Kunst G, De Somer F, et al. 2024 EACTS/EACTAIC/EBCP Guidelines on cardiopulmonary bypass in adult cardiac surgery. *Eur J Cardiothorac Surg.* 2025;67(2):ezae354. https://pmc.ncbi.nlm.nih.gov/articles/PMC11826095/
9. AmSECT. Standards and Guidelines for Perfusion Practice (2017). https://www.theaacp.com/wp-content/uploads/2017/11/AmSECT_Perfusion_SG_legal_ICEBP_final_2017.pdf 。2023年改訂の変更点: https://www.amsect.org/Portals/0/Comparison%20of%20S%26G%20Changes%20from%202017%20to%202023%20Final%20Draft.pdf
10. ANZCP. Standards and Guidelines for Perfusion Practice（2022年6月15日承認）. https://anzcp.org/wp-content/uploads/2022/06/ANZCP-Standards-and-Guidelines-Approved-15062022.pdf
11. ANZCP. PIRS-2 Reports（一覧: https://anzcp.org/pirs-ii/pirs-ii-reports/ ）。引用した報告（https://anzcp.org/wp-content/uploads/reports/ 以下）:
    - 2015/: PIRS-2015-Air-in-Circuit-2.pdf、PIRS-2015-Circuit-Disruption-3.pdf、PIRS-2015-Electrical.pdf、PIRS-2015-Hypo-hyper_perfusion.pdf、PIRS-2015-Oxygenator-1.pdf、PIRS-2015-Pump-Servoregulation-1.pdf
    - 2016/: PIRS-2016-Cannulation.pdf、PIRS-2016-Circuit-disruption.pdf、PIRS-2016-Circuit-error.pdf、PIRS-2016-Coagulation.pdf、PIRS-2016-Drug-Medication.pdf、PIRS-2016-Electrical-electronic.pdf
    - 2017/: PIRS-2017-Oxygenator.pdf
    - 2018/: PIRS-2018-Coagulation.pdf
    - 2019/: PIRS-2019-Hypoperfusion.pdf、PIRS-2019-Cardioplegia.pdf
    - 2020/: PIRS-2020-Cardioplegia.pdf
    - 2021/: PIRS-2021-Coagulation.pdf、PIRS-2021-Coagulation_2_Oxygenator_Changeout.pdf、PIRS-2021-Heater_Cooler_Degradation.pdf、PIRS-2021-Venous_Reservoir.pdf
    - 2022/: PIRS-2022-Air-Entrainment-Intra-Op.pdf、PIRS-2022-Hypoxia.pdf、PIRS-2022-servoregulation.pdf
    - 2024/: PIRS-2024-Coagulation_(Communication).pdf、PIRS-2024-Coagulation_(Heparinisation).pdf、PIRS-2024-Coagulation_(Protamine).pdf、PIRS-2024-Coagulation_(Protamine)_2.pdf
    - 2026/: PIRS-2026-VAVD_Staffing.pdf
12. ANZBP. Trainee Case Evaluation Form and Case Reflection – 200 Case（2025）. https://anzcp.org/wp-content/uploads/2025/06/ANZBP-Trainee-Case-Evaluation-Form-and-Case-Reflection-200-Case.pdf
13. SCPS／ACTA／SCTS. Recommendations for Standards of Monitoring and Safety during Cardiopulmonary Bypass（2016年8月）. https://global-uploads.webflow.com/5da4ad68b9d5374c5a54c71d/5da4ad68b9d537cbe854ca4a_Recommended%20Standards%20Of%20Monitoring%20During%20Cardiopulmonary%20ByPass.pdf
14. Society of Clinical Perfusion Scientists of GB & Ireland. Code of Practice（2019）. https://global-uploads.webflow.com/5da4ad68b9d5374c5a54c71d/5da742c4b9d497537544e0b7_SCPS-%20CODE%20OF%20PRACTICE%20-%202019.pdf
15. NHS Scotland Careers. Clinical perfusion scientist. https://www.careers.nhs.scot/explore-careers/healthcare-science/physiological-sciences/clinical-perfusion-scientist/
16. Lomax S, Catchpole K, Sutcliffe J. Human factors in anaesthetic practice. Part 2: clinical implications. *BJA Educ.* 2024;24(2):68-74. https://pmc.ncbi.nlm.nih.gov/articles/PMC10829084/
17. Noe KM, Don A, Cochrane AD, et al. Intraoperative hemodynamics and risk of cardiac surgery-associated acute kidney injury. *Clin Exp Pharmacol Physiol.* 2023;50(11):878-892. https://pmc.ncbi.nlm.nih.gov/articles/PMC10947000/ （Monash University, Melbourne）
18. Feinstein M（チャンネル）. POV: Going on the Heart-Lung Machine | Perfusionist Explains Cardiopulmonary Bypass. YouTube, 2025-05-31（Quinnipiac Cardiovascular Perfusion Program の模擬手術室）. https://www.youtube.com/watch?v=NLrEZGb6RF0 （自動字幕）
19. Greenfield B（UNMC）. Initiation of Bypass Lab. YouTube, 2018-03-18. https://www.youtube.com/watch?v=phxgyZ8ywWQ 。同講師の Maintenance of Bypass Lab（公開日は未確認）: https://www.youtube.com/watch?v=ZrGTPhwemqE （いずれも自動字幕）
20. Ismail A（Southampton University Hospitals, UK）. Cardiopulmonary Bypass: Conduct and Weaning. CTSNetVideo, YouTube, 2019-03-01. https://www.youtube.com/watch?v=8gAryVQGEnU （自動字幕）
21. Kreso A（MGH CT surgery resident）. Cardiac Surgery Didactics—Principles of Cardiopulmonary Bypass. MassGeneralHospital, YouTube, 2020-11-16. https://www.youtube.com/watch?v=PeJAdhk2RMc （自動字幕）
22. Mora-Mangano C, Chow JL, Kanevsky M. Cardiopulmonary Bypass and the Anesthesiologist（Chapter 22）. Kaplan's Essentials of Cardiac Anesthesia 所収, Elsevier（PDF のメタデータは2008年）. McGill 大学が掲載した PDF: https://www.mcgill.ca/anesthesia/files/anesthesia/wk_6a_kaplan_22_cpb1.pdf
23. Stewart JW, Nieter D, Wu X, et al. Advancing cardiotomy suction practices for coronary surgery via multidisciplinary collaborative learning. *JTCVS Open.* 2024;17:121-144. https://pmc.ncbi.nlm.nih.gov/articles/PMC10897666/
24. Gavin-Veyna J, et al. An in-vitro study of the timing between protamine sulfate administration and cardiotomy suction termination. *J Extra Corpor Technol.* 2025;57(4):188-193. https://pmc.ncbi.nlm.nih.gov/articles/PMC12710249/
25. Murphy A（MUSC Cardiovascular Perfusion Program）. A Survey of Perfusionists' Communication During Critical Events. AACP Newsletter, Summer 2020. https://www.theaacp.com/wp-content/uploads/2020/09/Summer_2020_Survey-of-Perfusionists-Communication_Murphy.pdf
26. Tarola CL, Hirji S, Yule SJ, et al. Cognitive Support to Promote Shared Mental Models during Safety-Critical Situations in Cardiac Surgery. IEEE CogSIMA 2018:165-167. https://pmc.ncbi.nlm.nih.gov/articles/PMC6364745/
27. Rance G, Arney D, Srey R, Goldman JM, Zenati MA. Establishing a Ventilator-Heart Lung Machine Communication Bridge to Mitigate Errors when Weaning from Bypass. *J Extra Corpor Technol.* 2019;51(1):38-40. https://pmc.ncbi.nlm.nih.gov/articles/PMC6436169/
28. Sarkar M, Prabhu V. Basics of cardiopulmonary bypass. *Indian J Anaesth.* 2017;61(9):760-767. https://pmc.ncbi.nlm.nih.gov/articles/PMC5613602/
29. Bhagat R, et al. A primer for the student joining the adult cardiac surgery service tomorrow: Primer 1 of 7. *JTCVS Open.* 2023;14:270-292. https://pmc.ncbi.nlm.nih.gov/articles/PMC10328963/ （"the pump" という呼び方、ACT の記載）
30. CRNA School Prep Academy. Episode 162: Phenylephrine (Neo-Synephrine). 2024-03-27. https://crnaschoolprepacademy.com/podcast/episode-162-phenylephrine-neo-synephrine-what-is-it-and-how-does-it-work-free-study-guide-included/ （"phenylephrine also commonly referred to as Neo"）
31. Coulie R, Ryckaert F, Raevsky E, Tsang V, Wright S. Anaesthetic Management of One-Lung Ventilation in a Fontan Patient. *Cureus.* 2025;17(8):e89274. https://pmc.ncbi.nlm.nih.gov/articles/PMC12404007/ （Barts Heart Centre, London。kPa・g/L・metaraminol の表記）
32. Gibbison B, et al. Hypobaric type oxygenators during cardiopulmonary bypass for cardiac surgery to reduce gaseous microemboli. *JTCVS Open.* 2026;31:101723. https://pmc.ncbi.nlm.nih.gov/articles/PMC13316339/ （Bristol, UK。mmHg と kPa を併記）
33. "hot shot" という用語の出典:
    - Volpi S, Ali JM, De Silva R. Does the use of a hot-shot lead to improved outcomes following adult cardiac surgery? *Interact Cardiovasc Thorac Surg.* 2019;28(3):473-477. doi:10.1093/icvts/ivy266
    - Ambrosio G, Gensini G. Commentary: Potential advantages of terminal warm blood cardioplegia: Will the "hot shot" approach become hot…? *J Thorac Cardiovasc Surg.* 2022;164(4):e157-e158. doi:10.1016/j.jtcvs.2020.12.046
    - James TM, et al. Warm Blood Cardioplegia for Myocardial Protection: Concepts and Controversies. *Tex Heart Inst J.* 2020. https://pmc.ncbi.nlm.nih.gov/articles/PMC7328091/ （Caputo 1998 "Warm blood hyperkalaemic reperfusion ('hot shot')" を引用）
34. Groom RC, Forest RJ, Cormack JE, Niimi KS, Morton J. Parallel replacement of the oxygenator that is not transferring oxygen: the PRONTO procedure. *Perfusion.* 2002;17(6):447-450. doi:10.1191/0267659102pf606oa （[11] の PIRS-2021 報告に添付されていたものを確認）
