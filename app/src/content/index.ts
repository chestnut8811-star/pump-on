// 教材の集約。フレーズ・会話・症例はシーンごとのファイルから集める（明示的に import する）。

import type { Dialogue, GlossaryEntry, Phase, PhaseId, Phrase, SimCase } from './types'
import { PHASES } from './phases'
import { GLOSSARY } from './glossary'
import { ALL_PHRASES } from './phrases'
import { ALL_DIALOGUES } from './dialogues'
import { ALL_CASES } from './cases'

export { PHASES, GLOSSARY }
export const PHRASES: Phrase[] = ALL_PHRASES
export const DIALOGUES: Dialogue[] = ALL_DIALOGUES
export const CASES: SimCase[] = ALL_CASES

export const PHASE_BY_ID = Object.fromEntries(PHASES.map((p) => [p.id, p])) as Record<PhaseId, Phase>
export const PHRASE_BY_ID: Record<string, Phrase> = Object.fromEntries(PHRASES.map((p) => [p.id, p]))
export const DIALOGUE_BY_ID: Record<string, Dialogue> = Object.fromEntries(DIALOGUES.map((d) => [d.id, d]))
export const CASE_BY_ID: Record<string, SimCase> = Object.fromEntries(CASES.map((c) => [c.id, c]))

export function phrasesOf(phase: PhaseId): Phrase[] {
  return PHRASES.filter((p) => p.phase === phase)
}

export function dialoguesOf(phase: PhaseId): Dialogue[] {
  return DIALOGUES.filter((d) => d.phase === phase)
}

export const GLOSSARY_SORTED: GlossaryEntry[] = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, 'en'))

/** 監修状態の集計（このアプリについて画面で表示） */
export function contentStats() {
  const items = [...PHRASES, ...DIALOGUES, ...CASES, ...PHASES, ...GLOSSARY]
  const count = (s: string) => items.filter((i) => i.status === s).length
  return {
    phrases: PHRASES.length,
    dialogues: DIALOGUES.length,
    cases: CASES.length,
    glossary: GLOSSARY.length,
    aiDraft: count('ai-draft'),
    needsCheck: count('needs-check'),
    reviewed: count('reviewed'),
  }
}
