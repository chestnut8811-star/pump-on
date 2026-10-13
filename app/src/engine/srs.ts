// 間隔反復（Leitner 方式）。box が上がるほど出題間隔が延びる。
// 正解で box+1、不正解で box 1（翌日）に戻す。初出は box 0（当日中に復習対象）。

export const BOX_DAYS = [0, 1, 2, 4, 8, 16, 32] as const
export const MAX_BOX = BOX_DAYS.length - 1

export interface SrsItem {
  box: number
  /** 次に出題する日 YYYY-MM-DD */
  due: string
  seen: number
  right: number
  wrong: number
  /** 最後に回答した日 */
  last: string
}

/** ローカル日付 YYYY-MM-DD */
export function today(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDays(day: string, n: number): string {
  const [y, m, d] = day.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() + n)
  return today(dt)
}

/** 日付の差（b - a、日数） */
export function diffDays(a: string, b: string): number {
  const [y1, m1, d1] = a.split('-').map(Number)
  const [y2, m2, d2] = b.split('-').map(Number)
  const t1 = Date.UTC(y1, m1 - 1, d1)
  const t2 = Date.UTC(y2, m2 - 1, d2)
  return Math.round((t2 - t1) / 86400000)
}

/** 初めて出会ったフレーズを登録（当日中に復習対象） */
export function introduce(day: string): SrsItem {
  return { box: 0, due: day, seen: 0, right: 0, wrong: 0, last: '' }
}

/** 回答を反映する */
export function grade(item: SrsItem | undefined, correct: boolean, day: string): SrsItem {
  const base = item ?? introduce(day)
  const box = correct ? Math.min(base.box + 1, MAX_BOX) : 1
  return {
    box,
    due: addDays(day, BOX_DAYS[box]),
    seen: base.seen + 1,
    right: base.right + (correct ? 1 : 0),
    wrong: base.wrong + (correct ? 0 : 1),
    last: day,
  }
}

export function isDue(item: SrsItem, day: string): boolean {
  return item.due <= day
}

/** 期限が来ている ID を、期限の古い順・box の低い順に */
export function dueIds(items: Record<string, SrsItem>, day: string, limit = Infinity): string[] {
  return Object.entries(items)
    .filter(([, it]) => isDue(it, day))
    .sort(([, a], [, b]) => (a.due === b.due ? a.box - b.box : a.due < b.due ? -1 : 1))
    .slice(0, limit)
    .map(([id]) => id)
}

/** 習熟度 0〜1（box の平均 / 最大）。未学習は 0 として数える */
export function mastery(ids: string[], items: Record<string, SrsItem>): number {
  if (ids.length === 0) return 0
  const sum = ids.reduce((acc, id) => acc + (items[id]?.box ?? 0), 0)
  return sum / (ids.length * MAX_BOX)
}
