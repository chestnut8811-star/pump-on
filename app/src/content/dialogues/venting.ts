import type { Dialogue } from '../types'

export const dialogues: Dialogue[] = [
  {
    id: 'ven-d1',
    phase: 'venting',
    title: 'LVベントを入れる',
    setting: '体外循環中。外科医が LV ベントを入れるため、いったん心臓を満たしてほしいと言います。挿入が終わったら脱血を戻し、ベントを回します。',
    lines: [
      { role: 'surgeon', en: 'Fill the heart for the LV vent.', ja: 'LVベントを入れるので、心臓を満たして。', phraseId: 'ven-01' },
      { role: 'perfusionist', en: 'Volume is going in.', ja: 'ボリュームを入れています。' },
      { role: 'surgeon', en: 'Hold there for a second.', ja: '少しそのまま保って。', phraseId: 'bas-07' },
      { role: 'perfusionist', en: 'Holding.', ja: '保ちます。' },
      { role: 'surgeon', en: 'LV vent is in. Go ahead and drain out.', ja: 'LVベントが入った。脱血を戻していいよ。', phraseId: 'ven-02' },
      { role: 'perfusionist', en: 'Draining out.', ja: '脱血を戻します。' },
      { role: 'surgeon', en: 'LV vent on.', ja: 'LVベントを回して。' },
      { role: 'perfusionist', en: 'LV vent is on.', ja: 'LVベントを回しました。', phraseId: 'ven-03' },
    ],
    level: 2,
    status: 'ai-draft',
  },
  {
    id: 'ven-d2',
    phase: 'venting',
    title: 'ベントの引きを伝える',
    setting: '体外循環中、LV ベントの引きが弱いことに気づきました。外科医がベントを直したあと、ルートベントも回します。',
    lines: [
      { role: 'perfusionist', en: "I'm not getting much return on the LV vent.", ja: 'LVベントの引きがあまりありません。', phraseId: 'ven-05' },
      { role: 'surgeon', en: 'Let me check the vent.', ja: 'ベントを確認する。' },
      { role: 'surgeon', en: "How's that now?", ja: 'これでどう？' },
      { role: 'perfusionist', en: "I've got good return on the vent.", ja: 'ベントの引き（戻り）は良好です。', phraseId: 'ven-04' },
      { role: 'surgeon', en: 'Root vent can go on.', ja: 'ルートベントを回していいよ。', phraseId: 'ven-07' },
      { role: 'perfusionist', en: "Root vent's coming on.", ja: 'ルートベントを回します。' },
    ],
    level: 3,
    status: 'needs-check',
  },
]
