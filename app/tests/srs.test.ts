import { describe, expect, it } from 'vitest'
import { addDays, diffDays, dueIds, grade, introduce, mastery, MAX_BOX } from '../src/engine/srs'

describe('間隔反復', () => {
  it('日付計算', () => {
    expect(addDays('2026-10-12', 1)).toBe('2026-10-13')
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
    expect(diffDays('2026-10-12', '2026-10-20')).toBe(8)
  })
  it('正解で間隔が延び、不正解で翌日に戻る', () => {
    let it1 = grade(undefined, true, '2026-10-12')
    expect(it1.box).toBe(1)
    expect(it1.due).toBe('2026-10-13')
    it1 = grade(it1, true, '2026-10-13')
    expect(it1.box).toBe(2)
    expect(it1.due).toBe('2026-10-15')
    it1 = grade(it1, false, '2026-10-15')
    expect(it1.box).toBe(1)
    expect(it1.due).toBe('2026-10-16')
    expect(it1.seen).toBe(3)
    expect(it1.wrong).toBe(1)
  })
  it('box は上限で止まる', () => {
    let x = introduce('2026-01-01')
    for (let i = 0; i < 20; i++) x = grade(x, true, '2026-01-01')
    expect(x.box).toBe(MAX_BOX)
  })
  it('期限の来たものを古い順に', () => {
    const items = {
      a: { ...introduce('2026-10-10'), box: 2 },
      b: { ...introduce('2026-10-12'), box: 1 },
      c: { ...introduce('2026-10-20'), box: 1 },
      d: { ...introduce('2026-10-10'), box: 1 },
    }
    expect(dueIds(items, '2026-10-12')).toEqual(['d', 'a', 'b'])
    expect(mastery(['a', 'b', 'zz'], items)).toBeCloseTo(3 / (3 * MAX_BOX))
  })
})
