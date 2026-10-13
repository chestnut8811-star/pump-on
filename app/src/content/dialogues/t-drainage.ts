import type { Dialogue } from '../types'

export const dialogues: Dialogue[] = [
  {
    id: 'tdr-d1',
    phase: 't-drainage',
    title: 'レベル低下：原因を確かめ、流量を下げ、容量を頼む',
    setting: '冠動脈バイパス術の遮断中、外科医が心臓を持ち上げて吻合をしています。リザーバーのレベルが下がってきました。',
    lines: [
      { role: 'perfusionist', en: 'My level is dropping. Is the heart up?', ja: 'レベルが下がっています。心臓を持ち上げていますか？', phraseId: 'tdr-01' },
      { role: 'surgeon', en: 'Yes, I need a minute here.', ja: 'うん、もう少しかかる。' },
      { role: 'perfusionist', en: "I'm coming down to 4 liters.", ja: '流量を4 L/分に下げます。', phraseId: 'tdr-02' },
      { role: 'surgeon', en: "Down to 4. That's fine.", ja: '4 L に下げるのね。それでいい。' },
      { role: 'perfusionist', en: 'Can I have some volume, please?', ja: 'ボリューム（輸液・血液）をいただけますか？', phraseId: 'tdr-03' },
      { role: 'anesthesiologist', en: 'Giving you some volume now.', ja: '今、ボリュームを入れます。' },
      { role: 'surgeon', en: 'Pump sucker high, please.', ja: 'ポンプサッカーを強くして。', phraseId: 'tdr-04' },
      { role: 'perfusionist', en: 'Pump sucker high.', ja: 'サッカーを強くします。' },
    ],
    level: 2,
    status: 'ai-draft',
  },
  {
    id: 'tdr-d2',
    phase: 't-drainage',
    title: 'エアロック：送血を止め、脱血ラインを満たし直す',
    setting: '前の会話の続きです。低レベルアラームが鳴り、脱血ラインに大きな空気が溜まって脱血が止まりました（エアロック）。',
    lines: [
      { role: 'perfusionist', en: "Air lock in the venous line! I'm stopping the pump.", ja: '脱血ラインにエアロック！送血を止めます。', phraseId: 'tdr-05' },
      { role: 'surgeon', en: 'Okay. What do you need?', ja: 'わかった。何が必要？' },
      { role: 'perfusionist', en: 'I can refill the venous line from my end.', ja: '脱血ラインはこちら（ポンプ側）から満たし直せます。', phraseId: 'tdr-07' },
      { role: 'surgeon', en: "Go ahead. Tell me when it's full.", ja: 'どうぞ。満たせたら教えて。', phraseId: 'tdr-08' },
      { role: 'perfusionist', en: "Venous line is full. I'm going back on slowly.", ja: '脱血ラインが満たされました。ゆっくり再開します。' },
      { role: 'surgeon', en: 'Good. Tell me when your level is back.', ja: 'よし。レベルが戻ったら教えて。' },
    ],
    level: 3,
    notes: [
      {
        kind: 'caution',
        text: 'この教材は「伝える言葉」の練習です。エアロックの実際の対処は、施設の手順（危機管理マニュアル）と外科医の指示に従います。JaSECT ハンドブックでは、多量の空気で脱血できないときは送血を止めて原因を除き、空気をリザーバーへ導いてから、ゆっくり再開します。',
        sources: ['jasect-handbook-2022'],
      },
      { kind: 'verify', text: '送血の停止と再開を伝える言い回しは、出典で確認できていません。' },
    ],
    status: 'needs-check',
  },
]
