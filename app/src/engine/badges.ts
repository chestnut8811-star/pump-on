// バッジの定義と判定。判定は学習記録だけから行う（純粋関数）。

import type { ProgressData } from '../store/progress'
import { FLOW_PHASES } from '../content/phase-ids'

export interface BadgeDef {
  id: string
  name: string
  ja: string
  /** lucide のアイコン名ではなく、表示用の1文字（絵文字は使わず記号で統一） */
  glyph: string
  check: (s: ProgressData) => boolean
}

export const BADGES: BadgeDef[] = [
  { id: 'first-play', name: 'First Words', ja: '初めて英語を再生した', glyph: '♪', check: (s) => s.counters.plays >= 1 },
  { id: 'first-drill', name: 'First Drill', ja: 'ドリルを1回やりきった', glyph: '✓', check: (s) => s.counters.drills >= 1 },
  { id: 'first-sim', name: 'Going On!', ja: 'シミュレーターを最後まで進めた', glyph: '▶', check: (s) => s.counters.sims >= 1 },
  { id: 'closed-loop-10', name: 'Closed Loop', ja: '復唱（closed-loop）の課題に10回正解', glyph: '⟲', check: (s) => s.counters.closedLoop >= 10 },
  { id: 'numbers-30', name: 'Number Catcher', ja: '数値キャッチで30問正解', glyph: '#', check: (s) => s.counters.numbersRight >= 30 },
  { id: 'speaker-30', name: 'Speak Up', ja: '発話練習を30回', glyph: '◉', check: (s) => s.counters.spoken >= 30 },
  {
    id: 'real-or',
    name: 'Real OR',
    ja: 'リアルORモードで症例をクリア',
    glyph: '★',
    check: (s) => Object.values(s.sims).some((p) => p.cleared.includes('real')),
  },
  {
    id: 'rank-s',
    name: 'Smooth Run',
    ja: 'シミュレーターで S ランク',
    glyph: 'S',
    check: (s) => Object.values(s.sims).some((p) => p.bestRank === 'S'),
  },
  {
    id: 'full-circuit',
    name: 'Full Circuit',
    ja: '手術の流れ12シーンすべてでドリルを完了',
    glyph: '◎',
    check: (s) => FLOW_PHASES.every((id) => (s.phases[id]?.drillRuns ?? 0) > 0),
  },
  { id: 'streak-7', name: '7-Day Run', ja: '7日連続で学習', glyph: '7', check: (s) => s.streak.best >= 7 },
  { id: 'review-100', name: 'Spaced Out', ja: '復習を100回', glyph: '↻', check: (s) => s.counters.reviewDone >= 100 },
  { id: 'night-owl', name: 'Night Pump', ja: '22時以降に学習した', glyph: '☾', check: (s) => s.counters.nightOwl >= 1 },
]

export function evaluateBadges(s: ProgressData): BadgeDef[] {
  return BADGES.filter((b) => b.check(s))
}
