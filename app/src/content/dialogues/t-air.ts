import type { Dialogue } from '../types'

export const dialogues: Dialogue[] = [
  {
    id: 'tai-d1',
    phase: 't-air',
    title: '送血ラインの空気：止めて、知らせて、読み上げる',
    setting: '体外循環中、送血ラインに空気を見つけ、ただちにポンプを止めて送血ラインを遮断しました。外科医に知らせ、看護師に危機チェックリストの読み上げを頼みます。',
    lines: [
      { role: 'perfusionist', en: 'Stop! Air in the line!', ja: '止めて！ラインに空気！', phraseId: 'tai-01' },
      { role: 'surgeon', en: 'Air in the line? Is the pump off?', ja: '空気？ポンプは止めた？' },
      { role: 'perfusionist', en: 'Pump is off. Arterial line clamped.', ja: 'ポンプ停止。送血ラインを遮断しました。', phraseId: 'tai-02' },
      { role: 'surgeon', en: 'Did any air get to the patient?', ja: '空気は患者さんに入った？', phraseId: 'tai-04' },
      { role: 'perfusionist', en: 'Some may have. I stopped the pump as soon as I saw it.', ja: '入ったかもしれません。見つけてすぐポンプを止めました。' },
      { role: 'surgeon', en: 'Head down, please. Steep Trendelenburg.', ja: '頭を下げて。急な頭低位に。', phraseId: 'tai-05' },
      {
        role: 'perfusionist',
        en: 'Can you get the air embolism checklist and read it out?',
        ja: '空気塞栓のチェックリストを持ってきて、読み上げてもらえますか？',
        phraseId: 'tai-06',
      },
      { role: 'nurse', en: "Getting the air embolism checklist. I'll read it out.", ja: '空気塞栓のチェックリストを持ってきます。読み上げます。' },
    ],
    level: 3,
    notes: [
      {
        kind: 'caution',
        text: 'この教材は「伝える言葉」の練習です。空気を見つけたときの実際の対処（体位・逆行性灌流など）は、施設の危機管理マニュアルと外科医の指示に従います。',
        sources: ['jasect-handbook-2022', 'mills-1980'],
      },
    ],
    status: 'ai-draft',
  },
  {
    id: 'tai-d2',
    phase: 't-air',
    title: '気泡検出器で止まった：状況を伝えて再開を待つ',
    setting: '体外循環中、気泡検出器のアラームで送血ポンプが止まりました。外科医に知らせ、回路の空気を除いてから再開できることを伝えます。',
    lines: [
      { role: 'perfusionist', en: 'Bubble detector alarm. The pump has stopped.', ja: '気泡検出器のアラームです。ポンプが止まりました。', phraseId: 'tai-03' },
      { role: 'surgeon', en: 'Bubble alarm. Is there air in the line?', ja: '気泡のアラームか。ラインに空気はある？' },
      { role: 'perfusionist', en: "Yes, there's air in the arterial line. I'm clearing it now.", ja: 'はい、送血ラインに空気があります。今、除いています。' },
      { role: 'surgeon', en: "Tell me when it's clear.", ja: '抜けたら教えて。' },
      { role: 'perfusionist', en: 'The line is clear of air. Ready to go back on.', ja: 'ラインの空気は抜けました。再開できます。', phraseId: 'tai-08' },
      { role: 'surgeon', en: 'Line is clear. Going back on.', ja: 'ラインの空気は抜けたね。再開しよう。' },
    ],
    level: 2,
    status: 'ai-draft',
  },
]
