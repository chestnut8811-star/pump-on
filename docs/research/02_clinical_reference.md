# CPB（人工心肺）臨床値・手順の根拠表 — 「Pump On!」教材用

- 文書の性格: AI（調査サブエージェント）による文献調査の下書き。**臨床未監修**。教材に反映する前に、臨床工学技士・心臓血管外科医・麻酔科医の監修を受けること。
- 調査日: 2026-10-12（出典の参照日もすべて同日）
- 対象: 成人の人工心肺（小児・DHCA は必要な範囲のみ）
- 方針: 一次資料に書かれている範囲だけを記載した。出典で確認できなかった数値は書かず「未確認」とした。引用は原文の短い抜粋（15語未満）。

## 凡例

- **根拠・推奨クラス**: I（推奨）／IIa（考慮すべき）／IIb（考慮してもよい）／III（推奨しない）、エビデンスレベル A／B／C。STS 2021 は B-R・B-NR・C-LD 表記。AmSECT は Standard（shall＝必須）／Guideline（should）。JaSECT は 必須／強く推奨／推奨。推奨表にない本文の記述は「本文」と表記。
- **確度**: 確定＝一次資料の原文で確認／二次情報＝レビュー論文・事例報告のみ／未確認＝探したが出典で確認できず。
- **施設差**: 大＝資料間で食い違う、または施設プロトコルに委ねると明記／中＝範囲はおおむね一致するが値は施設で異なる／小＝ほぼすべての資料で一致。
- 出典番号は末尾の「出典一覧」に対応。

---

## 0. 会話例でよく使う数値の早見表

会話例の数値は「例」として使い、解説では各章の「推奨値・範囲」と施設差を示す想定。

| 会話例の数値 | 判定 | 根拠の要点 | 出典 |
|---|---|---|---|
| "Heparin 300 units per kilo" | 例として可（国内外差あり） | 海外 GL 本文は 300–500 U/kg（PBM 2024 は 300–600）。国内添付文書は 150–300 単位/kg（300 は上限側） | [2][5][16] |
| "ACT is 520" | 可 | >480 s が代表的な目標（STS 2018 IIa-C、EACTS 2019 IIa-C） | [4][2] |
| "ACT is 410, OK to go on" | 施設依存 | 最大活性化型 ACT 機器では >400 s を治療域とすることが多い（STS 2018 IIa-C の推奨文中）。一方、300 IU/kg 投与後に <400 s はヘパリン抵抗性の定義例（PBM 2024 本文） | [4][5] |
| "Flow 4.5 liters" | 可 | 2.2–2.8 L/min/m²。4.5 L/min は BSA 約 1.61–2.05 m² に相当（計算値） | [1] |
| "MAP is 60" | 可 | 50–80 mmHg を維持（EACTS 2024 I-A） | [1] |
| "DO2i is 280" | 可 | 下限 280 mL/min/m²（EACTS 2024 I-A） | [1] |
| "SvO2 is 75" | 例として可 | 検証済みの単独閾値はない。>75% 維持で AKI が少なかった後ろ向き報告 | [1] |
| "Cooling to 32" | 可 | 軽度低体温（28.1–34℃）。90%超の施設が 32–34℃（STS 2015 本文の調査） | [1][3] |
| "Arterial outlet 37.5" | 誤りの例として使える | 送血温は <37℃（STS I-C）／最大 37℃（EACTS 2024 I-A） | [3][1] |
| "Rewarming gradient 10 degrees" | 条件付き | 送血温 <30℃なら最大 10℃（IIa-C）、≥30℃では ≤4℃（IIa-B）。国内 2007GL は 5℃以内 | [3][13] |
| "Hct 20, DO2i fine, no blood yet" | 可 | Hct 18–24% は組織酸素化を評価して判断（IIb-B）。<18%（Hb 6.0）は輸血推奨（I-C） | [1] |
| "K is 5.8 after cardioplegia" | 可 | 治療を検討するのは 6.5–7 mmol/L 超（EACTS 本文） | [1][2] |
| "Next dose in 20 minutes" | 可 | 間欠投与は 20–30 分ごと（EACTS 本文、国内 2007GL） | [1][13] |
| "Root pressure 80" | 可 | EACTS 60–100 mmHg、国内 2007GL 80–100 mmHg | [1][13] |
| "CS pressure 40" | 施設差あり | EACTS 30–50 mmHg、国内 2007GL 約 30 mmHg、HTK 製品概要 ≤30 mmHg | [1][13][22] |
| "del Nido 20 mL/kg, max one liter" | 原法の例として可 | 小児原法（Boston）。成人の追加投与時期は施設差 | [20][21] |
| "Protamine one to one" | 両論併記が必要 | EACTS 2024 は比 <1.0（I-B）。国内添付文書はヘパリン 1,000 単位に 10–15 mg | [1][17] |
| "Protamine is going in — suckers off" | 可（定番） | 投与開始で停止（EACTS 2024 IIa-C、AmSECT Standard 12.1） | [1][6] |
| "Systolic below 100 for cannulation" | 可 | EACTS 2024／2019 本文: 挿入時の収縮期血圧は通常 100 mmHg 未満（推奨表ではなく本文）。レビューでは 90–100 mmHg | [1][2][26] |
| "Switching to hand crank" | 可（定番） | 手動装置の常備は JaSECT 必須、AmSECT shall | [8][6] |

---

## 1. 抗凝固

| 項目 | 推奨値・範囲 | 根拠・推奨クラス | 出典 | 施設差 | 教材での扱い方の提案 |
|---|---|---|---|---|---|
| ヘパリン初回量 | 海外: 体重換算が一般的。EACTS 2019 本文 "ranges from 300 to 500 U/kg"。EACTS 2024 PBM 本文 "300 to 600 units per kilogram"。STS 2018 本文の例 "e.g. 300 IU/kg"。国内添付文書: 「人工心肺灌流時には、150～300単位／kg」 | 本文・添付文書の記載で推奨クラスなし。STS 2018: 体重換算ボーラスは妥当（IIa, C）、ヘパリン用量反応法が体重換算より有用とは示されていない（IIb, B）。確度: 確定 | [2][5][4][16] | 大（国内添付文書の範囲が海外慣行より低い） | "300 units per kilo" は例として使用可。解説で「国内添付文書 150–300 単位/kg、海外 GL 本文 300–500（600）U/kg。実際は施設プロトコル」と併記 |
| CPB 開始前の ACT | STS 2018: 開始前と定期的に、凝固時間で十分な抗凝固を確認（I, C）。EACTS 2024 本文: 豪州の調査で開始前目標 480 s（範囲 400–500）。国内 2007GL: 体外循環直前チェックに「ACT 延長の確認」（数値なし）。JaSECT ハンドブック: 「ACT が適正に伸びるまで体外循環を開始しない」 | 確定（国内資料に数値なし） | [4][1][13][12] | 大（機器・回路で目標が異なる） | "ACT is 520, we're ready to go on bypass." は可。開始可能な秒数は施設目標として扱い、一般論は「十分な延長を確認してから」 |
| CPB 中の ACT 維持目標 | STS 2018: "It is reasonable to maintain ACT above 480 seconds"（IIa, C）。最大活性化型機器では "values above 400 seconds are frequently considered therapeutic"。EACTS 2019: 非コーティング回路＋心内吸引で >480 s を考慮、必要値は機器による（IIa, C）。EACTS 2024 本文も同旨。EACTS 2024 PBM 本文: 目標 "between 300 and 600 s"（測定法・投与戦略で変わる） | 確定 | [4][2][1][5] | 大 | 480 は国際的な代表値として例示可。「400 を目標とする機器・施設」「コーティング回路では低め」がある点を解説 |
| ACT 測定間隔 | 具体的な分数は主要 GL に記載なし。EACTS 2024: "at regular intervals based on institutional protocols"（I, C）。STS 2018: 定期的に測定（I, C）。AmSECT Standard 8.1: 測定頻度を医師と定義 | 確定（数値は未確認） | [1][4][6] | 大 | 「20 分ごと」「30 分ごと」などは会話例の中だけで使い「施設プロトコル例」と明示。根拠表では断定しない |
| 追加投与の考え方 | 凝固検査の結果に基づき追加（EACTS 2024 I, C、AmSECT Guideline 8.2）。STS 2018: ACT 監視下での定時追加も選択肢（IIb, C）。EACTS 2024 PBM 本文: ACT が大きく下がれば追加。国内添付文書:「体外循環時間の延長とともに必要に応じて適宜追加」。国内 2007GL: 復温時はヘパリン半減期が短縮するため注意 | 確定 | [1][6][4][5][16][13] | 中 | 追加量（"5,000 units" など）は施設例。解説は「ACT を見て追加」「復温時は低下しやすい」 |
| ヘパリン抵抗性（AT 欠乏） | 定義例: 300 IU/kg 投与後に ACT <400 s（EACTS 2024 PBM 本文）。AT 製剤の投与を推奨（EACTS 2024 CPB は AT 欠乏の "primary treatment" として I, B／EACTS 2024 PBM は AT 欠乏患者への補充を I, A／STS 2021 は AT が原因のヘパリン抵抗性に Class I, Level A）。AT 製剤がなければ FFP（EACTS 2024 IIa, C）。手段を尽くしても十分な ACT が得られなければ代替法を検討（EACTS 2024 本文）。JaSECT ハンドブック: AT 欠乏を疑い検査、AT 製剤を投与。国内 AT 製剤の効能は「先天性アンチトロンビン欠乏に基づく血栓形成傾向」「アンチトロンビン低下を伴う播種性血管内凝固症候群（DIC）」で、CPB 中のヘパリン抵抗性は記載なし | 確定（国内での適応外使用・保険上の扱いは要確認） | [1][5][7][12][18] | 大（国内は効能外の可能性） | "We may need antithrombin." は可。解説で「国内では添付文書の効能外になりうる。施設の取り決めを確認」と明記 |
| HIT など代替抗凝固（参考） | ビバリルジンを第一選択として考慮（EACTS 2024 IIa, B）、腎障害ではアルガトロバン（IIb, C）。ACT 目標はベースラインの 2.5 倍、通常 >300 s（本文） | 確定 | [1] | 中 | 応用編に留める |

## 2. pump suckers（心内・術野吸引）

| 項目 | 推奨値・範囲 | 根拠・推奨クラス | 出典 | 施設差 | 教材での扱い方の提案 |
|---|---|---|---|---|---|
| 使い始めてよい条件 | 吸引開始の ACT 数値を明記した一次資料は見つからず。関連: STS 2018 は CPB 開始前に凝固時間で十分な抗凝固を確認（I, C）。国内 2007GL の直前チェックに「ACT 延長の確認」。JACE 人工心肺業務指針は「確実なヘパリン投与とその効果を確認」の後にサクション操作を記載。事例: ANZCP の報告で ACT >400 s までサッカーも CPB も開始しなかった好事例 | 数値は未確認（事例は二次情報） | [4][13][15][27] | 大 | "ACT is over 400 — suckers on." は「施設基準の例」と明示。解説は「ヘパリン投与と ACT 延長を確認してから」に留める |
| プロタミン時に止めるタイミング | EACTS 2024: "Cardiotomy suction should be discontinued with the start of the administration of protamine."（IIa, C）。AmSECT Standard 12.1: "shall be discontinued at the onset of protamine administration"（必須）。JaSECT ハンドブック:「プロタミンが投与され始めたらサクションポンプを止める」 | 確定 | [1][6][12] | 小 | 定番フレーズとして正面から扱ってよい |
| 止める理由 | 回路内の凝固を防ぎ、緊急の CPB 再開を不能にしないため（EACTS 2024 本文、AmSECT 12.1）。JaSECT ハンドブック: プロタミン投与後の回収血で回路内残血が凝固し、返血不能・再開遅延の原因 | 確定 | [1][6][12] | 小 | 理由を英語で説明させる練習題材に向く |
| テストドースとの関係 | テストドースだけでも ACT が大きく下がる。臨床前向き研究で平均 40% 低下、81% が 480 s 未満（Jansa 2022、"before any amount of protamine" で停止を推奨）。ブタ血の in vitro 研究でも平均 38.2% 低下（2025）。テストドース量は全量の 1–67% と麻酔科医でばらつき | 二次情報（単施設研究） | [23][24] | 大（テストドースの有無・量） | テストドースを出す会話では、その時点でサッカー停止を示すのが安全側。テストドースの実施自体は施設差 |
| 吸引の使い方 | 血球損傷を抑えるため心内吸引の使用を限定（EACTS 2024 IIa, B）。回収血の廃棄（IIa, B）または処理後返血（IIa, B）を考慮。日本心臓血管外科学会（2009）:「カルディオトミーリザーバはポンプ吸引だけで操作すべき」、壁吸引は人工心肺と独立した系で | 確定 | [1][14] | 中 | 解説で「サッカー血は活性化している」程度の一般論として扱える |

## 3. 送血管挿入時の血圧

| 項目 | 推奨値・範囲 | 根拠・推奨クラス | 出典 | 施設差 | 教材での扱い方の提案 |
|---|---|---|---|---|---|
| 収縮期血圧の目安 | EACTS 2024 本文: "the systolic arterial blood pressure (ABP) is commonly kept below 100 mmHg"。EACTS 2019 本文: "usually lowered below 100 mmHg before cannulation"。レビュー: "systolic pressure should be 90–100 mm Hg"（Sarkar 2017）。STS／AmSECT／JaSECT／国内 2007GL には数値の記載なし | 本文の慣行記載（推奨クラスなし）。確度: 確定 | [1][2][26] | 中 | "Can we bring the systolic below 100 for cannulation?" は一般的な慣行として扱える。下げ幅（90 か 100 か）は施設・術者で異なると注記 |
| 理由 | 大動脈解離のリスク低減（EACTS 2024／2019 本文、Sarkar 2017）。解離は大動脈カニュレーションの 0.06–0.23%（EACTS 2019 本文）。医原性大動脈解離は送血管挿入部や遮断部に多い（EACTS 2024 本文） | 確定 | [1][2][26] | 小 | 理由は一般論として扱える |
| 挿入後の確認 | 国内 2007GL 直前チェック:「送血圧拍動の確認」「送血テストの確認」（少量送血して送血圧が異常に上がらないこと）。JaSECT ハンドブック: 接続しても拍動が見えない場合はカニューレ先端が内膜を貫いていない可能性（偽腔送血の危険） | 確定 | [13][12] | 小 | "Line pressure is pulsatile, test infusion is fine." の会話に使える |

## 4. ポンプ流量・平均血圧・酸素需給

| 項目 | 推奨値・範囲 | 根拠・推奨クラス | 出典 | 施設差 | 教材での扱い方の提案 |
|---|---|---|---|---|---|
| ポンプ流量 | EACTS 2024 本文（中等度低体温〜常温）: "most perfusionists usually set the pump flow rate between 2.2 and 2.8 L/min/m2"。開始前に BSA と予定温度から決める（I, C）。肥満では除脂肪体重による計算を下限として考慮（IIb, B）。AmSECT Standard 10.1: 目標流量をプロトコルで事前決定 | 確定 | [1][6] | 中 | "4.5 liters" は BSA×2.2–2.8 で妥当性を計算（BSA 1.8 m² なら 4.0–5.0 L/min、計算値） |
| 平均血圧（MAP） | "MAP be maintained between 50 and 80 mmHg"（EACTS 2024 I, A、麻酔深度と流量を確認したうえで）。昇圧薬で 80 mmHg 超にするのは推奨しない（III, B）。術前に測った脳自動調節能に基づく個別化（IIa, A）。血管麻痺には α1 作動薬やバソプレシン（I, C）。AmSECT Standard 11.1: 血圧管理アルゴリズムと許容範囲を事前に定義。国内 2007GL: 開始時の血圧低下は流量の一時増加か昇圧薬で対処 | 確定 | [1][6][13] | 中 | "MAP is 45 — could we have some phenylephrine?" は例として可。目標は「50–80 の範囲で施設が設定」と解説 |
| DO2i の臨界値 | "a minimal value of DO2 of 280 ml/min/m2"（EACTS 2024 I, A、AKI stage 1 予防）。常温 CPB での下限 280–300（IIa, B）。目標指向灌流（GDP）自体を推奨（I, A）。2019 版は閾値の数値なし（IIa, B）。計算式: DO2i = 10 × CI × CaO2（AmSECT Standard 9.2） | 確定 | [1][2][6] | 小〜中 | "DO2i is 260 — let's increase the flow." は妥当。計算式は教材本文で扱える |
| SvO2 | 流量の適否は SvO2 等で評価（IIa, B）するが "No validated threshold presently exists."（EACTS 2024 推奨文中）。本文: SvO2 >75% 維持で AKI stage 1 が少ない（後ろ向き）、輸血は SvO2 <68% または O2ER >39% で有効（後ろ向き）。連続モニタ: EACTS I, B／AmSECT Standard 7.10／JaSECT 必須。レビュー: 70% 以上を維持（Sarkar） | 確定（閾値の根拠は弱い） | [1][6][8][26] | 中 | "SvO2 is 72" などは例。解説は「単独の絶対閾値はない」 |
| 乳酸 | 灌流の適否指標の一つ（EACTS 2024 IIa, B、閾値なし）。本文: 乳酸 >4.0 mmol/L とアシドーシスは術後出血増と関連（後ろ向き）、術後 6 時間で >3 mmol/L は合併症と関連 | 確定（術中の介入閾値は未確認） | [1][2] | 大 | "Lactate is 3.5" などは例。介入閾値として断定しない |

## 5. 温度管理

| 項目 | 推奨値・範囲 | 根拠・推奨クラス | 出典 | 施設差 | 教材での扱い方の提案 |
|---|---|---|---|---|---|
| 冷却時の温度帯 | 分類（核心温: 直腸／膀胱）: 軽度 28.1–34℃、高中等度 24.1–28℃、低中等度 20.1–24℃、深 14.1–20℃（EACTS 2024 Table 3、弓部手術の専門家合意）。実態: "mildly hypothermic perfusion of 32°C to 34°C is routinely used"（90%超の施設、STS 2015 本文の調査）。常温 CPB は十分な DO2 が保てるなら考慮（EACTS 2024 IIa, B）。PBM 2024: 低体温が必要なら 28℃超の軽度低体温（I, B）、常温維持を考慮（IIa, B） | 確定 | [1][3][5] | 大（常温〜軽度低体温） | "cooling to 32" は軽度低体温の典型例として妥当 |
| 冷却時の送血–脱血温度較差 | 人工肺の送血出口と静脈流入の較差 "should not exceed 10°C"（STS 2015 I, C、ガス塞栓予防）。EACTS 2024 本文（DHCA の節）にも 10℃を超えない旨の記載 | 確定 | [3][1] | 小 | 上限 10℃は一般論として解説可 |
| 復温時の較差 | 復温時も 10℃以下（STS 2015 I, C、脱ガス予防）。送血温 ≥30℃では "≤4°C"（IIa, B）、<30℃では最大 10℃（IIa, C）。国内 2007GL:「送脱血温度較差を 5℃以内」 | 確定 | [3][13] | 中（4℃／5℃／10℃が併存） | 会話例は "keep the gradient within 4 degrees" なら国内外とも矛盾しにくい。国内 GL の 5℃も併記 |
| 復温速度 | 送血温 ≥30℃で "≤.5°C/min"（STS 2015 IIa, B）。EACTS 2024 本文: ゆっくりした復温は術後認知機能障害の減少と関連（RCT 4 件） | 確定 | [3][1] | 中 | "0.5 degrees per minute or slower" として扱える |
| 送血温の上限 | STS 2015: "limit arterial outlet blood temperature to <37°C"（I, C）。EACTS 2024: "to a maximum of 37oC"（I, A）。AmSECT Standard 6.4: 人工肺出口温を監視し高温アラームを備える。STS 本文: 出口温度ポートは実温を 0.33–0.67℃低く表示しうる | 確定 | [3][1][6] | 小 | "Arterial outlet 37.5" は誤りの例に使える。正解は「37℃を超えない」 |
| 離脱時の目標体温 | 至適離脱温度は推奨なし（STS 2015: エビデンス不十分）。レビュー: 鼻咽頭温は 37℃を超えない、35.5–36.5℃を許容する著者もいる（Sarkar） | 確定（推奨なし）＋二次情報 | [3][26] | 大 | "Nasopharyngeal 36.5" は例として可。解説は「推奨値は確立していない」 |
| 測定部位 | 送血出口温を脳温の代替とする（STS I, C）。復温中は送血出口温が脳灌流温を過小評価すると想定（I, C）。離脱時と直後は肺動脈または鼻咽頭温が妥当（IIa, C）。膀胱・直腸温は復温中に脳温より 2–4℃低いことがある（本文）。EACTS 2024: 複数部位で同時測定（I, C）、弓部 HCA では鼻咽頭温＋核心温（I, C）。AmSECT: 患者核心温を少なくとも 1 部位記録 | 確定 | [3][1][6] | 中 | "NP 35, bladder 33" のように部位差を教える会話に向く |
| （参考）冷温水槽 | 故障時に温水を手動で加える場合「42℃を超えないように注意」（JaSECT ハンドブック） | 確定 | [12] | 小 | トラブル会話の補足に使える |

## 6. Hb/Hct・血糖・K・pH・血液ガス

| 項目 | 推奨値・範囲 | 根拠・推奨クラス | 出典 | 施設差 | 教材での扱い方の提案 |
|---|---|---|---|---|---|
| CPB 中の Hb/Hct 輸血閾値 | EACTS 2024 CPB: Hct <18%（Hb 6.0 g/dL）で輸血推奨（I, C）。Hct 18–24% は組織酸素化（DO2 >273、脳オキシメトリ）を評価して考慮（IIb, B）。Hct >24% で DO2 と酸素抽出が許容なら輸血しない（III, C）。EACTS 2024 PBM: 制限的トリガー（≤75 g/L）を推奨（I, A）。STS 2021: 制限的戦略（I, A）、Hb >10 g/dL での輸血は推奨しない（III） | 確定 | [1][5][7] | 中〜大 | "Hct is 20, DO2i is fine — no blood yet." は根拠と整合 |
| 血糖 | EACTS 2019: "Tight glycaemic control may be considered during CPB"（IIb, B）。本文: 糖尿病患者は "up to 10 mmol/l"、非糖尿病は <7.8 mmol/L が有益な可能性。EACTS 2024 CPB は目標値の記載なし。JaSECT ハンドブック: CPB 中は耐糖能が下がり上昇しやすく「積極的な対応は行わないことが多い」（糖尿病で著しい高血糖は別）。STS 2009 血糖 GL の ≤180 mg/dL は原典を確認できず | 確定（STS 2009 は未確認） | [2][12] | 大 | "Glucose is 250 — insulin?" は例。目標値は施設プロトコル |
| カリウム | 心筋保護後に上がりやすい。"exceeds the threshold of 6.5–7 mmol/L" で MUF・カルシウム・インスリン等を検討（EACTS 2024／2019 本文）。心筋保護液の K は 8–20 mEq/L（EACTS 2019 本文）。離脱時の目標 4.5–5 mmol/L（Sarkar、レビュー） | 確定（離脱時の目標は二次情報） | [1][2][26] | 中 | "K is 5.8 after cardioplegia" は経過観察範囲の例。離脱前目標は施設例 |
| pH 管理（α-stat／pH-stat） | 成人の標準は α-stat（37℃で測定し温度補正しない）（EACTS 2019 本文）。軽〜中等度低体温で α-stat（EACTS 2019 IIa, B／2024 は高中等度低体温で IIa, B）。正常 pH 7.35–7.45 の維持（EACTS 2019 IIa, B）、PBM 2024 も正常 pH 維持（IIa, B）。必要時は CO2 で pH-stat も可能（EACTS 2024 本文） | 確定 | [2][1][5] | 小（成人） | 成人の会話は α-stat 前提で可。小児・DHCA の pH-stat は応用編 |
| PaO2・過酸素の回避 | CPB 中の PaO2 目標値を定めた GL は見つからず。RCT 著者: "There are currently no guidelines on oxygenation during cardiac surgery."。同 RCT では CPB 中 200–220 と 130–150 mmHg の比較で心筋障害に差なし（Smit 2016）。EACTS 2019: 肺保護目的の高酸素は推奨しない（III, A） | 確定（目標値は未確認） | [25][2] | 大 | "PaO2 is 250" などは例。過酸素を避ける方向性のみ解説 |
| PaCO2 | 数値目標の推奨は見つからず。α-stat は 37℃測定値で評価（上記）。CO2 分圧は脳血流に影響（EACTS 2024 本文） | 未確認（数値） | [1][2] | 中 | "PaCO2 40 (alpha-stat)" は例として可 |

## 7. 心筋保護

| 項目 | 推奨値・範囲 | 根拠・推奨クラス | 出典 | 施設差 | 教材での扱い方の提案 |
|---|---|---|---|---|---|
| 血液心筋保護の比率 | 従来型は "4 parts of blood to 1 part of crystalloid"（4:1、Buckberg）。ほかに 1:1–5:1、microplegia（≥66:1）など（EACTS 2019／2024 本文） | 確定 | [1][2] | 大 | "4 to 1 blood cardioplegia" は代表例として可 |
| 初回量 | 標準的な 4:1 血液心筋保護の初回量（mL/kg など）は、主要 GL・国内資料で確認できず | 未確認 | — | 大 | "1,000 mL induction" などを使うなら「施設例」と明示。根拠表には数値を載せない |
| 再投与間隔 | "cold and intermittently every 20 to 30 min"（EACTS 2019／2024 本文）。国内 2007GL:「約 20～30 分毎」、実際は手術操作の区切りで | 確定 | [1][2][13] | 中 | "It's been 20 minutes since the last dose." は妥当 |
| del Nido | 血液:晶質＝1:4。成人で "a single dose for up to 90 min of ischaemia"（EACTS 2024 本文）。長時間遮断・低心機能などは未解決（同）。原法（小児、Boston）: 20 mL/kg 単回、50 kg 超は最大 1 L、遮断 <30 分なら 10 mL/kg、追加は通常不要（例外: 3 時間超など）。成人の後ろ向き研究（遮断 >3 時間）: 初回追加まで中央値 74 分（59–91） | 確定（成人の追加基準は施設差） | [1][20][21] | 大 | "del Nido, 20 mL/kg, max one liter" は原法の例として可。成人の追加時期は施設差として扱う |
| HTK（Custodiol） | 英国 SmPC（2024 改訂）: "1 ml/minute/gram heart weight"、成人総量 1.5–2 L、液温 6–10℃、大動脈基部圧は初期 80–110 mmHg → 心停止後に半分（40–60 mmHg）、灌流時間 6–8 分（短縮しない）、追加は 1–2 分（200–400 mL）、逆行性は "Do not exceed 30 mmHg"。EACTS 2024 本文: 低ナトリウム血症を起こすが等浸透圧なので補正しない | 確定（国内の承認状況は未確認） | [22][1] | 中 | 国内での使用状況は未確認。教材では「海外の単回投与液の例」として扱う |
| 順行性の基部圧 | EACTS 本文 "at a pressure of 60–100 mmHg"。国内 2007GL:「80～100mmHg 程度であることが望ましい」。AmSECT Standard 7.4: 順行性ライン圧・逆行性 CS 圧・投与量・虚血時間を継続監視（必須）。JaSECT: 心筋保護回路の注入圧力計（アラーム付き）と圧による制御が必須 | 確定 | [1][2][13][6][8] | 中 | "Root pressure 80" なら国内外の両方に整合 |
| 逆行性の CS 圧・流量 | EACTS 本文: 流量 200–400 mL/min、"coronary sinus pressure between 30 and 50 mmHg"、それ以上は冠静脈損傷を避けるため不可。国内 2007GL:「30mmHg 程度に保つ」。HTK: ≤30 mmHg。心停止までの時間は逆行性 2–4 分、順行性 30–60 秒（EACTS 本文） | 確定 | [1][2][13][22] | 中〜大 | "CS pressure 35" は国際範囲内だが国内 GL より高め。会話例は施設差を注記 |
| warm reperfusion（hot shot） | 遮断解除前の温血心筋保護 "terminal warm blood-controlled reperfusion ('hot-shot')"。小規模 RCT で代謝面の利点、しばしば逆行性で投与（EACTS 本文）。温度・量・時間の数値は GL・原著抄録に記載なし | 確定（数値は未確認） | [1][2][29][30] | 大 | "Hot shot before the cross-clamp comes off" は用語として可。数値は施設例 |
| 総論の推奨 | 施設固定の保護液でなく患者・手技に応じた戦略（EACTS 2019／2024 I, C）。貧血・低 BSA・CKD・複雑手術では血液心筋保護を考慮（IIa, B） | 確定 | [1][2] | — | 解説の総論に使える |

## 8. 離脱（weaning）

| 項目 | 推奨値・範囲 | 根拠・推奨クラス | 出典 | 施設差 | 教材での扱い方の提案 |
|---|---|---|---|---|---|
| 離脱前チェックリスト | "The use of a checklist before the CPB weaning process is recommended"（EACTS 2019／2024 I, C）。人工呼吸器の再開忘れを警告する装置の報告（2024 本文）。2024 版の提案チェックリストは補遺（未入手）。AmSECT Guideline 5.2: 離脱前を含む全期間でチェックリスト | 確定（補遺の項目は未確認） | [1][2][6] | 小 | "Pre-wean checklist" を会話の型にするのは根拠と整合 |
| 換気再開 | 国内 2007GL: 復温で自己拍動が戻れば麻酔器の換気再開を依頼し、離脱前に「再度、麻酔器の換気を確認」。Sarkar: 機械換気を開始 | 確定 | [13][26] | 小 | "Lungs are ventilating?" は定番 |
| 体温 | 推奨値なし（5 章参照） | — | [3] | 大 | |
| Hb | 離脱時の目標値を定めた一次資料は見つからず（輸血閾値は 6 章） | 未確認 | — | 大 | 数値は例として扱う |
| K | 4.5–5 mmol/L を目標（Sarkar） | 二次情報 | [26] | 中 | |
| リズム・ペーシング | 国内 2007GL: 徐脈時は心房または心室ペーシング。Sarkar: 房室ブロックに心外膜ペーシング、遮断解除後の VF は内部パドルで二相性 5–20 J | 確定＋二次情報 | [13][26] | 中 | |
| 空気抜き | TOE で脱気を評価（Sarkar）。EACTS 2019 本文: TOE は遺残空気の評価にも役立つ | 二次情報＋確定 | [26][2] | 中 | |
| 強心薬・昇圧薬 | LCOS では強心薬／昇圧薬が第一選択（EACTS 2024 I, A）。"Forcing weaning ... using high-dose inotropic drugs" は推奨しない（III, B）。困難例では一時的機械的補助を考慮（IIa, B）、多職種で対応（I, B） | 確定 | [1] | 中 | |
| 流量を下げる手順 | 段階の刻み（％）を定めた一次資料は見つからず。国内 2007GL: 貯血槽液面を下げて前負荷を増やし、血圧・SvO2 の上昇を見ながら「徐々に送血流量を減少させ」終了。JACE: 貯血レベルを調節しながら送血流量を適時減らす。Sarkar: 静脈還流を徐々に絞って心臓を満たしつつ流量を段階的に下げる | 確定（刻みは未確認） | [13][15][26] | 中 | "Going to half flow" などの刻みは例。根拠表では断定しない |
| 離脱後の回路 | "the CPB circuit be kept functional until the patient's chest has been closed"（EACTS 2019／2024 I, C）。国内 2007GL: 回路の廃棄まで再開できる態勢 | 確定 | [1][2][13] | 小 | |

## 9. プロタミン

| 項目 | 推奨値・範囲 | 根拠・推奨クラス | 出典 | 施設差 | 教材での扱い方の提案 |
|---|---|---|---|---|---|
| 中和比 | EACTS 2024 CPB: "A protamine-to-heparin ratio < 1.0 is recommended"（I, B）。EACTS 2024 PBM: 初回ヘパリン量を基準に比 <1.0（I, B）。EACTS 2019 本文: 初回量の 0.8–1.0。STS 2018: ヘパリン滴定に基づく用量（IIa, B）、プロタミン 2.6 mg／ヘパリン 100 単位未満に制限（IIa, C）。国内添付文書:「ヘパリン1,000単位に対して本剤1.0～1.5mL（プロタミン硫酸塩として10～15mg）」。米国添付文書: 1 mg で 100 USP 単位以上を中和 | 確定 | [1][5][2][4][17][19] | 大（GL と国内添付文書が食い違う） | "Protamine one to one" は例として扱い、解説で「最新欧州 GL は <1.0、国内添付文書は 1.0–1.5 mg/100 単位」を併記 |
| テストドース | 主要 GL（STS 2018、EACTS 2019／2024）の推奨表に記載なし。実態として量は全量の 1–67% とばらつく（Jansa） | 推奨は未確認／実態は二次情報 | [23] | 大 | 会話で使う場合は「施設慣行」。サッカー停止とセットで扱う |
| 投与速度 | 国内添付文書: 1 回 50 mg を超えない量を 100–200 mL に希釈し「10分間以上をかけて徐々に」。急速投与で呼吸困難・血圧低下・徐脈。米国添付文書: "over a 10-minute period in doses not to exceed 50 mg"。EACTS 2024 本文・PBM 2024: ゆっくり投与で副作用が軽い。レビュー: 10–15 分（Sarkar） | 確定 | [17][19][1][5][26] | 中 | "Give it slowly" は可。全量の投与時間は施設例 |
| 副作用（低血圧・肺高血圧） | 低血圧、徐脈、肺血管収縮、アナフィラキシー反応（EACTS 2024 本文）。米国添付文書の警告: 重度低血圧、循環虚脱、非心原性肺水腫、肺高血圧。リスク: 投与歴、プロタミン含有インスリン（国内添付文書は問診を求める）。真のアナフィラキシーは <1%（STS 本文） | 確定 | [1][19][17][4] | 小 | "BP dropped after protamine — slow down or stop" は根拠と整合 |
| 重篤な反応時 | 投与中止と蘇生、"reinstitution of CPB with adequate anticoagulation" が救命的になりうる（STS 2018 I, C）。JaSECT ハンドブック: 再開時はヘパリン投与を確実に確認してから | 確定 | [4][12] | 小 | "Re-heparinize before we go back on." を強調できる |
| 投与後の ACT 確認 | 中和は ACT かヘパリン／プロタミン滴定で確認（AmSECT Guideline 8.3）。投与完了後に ACT で正常化を確認（Sarkar）。残存ヘパリンは Hepcon や TEG でも評価（EACTS 2024 本文） | 確定 | [6][26][1] | 小 | "Post-protamine ACT is back to baseline" は可（目標秒数は未確認） |
| 低用量持続投与（参考） | ヘパリンリバウンド対策に 25 mg/h を最大 6 時間（STS 2018 IIb, C） | 確定 | [4] | 中 | 応用編 |
| 投与の位置づけ（国内） | 国内 2007GL:「カニューレを抜去してからプロタミンを投与する」。JaSECT ハンドブック: CPB 中はプロタミンを準備しない・手元に置かない（誤投与防止） | 確定 | [13][12] | 中（抜去との順序は施設差） | 誤投与防止の文化として紹介できる |

## 10. トラブル時の標準的な対応

| 項目 | 推奨値・範囲（手順） | 根拠・推奨クラス | 出典 | 施設差 | 教材での扱い方の提案 |
|---|---|---|---|---|---|
| 大量空気塞栓（Mills & Ochsner） | 原著抄録（1980）: 直後の処置は "deep Trendelenburg position"、上行大動脈を切開して脳血管床から逆行性に排出、上大静脈からの一時的な逆行性灌流も可。続いて低体温での CPB 再開、昇圧、ステロイド、100% 酸素換気、深いバルビツレート麻酔。JaSECT ハンドブック: 直ちに CPB 停止、頭部を低く、送血カニューレ抜去、原因を除いたら冷却しつつ上大静脈から逆行性脳灌流、大動脈から脱気し、気泡が消えたら再挿入して順行性再開、しばらく低体温で補助。EACTS 2024 本文: 薬物治療、組織酸素化、低体温、RCP の報告、高気圧酸素は選択肢 | 確定（RCP の流量・温度・時間の数値は未確認） | [28][12][1] | 中 | 手順の骨格は会話教材に向く。数値は入れない |
| 送血管による大動脈解離 | EACTS 2024 本文: 送血管挿入部や遮断部に多く、早期発見でも死亡率は約 30%、診断にエコーが重要。国内 2007GL: 開始時に急な動脈圧低下が流量増・昇圧薬に反応しなければ解離を疑う。JaSECT ハンドブック: 血圧が急低下したのに送血圧が上がれば急性大動脈解離を疑い、直ちに送血部位を変更。Sarkar: 低動脈圧、高送血圧（>300 mmHg）、静脈還流の低下、血管の変色。修復は DHCA 下 | 確定＋二次情報 | [1][13][12][26] | 中 | "Line pressure is high, radial pressure is low" の鑑別会話に好適 |
| venous air lock | JaSECT ハンドブック: 多量の空気で落差脱血ができない場合は送血を止めて原因を除き、ゆっくり送血して CVP を高めに保ち、貯血槽に陰圧をかけるか空気の入った部分を持ち上げて貯血槽へ導いてから再開。少量の流入は貯血レベルを下げて静脈圧を少し高めにすると止まる。吸引補助脱血では貯血槽の陽圧に注意（陽圧防止弁・圧監視）。EACTS 2024 本文: 吸引補助は −60 mmHg まで安全との報告、−80 mmHg で溶血増。陰圧の監視（I, C）、過度の陰圧は推奨しない（III, B） | 確定 | [12][1] | 中 | "We've got an air lock — slow the pump, walk the air into the reservoir." の会話に使える |
| 人工肺不全と交換 | JaSECT ハンドブック: ガス排出口から黄色または泡状の液＝血漿リーク。酸素流量を上げつつ交換または追加の準備（不全の人工肺を外さず新しい人工肺を組み込む方法も）。破損時は送血を止めて前後を遮断、交換時は人工肺／フィルターのベントから脱気し送血圧を見ながら再開。JACE: 可能な限り CPB を維持しつつ交換。EACTS 2024 本文: 高圧事象は 1.14–1.8%、対処アルゴリズム（ヘパリン、AT、エポプロステノール、希釈）、排ガスモニタで早期発見 | 確定 | [12][15][1] | 大（交換手技は施設で訓練） | 交換手順は施設手順書と併用する前提で扱う |
| 停電・ポンプ故障（ハンドクランク） | JaSECT 第 7 版: 送血ポンプの手動装置の常備（必須）、バッテリー内蔵（必須）、全ポンプの手動操作（強く推奨）。AmSECT Standard 6.9: "Hand cranks shall be readily available"、6.11: 無停電の予備電源。EACTS 2024 本文: クランクハンドルで手動運転でき、多くは照明とバッテリーを内蔵。JaSECT ハンドブック: バッテリー駆動を確認し、止まっていれば手動に切り替えて停電前の貯血レベルと血圧を維持、懐中電灯でレベル確認 | 確定 | [8][6][1][12] | 小 | "Switching to the hand crank" は定番フレーズとして可 |
| 送血ライン圧上昇の鑑別 | JaSECT ハンドブック・国内 2007GL: 鉗子の外し忘れ、回路の屈曲、送脱血の誤接続、カニューレの先当たり・サイズ、偽腔挿入、送血フィルターの目詰まり（フィブリン・血小板、冷却時の寒冷凝集）、急性大動脈解離。人工肺／フィルター前後の圧差で原因部位を特定（2007GL）。対処: 安全な圧まで流量を下げて点検、解離も念頭に術者・麻酔科医と連携 | 確定 | [12][13] | 中（アラーム値は回路依存） | アラーム設定値（"300" など）は施設例として扱う |
| リザーバーレベル低下 | レベルセンサー: JaSECT 必須（送血ポンプ制御は強く推奨）、AmSECT Standard 6.3、EACTS 2024 I, C。JaSECT ハンドブック: 原因は脱血回路の屈曲、カニューレ先当たり、循環血液量不足、鉗子操作の誤りなど。空になったら直ちに送血を止めて気泡を除去。国内 2007GL: 液面低下は脱血不良を疑う。2009 年の厚労省通知の事例: レベルセンサー未使用とレベル低下の見落としが空気誤送の要因 | 確定 | [8][6][1][12][13][14] | 小 | "Level is dropping — check the venous line, volume please." |
| CPB の緊急再開 | 胸骨閉鎖まで回路を機能状態に保つ（I, C）、緊急用セットアップを常備（I, C）、ECLS を常時使える体制（I, C）（EACTS 2024）。再開前に十分なヘパリンを投与（本文）。充填済み回路 72 時間・乾燥回路 30 日の保存を施設方針として考慮（本文） | 確定 | [1] | 中 | "Back on bypass — heparin is in?" を確認させる会話に使える |

## 11. 日本の基準と運用、海外との違い

| 項目 | 内容 | 根拠 | 出典 | 施設差 | 教材での扱い方の提案 |
|---|---|---|---|---|---|
| 人工心肺における安全装置設置基準（第 7 版、2024-09-24） | 必須: SvO2 の常時モニター、貯血槽レベルセンサー、送血回路の気泡検出器、送血圧力計（送血ポンプと人工肺の間、高圧アラーム、ローラーポンプは高圧時に制御）、送血フィルター入口圧を切り替えか追加で監視できること、遠心ポンプの流量計、送血フィルター、ポンプ注入の心筋保護回路の注入圧力計（アラーム付き、圧で制御）と気泡検出器、送血ポンプの手動装置、バッテリー内蔵。強く推奨: レベルセンサー・気泡検出による送血ポンプ制御、遠心ポンプの逆流防止、全ポンプの手動操作、心筋保護回路の気泡検出による制御、ベント回路の逆流防止弁。初版は 2007 年 4 月 | 確定 | [8] | 小 | 国内の必須装置を扱う場面で直接引用できる |
| 関連学会のガイドライン・通知 | 2007 年 3 月「人工心肺装置の標準的接続方法およびそれに応じた安全教育等に関するガイドライン」（日本心臓血管外科学会・日本胸部外科学会・日本人工臓器学会・日本体外循環技術医学会・日本医療器材工業会）: 操作マニュアル、チェックリスト、危機管理マニュアルを含む。2009 年 10 月の厚労省通知（医政総発 1008 第 1 号・薬食安発 1008 第 1 号）で同 GL と安全装置設置基準の確認・徹底を周知。日本心臓血管外科学会（2009）: カルディオトミーリザーバはポンプ吸引のみ、壁吸引は独立した系。3 学会の吸引補助脱血勧告（2003）: 陰圧ラインにガスフィルターを使わずウォータートラップ、毎回滅菌済み新品、貯血槽に陽圧アラーム付き圧モニターと陽圧防止弁、専用の陰圧コントローラー | 確定 | [13][14] | — | 国内の安全文化の背景として紹介できる |
| 人工心肺安全ハンドブック 改訂 2 版（2022） | 気泡、停電・故障、回路破損、圧異常、ガス交換、誤作動、脱血異常、凝固、検査値、薬剤・輸血、心筋保護、汚染、温度の各トラブルについて具体例・原因・予防・対処 | 確定 | [12] | — | トラブル会話シナリオの国内根拠として最適 |
| 法令上の業務範囲 | 臨床工学技士法第 38 条:「医師の具体的な指示を受けなければ」省令で定める生命維持管理装置の操作をしてはならない。施行規則第 32 条: 該当する操作に「身体への血液、気体又は薬剤の注入」。施行規則第 31 条の 2（2021 年の改正で追加）: 手術室・集中治療室で生命維持管理装置を用いる治療での輸液／シリンジポンプの静脈路への接続、薬剤投与のための操作、抜針・止血 | 確定 | [9][10] | — | |
| 業務指針 | JACE 人工心肺業務指針（業務別業務指針 2012）: 医師の指示で算出した操作条件と薬剤の使用量に従って技士が設定・変更し医師に報告、術中の指示も「できる限り具体的に」受ける。回路ポートからの採血・輸血・輸液も医師の具体的指示で。日本麻酔科学会・日本臨床工学技士会の指針（2025-04-25）:「人工心肺を施行中の患者の血液、補液及び薬剤の投与量の設定及び変更」は既に技士の業務範囲（同指針の対象外）。同指針が扱う麻酔関連補助業務では、包括指示・手順書による実施は不可、具体的指示があってもワンショット静注は不可 | 確定（2012 以降の改訂は未確認） | [15][11] | — | |
| CPB 中の昇圧薬を誰が投与するか | 米国 AmSECT: 回路から投与した薬剤を灌流記録に記載（Appendix C 14）、血圧管理アルゴリズムを事前に定義し、監督医師が変更を指示しうる（Standard 11.1 注）。日本: 回路からの薬剤注入は医師の具体的指示が必須（法令・業務指針）、手順書による包括指示での実施は認めない整理（2025 指針、ただし対象は麻酔関連補助業務）。「誰が判断し、誰が注入するか」の実態を国内外で比較した一次資料は見つからず | 確定（実態比較は未確認） | [6][9][10][15][11] | 大 | 国内向け会話は "Anesthesia, may I give phenylephrine 100 micrograms into the circuit?" のように医師の指示を受けて投与する形が法令と整合。米国流の「プロトコルで自律的に投与」は国内と異なる可能性として注記 |
| その他の国内外の差 | ①ヘパリン: 国内添付文書 150–300 単位/kg、海外 GL 本文 300–500（600）U/kg（1 章）。②プロタミン: 国内添付文書 1.0–1.5 mg/100 単位、EACTS 2024 は比 <1.0（9 章）。③AT 製剤: 海外 GL は I 推奨、国内添付文書の効能に CPB 中のヘパリン抵抗性なし（1 章）。④送血フィルター: JaSECT 必須・AmSECT Standard 6.5（shall）に対し、EACTS 2024 は "ALFs may be considered"（IIb, C）。⑤復温時の較差: 国内 2007GL 5℃以内、STS は送血温 ≥30℃で ≤4℃・<30℃で最大 10℃。⑥心筋保護圧: 国内 2007GL 順行 80–100／逆行 約 30 mmHg、EACTS 60–100／30–50 mmHg | 確定 | [16][17][18][1][2][3][5][6][8][13] | 大 | 教材の解説欄で「国内では」「海外 GL では」と分けて書く |

---

## 12. ガイドライン間で食い違う点（要約）

1. **プロタミン中和比**: EACTS 2024（CPB・PBM とも）比 <1.0（I, B）、EACTS 2019 本文 0.8–1.0、STS 2018 は滴定（IIa, B）と上限 2.6 mg/100 単位（IIa, C）、国内添付文書 1.0–1.5 mg/100 単位。新しく権威が高いのは EACTS 2024、国内の法的な用法用量は添付文書。
2. **ACT 目標**: STS 2018 >480 s（最大活性化型機器では >400 s）、EACTS 2019 >480 s（回路・機器依存）、EACTS 2024 PBM は 300–600 s（測定法・戦略依存）、国内資料は数値なし。
3. **ヘパリン初回量**: 国内添付文書 150–300 単位/kg、EACTS 2019 本文 300–500、EACTS 2024 PBM 本文 300–600 U/kg。
4. **送血温の上限**: STS 2015「<37℃」、EACTS 2024「最大 37℃」（表現の差）。
5. **復温時の温度較差**: STS 2015 ≤4℃（送血温 ≥30℃）・最大 10℃（<30℃）、国内 2007GL 5℃以内。
6. **心筋保護の注入圧**: 順行性は EACTS 60–100 と国内 2007GL 80–100、逆行性は EACTS 30–50 と国内 2007GL 約 30、HTK 製品概要 ≤30 mmHg。
7. **送血フィルター**: JaSECT 必須・AmSECT shall、EACTS 2024 IIb（C）。
8. **輸血閾値の表現**: EACTS 2024 CPB は Hct <18%（I, C）と 18–24% は IIb、PBM 2024 は ≤75 g/L の制限的トリガー（I, A）、STS 2021 は制限的戦略（I, A）と Hb >10 g/dL での輸血は不要（III）。
9. **AT 製剤**: 海外 GL はヘパリン抵抗性に I 推奨、国内添付文書の効能には含まれない。

## 13. 施設差が大きく、教材で「例」と明示すべき値

ACT の目標値と測定間隔、ヘパリン初回量と追加量、サッカー開始の ACT 基準、送血管挿入時の血圧の下げ幅（100 未満か 90–100 か）、目標体温（冷却・離脱）、SvO2・乳酸の介入閾値、PaO2・PaCO2 の目標、輸血閾値、血糖目標、離脱時の K・Hb、標準血液心筋保護の初回量、del Nido の成人追加時期、hot shot の条件、プロタミンの比・テストドース・投与時間、離脱時の流量の刻み、送血圧アラーム値、CPB 中の薬剤投与の役割分担。

## 14. 確認できなかった点・アクセスできなかった資料

- **標準 4:1 血液心筋保護の初回量・再投与量**、**hot shot の温度・量・時間**: EACTS 2019／2024、国内 2007GL、原著抄録（Teoh 1986、Caputo 1998）で数値を確認できず。
- **ACT の測定間隔の分数**、**サッカー開始の ACT 閾値**: どの GL も施設プロトコルに委ねており数値なし（後者は ANZCP の事例報告のみ）。
- **送血管挿入時の収縮期血圧**: EACTS 2024／2019 の本文に「通常 100 mmHg 未満」の記載はあるが、推奨表（クラス付き）の項目ではない。STS／AmSECT／国内資料に数値なし。
- **Mills & Ochsner の詳細手順（逆行性灌流の流量・温度・時間）**: 原著全文に未アクセス。抄録の範囲のみ記載。
- **STS 2009 血糖管理 GL（Lazar ら）の原文**: PubMed に抄録がなく本文未確認。
- **EACTS 2024／2019 の補遺（離脱チェックリスト）**: PMC の PDF・補遺はダウンロード時に検証ページが表示され取得できず。
- **Custodiol（HTK）の国内承認状況**: 未確認。
- **教科書（Gravlee、Kaplan）**: 参照していない（アクセス手段なし）。Kaplan 第22章は research/01 の調査で参照されており、その臨床手順の記載を 15 章に転記した。
- **国内で CPB 中の昇圧薬を誰が判断・投与しているかの実態調査**: 見つからず。

## 15. 補遺: research/01 の出典にある臨床手順（2026-10-13 転記）

教材が使っている臨床手順のうち、本調査では扱わず research/01（表現の調査）の出典にだけ記載があったもの。research/01 の記載をそのまま転記したもので、本調査で原典を再確認したものではない。出典番号は research/01 の番号。

| 項目 | 記載内容 | 出典（research/01） | 確度（research/01 の評価） | 教材での扱い |
|---|---|---|---|---|
| 離脱後のボリューム | 教科書: 離脱後の前負荷は "transfusion of perfusate through the aortic inflow line" で整える。講義: 離脱後に追加でボリュームを入れるときは、送血管内の空気を確認する | [22] Kaplan 第22章、[21] MGH 講義（自動字幕） | 高（教科書）／中（講義） | "Give 100." の量は例。1回量・刻みを定めた資料はなく施設差 |
| 残血の処理 | 品質基準の項目（英訳）: "Venous canule removed" → "Withdraw blood from venous line"（脱血管の抜去後に脱血ラインの血液を回収）、"Blood volume left in pump" → "Empty pump"。豪NZ の報告: 必要な量だけポンプから返血し、残りはセルセーバーへ送った | [5] オランダの品質基準、[11] ANZCP PIRS（2021 Coagulation、2024 Coagulation (Communication)） | 高（項目として）／中（報告） | 返血の量・方法、セルセーバーを使うかは施設差 |
| 空気抜きの頭位と換気 | 講義: "head up, volume and ventilate"（その場で head down ではと議論）。教科書: 遮断解除前に "patient is placed head down"、"lungs ventilated to promote clearance of air" | [21] MGH 講義（自動字幕）、[22] Kaplan 第22章 | 中（講義）／高（教科書） | 頭位は施設差として両論を併記し、一方を正解にしない |

---

## 出典一覧（参照日はすべて 2026-10-12）

1. Wahba A, Kunst G, De Somer F, et al. 2024 EACTS/EACTAIC/EBCP Guidelines on cardiopulmonary bypass in adult cardiac surgery. Eur J Cardiothorac Surg. 2025;67(2):ezae354. doi:10.1093/ejcts/ezae354（同時掲載: Interdiscip Cardiovasc Thorac Surg 2025;40(2):ivaf002, PMC11826094／Br J Anaesth 2025;134(4):917–1008）。https://doi.org/10.1093/ejcts/ezae354 ／ https://pmc.ncbi.nlm.nih.gov/articles/PMC11826094/ （本文確認に使った PDF: https://opinvisindi.is/bitstreams/87675b22-5342-4a36-958d-9caebc3b3901/download ）
2. Wahba A, Milojevic M, Boer C, et al. 2019 EACTS/EACTA/EBCP guidelines on cardiopulmonary bypass in adult cardiac surgery. Eur J Cardiothorac Surg. 2020;57(2):210–251／Puis L, Milojevic M, Boer C, et al. Interact Cardiovasc Thorac Surg. 2020;30(2):161–202. doi:10.1093/icvts/ivz251。https://pmc.ncbi.nlm.nih.gov/articles/PMC10634377/
3. Engelman R, Baker RA, Likosky DS, et al. The Society of Thoracic Surgeons, The Society of Cardiovascular Anesthesiologists, and The American Society of ExtraCorporeal Technology: Clinical Practice Guidelines for Cardiopulmonary Bypass—Temperature Management during Cardiopulmonary Bypass. J Extra Corpor Technol. 2015;47(3):145–154（Ann Thorac Surg 2015;100:748–757 にも掲載）。https://pmc.ncbi.nlm.nih.gov/articles/PMC4631211/
4. Shore-Lesserson L, Baker RA, Ferraris V, et al. STS/SCA/AmSECT Clinical Practice Guidelines: Anticoagulation during Cardiopulmonary Bypass. J Extra Corpor Technol. 2018;50(1):5–18（Ann Thorac Surg 2018;105:650–662 にも掲載）。https://pmc.ncbi.nlm.nih.gov/articles/PMC5850589/
5. Casselman FPA, Lance MD, Ahmed A, et al. 2024 EACTS/EACTAIC Guidelines on patient blood management in adult cardiac surgery in collaboration with EBCP. Eur J Cardiothorac Surg. 2025;67(5):ezae352. doi:10.1093/ejcts/ezae352。https://pmc.ncbi.nlm.nih.gov/articles/PMC12257489/
6. American Society of ExtraCorporeal Technology (AmSECT). Standards and Guidelines for Perfusion Practice. February 2023（2023 年会員承認）。https://amsect.org/policy-practice/amsects-standards-and-guidelines （PDF: https://amsect.org/LinkClick.aspx?fileticket=ho9RET5JqjE%3d&portalid=0 ）
7. Tibi P, McClure RS, Huang J, et al. STS/SCA/AmSECT/SABM Update to the Clinical Practice Guidelines on Patient Blood Management. J Extra Corpor Technol. 2021;53(2):97–124. doi:10.1182/ject-2100053。https://pmc.ncbi.nlm.nih.gov/articles/PMC8220901/
8. 日本体外循環技術医学会（理事長・安全対策委員長・教育委員長）. 人工心肺における安全装置設置基準に関する勧告／人工心肺における安全装置設置基準（第7版）. 2024年9月24日. https://jasect.org/wp/wp-content/uploads/2025/07/No7-cpb_safety_recommendation_2024-2.pdf
9. 臨床工学技士法（昭和62年法律第60号）第37条・第38条. e-Gov 法令検索. https://laws.e-gov.go.jp/law/362AC0000000060
10. 臨床工学技士法施行規則（昭和63年厚生省令第19号）第31条の2・第32条. e-Gov 法令検索. https://laws.e-gov.go.jp/law/363M50000100019
11. 日本麻酔科学会・日本臨床工学技士会. 臨床工学技士の術中麻酔関連補助業務に関する安全管理指針. 2025年4月25日. https://anesth.or.jp/files/pdf/safety_management_guideline_clinical_engineers.pdf
12. 日本体外循環技術医学会. 人工心肺安全ハンドブック 改訂2版. 2022年1月. https://jasect.org/wp/wp-content/uploads/2022/04/f792b0aa04d85e5422b463a05783453b.pdf
13. 日本心臓血管外科学会・日本胸部外科学会・日本人工臓器学会・日本体外循環技術医学会・日本医療器材工業会. 人工心肺装置の標準的接続方法およびそれに応じた安全教育等に関するガイドライン. 平成19年（2007年）3月（平成18年度医薬品等適正使用推進事業）. https://www.mhlw.go.jp/topics/2007/04/tp0427-10.html （全体版 PDF: https://www.mhlw.go.jp/topics/2007/04/dl/tp0427-10.pdf ）
14. 厚生労働省医政局総務課長・医薬食品局安全対策課長. 人工心肺装置の安全使用について（周知徹底）. 医政総発1008第1号・薬食安発1008第1号. 平成21年（2009年）10月8日（別添: 日本心臓血管外科学会・日本人工臓器学会の会員向け文書）. https://www.pmda.go.jp/files/000145336.pdf
15. 日本臨床工学技士会 業務別業務指針検討委員会（臨床工学合同委員会監修）. 臨床工学技士業務別業務指針（人工心肺業務指針）. 2012年7月16日. https://www.ja-ces.or.jp/01jacet/gaiyou/pdf/gyoumubetsu_gyoumushishin.pdf （人工心肺業務指針の抜粋: https://ja-ces.or.jp/ja-ces/01jacet/shiryou/pdf/2012gyoumubetsu_gyoumushishin02.pdf ）
16. ニプロ株式会社. ヘパリンナトリウム注1万単位/10mL「ニプロ」ほか 添付文書. 2024年7月改訂（第3版）. https://www.pmda.go.jp/PmdaSearch/iyakuDetail/530100_3334401A6140_1_05
17. 持田製薬. プロタミン硫酸塩静注100mg「モチダ」添付文書. 2023年3月改訂（第1版）. https://www.pmda.go.jp/PmdaSearch/iyakuDetail/790005_3329403A1058_1_04
18. 協和キリン. アコアラン静注用600／1800 添付文書. 2025年6月改訂（第6版）. https://www.pmda.go.jp/PmdaSearch/iyakuDetail/230124_6343444D1021_1_12
19. Fresenius Kabi USA. Protamine Sulfate Injection, USP — prescribing information. DailyMed（2025年5月15日掲載）. https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c76876da-b9a8-45d0-9278-7df3288d3a06
20. Matte GS, del Nido PJ. History and use of del Nido cardioplegia solution at Boston Children's Hospital. J Extra Corpor Technol. 2012;44(3):98–103. https://pmc.ncbi.nlm.nih.gov/articles/PMC4557532/
21. D'Angelo AM, Nemeth S, Wang C, et al. Re-dosing of del Nido cardioplegia in adult cardiac surgery requiring prolonged aortic cross-clamp. Interact Cardiovasc Thorac Surg. 2022;34(4):556–563. doi:10.1093/icvts/ivab310. https://pmc.ncbi.nlm.nih.gov/articles/PMC8972223/
22. Dr. Franz Köhler Chemie GmbH. Custodiol Solution for cardioplegia/organ preservation — Summary of Product Characteristics（UK、2024年5月1日改訂）. electronic medicines compendium. https://www.medicines.org.uk/emc/product/14445/smpc
23. Jansa L, Fischer C, Serrick C, et al. Protamine Test Dose: Impact on Activated Clotting Time and Circuit Integrity. Ann Thorac Surg. 2022;113(2):506–510. doi:10.1016/j.athoracsur.2021.04.059. https://pubmed.ncbi.nlm.nih.gov/33961816/
24. Gavin-Veyna J, Troester CT, Homann R, et al. An in-vitro study of the timing between protamine sulfate administration and cardiotomy suction termination. J Extra Corpor Technol. 2025;57(4):188–193. doi:10.1051/ject/2025028. https://pmc.ncbi.nlm.nih.gov/articles/PMC12710249/
25. Smit B, Smulders YM, de Waard MC, et al. Moderate hyperoxic versus near-physiological oxygen targets during and after coronary artery bypass surgery: a randomised controlled trial. Crit Care. 2016;20:55. doi:10.1186/s13054-016-1240-6. https://pmc.ncbi.nlm.nih.gov/articles/PMC4788916/
26. Sarkar M, Prabhu V. Basics of cardiopulmonary bypass. Indian J Anaesth. 2017;61(9):760–767. doi:10.4103/ija.IJA_379_17. https://pmc.ncbi.nlm.nih.gov/articles/PMC5613602/ （レビュー論文＝二次情報）
27. Australian and New Zealand College of Perfusionists. PIRS 2024 Coagulation (Heparinisation)（インシデント報告）. https://anzcp.org/wp-content/uploads/reports/2024/PIRS-2024-Coagulation_(Heparinisation).pdf （事例報告＝二次情報）
28. Mills NL, Ochsner JL. Massive air embolism during cardiopulmonary bypass. Causes, prevention, and management. J Thorac Cardiovasc Surg. 1980;80(5):708–717. https://pubmed.ncbi.nlm.nih.gov/7431967/ （抄録のみ確認）
29. Caputo M, Dihmis WC, Bryan AJ, et al. Warm blood hyperkalaemic reperfusion ('hot shot') prevents myocardial substrate derangement in patients undergoing coronary artery bypass surgery. Eur J Cardiothorac Surg. 1998;13(5):559–564. https://pubmed.ncbi.nlm.nih.gov/9663539/ （抄録のみ確認）
30. Teoh KH, Christakis GT, Weisel RD, et al. Accelerated myocardial metabolic recovery with terminal warm blood cardioplegia. J Thorac Cardiovasc Surg. 1986;91(6):888–895. https://pubmed.ncbi.nlm.nih.gov/3520161/ （抄録のみ確認）
