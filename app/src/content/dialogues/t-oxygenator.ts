import type { Dialogue } from '../types'

export const dialogues: Dialogue[] = [
  {
    id: 'tox-d1',
    phase: 't-oxygenator',
    title: '血が暗い：ガスを確かめ、数値で伝え、交換に備える',
    setting: '体外循環を始めた直後、助手（レジストラー）が「血がとても暗い」と言いました。ガスの供給を確かめても、送血の酸素分圧が上がりません。',
    lines: [
      { role: 'assistant', en: 'The blood is very dark.', ja: '血がとても暗い。', phraseId: 'tox-01' },
      { role: 'perfusionist', en: 'Dark blood. Checking my gas now.', ja: '血が暗いですね。ガスを確認します。' },
      { role: 'anesthesiologist', en: "What's your PO2?", ja: 'PO2 はいくつ？', phraseId: 'tox-02' },
      { role: 'perfusionist', en: 'My sweep is on, but the PO2 is only 80.', ja: 'ガスは流れていますが、PO2 が80しかありません。', phraseId: 'tox-03' },
      { role: 'surgeon', en: 'Only 80. Is it the oxygenator?', ja: '80だけか。人工肺の問題？' },
      { role: 'perfusionist', en: "Gas supply and connections are fine. I've turned my sweep up.", ja: 'ガスの供給と接続は問題ありません。ガス流量を上げました。' },
      { role: 'perfusionist', en: "I think the oxygenator is failing. Let's get ready to change it out.", ja: '人工肺の機能が落ちているようです。交換の準備をしましょう。', phraseId: 'tox-04' },
      { role: 'surgeon', en: 'Okay. Get ready and tell me before you stop the pump.', ja: 'わかった。準備して、ポンプを止める前に教えて。' },
    ],
    level: 3,
    notes: [
      { kind: 'caution', text: '交換を考える前に、ガスの供給（配管・ブレンダー・接続）と設定を確かめます。JaSECT ハンドブックでは、酸素流量を上げつつ交換または追加の準備をするとしています。判断と手順は施設で訓練された方法と外科医の指示に従います。', sources: ['jasect-handbook-2022'] },
      { kind: 'verify', text: '確認の報告と交換を提案する言い回しは、出典で確認できていません。' },
    ],
    status: 'needs-check',
  },
  {
    id: 'tox-d2',
    phase: 't-oxygenator',
    title: '交換の準備：人と物を頼み、外科医に復唱する',
    setting: '人工肺の交換が決まりました。外回り看護師に応援の技士と交換用セットを頼み、外科医の依頼には復唱で応えます。',
    lines: [
      { role: 'perfusionist', en: 'Call another perfusionist, please. I need help.', ja: 'もう一人技士を呼んでください。応援が必要です。', phraseId: 'tox-05' },
      { role: 'nurse', en: 'Calling another perfusionist now.', ja: '今、別の技士を呼びます。' },
      { role: 'perfusionist', en: 'Can you bring in the change-out kit?', ja: '人工肺の交換用セットを持ってきてもらえますか？', phraseId: 'tox-06' },
      { role: 'nurse', en: 'Bringing the change-out kit now.', ja: '交換用セットを今持ってきます。' },
      { role: 'surgeon', en: 'Tell me before you stop the pump.', ja: 'ポンプを止める前に教えて。', phraseId: 'tox-07' },
      { role: 'perfusionist', en: "I'll tell you before I stop the pump.", ja: 'ポンプを止める前にお伝えします。' },
    ],
    level: 2,
    notes: [
      {
        kind: 'caution',
        text: 'この教材は「伝える言葉」の練習です。人工肺の交換の判断と手順は、施設で訓練された方法と外科医の指示に従います。',
        sources: ['jasect-handbook-2022', 'groom-2002'],
      },
    ],
    status: 'ai-draft',
  },
]
