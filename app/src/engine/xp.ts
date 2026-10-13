// 経験値とレベル。称号は人工心肺の進行になぞらえる。

export interface LevelDef {
  level: number
  min: number
  title: string
  ja: string
}

export const LEVELS: LevelDef[] = [
  { level: 1, min: 0, title: 'Priming Rookie', ja: 'プライミング見習い' },
  { level: 2, min: 150, title: 'Circuit Checker', ja: '回路チェッカー' },
  { level: 3, min: 400, title: 'On Pump', ja: 'オンポンプ' },
  { level: 4, min: 800, title: 'Full Flow', ja: 'フルフロー' },
  { level: 5, min: 1400, title: 'Clamp Keeper', ja: '遮断キーパー' },
  { level: 6, min: 2200, title: 'Pleg Master', ja: '心筋保護マスター' },
  { level: 7, min: 3300, title: 'Smooth Weaner', ja: 'スムーズ離脱' },
  { level: 8, min: 4800, title: 'Chief Perfusionist', ja: 'チーフ・パーフュージョニスト' },
]

export const XP = {
  drillCorrect: 10,
  drillWrong: 2,
  simTask: 15,
  simRealOrBonus: 1.5,
  speak: 5,
  review: 5,
  dialogue: 10,
  numberCorrect: 3,
  dailyGoalBonus: 20,
} as const

export const DAILY_GOAL_DEFAULT = 50

export function levelOf(xp: number): { current: LevelDef; next: LevelDef | null; progress: number } {
  let current = LEVELS[0]
  for (const l of LEVELS) if (xp >= l.min) current = l
  const next = LEVELS.find((l) => l.min > xp) ?? null
  const progress = next ? (xp - current.min) / (next.min - current.min) : 1
  return { current, next, progress }
}
