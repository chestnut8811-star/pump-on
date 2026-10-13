import type { Dialogue } from '../types'

export const dialogues: Dialogue[] = [
  {
    id: 'xcl-d1',
    phase: 'crossclamp',
    title: '下げる → 遮断 → 戻す',
    setting: '冷却が進み、外科医が大動脈を遮断します。遮断の直前に流量を下げ、遮断したらすぐ戻して、その時刻をチームに伝えます。',
    lines: [
      { role: 'surgeon', en: 'Ready for cross clamp?', ja: '遮断していい？（準備はいい？）', phraseId: 'xcl-02' },
      { role: 'perfusionist', en: "Bypass looks good. We're okay to cross.", ja: '体外循環は良好です。遮断して大丈夫です。', phraseId: 'xcl-03' },
      { role: 'surgeon', en: 'Drop your flow to 500, please.', ja: '流量を500に下げて。', phraseId: 'xcl-04' },
      { role: 'perfusionist', en: "Flow's at 500.", ja: '流量500です（下げました）。', phraseId: 'xcl-05' },
      { role: 'surgeon', en: 'Clamp on, flow up.', ja: '遮断した。流量を戻して。', phraseId: 'xcl-06' },
      { role: 'perfusionist', en: 'Flow back up.', ja: '流量を戻しました。', phraseId: 'xcl-07' },
      { role: 'perfusionist', en: 'Clamp on at 9:21.', ja: '9時21分、遮断開始です。', phraseId: 'xcl-08' },
      { role: 'anesthesiologist', en: 'Clamp on at 9:21. Got it.', ja: '遮断9時21分、了解。' },
    ],
    level: 2,
    notes: [{ kind: 'facility', text: '遮断のときに下げる流量の値は施設・術者で異なります。' }],
    status: 'needs-check',
  },
  {
    id: 'xcl-d2',
    phase: 'crossclamp',
    title: '遮断時刻と遮断時間を答える',
    setting: '遮断から45分ほどたった10時06分ごろ。麻酔科医が遮断した時刻を確かめ、外科医が遮断時間を聞きます。',
    lines: [
      { role: 'anesthesiologist', en: 'When did the clamp go on?', ja: '遮断は何時だった？' },
      { role: 'perfusionist', en: 'Clamp on at 9:21.', ja: '9時21分、遮断開始です。', phraseId: 'xcl-08' },
      { role: 'surgeon', en: "What's the clamp time?", ja: '遮断時間は？' },
      { role: 'perfusionist', en: 'Clamp time is 45 minutes.', ja: '遮断時間は45分です。', phraseId: 'xcl-09' },
      { role: 'surgeon', en: '45 minutes. Thanks.', ja: '45分ね、ありがとう。' },
    ],
    level: 3,
    notes: [{ kind: 'verify', text: '遮断時刻・遮断時間を口頭で伝える決まった言い回しは、出典で確認できていません。', sources: ['anzcp-pirs'] }],
    status: 'needs-check',
  },
]
