import type { Dialogue } from '../types'

export const dialogues: Dialogue[] = [
  {
    id: 'pro-d1',
    phase: 'protamine',
    title: 'プロタミン開始 → サッカー停止 → 残血',
    setting: '離脱して状態が落ち着きました。外科医がプロタミンの開始を指示します。投与の宣言を聞いたらすぐにポンプサッカーを止めて全員に伝え、脱血管の抜去と残血の返血に進みます。',
    lines: [
      { role: 'surgeon', en: 'Start protamine.', ja: 'プロタミンを始めて。', phraseId: 'pro-01' },
      { role: 'anesthesiologist', en: 'Protamine is going in.', ja: 'プロタミンを入れています。', phraseId: 'pro-02' },
      { role: 'perfusionist', en: 'Pump suckers off.', ja: 'ポンプサッカー止めました。', phraseId: 'pro-04' },
      { role: 'surgeon', en: 'Suckers off. Thanks.', ja: 'サッカー停止ね。ありがとう。' },
      { role: 'surgeon', en: 'Venous cannula out.', ja: '脱血管を抜いた。', phraseId: 'pro-10' },
      { role: 'perfusionist', en: 'Venous cannula out. Draining the venous line.', ja: '脱血管抜去ですね。脱血ラインの血液を回収します。' },
      { role: 'surgeon', en: 'How much is left in the pump?', ja: 'ポンプに残っているのはどれくらい？', phraseId: 'pro-07' },
      { role: 'perfusionist', en: "There's 600 left in the pump.", ja: 'ポンプに600残っています。', phraseId: 'pro-08' },
      { role: 'surgeon', en: 'Give 100.', ja: '100入れて。', phraseId: 'wea-08' },
      { role: 'perfusionist', en: 'Giving 100.', ja: '100入れます。' },
    ],
    level: 2,
    notes: [
      { kind: 'caution', text: 'プロタミンの投与開始と同時にポンプサッカーを止めるのが基準です（AmSECT・ANZCP・EACTS 2024・JaSECT）。', sources: ['amsect-2017', 'anzcp-2022', 'eacts-cpb-2024', 'jasect-handbook-2022'] },
      { kind: 'facility', text: 'プロタミンとカニューレ抜去の順番、残血の返し方は施設で異なります。残血量などの数値は例です。', sources: ['lind-2019', 'jp-cpb-gl-2007'] },
      { kind: 'verify', text: '抜去後の受け答えと残血の報告の言い回しは、出典で確認できていません。' },
    ],
    status: 'needs-check',
  },
  {
    id: 'pro-d2',
    phase: 'protamine',
    title: '体外循環中のプロタミンを止める',
    setting: 'まだ体外循環中です。外科医が縫合糸（Prolene）を頼んだ直後、麻酔科医が「プロタミンを入れる」と言いました。聞き違いの可能性があります。すぐに止めます。',
    lines: [
      { role: 'surgeon', en: 'Prolene, please.', ja: 'プロリーン（糸）ちょうだい。' },
      { role: 'anesthesiologist', en: 'Okay, giving protamine.', ja: 'はい、プロタミン入れます。' },
      { role: 'perfusionist', en: "Stop! We're still on bypass. Hold the protamine.", ja: '待って！まだ体外循環中です。プロタミンは入れないで。', phraseId: 'pro-06' },
      { role: 'anesthesiologist', en: 'Holding. No protamine given.', ja: '止めました。プロタミンは入れていません。' },
      { role: 'surgeon', en: 'I asked for Prolene, the suture.', ja: '頼んだのはプロリーン、糸のほうだよ。' },
      { role: 'perfusionist', en: "Thanks. No protamine until we're off bypass.", ja: 'ありがとうございます。離脱するまでプロタミンは入れません。' },
    ],
    level: 3,
    notes: [
      { kind: 'caution', text: '外科医の Prolene の依頼をプロタミンと聞き違えた可能性があり、体外循環中だったため技士がすぐに指摘した実例が豪州・NZで報告されています。', sources: ['anzcp-pirs'] },
      { kind: 'verify', text: 'この会話は報告をもとに作った例で、言い回しは出典で確認できていません。' },
    ],
    status: 'needs-check',
  },
]
