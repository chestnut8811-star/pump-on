import { useCallback, useMemo, useRef, useState } from 'react'
import { useLocation, useParams } from 'wouter'
import { X, Trophy, RotateCcw, ArrowLeft } from 'lucide-react'
import { Bar, Button, Card } from '../components/ui'
import { QuestionView } from '../components/QuestionView'
import { AudioButton } from '../components/audio'
import { PHASE_BY_ID, PHRASES, PHRASE_BY_ID, dialoguesOf, phrasesOf } from '../content'
import type { PhaseId } from '../content/types'
import { buildDrill, type DrillQ } from '../engine/drills'
import { useProgress } from '../store/progress'
import { useSettings } from '../store/settings'
import { XP } from '../engine/xp'
import { sfx } from '../engine/sfx'
import { stopSpeech } from '../engine/speech'
import NotFound from './NotFound'

export default function Drill() {
  const { phase: phaseId } = useParams<{ phase: string }>()
  const phase = PHASE_BY_ID[phaseId as PhaseId]
  const [, navigate] = useLocation()
  const [seed, setSeed] = useState(1)
  const questions = useMemo<DrillQ[]>(() => {
    if (!phase) return []
    void seed
    return buildDrill(phrasesOf(phase.id), dialoguesOf(phase.id), PHRASES, Math.random)
  }, [phase, seed])
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<{ q: DrillQ; ok: boolean }[]>([])
  const answered = useRef(false)
  const gradePhrase = useProgress((s) => s.gradePhrase)
  const addXp = useProgress((s) => s.addXp)
  const bump = useProgress((s) => s.bump)
  const recordDrill = useProgress((s) => s.recordDrill)
  const meet = useProgress((s) => s.meet)
  const goal = useSettings((s) => s.dailyGoal)

  const onAnswer = useCallback(
    (ok: boolean) => {
      if (answered.current) return
      answered.current = true
      const q = questions[idx]
      setAnswers((a) => [...a, { q, ok }])
      if (q.phraseId) {
        meet([q.phraseId])
        gradePhrase(q.phraseId, ok)
      }
      if (q.kind === 'reply' && ok) bump('closedLoop')
      addXp(ok ? XP.drillCorrect : XP.drillWrong, goal)
    },
    [questions, idx, meet, gradePhrase, bump, addXp, goal],
  )

  const done = idx >= questions.length && questions.length > 0
  const onNext = useCallback(() => {
    stopSpeech()
    answered.current = false
    const next = idx + 1
    setIdx(next)
    if (next >= questions.length) {
      const correct = answers.filter((a) => a.ok).length
      recordDrill(phase.id, Math.round((correct / questions.length) * 100))
      sfx.levelUp()
    }
  }, [idx, questions.length, answers, recordDrill, phase])

  if (!phase) return <NotFound />

  const correct = answers.filter((a) => a.ok).length
  const pct = questions.length ? Math.round((correct / questions.length) * 100) : 0
  const missed = answers.filter((a) => !a.ok && a.q.phraseId).map((a) => PHRASE_BY_ID[a.q.phraseId!]).filter(Boolean)

  return (
    <div className="min-h-full bg-bg">
      <header className="pt-safe sticky top-0 z-20 bg-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <button
            type="button"
            aria-label="やめる"
            onClick={() => {
              stopSpeech()
              navigate(`/phase/${phase.id}/drill`)
            }}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-card"
          >
            <X size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-sub">ドリル・{phase.titleJa}</p>
            <Bar value={questions.length ? Math.min(idx, questions.length) / questions.length : 0} className="mt-1.5" />
          </div>
          <span className="num text-sm font-bold text-sub">
            {Math.min(idx + 1, questions.length)}/{questions.length}
          </span>
        </div>
      </header>

      <main className="pb-safe-plus mx-auto max-w-2xl px-4">
        {questions.length === 0 && <p className="mt-10 text-center text-sub">このシーンのフレーズは準備中です。</p>}
        {!done && questions[idx] && <QuestionView key={`${seed}-${idx}`} q={questions[idx]} onAnswer={onAnswer} onNext={onNext} />}
        {done && (
          <div className="animate-pop mt-6">
            <Card className="p-6 text-center">
              <Trophy className="mx-auto text-warn" size={36} />
              <p className="mt-2 text-sm text-sub">{phase.titleJa}のドリル</p>
              <p className="num mt-1 text-5xl font-extrabold">{pct}%</p>
              <p className="mt-1 text-sm text-sub">
                {questions.length}問中 {correct}問正解
              </p>
            </Card>
            {missed.length > 0 && (
              <Card className="mt-4 p-4">
                <p className="text-sm font-bold">復習に入った表現</p>
                <ul className="mt-2 space-y-2">
                  {missed.map((p) => (
                    <li key={p.id} className="flex items-center gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="en text-[15px] font-semibold leading-snug">{p.en}</p>
                        <p className="text-xs text-sub">{p.ja}</p>
                      </div>
                      <AudioButton k={`miss:${p.id}`} item={{ text: p.en, role: p.speaker, tts: p.tts }} size="sm" tone="light" />
                    </li>
                  ))}
                </ul>
              </Card>
            )}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => navigate(`/phase/${phase.id}`)}>
                <ArrowLeft size={16} /> シーンへ
              </Button>
              <Button
                onClick={() => {
                  setSeed(seed + 1)
                  setIdx(0)
                  setAnswers([])
                  answered.current = false
                }}
              >
                <RotateCcw size={16} /> もう一度
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
