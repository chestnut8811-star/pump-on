import type { Dialogue } from '../types'

export const dialogues: Dialogue[] = [
  {
    id: 'tpw-d1',
    phase: 't-power',
    title: '停電からポンプ停止へ：手回しを続けながら伝える',
    setting: '体外循環中に手術室が停電しました。人工心肺はバッテリー駆動に切り替わりましたが、しばらくして送血ポンプが止まりました。',
    lines: [
      { role: 'perfusionist', en: 'Power failure. The pump is on battery.', ja: '停電です。ポンプはバッテリーで動いています。', phraseId: 'tpw-01' },
      { role: 'surgeon', en: 'On battery. Tell me if anything changes.', ja: 'バッテリーだね。何か変わったら教えて。' },
      { role: 'perfusionist', en: "Pump failure. I'm hand cranking. Call for help.", ja: 'ポンプが止まりました。手回ししています。応援を呼んでください。', phraseId: 'tpw-02' },
      { role: 'nurse', en: 'Help is on the way.', ja: '応援がこちらに向かっています。', phraseId: 'tpw-06' },
      { role: 'perfusionist', en: 'Can someone shine a flashlight on my reservoir?', ja: '誰か懐中電灯でリザーバーを照らしてもらえますか？', phraseId: 'tpw-04' },
      { role: 'nurse', en: 'Shining the flashlight on your reservoir.', ja: 'リザーバーを懐中電灯で照らします。' },
      { role: 'anesthesiologist', en: 'Mean is 45. Can you give more flow?', ja: '平均圧が45です。流量を増やせますか？', phraseId: 'tpw-05' },
      { role: 'perfusionist', en: 'Mean 45. Giving more flow now.', ja: '平均圧45ですね。流量を上げます。' },
    ],
    level: 3,
    notes: [
      {
        kind: 'caution',
        text: 'この教材は「伝える言葉」の練習です。停電・ポンプ故障の実際の対処は、施設の危機管理マニュアルと装置の取扱説明書に従います。',
        sources: ['jasect-handbook-2022'],
      },
    ],
    status: 'ai-draft',
  },
]
