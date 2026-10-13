// 学習記録のバックアップ（書き出したファイル）の検証。
// 読み込む前に全体の形と値を確かめ、1か所でもおかしければ何も上書きしない（既存の記録を守る）。
// ストアに依存しない純粋関数にして、テストから直接呼べるようにしている。

import type { ProgressData, SimMode } from './progress'
import type { SettingsData } from './settings'
import type { SrsItem } from '../engine/srs'

type Obj = Record<string, unknown>

const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v)
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)
const isCount = (v: unknown): v is number => isNum(v) && v >= 0
const isStr = (v: unknown): v is string => typeof v === 'string'
const isBool = (v: unknown): v is boolean => typeof v === 'boolean'
/** YYYY-MM-DD（未記録は空文字） */
const isDay = (v: unknown): v is string => isStr(v) && (v === '' || /^\d{4}-\d{2}-\d{2}$/.test(v))

const SIM_MODES: readonly SimMode[] = ['guided', 'standard', 'real']
const COUNTER_KEYS = ['plays', 'spoken', 'closedLoop', 'numbersRight', 'reviewDone', 'drills', 'sims', 'nightOwl'] as const

/** 値がすべて条件を満たすオブジェクトか */
function isRecordOf<T>(v: unknown, check: (x: unknown) => x is T): v is Record<string, T> {
  return isObj(v) && Object.values(v).every(check)
}

function isSrsItem(v: unknown): v is SrsItem {
  return (
    isObj(v) &&
    isCount(v.box) &&
    v.box <= 6 &&
    Number.isInteger(v.box) &&
    isDay(v.due) &&
    isCount(v.seen) &&
    isCount(v.right) &&
    isCount(v.wrong) &&
    isDay(v.last)
  )
}

function isPhaseProgress(v: unknown): boolean {
  return isObj(v) && isCount(v.drillBest) && isCount(v.drillRuns) && Array.isArray(v.dialoguesDone) && v.dialoguesDone.every(isStr) && isBool(v.visited)
}

function isSimProgress(v: unknown): boolean {
  return (
    isObj(v) &&
    isCount(v.bestScore) &&
    isStr(v.bestRank) &&
    isCount(v.runs) &&
    Array.isArray(v.cleared) &&
    v.cleared.every((m) => SIM_MODES.includes(m as SimMode))
  )
}

/** 学習記録の検証。正しければ ProgressData、1か所でもおかしければ null */
export function parseProgress(v: unknown): ProgressData | null {
  if (!isObj(v) || v.version !== 1) return null
  const { streak, counters, last } = v
  if (!isCount(v.xp)) return null
  if (!isObj(streak) || !isCount(streak.current) || !isCount(streak.best) || !isDay(streak.lastDay)) return null
  if (!isRecordOf(v.daily, isCount)) return null
  if (!isRecordOf(v.phrases, isSrsItem)) return null
  if (!isObj(v.phases) || !Object.values(v.phases).every(isPhaseProgress)) return null
  if (!isObj(v.sims) || !Object.values(v.sims).every(isSimProgress)) return null
  if (!isObj(counters) || !COUNTER_KEYS.every((k) => counters[k] === undefined || isCount(counters[k]))) return null
  if (!isRecordOf(v.badges, isStr)) return null
  if (!isBool(v.onboarded)) return null
  if (!(last === null || last === undefined || (isObj(last) && isStr(last.path) && last.path.startsWith('/') && isStr(last.label)))) return null
  const c = counters as Partial<Record<(typeof COUNTER_KEYS)[number], number>>
  return {
    version: 1,
    xp: v.xp,
    streak: { current: streak.current, best: streak.best, lastDay: streak.lastDay },
    daily: v.daily,
    phrases: v.phrases,
    phases: v.phases as ProgressData['phases'],
    sims: v.sims as ProgressData['sims'],
    // 古い書き出しに無いカウンターは 0 で補う
    counters: Object.fromEntries(COUNTER_KEYS.map((k) => [k, c[k] ?? 0])) as unknown as ProgressData['counters'],
    badges: v.badges,
    onboarded: v.onboarded,
    last: (last ?? null) as ProgressData['last'],
  }
}

/** 設定の検証。知らない項目・型の違う項目は捨て、正しい項目だけを返す。設定そのものが壊れていれば null */
export function parseSettings(v: unknown): Partial<SettingsData> | null {
  if (!isObj(v)) return null
  const out: Partial<SettingsData> = {}
  if (v.theme === 'system' || v.theme === 'light' || v.theme === 'dark') out.theme = v.theme
  if (isNum(v.rate)) out.rate = Math.min(1.3, Math.max(0.6, v.rate))
  if (isRecordOf(v.voices, isStr)) out.voices = v.voices
  if (v.subtitles === 'en+ja' || v.subtitles === 'en' || v.subtitles === 'none') out.subtitles = v.subtitles
  if (SIM_MODES.includes(v.simMode as SimMode)) out.simMode = v.simMode as SimMode
  if (isBool(v.orNoise)) out.orNoise = v.orNoise
  if (isBool(v.useRecognition)) out.useRecognition = v.useRecognition
  if (isBool(v.sfx)) out.sfx = v.sfx
  if (isNum(v.dailyGoal) && v.dailyGoal > 0 && v.dailyGoal <= 1000) out.dailyGoal = Math.round(v.dailyGoal)
  if (isBool(v.installHintClosed)) out.installHintClosed = v.installHintClosed
  return out
}

export interface Backup {
  progress: ProgressData
  settings: Partial<SettingsData> | null
}

/** 書き出したファイルの中身（JSON.parse 済み）を検証する。読み込めないときは null */
export function parseBackup(json: unknown): Backup | null {
  if (!isObj(json) || json.app !== 'pump-on' || json.version !== 1) return null
  const progress = parseProgress(json.progress)
  if (!progress) return null
  if (json.settings === undefined) return { progress, settings: null }
  const settings = parseSettings(json.settings)
  if (!settings) return null
  return { progress, settings }
}
