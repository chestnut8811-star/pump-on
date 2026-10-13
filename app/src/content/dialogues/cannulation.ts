import type { Dialogue } from '../types'

export const dialogues: Dialogue[] = [
  {
    id: 'can-d1',
    phase: 'cannulation',
    title: '降圧・切り離し・送血テスト',
    setting: '送血管を入れる場面。外科医が麻酔科医に降圧を頼み、回路を切り離して送血ラインをつなぎます。あなたは拍動と送血テストの結果を報告します。',
    lines: [
      { role: 'surgeon', en: "Let's cannulate.", ja: 'カニュレーションを始めます。' },
      { role: 'surgeon', en: 'Can we bring the systolic below 100 for cannulation?', ja: '送血管を入れるので、収縮期血圧を100未満に下げてもらえますか。', phraseId: 'can-01' },
      { role: 'anesthesiologist', en: 'Systolic is 95 now.', ja: '収縮期は今95です。' },
      { role: 'surgeon', en: 'Can I divide your lines?', ja: '回路（ライン）を切り離していい？', phraseId: 'can-02' },
      { role: 'perfusionist', en: 'Pump is off. Lines are clamped.', ja: 'ポンプは止めています。ラインは鉗子で止めています。', phraseId: 'can-03' },
      { role: 'surgeon', en: "You've got your arterial line.", ja: '送血ラインをつないだよ（確認して）。', phraseId: 'can-04' },
      { role: 'perfusionist', en: "I've got a good pulse. I'm going to test the line.", ja: '拍動はしっかり見えます。送血テストをします。', phraseId: 'can-05' },
      { role: 'perfusionist', en: 'Good line pressure. Line test is good.', ja: '送血圧は良好、送血テストも問題ありません。', phraseId: 'can-06' },
    ],
    level: 2,
    notes: [{ kind: 'facility', text: '降圧の目標（100 未満か 90〜100 か）は施設・術者で異なります。', sources: ['eacts-cpb-2024', 'sarkar-2017'] }],
    status: 'needs-check',
  },
  {
    id: 'can-d2',
    phase: 'cannulation',
    title: '脱血管を先に入れる',
    setting: '血圧がなかなか下がらないため、外科医はいつもと順番を変えて、脱血管を先に入れることにしました（米国の講師が挙げた例）。',
    lines: [
      { role: 'surgeon', en: 'Give me the venous first.', ja: '先に脱血側からいくよ。', phraseId: 'can-09' },
      { role: 'perfusionist', en: 'Venous first. Got it.', ja: '脱血が先ですね。了解です。' },
      { role: 'surgeon', en: "You've got your venous line.", ja: '脱血ラインをつないだよ。', phraseId: 'can-08' },
      { role: 'perfusionist', en: 'Got the venous line. Thanks.', ja: '脱血ライン、了解です。ありがとうございます。' },
    ],
    level: 3,
    notes: [{ kind: 'facility', text: 'カニュレーションの順番は施設・術者で異なります。', sources: ['lectures-2018-2020'] }],
    status: 'ai-draft',
  },
]
