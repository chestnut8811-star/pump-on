// 学習記録（端末内のみ。localStorage に保存）。書き出し/読み込みで退避できる。

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { grade, introduce, today, addDays, type SrsItem } from '../engine/srs'
import { DAILY_GOAL_DEFAULT, XP } from '../engine/xp'
import { evaluateBadges } from '../engine/badges'
import { notify } from './ui'

export type SimMode = 'guided' | 'standard' | 'real'

export interface Counters {
  plays: number
  spoken: number
  closedLoop: number
  numbersRight: number
  reviewDone: number
  drills: number
  sims: number
  nightOwl: number
}

export interface PhaseProgress {
  drillBest: number
  drillRuns: number
  dialoguesDone: string[]
  visited: boolean
}

export interface SimProgress {
  bestScore: number
  bestRank: string
  runs: number
  cleared: SimMode[]
}

export interface LastActivity {
  path: string
  label: string
}

export interface ProgressData {
  version: 1
  xp: number
  streak: { current: number; best: number; lastDay: string }
  daily: Record<string, number>
  phrases: Record<string, SrsItem>
  phases: Record<string, PhaseProgress>
  sims: Record<string, SimProgress>
  counters: Counters
  badges: Record<string, string>
  onboarded: boolean
  last: LastActivity | null
}

export const emptyProgress = (): ProgressData => ({
  version: 1,
  xp: 0,
  streak: { current: 0, best: 0, lastDay: '' },
  daily: {},
  phrases: {},
  phases: {},
  sims: {},
  counters: { plays: 0, spoken: 0, closedLoop: 0, numbersRight: 0, reviewDone: 0, drills: 0, sims: 0, nightOwl: 0 },
  badges: {},
  onboarded: false,
  last: null,
})

interface Actions {
  /** XP を加算し、連続日数とデイリー目標を更新 */
  addXp: (n: number, dailyGoal?: number) => void
  /** フレーズに出会った（未登録なら復習対象に登録） */
  meet: (ids: string[]) => void
  /** フレーズの正誤を復習データに反映 */
  gradePhrase: (id: string, correct: boolean) => void
  bump: (key: keyof Counters, n?: number) => void
  recordDrill: (phaseId: string, scorePct: number) => void
  recordDialogue: (phaseId: string, dialogueId: string) => void
  visitPhase: (phaseId: string) => void
  recordSim: (caseId: string, score: number, rank: string, mode: SimMode, cleared: boolean) => void
  setOnboarded: (v: boolean) => void
  setLast: (a: LastActivity) => void
  replaceAll: (data: ProgressData) => void
  reset: () => void
  checkBadges: () => void
}

const phaseOf = (s: ProgressData, id: string): PhaseProgress =>
  s.phases[id] ?? { drillBest: 0, drillRuns: 0, dialoguesDone: [], visited: false }

export const useProgress = create<ProgressData & Actions>()(
  persist(
    (set, get) => ({
      ...emptyProgress(),

      addXp: (n, dailyGoal = DAILY_GOAL_DEFAULT) => {
        const day = today()
        const s = get()
        const before = s.daily[day] ?? 0
        let gained = n
        if (before < dailyGoal && before + n >= dailyGoal) gained += XP.dailyGoalBonus
        let { current, best, lastDay } = s.streak
        if (lastDay !== day) {
          current = lastDay === addDays(day, -1) ? current + 1 : 1
          best = Math.max(best, current)
          lastDay = day
        }
        const hour = new Date().getHours()
        set({
          xp: s.xp + gained,
          daily: { ...s.daily, [day]: before + gained },
          streak: { current, best, lastDay },
          counters: hour >= 22 || hour < 4 ? { ...s.counters, nightOwl: s.counters.nightOwl + 1 } : s.counters,
        })
        if (gained > n) notify({ kind: 'goal', title: '今日の目標を達成！', body: `ボーナス +${XP.dailyGoalBonus} XP` })
        get().checkBadges()
      },

      meet: (ids) => {
        const s = get()
        const day = today()
        const next = { ...s.phrases }
        let changed = false
        for (const id of ids) {
          if (!next[id]) {
            next[id] = introduce(day)
            changed = true
          }
        }
        if (changed) set({ phrases: next })
      },

      gradePhrase: (id, correct) => {
        const s = get()
        set({ phrases: { ...s.phrases, [id]: grade(s.phrases[id], correct, today()) } })
      },

      bump: (key, n = 1) => {
        const s = get()
        set({ counters: { ...s.counters, [key]: s.counters[key] + n } })
        get().checkBadges()
      },

      recordDrill: (phaseId, scorePct) => {
        const s = get()
        const p = phaseOf(s, phaseId)
        set({
          phases: { ...s.phases, [phaseId]: { ...p, drillBest: Math.max(p.drillBest, scorePct), drillRuns: p.drillRuns + 1 } },
          counters: { ...s.counters, drills: s.counters.drills + 1 },
        })
        get().checkBadges()
      },

      recordDialogue: (phaseId, dialogueId) => {
        const s = get()
        const p = phaseOf(s, phaseId)
        if (p.dialoguesDone.includes(dialogueId)) return
        set({ phases: { ...s.phases, [phaseId]: { ...p, dialoguesDone: [...p.dialoguesDone, dialogueId] } } })
      },

      visitPhase: (phaseId) => {
        const s = get()
        const p = phaseOf(s, phaseId)
        if (p.visited) return
        set({ phases: { ...s.phases, [phaseId]: { ...p, visited: true } } })
      },

      recordSim: (caseId, score, rank, mode, cleared) => {
        const s = get()
        const prev = s.sims[caseId] ?? { bestScore: 0, bestRank: '', runs: 0, cleared: [] }
        const better = score > prev.bestScore
        set({
          sims: {
            ...s.sims,
            [caseId]: {
              bestScore: Math.max(prev.bestScore, score),
              bestRank: better ? rank : prev.bestRank,
              runs: prev.runs + 1,
              cleared: cleared && !prev.cleared.includes(mode) ? [...prev.cleared, mode] : prev.cleared,
            },
          },
          counters: { ...s.counters, sims: s.counters.sims + 1 },
        })
        get().checkBadges()
      },

      setOnboarded: (v) => set({ onboarded: v }),
      setLast: (a) => set({ last: a }),
      replaceAll: (data) => set({ ...emptyProgress(), ...data }),
      reset: () => set(emptyProgress()),

      checkBadges: () => {
        const s = get()
        const earned = evaluateBadges(s)
        const fresh = earned.filter((b) => !s.badges[b.id])
        if (fresh.length === 0) return
        const day = today()
        const badges = { ...s.badges }
        for (const b of fresh) badges[b.id] = day
        set({ badges })
        for (const b of fresh) notify({ kind: 'badge', title: `バッジ獲得: ${b.name}`, body: b.ja })
      },
    }),
    {
      name: 'pumpon:progress:v1',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (s) => {
        // 関数を除いたデータだけを保存
        const { addXp: _a, meet: _m, gradePhrase: _g, bump: _b, recordDrill: _rd, recordDialogue: _rdi, visitPhase: _v,
          recordSim: _rs, setOnboarded: _so, setLast: _sl, replaceAll: _ra, reset: _r, checkBadges: _cb, ...data } = s
        return data
      },
    },
  ),
)

/** 書き出し用に、現在の記録をデータだけ取り出す */
export function snapshotProgress(): ProgressData {
  const s = useProgress.getState()
  return {
    version: 1,
    xp: s.xp,
    streak: s.streak,
    daily: s.daily,
    phrases: s.phrases,
    phases: s.phases,
    sims: s.sims,
    counters: s.counters,
    badges: s.badges,
    onboarded: s.onboarded,
    last: s.last,
  }
}
