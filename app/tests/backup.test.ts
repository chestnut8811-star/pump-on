import { describe, expect, it } from 'vitest'
import { parseBackup } from '../src/store/backup'

const validProgress = () => ({
  version: 1,
  xp: 120,
  streak: { current: 2, best: 5, lastDay: '2026-10-12' },
  daily: { '2026-10-12': 40 },
  phrases: { 'pre-01': { box: 2, due: '2026-10-14', seen: 3, right: 2, wrong: 1, last: '2026-10-12' } },
  phases: { prebypass: { drillBest: 80, drillRuns: 2, dialoguesDone: ['pre-d1'], visited: true } },
  sims: { 'cabg-standard': { bestScore: 72, bestRank: 'B', runs: 1, cleared: ['guided'] } },
  counters: { plays: 10, spoken: 3, closedLoop: 1, numbersRight: 4, reviewDone: 0, drills: 2, sims: 1, nightOwl: 0 },
  badges: { first: '2026-10-12' },
  onboarded: true,
  last: { path: '/phase/prebypass', label: 'シーン: 体外循環前' },
})

describe('学習記録の読み込み', () => {
  it('書き出した形はそのまま読める', () => {
    const b = parseBackup({ app: 'pump-on', version: 1, progress: validProgress(), settings: { theme: 'dark', rate: 1 } })
    expect(b).not.toBeNull()
    expect(b!.progress.phrases['pre-01'].box).toBe(2)
    expect(b!.settings).toEqual({ theme: 'dark', rate: 1 })
  })
  it('中身の型が違うファイルは拒否する（既存の記録を上書きしない）', () => {
    expect(parseBackup({ app: 'pump-on', version: 1, progress: { phrases: null } })).toBeNull()
    const broken = validProgress() as Record<string, unknown>
    broken.phrases = { 'pre-01': { box: 'x' } }
    expect(parseBackup({ app: 'pump-on', version: 1, progress: broken })).toBeNull()
    expect(parseBackup({ app: 'other', version: 1, progress: validProgress() })).toBeNull()
    expect(parseBackup('not json object')).toBeNull()
  })
  it('設定は正しい項目だけを取り込み、範囲外の値は丸める', () => {
    const b = parseBackup({ app: 'pump-on', version: 1, progress: validProgress(), settings: { theme: 'neon', rate: 9, sfx: false, extra: 1 } })
    expect(b!.settings).toEqual({ rate: 1.3, sfx: false })
  })
  it('既定のモードがフルオートの設定も読める（知らないモードは捨てる）', () => {
    expect(parseBackup({ app: 'pump-on', version: 1, progress: validProgress(), settings: { simMode: 'auto' } })!.settings).toEqual({ simMode: 'auto' })
    expect(parseBackup({ app: 'pump-on', version: 1, progress: validProgress(), settings: { simMode: 'turbo' } })!.settings).toEqual({})
  })
  it('古い書き出しに無いカウンターは 0 で補う', () => {
    const old = validProgress() as Record<string, unknown>
    old.counters = { plays: 1 }
    const b = parseBackup({ app: 'pump-on', version: 1, progress: old })
    expect(b!.progress.counters.nightOwl).toBe(0)
    expect(b!.progress.counters.plays).toBe(1)
  })
})
