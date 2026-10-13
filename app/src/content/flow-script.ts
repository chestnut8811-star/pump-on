// 会話リスト: 基本的な体外循環で交わす英語を、開始前からプロタミンまで流れの順に並べたもの。
// 本文・訳・音声はフレーズ（phrases/*.ts）を参照するので、ここには並び順だけを持つ。
// トラブル寄りの場面（ACT 不足で断る、拍動が見えない、脱血不良など）と別運用の言い方は入れない。
// それらは各シーンのフレーズ一覧で見られる。

import type { PhaseId } from './types'

export interface FlowScriptSection {
  /** 見出しにするシーン */
  phase: PhaseId
  /** 流れの順に並べたフレーズ ID */
  ids: string[]
}

export const FLOW_SCRIPT: FlowScriptSection[] = [
  // 胸骨切開時の換気停止（ven-08）は開始前に置く
  { phase: 'prebypass', ids: ['pre-01', 'pre-02', 'pre-03', 'ven-08', 'pre-04', 'pre-05', 'pre-10', 'pre-06', 'pre-07'] },
  { phase: 'cannulation', ids: ['can-01', 'can-02', 'can-03', 'can-04', 'can-05', 'can-06', 'can-08'] },
  { phase: 'initiation', ids: ['ini-01', 'ini-02', 'ini-03', 'ini-04', 'ini-05', 'ini-06', 'ini-07', 'ini-08'] },
  { phase: 'venting', ids: ['ven-01', 'ven-02', 'ven-03', 'ven-04', 'ven-06', 'ven-07'] },
  { phase: 'cooling', ids: ['coo-01', 'coo-02', 'coo-03', 'coo-04'] },
  { phase: 'crossclamp', ids: ['xcl-01', 'xcl-02', 'xcl-03', 'xcl-04', 'xcl-05', 'xcl-06', 'xcl-07', 'xcl-08'] },
  { phase: 'cardioplegia', ids: ['ple-01', 'ple-02', 'ple-04', 'ple-05', 'ple-06', 'ple-07', 'ple-08'] },
  // 遮断時間を聞かれる（xcl-09）のは体外循環中
  { phase: 'onbypass', ids: ['onb-01', 'onb-02', 'onb-04', 'onb-06', 'onb-07', 'onb-08', 'onb-09', 'onb-10', 'xcl-09'] },
  { phase: 'rewarming', ids: ['rew-01', 'rew-02', 'rew-03', 'rew-04', 'rew-07'] },
  { phase: 'deairing', ids: ['dea-01', 'dea-02', 'dea-03', 'dea-04', 'dea-05'] },
  // 換気の再開（wea-02）→ 離脱開始 → 換気の確認の順
  { phase: 'weaning', ids: ['wea-02', 'wea-01', 'wea-03', 'wea-04', 'wea-05', 'wea-06', 'wea-07', 'wea-09', 'wea-08'] },
  { phase: 'protamine', ids: ['pro-01', 'pro-02', 'pro-03', 'pro-04', 'pro-10', 'pro-07', 'pro-08', 'pro-09'] },
]
