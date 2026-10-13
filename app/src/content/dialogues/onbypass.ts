import type { Dialogue } from '../types'

export const dialogues: Dialogue[] = [
  {
    id: 'onb-d1',
    phase: 'onbypass',
    title: '血圧が低い — 昇圧薬の指示をもらう',
    setting: '体外循環中、平均血圧が44まで下がりました。日本では臨床工学技士が回路から薬剤を入れるには医師の具体的な指示が必要です。麻酔科医に指示を求め、入れたら量を伝えます。',
    lines: [
      { role: 'anesthesiologist', en: "What's your mean?", ja: '平均血圧は？', phraseId: 'onb-01' },
      { role: 'perfusionist', en: 'Mean is 44. May I give phenylephrine 100 micrograms into the circuit?', ja: '平均44です。フェニレフリン100マイクログラムを回路から入れてよいですか？', phraseId: 'onb-02' },
      { role: 'anesthesiologist', en: 'Yes, give 100 micrograms.', ja: 'はい、100マイクログラム入れてください。' },
      { role: 'perfusionist', en: "That's 100 mics of phenylephrine.", ja: 'フェニレフリン100マイクログラム、入れました。', phraseId: 'onb-04' },
      { role: 'anesthesiologist', en: '100 mics. Got it.', ja: '100マイクログラムね、了解。' },
      { role: 'perfusionist', en: 'Mean is coming up. 62 now.', ja: '平均血圧が上がってきました。今62です。' },
    ],
    level: 2,
    notes: [
      { kind: 'facility', text: '日本では、臨床工学技士が回路から薬剤を入れるには医師の具体的な指示が必要です（臨床工学技士法38条）。米国などでは技士がプロトコルに沿って投与し、宣言する施設もあります。', sources: ['ce-law', 'amsect-2023'] },
      { kind: 'facility', text: '平均血圧は 50〜80 mmHg に保つことが推奨されています（EACTS 2024）。薬剤と量は施設のプロトコルによる例です。', sources: ['eacts-cpb-2024'] },
      { kind: 'verify', text: '指示を求める言い回しは日本の運用に合わせて作った文で、出典で確認できていません。' },
    ],
    status: 'needs-check',
  },
  {
    id: 'onb-d2',
    phase: 'onbypass',
    title: '血液ガスと ACT を共有する',
    setting: '体外循環中に血液ガスと ACT の結果が出ました。麻酔科医が読み上げた数値を復唱し、ACT が下がってきたことを伝えて判断を求めます。',
    lines: [
      { role: 'anesthesiologist', en: "Gas is back. Hemoglobin's 8.2, potassium 4.6.", ja: '血液ガス出ました。ヘモグロビン8.2、カリウム4.6。', phraseId: 'onb-06' },
      { role: 'perfusionist', en: 'Hemoglobin 8.2, potassium 4.6. Thanks.', ja: 'ヘモグロビン8.2、カリウム4.6ですね。ありがとうございます。' },
      { role: 'perfusionist', en: 'ACT is 450. Do you want more heparin?', ja: 'ACT は450です。ヘパリンを追加しますか？', phraseId: 'onb-07' },
      { role: 'anesthesiologist', en: '5,000 units going in at 10:20.', ja: '5000単位、10時20分に入れます。' },
      { role: 'perfusionist', en: "5,000 units at 10:20. I'll recheck the ACT after that.", ja: '5000単位、10時20分ですね。そのあと ACT を測り直します。' },
    ],
    level: 2,
    notes: [
      { kind: 'facility', text: 'ACT の目標と追加量は施設のプロトコルによります（480 秒超が代表的、機器によって 400 秒を目標にする施設も）。ここの数値は例です。', sources: ['sts-anticoag-2018', 'eacts-cpb-2024'] },
      { kind: 'verify', text: '結果の読み上げと復唱の言い回しは、出典で確認できていません。' },
    ],
    status: 'needs-check',
  },
]
