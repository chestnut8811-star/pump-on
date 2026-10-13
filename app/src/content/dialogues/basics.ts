import type { Dialogue } from '../types'

export const dialogues: Dialogue[] = [
  {
    id: 'bas-d1',
    phase: 'basics',
    title: '待ってもらう・量と時刻を復唱する',
    setting: '人工心肺の開始前。ヘパリン投与のあと、外科医はカニュレーションを始めたがっていますが、ACT はまだ上がっている途中です。',
    lines: [
      { role: 'surgeon', en: 'Are you ready to cannulate?', ja: 'カニュレーションしていい？' },
      { role: 'perfusionist', en: 'One moment. The ACT is 400 and rising.', ja: '少し待ってください。ACTは400で、まだ上がっています。', phraseId: 'bas-02' },
      { role: 'anesthesiologist', en: '10,000 units of heparin just went in at 8:58.', ja: 'ヘパリン1万単位を8時58分に入れました。' },
      { role: 'perfusionist', en: "That's 10,000 units of heparin at 8:58.", ja: 'ヘパリン1万単位、8時58分ですね。', phraseId: 'bas-09' },
      { role: 'anesthesiologist', en: 'Correct, 8:58.', ja: 'そう、8時58分。' },
      { role: 'surgeon', en: "Let me know when you're ready.", ja: '準備ができたら教えて。' },
    ],
    level: 2,
    notes: [{ kind: 'facility', text: 'カニュレーションや体外循環を始めてよい ACT の値は施設のプロトコルによります。' }],
    status: 'ai-draft',
  },
  {
    id: 'bas-d2',
    phase: 'basics',
    title: '聞き返す・off を綴る',
    setting: '体外循環中。吸引の音で外科医の指示がよく聞き取れませんでした。推測で動かず、聞き返してから復唱します。',
    lines: [
      { role: 'surgeon', en: 'Cool to 32, please.', ja: '32℃まで冷やして。' },
      { role: 'perfusionist', en: 'Sorry, say again?', ja: 'すみません、もう一度お願いします。', phraseId: 'bas-04' },
      { role: 'surgeon', en: 'Thirty-two degrees.', ja: '32℃です。' },
      { role: 'perfusionist', en: 'Cooling to 32.', ja: '32℃まで冷却します。' },
      { role: 'surgeon', en: 'And the LV vent can come off.', ja: 'それとLVベントは止めていいよ。' },
      { role: 'perfusionist', en: "LV vent's off. O-F-F.", ja: 'LVベントを止めました。オフです。', phraseId: 'bas-06' },
    ],
    level: 1,
    status: 'ai-draft',
  },
]
