import { describe, expect, it } from 'vitest'
import { makeNumberItem, NUMBER_KINDS, numberToWords, sayCompact, sayDecimal, sayTime, type NumberKind } from '../src/engine/numbers'
import { nearNumbers } from '../src/engine/drills'

function seeded(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 2 ** 32
  }
}

describe('数値の読み', () => {
  it('英単語', () => {
    expect(numberToWords(0)).toBe('zero')
    expect(numberToWords(42)).toBe('forty-two')
    expect(numberToWords(480)).toBe('four hundred eighty')
    expect(numberToWords(30000)).toBe('thirty thousand')
  })
  it('現場読み（3桁）', () => {
    expect(sayCompact(480)).toBe('four eighty')
    expect(sayCompact(405)).toBe('four oh five')
    expect(sayCompact(500)).toBe('five hundred')
    expect(sayCompact(100)).toBe('a hundred')
    expect(sayCompact(250)).toBe('two fifty')
    expect(sayCompact(60)).toBe('sixty')
  })
  it('小数', () => {
    expect(sayDecimal(4.5)).toBe('four point five')
    expect(sayDecimal(36.5)).toBe('thirty-six point five')
    expect(sayDecimal(2)).toBe('two')
  })
  it('時刻', () => {
    expect(sayTime('09:42')).toBe('nine forty-two')
    expect(sayTime('10:05')).toBe('ten oh five')
    expect(sayTime('11:00')).toBe("eleven o'clock")
    expect(sayTime('13:15')).toBe('one fifteen')
  })
})

describe('数値キャッチの問題生成', () => {
  const kinds = Object.keys(NUMBER_KINDS) as NumberKind[]
  it('全種類で、正解を含む重複のない4択ができる', () => {
    for (const kind of kinds) {
      for (let seed = 1; seed <= 200; seed++) {
        const item = makeNumberItem(kind, seeded(seed * 31 + kind.length))
        expect(item.options).toContain(item.answer)
        expect(new Set(item.options).size).toBe(item.options.length)
        expect(item.options.length).toBe(4)
        expect(item.sentence).toContain(item.answer)
        expect(item.speech).not.toMatch(/\{v\}/)
      }
    }
  })
  it('選択肢は現実的な範囲に収まる（例として出す値でもありえない数は出さない）', () => {
    const range: Partial<Record<NumberKind, [number, number]>> = {
      flow: [0.5, 7],
      map: [13, 120], // 60 ↔ 16 のような teen/ty の聞き違いは意図した選択肢
      act: [100, 999],
      temp: [15, 40],
      hb: [4, 16],
      k: [2, 8],
      svo2: [13, 100],
      heparin: [5000, 40000],
      linePressure: [50, 500],
      clampTime: [1, 240],
      joules: [5, 20],
    }
    for (const [kind, [lo, hi]] of Object.entries(range) as [NumberKind, [number, number]][]) {
      for (let seed = 1; seed <= 300; seed++) {
        const item = makeNumberItem(kind, seeded(seed * 7 + 3))
        for (const o of item.options) {
          const v = Number(o.replace(/,/g, ''))
          expect(v, `${kind}: ${o}`).toBeGreaterThanOrEqual(lo)
          expect(v, `${kind}: ${o}`).toBeLessThanOrEqual(hi)
        }
      }
    }
  })
  it('時刻の選択肢は 00:00〜23:59 の正しい時刻だけ', () => {
    for (let seed = 1; seed <= 500; seed++) {
      const item = makeNumberItem('time', seeded(seed * 13 + 5))
      for (const o of item.options) {
        const m = /^(\d{2}):(\d{2})$/.exec(o)
        expect(m, o).not.toBeNull()
        expect(Number(m![1]), o).toBeLessThan(24)
        expect(Number(m![2]), o).toBeLessThan(60)
      }
    }
    for (let mm = 0; mm < 60; mm++) {
      const v = `09:${String(mm).padStart(2, '0')}`
      for (const o of nearNumbers(v, seeded(mm + 1))) expect(Number(o.split(':')[1]), `${v} → ${o}`).toBeLessThan(60)
    }
  })
  it('ACT は現場読みで読み上げる', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const item = makeNumberItem('act', seeded(seed))
      expect(item.speech).toMatch(/^A C T/)
      expect(item.speech).not.toMatch(/\d/)
    }
  })
})
