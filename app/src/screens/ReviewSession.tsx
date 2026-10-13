import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useSearch } from 'wouter'
import { X, Trophy, ArrowLeft } from 'lucide-react'
import { Bar, Button, Card } from '../components/ui'
import { QuestionView } from '../components/QuestionView'
import { PHRASES, PHRASE_BY_ID } from '../content'
import { buildReviewItem, type DrillQ } from '../engine/drills'
import { dueIds, today } from '../engine/srs'
import { shuffle } from '../engine/numbers'
import { useProgress } from '../store/progress'
import { useSettings } from '../store/settings'
import { XP } from '../engine/xp'
import { sfx } from '../engine/sfx'
import { stopSpeech } from '../engine/speech'

export default function ReviewSession() {
  const search = useSearch()
  const mode = new URLSearchParams(search).get('mode') ?? 'due'
  const [, navigate] = useLocation()
  const items = useProgress((s) => s.phrases)
  const gradePhrase = useProgress((s) => s.gradePhrase)
  const addXp = useProgress((s) => s.addXp)
  const bump = useProgress((s) => s.bump)
  const goal = useSettings((s) => s.dailyGoal)

  // セッション開始時の対象で固定する（回答で期限が変わっても問題が入れ替わらないように）
  const questions = useMemo<DrillQ[]>(() => {
    const known = Object.keys(items).filter((id) => PHRASE_BY_ID[id])
    let ids: string[]
    if (mode === 'weak') ids = known.filter((id) => items[id].wrong > 0).sort((a, b) => items[a].box - items[b].box).slice(0, 15)
    else if (mode === 'random') ids = shuffle(Math.random, known).slice(0, 10)
    else ids = dueIds(items, today()).filter((id) => PHRASE_BY_ID[id]).slice(0, 20)
    return ids
      .map((id) => buildReviewItem(PHRASE_BY_ID[id], PHRASES, Math.random, true))
      .filter((q): q is DrillQ => q !== null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  const [idx, setIdx] = useState(0)
  const [okCount, setOkCount] = useState(0)
  const answered = useRef(false)
  // 次の問題は先頭から見せる（画面は替わらず中身だけ替わるので、前の問題のスクロール位置が残る）
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [idx])

  const onAnswer = useCallback(
    (ok: boolean) => {
      if (answered.current) return
      answered.current = true
      const q = questions[idx]
      if (q.phraseId) gradePhrase(q.phraseId, ok)
      if (ok) setOkCount((n) => n + 1)
      if (q.kind === 'reply' && ok) bump('closedLoop')
      bump('reviewDone')
      addXp(ok ? XP.review : 1, goal)
    },
    [questions, idx, gradePhrase, bump, addXp, goal],
  )

  const onNext = useCallback(() => {
    stopSpeech()
    answered.current = false
    setIdx((i) => {
      if (i + 1 >= questions.length) sfx.levelUp()
      return i + 1
    })
  }, [questions.length])

  const done = idx >= questions.length
  return (
    <div className="min-h-full bg-bg">
      <header className="pt-safe sticky top-0 z-20 bg-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <button
            type="button"
            aria-label="やめる"
            onClick={() => {
              stopSpeech()
              navigate('/review')
            }}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-card"
          >
            <X size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-sub">復習{mode === 'weak' ? '（苦手）' : mode === 'random' ? '（ランダム）' : ''}</p>
            <Bar value={questions.length ? Math.min(idx, questions.length) / questions.length : 0} className="mt-1.5" color="var(--ven)" />
          </div>
          <span className="num text-sm font-bold text-sub">
            {Math.min(idx + 1, questions.length)}/{questions.length}
          </span>
        </div>
      </header>
      <main className="pb-safe-plus mx-auto max-w-2xl px-4">
        {questions.length === 0 && (
          <Card className="mt-8 p-6 text-center">
            <p className="font-bold">出題できる表現がありません</p>
            <Button className="mt-4" onClick={() => navigate('/review')}>
              戻る
            </Button>
          </Card>
        )}
        {!done && questions[idx] && <QuestionView key={idx} q={questions[idx]} onAnswer={onAnswer} onNext={onNext} />}
        {done && questions.length > 0 && (
          <div className="animate-pop mt-6">
            <Card className="p-6 text-center">
              <Trophy className="mx-auto text-warn" size={36} />
              <p className="mt-2 text-sm text-sub">復習おつかれさまでした</p>
              <p className="num mt-1 text-5xl font-extrabold">
                {okCount}/{questions.length}
              </p>
              <p className="mt-2 text-xs text-sub">正解した表現は次の出題まで間隔が延びます。</p>
            </Card>
            <Button block className="mt-4" variant="secondary" onClick={() => navigate('/review')}>
              <ArrowLeft size={16} /> 復習トップへ
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
