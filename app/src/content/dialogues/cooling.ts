import type { Dialogue } from '../types'

export const dialogues: Dialogue[] = [
  {
    id: 'coo-d1',
    phase: 'cooling',
    title: '目標温度を復唱し、部位を添えて報告する',
    setting: '体外循環が安定し、外科医が目標温度を指示します。冷却の途中で麻酔科医に体温を聞かれ、測定部位を添えて答えます。',
    lines: [
      { role: 'surgeon', en: '34, please.', ja: '34℃まで冷やして。', phraseId: 'coo-01' },
      { role: 'perfusionist', en: 'Cooling to 34.', ja: '34℃まで冷却します。', phraseId: 'coo-02' },
      { role: 'anesthesiologist', en: "What's the temp now?", ja: '今、体温は何度？', phraseId: 'coo-03' },
      { role: 'perfusionist', en: 'Naso is 35.', ja: '鼻咽頭温は35℃です。', phraseId: 'coo-04' },
      { role: 'surgeon', en: '35. Keep going to 34.', ja: '35℃ね。34℃まで続けて。' },
    ],
    level: 2,
    notes: [{ kind: 'facility', text: '目標温度は術式と施設で異なります（ここの温度は例）。', sources: ['sts-temp-2015'] }],
    status: 'needs-check',
  },
  {
    id: 'coo-d2',
    phase: 'cooling',
    title: '冷却を急かされたとき',
    setting: '冷却中、外科医がもっと速く冷やしてほしいと言います。送血と脱血の温度差の上限を理由に、今のペースを説明します。',
    lines: [
      { role: 'surgeon', en: 'Can you cool any faster?', ja: 'もっと速く冷やせない？', phraseId: 'coo-06' },
      { role: 'perfusionist', en: "I'm keeping the gradient under 10.", ja: '（送血と脱血の）温度差を10℃未満に保っています。', phraseId: 'coo-07' },
      { role: 'surgeon', en: 'Understood. Keep it under 10.', ja: 'わかった。10℃未満でいこう。' },
      { role: 'perfusionist', en: 'Naso is 34 now.', ja: '鼻咽頭温、34℃になりました。' },
    ],
    level: 3,
    status: 'needs-check',
  },
]
