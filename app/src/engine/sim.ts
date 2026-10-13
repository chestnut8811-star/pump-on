// シミュレーターの進行と採点（純粋関数）

import type { Beat, HudState, PhaseId, SimCase, SimTask } from '../content/types'

export type SimMode = 'guided' | 'standard' | 'real'

export const MODE_META: Record<SimMode, { label: string; desc: string; rate: number; timeLimit: number | null; replays: number }> = {
  guided: { label: 'ガイド', desc: '英語字幕と日本語訳つき・ゆっくり・時間制限なし', rate: 0.85, timeLimit: null, replays: Infinity },
  standard: { label: 'スタンダード', desc: '英語字幕は音声のあと・日本語は答えたあと・通常速度', rate: 1, timeLimit: null, replays: Infinity },
  real: { label: 'リアルOR', desc: '音声だけ・聞き直し1回・時間制限あり', rate: 1.05, timeLimit: 15, replays: 1 },
}

/** 課題の制限時間（秒）。リアルORのみ */
export function timeLimitFor(task: SimTask, mode: SimMode): number | null {
  const base = MODE_META[mode].timeLimit
  if (base === null) return null
  if (task.kind === 'catch') return base - 3
  if (task.kind === 'speak') return base + 10
  return base
}

/** i 番目のビートまでを反映したモニター表示 */
export function hudAt(c: SimCase, index: number): HudState {
  let hud: HudState = { ...c.initialHud }
  for (let i = 0; i <= index && i < c.beats.length; i++) {
    const h = c.beats[i].hud
    if (h) hud = { ...hud, ...h }
  }
  return hud
}

/** 'HH:MM' 同士の差（分）。b が a より前なら日付をまたいだとみなす */
export function minutesBetween(a: string, b: string): number {
  const [h1, m1] = a.split(':').map(Number)
  const [h2, m2] = b.split(':').map(Number)
  let d = h2 * 60 + m2 - (h1 * 60 + m1)
  if (d < 0) d += 24 * 60
  return d
}

/** 現在の模擬時刻（そのビートまでで最後に指定された clock） */
export function clockAt(c: SimCase, index: number): string | null {
  for (let i = Math.min(index, c.beats.length - 1); i >= 0; i--) {
    const clk = c.beats[i].clock
    if (clk) return clk
  }
  return null
}

/** シーン単位の練習: そのシーンのビートだけを取り出した範囲 [start, end) */
export function phaseRange(c: SimCase, phase: PhaseId): [number, number] | null {
  const idx = c.beats.map((b, i) => (b.phase === phase ? i : -1)).filter((i) => i >= 0)
  if (idx.length === 0) return null
  return [idx[0], idx[idx.length - 1] + 1]
}

export interface TaskResult {
  beatId: string
  kind: SimTask['kind']
  ok: boolean
  /** 回答までの時間（ミリ秒） */
  ms: number
  timedOut: boolean
  phraseIds: string[]
}

export interface SimScore {
  /** 0〜100 */
  score: number
  rank: 'S' | 'A' | 'B' | 'C' | 'D'
  correct: number
  total: number
  avgSec: number | null
}

export function scoreRun(results: TaskResult[], mode: SimMode): SimScore {
  const total = results.length
  if (total === 0) return { score: 0, rank: 'D', correct: 0, total: 0, avgSec: null }
  const correct = results.filter((r) => r.ok).length
  let pts = 0
  for (const r of results) {
    if (!r.ok) continue
    let p = 100
    // リアルOR は速さのボーナス（上限あり）
    if (mode === 'real' && !r.timedOut && r.ms < 6000) p += 10
    pts += p
  }
  const score = Math.min(100, Math.round(pts / total))
  const rank = score >= 95 ? 'S' : score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 50 ? 'C' : 'D'
  const avgSec = Math.round((results.reduce((a, r) => a + r.ms, 0) / total / 1000) * 10) / 10
  return { score, rank, correct, total, avgSec }
}

export function taskCount(beats: Beat[]): number {
  return beats.filter((b) => b.task).length
}
