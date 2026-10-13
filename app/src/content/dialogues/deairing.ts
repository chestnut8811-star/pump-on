import type { Dialogue } from '../types'

export const dialogues: Dialogue[] = [
  {
    id: 'dea-d1',
    phase: 'deairing',
    title: '空気抜き → 遮断解除 → 時刻と遮断時間',
    setting: '最後の吻合が終わり、遮断を外します（9時21分に遮断）。空気抜きのあと流量を下げて遮断を解除し、流量を戻して、解除時刻と遮断時間を伝えます。',
    lines: [
      { role: 'surgeon', en: 'Head up, volume and ventilate.', ja: '頭を上げて、心臓を満たして、換気して。', phraseId: 'dea-01' },
      { role: 'perfusionist', en: 'Filling the heart now.', ja: '心臓を満たしています。', phraseId: 'dea-02' },
      { role: 'anesthesiologist', en: 'Ventilating.', ja: '換気しています。' },
      { role: 'surgeon', en: 'Flow down. Clamp is coming off.', ja: '流量を下げて。遮断を外すよ。', phraseId: 'dea-03' },
      { role: 'perfusionist', en: 'Flow down.', ja: '流量を下げました。' },
      { role: 'surgeon', en: 'Clamp off, flows back up.', ja: '遮断解除。流量を戻して。', phraseId: 'dea-04' },
      { role: 'perfusionist', en: 'Flow back up.', ja: '流量を戻しました。' },
      { role: 'perfusionist', en: 'Clamp off at 10:46. Clamp time 85 minutes.', ja: '10時46分に遮断解除。遮断時間は85分です。', phraseId: 'dea-05' },
      { role: 'anesthesiologist', en: 'Clamp off 10:46. 85 minutes. Got it.', ja: '遮断解除10時46分、85分ね。了解。' },
    ],
    level: 2,
    notes: [
      { kind: 'facility', text: '空気抜きのときの頭の位置は、講義（head up）と教科書（head down）で異なる例があり、施設・術者の指示に従います。', sources: ['lectures-2018-2020', 'kaplan-cpb'] },
      { kind: 'verify', text: '解除時刻と遮断時間を口頭で伝える決まった言い回しは、出典で確認できていません。', sources: ['anzcp-pirs'] },
    ],
    status: 'needs-check',
  },
]
