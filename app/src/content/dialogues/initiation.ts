import type { Dialogue } from '../types'

export const dialogues: Dialogue[] = [
  {
    id: 'ini-d1',
    phase: 'initiation',
    title: 'Full flow を合図に換気を止める',
    setting: '送血・脱血ラインの接続が終わり、体外循環を始めます。麻酔科医はあなたの "Full flow." を合図に換気を止めます。',
    lines: [
      { role: 'perfusionist', en: 'Ready for bypass.', ja: '体外循環の準備ができています。', phraseId: 'ini-01' },
      { role: 'surgeon', en: 'Go on bypass.', ja: '体外循環を始めて。', phraseId: 'ini-02' },
      { role: 'anesthesiologist', en: 'Let me know when you get to full flow.', ja: 'フルフローになったら教えて。', phraseId: 'ini-04' },
      { role: 'perfusionist', en: 'Full flow.', ja: '目標流量（フルフロー）に達しました。', phraseId: 'ini-05' },
      { role: 'perfusionist', en: 'You can turn the lungs off.', ja: '換気を止めてください。', phraseId: 'ini-06' },
      { role: 'anesthesiologist', en: "Vent's off, gas is off.", ja: '人工呼吸器を止めました。吸入麻酔も止めました。', phraseId: 'ini-07' },
      { role: 'perfusionist', en: "Thanks. I've got sweep on.", ja: 'ありがとうございます。人工肺のガスは流しています。' },
    ],
    level: 2,
    status: 'ai-draft',
  },
  {
    id: 'ini-d2',
    phase: 'initiation',
    title: '心臓が張っている — 脱血を戻す',
    setting: '体外循環を始めた直後。心臓が十分にしぼまず、リザーバーのレベルも下がってきました。外科医が脱血管の位置を直します。',
    lines: [
      { role: 'surgeon', en: 'Heart looks a little full.', ja: '心臓が少し張っているね。', phraseId: 'ini-09' },
      { role: 'perfusionist', en: 'Yes. My level is dropping.', ja: 'はい。リザーバーのレベルが下がっています。' },
      { role: 'surgeon', en: 'Let me adjust the cannula.', ja: 'カニューレを調整するよ。' },
      { role: 'surgeon', en: 'Did that get you some drainage back?', ja: '脱血は戻った？', phraseId: 'ini-10' },
      { role: 'perfusionist', en: "It did. My level's getting a little better.", ja: '戻りました。レベルが少し上がってきています。' },
    ],
    level: 3,
    status: 'ai-draft',
  },
]
