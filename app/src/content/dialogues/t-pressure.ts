import type { Dialogue } from '../types'

export const dialogues: Dialogue[] = [
  {
    id: 'tpr-d1',
    phase: 't-pressure',
    title: '送血ライン圧の上昇を数値で伝え、原因を確かめる',
    setting: '上行大動脈送血で体外循環を始め、流量を上げているところです。送血ライン圧が急に上がり、動脈圧は低いままです。',
    lines: [
      { role: 'perfusionist', en: 'My line pressure is high.', ja: '送血ライン圧が高いです。', phraseId: 'tpr-01' },
      { role: 'surgeon', en: "High line pressure? What's the number?", ja: '送血圧が高い？数値は？' },
      {
        role: 'perfusionist',
        en: "Line pressure is high, 360. Radial pressure is low, mean 32. I'm coming down on flow.",
        ja: '送血ライン圧が高く、360です。橈骨動脈圧は低く、平均32です。流量を下げます。',
        phraseId: 'tpr-02',
      },
      {
        role: 'surgeon',
        en: "I don't see anything on the field. Check your clamps and lines.",
        ja: '術野には何も見当たらない。鉗子とラインを確認して。',
        phraseId: 'tpr-05',
      },
      { role: 'perfusionist', en: 'All clamps are off. No kinks in the line.', ja: '鉗子はすべて外れています。ラインの屈曲もありません。', phraseId: 'tpr-04' },
      { role: 'surgeon', en: 'Clamps off, no kinks. Then it could be a dissection.', ja: '鉗子も屈曲もなしか。では解離かもしれない。' },
    ],
    level: 2,
    status: 'ai-draft',
  },
  {
    id: 'tpr-d2',
    phase: 't-pressure',
    title: '解離を疑う：エコーで確かめ、送血部位を変える',
    setting: '前の会話の続きです。回路に原因が見つからず、流量を上げられない状態が続いています。外科医は解離を疑い、麻酔科医にエコーでの確認を頼みます。',
    lines: [
      { role: 'perfusionist', en: "I can't flow higher than 1.5 liters a minute.", ja: '1.5 L/分より上げられません。', phraseId: 'tpr-03' },
      { role: 'surgeon', en: 'Do we have a dissection? Can you look at the echo?', ja: '解離か？エコーで見てくれる？', phraseId: 'tpr-06' },
      { role: 'anesthesiologist', en: 'I see a flap in the ascending aorta.', ja: '上行大動脈にフラップが見えます。', phraseId: 'tpr-07' },
      { role: 'surgeon', en: "Stop the pump. We'll go back on in the groin.", ja: 'ポンプを止めて。鼠径部（大腿動脈）から再開する。', phraseId: 'tpr-08' },
      { role: 'perfusionist', en: 'Pump is off. Arterial line clamped.', ja: 'ポンプ停止、送血ラインを遮断しました。' },
      { role: 'surgeon', en: 'Femoral line is connected. Go back on.', ja: '大腿動脈のラインをつないだ。再開して。' },
      { role: 'perfusionist', en: 'Going back on bypass.', ja: '体外循環を再開します。' },
    ],
    level: 3,
    notes: [
      {
        kind: 'caution',
        text: 'この教材は「伝える言葉」の練習です。解離の診断と送血部位の変更などの対処は外科医が判断し、実際の手順は施設の危機管理マニュアルに従います。',
        sources: ['jasect-handbook-2022', 'jp-cpb-gl-2007'],
      },
    ],
    status: 'ai-draft',
  },
]
