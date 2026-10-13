import type { Dialogue } from '../types'

export const dialogues: Dialogue[] = [
  {
    id: 'tac-d1',
    phase: 't-anticoag',
    title: '急かされても待つ：値と提案を伝える',
    setting: 'ヘパリンを投与しましたが、ACT が目標に届いていません。外科医は早く体外循環を始めたがっています。',
    lines: [
      {
        role: 'perfusionist',
        en: 'The ACT just stopped at 280 seconds. I recommend giving another 10,000 units.',
        ja: 'ACT は280秒で確定しました。ヘパリンをさらに1万単位入れることをお勧めします。',
        phraseId: 'tac-01',
      },
      { role: 'anesthesiologist', en: 'Another 10,000 units of heparin going in at 9:12.', ja: 'ヘパリンをさらに1万単位、9時12分に入れます。' },
      { role: 'surgeon', en: 'Just go on bypass.', ja: 'とにかく体外循環を始めて。', phraseId: 'tac-03' },
      { role: 'perfusionist', en: "I can't go on bypass until the ACT is over 400.", ja: 'ACT が400を超えるまでは、体外循環を始められません。', phraseId: 'tac-04' },
      { role: 'surgeon', en: 'Is the ACT up yet?', ja: 'ACT はもう上がった？', phraseId: 'tac-02' },
      { role: 'perfusionist', en: "Not yet. It's 380 and rising.", ja: 'まだです。380で、まだ上がっています。' },
      { role: 'surgeon', en: "Tell me as soon as it's over 400.", ja: '400を超えたらすぐ教えて。' },
      { role: 'perfusionist', en: "Repeat ACT is 520. We're good to go on bypass.", ja: '再検の ACT は520です。体外循環を始められます。', phraseId: 'tac-08' },
    ],
    level: 3,
    notes: [
      {
        kind: 'caution',
        text: 'この教材は「伝える言葉」の練習です。目標の ACT、ヘパリンの量、開始の判断は、施設のプロトコルと医師の指示に従います。',
        sources: ['sts-anticoag-2018', 'eacts-cpb-2024'],
      },
    ],
    status: 'ai-draft',
  },
  {
    id: 'tac-d2',
    phase: 't-anticoag',
    title: 'ヘパリン抵抗性を疑う：相談してチェックリストで進める',
    setting: '体重あたりのヘパリンを投与しても、ACT が十分に延びません。ヘパリン抵抗性を疑い、麻酔科医とチームに相談します。',
    lines: [
      {
        role: 'perfusionist',
        en: 'ACT is 350 after 300 units per kilo. Could this be heparin resistance?',
        ja: '300単位/kg 入れて ACT が350です。ヘパリン抵抗性でしょうか？',
        phraseId: 'tac-05',
      },
      { role: 'anesthesiologist', en: "Heparin resistance? Let's check the antithrombin.", ja: 'ヘパリン抵抗性？アンチトロンビンを調べよう。' },
      { role: 'perfusionist', en: 'Can we run the heparin resistance checklist?', ja: 'ヘパリン抵抗性のチェックリストに沿って進めませんか？', phraseId: 'tac-07' },
      { role: 'nurse', en: "Getting the heparin resistance checklist. I'll read it out.", ja: 'ヘパリン抵抗性のチェックリストを持ってきます。読み上げます。' },
      { role: 'anesthesiologist', en: 'We may need antithrombin or FFP.', ja: 'アンチトロンビンか FFP が必要かもしれない。', phraseId: 'tac-06' },
      { role: 'perfusionist', en: "Antithrombin or FFP. I'll recheck the ACT after it goes in.", ja: 'アンチトロンビンか FFP ですね。入ったら ACT を測り直します。' },
    ],
    level: 3,
    notes: [
      {
        kind: 'caution',
        text: '国内の AT 製剤の効能には CPB 中のヘパリン抵抗性が含まれていません。使うかどうかは施設の取り決めと医師の判断によります。',
        sources: ['pi-at-jp'],
      },
    ],
    status: 'ai-draft',
  },
]
