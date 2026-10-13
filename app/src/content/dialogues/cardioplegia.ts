import type { Dialogue } from '../types'

export const dialogues: Dialogue[] = [
  {
    id: 'ple-d1',
    phase: 'cardioplegia',
    title: '順行性で始めて、心停止を確かめる',
    setting: '大動脈を遮断した直後。外科医の指示で順行性に心筋保護液を入れ始めます。注入圧を伝え、心停止までに入った量を答えます。',
    lines: [
      { role: 'surgeon', en: 'Start antegrade.', ja: '順行性で始めて。', phraseId: 'ple-01' },
      { role: 'perfusionist', en: 'Cardioplegia flowing.', ja: '心筋保護液、注入中です。', phraseId: 'ple-02' },
      { role: 'surgeon', en: 'Let me know the pressure.', ja: '圧を教えて。' },
      { role: 'perfusionist', en: 'Root pressure is 80.', ja: '大動脈基部圧は80です。', phraseId: 'ple-04' },
      { role: 'anesthesiologist', en: 'Looks like we have quiescence on the EKG.', ja: '心電図は静止したようです。', phraseId: 'ple-05' },
      { role: 'surgeon', en: 'How much has gone in?', ja: 'どれくらい入った？' },
      { role: 'perfusionist', en: 'That was one-third dose.', ja: '（心停止まで）予定量の3分の1です。', phraseId: 'ple-06' },
      { role: 'surgeon', en: 'Go to a liter.', ja: '1リットルまで入れて。' },
      { role: 'perfusionist', en: 'Going to a liter.', ja: '1リットルまで入れます。' },
    ],
    level: 2,
    notes: [
      { kind: 'facility', text: '順行性の注入圧は EACTS 2024 で 60〜100 mmHg、国内2007年ガイドラインで 80〜100 mmHg。量や心筋保護液の種類は施設で異なり、ここの数値は例です。', sources: ['eacts-cpb-2024', 'jp-cpb-gl-2007'] },
      { kind: 'verify', text: '基部圧の報告と量の受け答えの言い回しは、出典で確認できていません。' },
    ],
    status: 'needs-check',
  },
  {
    id: 'ple-d2',
    phase: 'cardioplegia',
    title: '追加投与の時期を自分から知らせる',
    setting: '冠動脈の吻合中。前回の心筋保護から20分たちました。自分から外科医に知らせ、次は逆行性で入れます。',
    lines: [
      { role: 'perfusionist', en: 'Last cardioplegia was 20 minutes ago.', ja: '前回の心筋保護から20分です。', phraseId: 'ple-07' },
      { role: 'surgeon', en: "Thanks. I'll give it after this anastomosis.", ja: 'ありがとう。この吻合が終わったら入れる。' },
      { role: 'surgeon', en: 'Let me know again every 15 minutes.', ja: 'また15分ごとに教えて。', phraseId: 'ple-08' },
      { role: 'perfusionist', en: "I'll let you know in 15 minutes.", ja: '15分後にお知らせします。' },
      { role: 'surgeon', en: "Let's go retrograde.", ja: '逆行性でいこう。', phraseId: 'ple-09' },
      { role: 'perfusionist', en: 'Retrograde going in. CS pressure is 30.', ja: '逆行性で注入中。冠静脈洞圧は30です。', phraseId: 'ple-10' },
      { role: 'surgeon', en: '30. Keep it there.', ja: '30ね、そのままで。' },
    ],
    level: 2,
    notes: [
      { kind: 'facility', text: '前回の投与から20分たったことを伝え、その後は15分ごとに知らせる例です（知らせる間隔は外科医の依頼による）。追加投与そのものの間隔は、冷却した液の間欠投与で約20〜30分ごととされ（EACTS・国内2007年ガイドライン）、液の種類と施設で異なります。逆行性の注入圧は EACTS 2024 で 30〜50 mmHg、国内2007年ガイドラインで約 30 mmHg です。', sources: ['eacts-cpb-2024', 'jp-cpb-gl-2007'] },
      { kind: 'verify', text: '逆行性への切り替えと冠静脈洞圧の報告の言い回しは、出典で確認できていません。' },
    ],
    status: 'needs-check',
  },
]
