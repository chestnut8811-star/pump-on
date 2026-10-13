import { describe, expect, it } from 'vitest'
import { canonicalTokens, matchUtterance } from '../src/engine/match'

describe('発話の照合', () => {
  it('数字の書き方の揺れをそろえる', () => {
    expect(canonicalTokens('ACT is four eighty')).toEqual(['act', 'is', '480'])
    expect(canonicalTokens('ACT is four hundred and eighty')).toEqual(['act', 'is', '480'])
    expect(canonicalTokens('ACT is 480.')).toEqual(['act', 'is', '480'])
    expect(canonicalTokens('Clamp on at 09:42')).toEqual(['clamp', 'on', 'at', '942'])
    expect(canonicalTokens('clamp on at nine forty-two')).toEqual(['clamp', 'on', 'at', '942'])
    expect(canonicalTokens('ten oh five')).toEqual(['1005'])
    expect(canonicalTokens('10:05')).toEqual(['1005'])
    expect(canonicalTokens('four point five liters')).toEqual(['4.5', 'liters'])
    expect(canonicalTokens('Give a hundred')).toEqual(['give', '100'])
    expect(canonicalTokens('thirty thousand units')).toEqual(['30000', 'units'])
    expect(canonicalTokens('30,000 units')).toEqual(['30000', 'units'])
    expect(canonicalTokens("eleven o'clock")).toEqual(['1100'])
    expect(canonicalTokens("Flow's coming down")).toEqual(['flow', 'coming', 'down'])
    expect(canonicalTokens("Level's back.")).toEqual(['level', 'back'])
  })
  it('必須語がそろえば合格', () => {
    const r = matchUtterance('cross clamp on at nine forty two', 'Cross-clamp on at 09:42.', ['clamp on', '09:42'])
    expect(r.pass).toBe(true)
    expect(r.hits.every((h) => h.hit)).toBe(true)
  })
  it('数値が違えば不合格', () => {
    const r = matchUtterance('cross clamp on at nine fifty two', 'Cross-clamp on at 09:42.', ['clamp on', '09:42'])
    expect(r.pass).toBe(false)
    expect(r.hits.find((h) => h.keyword === '09:42')?.hit).toBe(false)
  })
  it('許容例でも合格できる', () => {
    const r = matchUtterance('pump suckers are off', 'Suckers off.', ['off'], ['Pump suckers are off.'])
    expect(r.pass).toBe(true)
  })
  it('意味が逆（on/off・否定）なら、必須語がそろっていても不合格', () => {
    const r = matchUtterance('All clamps are on. Kinks in the line.', 'All clamps are off. No kinks in the line.', ['clamps', 'kinks'])
    expect(r.pass).toBe(false)
    expect(r.conflicts).toContain('off')
    expect(matchUtterance('Flow back down.', 'Flow back up.', ['flow']).pass).toBe(false)
    expect(matchUtterance('All clamps are off. No kinks in the line.', 'All clamps are off. No kinks in the line.', ['clamps', 'kinks']).pass).toBe(true)
  })
  it('数値が違えば、ほかが合っていても不合格', () => {
    const r = matchUtterance(
      'Mean is 54. May I give phenylephrine 100 micrograms into the circuit?',
      'Mean is 44. May I give phenylephrine 100 micrograms into the circuit?',
      ['Mean', 'phenylephrine', '100', 'micrograms', 'circuit', 'May I'],
    )
    expect(r.pass).toBe(false)
    expect(r.conflicts).toContain('44')
  })
  it('許容例は、その文に含まれる必須語だけで採点する', () => {
    const r = matchUtterance('Are the lungs back on?', 'Anesthesia, are we ventilating?', ['ventilating'], ['Are the lungs back on?'])
    expect(r.pass).toBe(true)
    expect(matchUtterance('Are the lungs off?', 'Anesthesia, are we ventilating?', ['ventilating'], ['Are the lungs back on?']).pass).toBe(false)
  })
  it('数値の順番の入れ替え・否定の抜けは不合格', () => {
    expect(matchUtterance('Naso is 35.1, bladder 36.4.', 'Naso is 36.4, bladder 35.1.', ['36.4', '35.1', 'Naso']).pass).toBe(false)
    expect(matchUtterance('Naso is 36.4, bladder 35.1.', 'Naso is 36.4, bladder 35.1.', ['36.4', '35.1', 'Naso']).pass).toBe(true)
    expect(matchUtterance('No clamps, kinks.', 'All clamps are off. No kinks in the line.', ['clamps', 'kinks'], ['No clamps, no kinks.']).pass).toBe(false)
  })
  it('同じ数の別の書き方（4.0 と 4）は同じとみなす', () => {
    expect(canonicalTokens('four point zero liters')).toEqual(['4', 'liters'])
    expect(matchUtterance("I'm coming down to four point zero liters.", "I'm coming down to 4 liters.", ['4']).pass).toBe(true)
  })
  it('言い換えで on/up を省くのは許す（逆の語だけを不合格にする）', () => {
    const r = matchUtterance('Can I increase the flow to 4.8?', 'Can I bring the flow up to 4.8?', ['flow', '4.8'])
    expect(r.conflicts).toEqual([])
  })
})
