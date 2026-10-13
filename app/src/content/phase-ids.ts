import type { PhaseId } from './types'

/** 手術の流れの順（シーン学習・マップの並び順） */
export const FLOW_PHASES: PhaseId[] = [
  'prebypass',
  'cannulation',
  'initiation',
  'venting',
  'cooling',
  'crossclamp',
  'cardioplegia',
  'onbypass',
  'rewarming',
  'deairing',
  'weaning',
  'protamine',
]

export const TROUBLE_PHASES: PhaseId[] = ['t-pressure', 't-air', 't-drainage', 't-oxygenator', 't-power', 't-anticoag']

export const ALL_PHASES: PhaseId[] = ['basics', ...FLOW_PHASES, ...TROUBLE_PHASES]
