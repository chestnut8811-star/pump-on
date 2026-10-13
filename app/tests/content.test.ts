// 教材の整合性テスト。執筆ルール docs/content-guidelines.md を機械的に確かめる。
import { describe, expect, it } from 'vitest'
import { CASES, DIALOGUES, GLOSSARY, PHASES, PHRASES, PHRASE_BY_ID } from '../src/content'
import { ALL_PHASES, FLOW_PHASES } from '../src/content/phase-ids'
import { SOURCES } from '../src/content/sources'
import type { HudState, PhaseId } from '../src/content/types'
import { canonicalTokens, matchUtterance } from '../src/engine/match'
import { catchLabel } from '../src/engine/drills'
import { FLOW_SCRIPT } from '../src/content/flow-script'

const PREFIX: Record<PhaseId, string> = {
  basics: 'bas',
  prebypass: 'pre',
  cannulation: 'can',
  initiation: 'ini',
  venting: 'ven',
  cooling: 'coo',
  crossclamp: 'xcl',
  cardioplegia: 'ple',
  onbypass: 'onb',
  rewarming: 'rew',
  deairing: 'dea',
  weaning: 'wea',
  protamine: 'pro',
  't-pressure': 'tpr',
  't-air': 'tai',
  't-drainage': 'tdr',
  't-oxygenator': 'tox',
  't-power': 'tpw',
  't-anticoag': 'tac',
}

const JA = /[぀-ヿ㐀-鿿]/
const HUD_KEYS: (keyof HudState)[] = ['stage', 'flow', 'map', 'temp', 'act', 'svo2', 'linePressure', 'level', 'cpbStart', 'clampStart', 'plegAt', 'alarm']

function containsTokens(hay: string, needle: string): boolean {
  const h = canonicalTokens(hay)
  const n = canonicalTokens(needle)
  if (n.length === 0) return false
  for (let i = 0; i + n.length <= h.length; i++) if (n.every((t, k) => h[i + k] === t)) return true
  return false
}

describe('シーン', () => {
  it('すべてのシーンが定義されている', () => {
    expect(PHASES.map((p) => p.id).sort()).toEqual([...ALL_PHASES].sort())
  })
  it('出典IDが存在する', () => {
    for (const p of PHASES) for (const s of p.sources) expect(SOURCES).toHaveProperty(s)
  })
})

describe('フレーズ', () => {
  it('ID が一意で、シーン略号で始まる', () => {
    const ids = PHRASES.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const p of PHRASES) expect(p.id, p.id).toMatch(new RegExp(`^${PREFIX[p.phase]}-\\d{2}$`))
  })

  it('必須項目と言語の混在', () => {
    for (const p of PHRASES) {
      const where = `${p.id}: ${p.en}`
      expect(p.en.trim(), where).not.toBe('')
      expect(JA.test(p.en), `${where} en に日本語`).toBe(false)
      expect(JA.test(p.ja), `${where} ja が日本語でない`).toBe(true)
      expect(JA.test(p.when), `${where} when が日本語でない`).toBe(true)
      for (const v of p.variants) {
        expect(JA.test(v.en), `${where} variant に日本語: ${v.en}`).toBe(false)
        expect(v.en, `${where} variant が代表表現と同じ`).not.toBe(p.en)
      }
      for (const r of p.replies) {
        expect(JA.test(r.en), `${where} reply に日本語`).toBe(false)
        expect(JA.test(r.ja), `${where} reply.ja が日本語でない`).toBe(true)
        expect(/^(ok|okay|yes)\.?$/i.test(r.en.trim()), `${where} 内容のない返答: ${r.en}`).toBe(false)
      }
    }
  })

  it('simple の言い方が1つ以上ある', () => {
    for (const p of PHRASES) expect(p.variants.some((v) => v.register === 'simple'), `${p.id} に simple がない`).toBe(true)
  })

  it('相手のいる発話には返答がある', () => {
    for (const p of PHRASES) if (p.to !== 'all') expect(p.replies.length, `${p.id} に replies がない`).toBeGreaterThan(0)
  })

  it('数値・時刻のキーワードは本文に同じ表記で含まれる', () => {
    for (const p of PHRASES)
      for (const k of p.keywords)
        if (k.kind === 'number' || k.kind === 'time') expect(p.en.includes(k.en), `${p.id}: "${k.en}" が en にない`).toBe(true)
  })

  it('裏付けのルール', () => {
    for (const p of PHRASES) {
      if (p.evidence === 'constructed') {
        expect(p.notes?.some((n) => n.kind === 'verify'), `${p.id}: constructed なのに verify 注記がない`).toBe(true)
        expect(p.status, `${p.id}: constructed は needs-check`).toBe('needs-check')
      } else {
        expect(p.sources?.length ?? 0, `${p.id}: ${p.evidence} なのに sources がない`).toBeGreaterThan(0)
      }
      if (p.notes?.some((n) => n.kind === 'verify')) expect(p.status, `${p.id}: verify 注記があるのに needs-check でない`).toBe('needs-check')
      for (const v of p.variants) if (v.register === 'shorthand') expect(v.evidence, `${p.id}: shorthand「${v.en}」に evidence がない`).toBeDefined()
    }
  })
})

describe('会話', () => {
  it('ID 一意・行数・あなたの行・参照', () => {
    const ids = DIALOGUES.map((d) => d.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const d of DIALOGUES) {
      expect(d.lines.length, d.id).toBeGreaterThanOrEqual(4)
      expect(d.lines.filter((l) => l.role === 'perfusionist').length, `${d.id}: あなたの行が2つ未満`).toBeGreaterThanOrEqual(2)
      expect(JA.test(d.setting), d.id).toBe(true)
      for (const l of d.lines) {
        expect(JA.test(l.en), `${d.id}: en に日本語`).toBe(false)
        expect(JA.test(l.ja), `${d.id}: ja が日本語でない「${l.en}」`).toBe(true)
        if (l.phraseId) expect(PHRASE_BY_ID[l.phraseId], `${d.id}: 存在しない phraseId ${l.phraseId}`).toBeDefined()
      }
    }
  })
})

describe('症例（シミュレーター）', () => {
  it('課題が成立している', () => {
    const ids = CASES.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const c of CASES) {
      const beatIds = c.beats.map((b) => b.id)
      expect(new Set(beatIds).size, `${c.id}: beat id 重複`).toBe(beatIds.length)
      expect(c.beats.filter((b) => b.task).length, `${c.id}: 課題が少ない`).toBeGreaterThanOrEqual(4)
      for (const b of c.beats) {
        const where = `${c.id}/${b.id}`
        expect(ALL_PHASES, where).toContain(b.phase)
        if (b.clock) expect(b.clock, where).toMatch(/^\d{2}:\d{2}$/)
        if (b.hud) for (const k of Object.keys(b.hud)) expect(HUD_KEYS, `${where}: hud.${k}`).toContain(k)
        for (const l of [...(b.lines ?? []), ...(b.after ?? [])]) {
          expect(JA.test(l.en), `${where}: en に日本語`).toBe(false)
          expect(JA.test(l.ja), `${where}: ja が日本語でない`).toBe(true)
          if (l.phraseId) expect(PHRASE_BY_ID[l.phraseId], `${where}: ${l.phraseId}`).toBeDefined()
        }
        const t = b.task
        if (!t) continue
        for (const pid of t.phraseIds ?? []) expect(PHRASE_BY_ID[pid], `${where}: phraseId ${pid}`).toBeDefined()
        if (t.kind === 'respond') {
          expect(t.options.filter((o) => o.correct).length, `${where}: 正解は1つ`).toBe(1)
          expect(t.options.length, where).toBeGreaterThanOrEqual(3)
          expect(t.options.find((o) => o.correct)?.en, `${where}: model と正解の不一致`).toBe(t.model)
          for (const o of t.options) expect(JA.test(o.why), `${where}: why は日本語`).toBe(true)
        }
        if (t.kind === 'catch') {
          expect(t.options, where).toContain(t.answer)
          expect(new Set(t.options).size, where).toBe(t.options.length)
        }
        if (t.kind === 'speak') {
          expect(t.keywords.length, `${where}: keywords がない`).toBeGreaterThan(0)
          for (const k of t.keywords) expect(containsTokens(t.target, k), `${where}: keyword「${k}」が target にない`).toBe(true)
        }
      }
    }
  })
})

describe('会話リスト', () => {
  it('手術の流れのシーン順に、実在するフレーズを重複なく並べている（トラブル・基本は入れない）', () => {
    expect(FLOW_SCRIPT.map((s) => s.phase)).toEqual(FLOW_PHASES)
    const ids = FLOW_SCRIPT.flatMap((s) => s.ids)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) {
      const p = PHRASE_BY_ID[id]
      expect(p, id).toBeDefined()
      expect(FLOW_PHASES, `${id}: 手術の流れのフレーズではない`).toContain(p.phase)
    }
  })
})

describe('問題として成立するか', () => {
  it('数値キャッチの設問ラベルに答えの数値が出ない', () => {
    for (const p of PHRASES) {
      for (const k of p.keywords) {
        if ((k.kind !== 'number' && k.kind !== 'time') || !p.en.includes(k.en)) continue
        const label = catchLabel(k)
        const digits = k.en.replace(/[^0-9]/g, '')
        expect(label.replace(/[^0-9]/g, '').includes(digits), `${p.id}: 「${label}」に ${k.en}`).toBe(false)
      }
    }
  })
  it('発話課題のお手本と許容例は、そのまま言えば合格する', () => {
    for (const p of PHRASES) {
      const kws = p.keywords.map((k) => k.en).filter((k) => p.en.toLowerCase().includes(k.toLowerCase()))
      const accept = p.variants.filter((v) => v.register !== 'shorthand').map((v) => v.en)
      for (const said of [p.en, ...accept]) expect(matchUtterance(said, p.en, kws, accept).pass, `${p.id}: ${said}`).toBe(true)
    }
    for (const c of CASES) {
      for (const b of c.beats) {
        const t = b.task
        if (t?.kind !== 'speak') continue
        for (const said of [t.target, ...(t.accept ?? [])]) {
          expect(matchUtterance(said, t.target, t.keywords, t.accept).pass, `${c.id}/${b.id}: ${said}`).toBe(true)
        }
      }
    }
  })
})

describe('用語集', () => {
  it('用語が一意で説明がある', () => {
    const terms = GLOSSARY.map((g) => g.term.toLowerCase())
    expect(new Set(terms).size).toBe(terms.length)
    for (const g of GLOSSARY) {
      expect(JA.test(g.ja), g.term).toBe(true)
      expect(JA.test(g.desc), g.term).toBe(true)
    }
  })
})
