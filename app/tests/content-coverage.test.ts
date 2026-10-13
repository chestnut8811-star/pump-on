// 教材の網羅テスト: 全シーンに必要な分量がそろっているか、症例の課題が復習と結ばれているか。
import { describe, expect, it } from 'vitest'
import { CASES, DIALOGUES, GLOSSARY, PHASES, PHRASES } from '../src/content'

describe('網羅', () => {
  it('各シーンにフレーズと会話がある', () => {
    for (const ph of PHASES) {
      const list = PHRASES.filter((p) => p.phase === ph.id)
      const min = ph.group === 'trouble' ? 5 : 6
      expect(list.length, `${ph.id}: フレーズ ${list.length}`).toBeGreaterThanOrEqual(min)
      expect(DIALOGUES.filter((d) => d.phase === ph.id).length, `${ph.id}: 会話がない`).toBeGreaterThanOrEqual(1)
    }
  })

  it('手術の流れのシーンには「聞く」と「話す」の両方がある', () => {
    for (const ph of PHASES.filter((p) => p.group === 'flow')) {
      const list = PHRASES.filter((p) => p.phase === ph.id)
      expect(list.some((p) => p.speaker === 'perfusionist'), `${ph.id}: 話す（あなた）がない`).toBe(true)
      expect(list.some((p) => p.speaker !== 'perfusionist'), `${ph.id}: 聞く（相手）がない`).toBe(true)
    }
  })

  it('用語集が十分にある', () => {
    expect(GLOSSARY.length).toBeGreaterThanOrEqual(50)
  })

  it('症例の課題（選ぶ・話す）は復習用のフレーズと結ばれている', () => {
    for (const c of CASES)
      for (const b of c.beats)
        if (b.task && b.task.kind !== 'catch') expect(b.task.phraseIds?.length ?? 0, `${c.id}/${b.id}: phraseIds がない`).toBeGreaterThan(0)
  })
})
