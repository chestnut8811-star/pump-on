import type { Dialogue } from '../types'

export const dialogues: Dialogue[] = [
  {
    id: 'pre-d1',
    phase: 'prebypass',
    title: 'タイムアウトとヘパリンの宣言',
    setting: '執刀前のタイムアウト。続いて外科医がヘパリン投与を指示し、麻酔科医が量と時刻を宣言します。あなたは同じ形で復唱します。',
    lines: [
      { role: 'surgeon', en: 'Start time-out.', ja: 'タイムアウトを始めます。' },
      { role: 'perfusionist', en: 'Pump checklist complete.', ja: '人工心肺のチェックリストは完了しています。', phraseId: 'pre-03' },
      { role: 'surgeon', en: 'Give heparin.', ja: 'ヘパリンを投与して。', phraseId: 'pre-04' },
      { role: 'anesthesiologist', en: '21,000 units of heparin going in at 8:45.', ja: 'ヘパリン2万1000単位、8時45分に投与します。', phraseId: 'pre-05' },
      { role: 'perfusionist', en: "That's 21,000 units of heparin at 8:45.", ja: 'ヘパリン2万1000単位、8時45分ですね。' },
      { role: 'anesthesiologist', en: 'Correct, 8:45.', ja: 'そう、8時45分。' },
    ],
    level: 2,
    notes: [{ kind: 'facility', text: 'ヘパリンの量は施設のプロトコルによります（国内添付文書と海外ガイドラインで幅が異なります）。', sources: ['pi-heparin-jp', 'eacts-cpb-2019'] }],
    status: 'ai-draft',
  },
  {
    id: 'pre-d2',
    phase: 'prebypass',
    title: '急かされても ACT を待つ',
    setting: 'ヘパリン投与の数分後。ACT は測定中で、表示はまだ 350 秒です。外科医はサッカーを回したがっていますが、基準を超えるまで待ってもらいます。',
    lines: [
      { role: 'anesthesiologist', en: "Here's your ACT sample.", ja: 'ACT 用の検体です。', phraseId: 'pre-10' },
      { role: 'perfusionist', en: 'Thanks. Running the ACT now.', ja: 'ありがとうございます。今からACTを測ります。' },
      { role: 'surgeon', en: 'Just turn on cardiotomy.', ja: 'いいから、サッカーを回して。', phraseId: 'pre-08' },
      { role: 'perfusionist', en: 'Not yet. ACT is only 350. I need it over 400.', ja: 'まだです。ACTはまだ350です。400を超えるまで待ってください。', phraseId: 'pre-09' },
      { role: 'surgeon', en: "OK. Tell me when it's over 400.", ja: 'わかった。400を超えたら教えて。' },
      { role: 'perfusionist', en: 'ACT is good. Stopped at 485.', ja: 'ACTは良好です。485で確定しました。', phraseId: 'pre-06' },
      { role: 'surgeon', en: 'Can we have the pump suckers, please?', ja: 'ポンプサッカーを回してもらえますか。', phraseId: 'pre-07' },
      { role: 'perfusionist', en: 'Suckers are on.', ja: 'サッカー回しました。' },
    ],
    level: 3,
    notes: [
      { kind: 'facility', text: 'サッカーや体外循環を始めてよい ACT の基準は施設で異なります。ここの 400 は豪州・NZの事例の値です。', sources: ['anzcp-pirs'] },
    ],
    status: 'needs-check',
  },
]
