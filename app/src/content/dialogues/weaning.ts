import type { Dialogue } from '../types'

export const dialogues: Dialogue[] = [
  {
    id: 'wea-d1',
    phase: 'weaning',
    title: '換気を確かめてから下げ、離脱する',
    setting: '体温が十分になり、心臓の動きも戻りました。外科医が離脱を始めます。流量を下げる前に換気の再開を声で確かめ、離脱したら再開の備えを伝えます。',
    lines: [
      { role: 'perfusionist', en: 'Patient body temperature is adequate.', ja: '体温は十分です。', phraseId: 'rew-07' },
      { role: 'surgeon', en: 'Wean pump.', ja: '離脱していこう。', phraseId: 'wea-01' },
      { role: 'perfusionist', en: 'Anesthesia, are we ventilating?', ja: '麻酔科、換気は再開していますか？', phraseId: 'wea-03' },
      { role: 'anesthesiologist', en: "Yes, we're ventilating.", ja: 'はい、換気しています。' },
      { role: 'surgeon', en: 'Pump flow down.', ja: '流量を下げて。', phraseId: 'wea-04' },
      { role: 'perfusionist', en: 'Half flow.', ja: '半分の流量です。', phraseId: 'wea-05' },
      { role: 'surgeon', en: 'Come off pump.', ja: '離脱して。', phraseId: 'wea-06' },
      { role: 'perfusionist', en: 'We are off pump.', ja: '人工心肺から離脱しました。', phraseId: 'wea-07' },
      { role: 'anesthesiologist', en: 'Off bypass. Watching the pressure.', ja: '離脱ね。血圧を見ています。' },
      { role: 'perfusionist', en: 'The pump is ready if we need to go back on.', ja: '必要ならいつでも再開できるよう、ポンプは準備しています。', phraseId: 'wea-09' },
    ],
    level: 2,
    notes: [
      { kind: 'caution', text: '換気の再開忘れは離脱時の重大なエラーとして知られています。国内2007年ガイドラインも、離脱前に麻酔器の換気を再度確認するとしています。', sources: ['rance-2019', 'jp-cpb-gl-2007'] },
      { kind: 'facility', text: '流量を下げる刻み（half flow など）は施設・術者で異なります。', sources: ['jp-cpb-gl-2007'] },
      { kind: 'verify', text: '換気の確認と再開の備えを伝える言い回しは、出典で確認できていません。' },
    ],
    status: 'needs-check',
  },
]
