import type { Dialogue } from '../types'

export const dialogues: Dialogue[] = [
  {
    id: 'rew-d1',
    phase: 'rewarming',
    title: '復温 — 急がされても上限を守る',
    setting: '復温の途中。外科医が体温を聞き、早く離脱したい様子です。測定部位を添えて体温を伝え、送血温の上限を守ります。',
    lines: [
      { role: 'surgeon', en: "What's your temp?", ja: '体温は？', phraseId: 'rew-03' },
      { role: 'perfusionist', en: 'Naso is 36.4, bladder 35.1.', ja: '鼻咽頭温36.4℃、膀胱温35.1℃です。', phraseId: 'rew-04' },
      { role: 'surgeon', en: 'Can you warm a little faster?', ja: 'もう少し早く温められる？' },
      { role: 'perfusionist', en: "Arterial outlet is 36.8. I won't go above 37.", ja: '送血温は36.8℃です。37℃は超えないようにします。', phraseId: 'rew-05' },
      { role: 'surgeon', en: "Okay. Don't go above 37.", ja: 'わかった。37℃は超えないで。' },
      { role: 'surgeon', en: 'Are we ready to come off?', ja: '離脱できる？' },
      { role: 'perfusionist', en: "We're not fully warm yet.", ja: 'まだ十分に温まっていません。', phraseId: 'rew-06' },
      { role: 'surgeon', en: "Okay. Tell me when you're there.", ja: 'わかった。温まったら教えて。' },
    ],
    level: 3,
    notes: [
      { kind: 'caution', text: '送血温は 37℃ を超えないことが推奨されています（STS 2015: 37℃ 未満、EACTS 2024: 最大 37℃）。', sources: ['sts-temp-2015', 'eacts-cpb-2024'] },
      { kind: 'facility', text: '離脱時の目標体温には確立した推奨値がなく（STS 2015）、何℃で「十分」とするかは施設で決めます。ここの数値は例です。', sources: ['sts-temp-2015'] },
      { kind: 'verify', text: '体温の報告と、上限を伝える言い回しは出典で確認できていません。' },
    ],
    status: 'needs-check',
  },
]
