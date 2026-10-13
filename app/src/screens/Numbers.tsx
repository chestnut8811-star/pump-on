import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'wouter'
import { X, Volume2, Check, Zap, RotateCcw, Trophy } from 'lucide-react'
import { Bar, Button, Card, Segmented } from '../components/ui'
import { useSpeak, Wave } from '../components/audio'
import { NUMBER_KINDS, makeNumberItem, type NumberItem, type NumberKind } from '../engine/numbers'
import type { RoleId } from '../content/types'
import { ROLES } from '../content/roles'
import { useProgress } from '../store/progress'
import { useSettings } from '../store/settings'
import { XP } from '../engine/xp'
import { sfx } from '../engine/sfx'
import { stopSpeech, unlockSpeech } from '../engine/speech'

const ROUNDS = 10
const SPEAKERS: RoleId[] = ['surgeon', 'anesthesiologist', 'nurse', 'assistant']
type Speed = 'normal' | 'fast'

export default function Numbers() {
  const [, navigate] = useLocation()
  const [started, setStarted] = useState(false)
  const [speed, setSpeed] = useState<Speed>('normal')
  const [kinds, setKinds] = useState<NumberKind[]>(Object.keys(NUMBER_KINDS) as NumberKind[])
  const [round, setRound] = useState(0)
  const [seed, setSeed] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [right, setRight] = useState(0)
  const [combo, setCombo] = useState(0)
  const [best, setBest] = useState(0)
  const { play, playingKey } = useSpeak()
  const addXp = useProgress((s) => s.addXp)
  const bump = useProgress((s) => s.bump)
  const goal = useSettings((s) => s.dailyGoal)

  const items = useMemo(() => {
    void seed
    return Array.from({ length: ROUNDS }, (_, i): NumberItem & { role: RoleId } => ({
      ...makeNumberItem(kinds[Math.floor(Math.random() * kinds.length)]),
      role: SPEAKERS[i % SPEAKERS.length],
    }))
  }, [kinds, seed])
  const item = items[round]
  const done = round >= ROUNDS
  const rateMul = speed === 'fast' ? 1.25 : 1

  const say = useCallback(() => {
    if (!item) return
    void play(`num:${seed}:${round}`, { text: item.sentence, role: item.role, tts: item.speech }, rateMul)
  }, [item, play, seed, round, rateMul])

  useEffect(() => {
    if (!started || done) return
    const t = setTimeout(say, 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, round, seed])

  useEffect(() => () => stopSpeech(), [])

  function choose(o: string) {
    if (picked !== null || !item) return
    setPicked(o)
    if (o === item.answer) {
      sfx.correct()
      setRight((n) => n + 1)
      setCombo((c) => {
        const n = c + 1
        setBest((b) => Math.max(b, n))
        return n
      })
      bump('numbersRight')
      addXp(XP.numberCorrect, goal)
    } else {
      sfx.wrong()
      setCombo(0)
    }
  }

  function next() {
    stopSpeech()
    setPicked(null)
    setRound((r) => r + 1)
  }

  function restart() {
    setSeed((s) => s + 1)
    setRound(0)
    setRight(0)
    setCombo(0)
    setPicked(null)
  }

  return (
    <div className="min-h-full bg-bg">
      <header className="pt-safe sticky top-0 z-20 bg-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <button type="button" aria-label="閉じる" onClick={() => navigate('/learn')} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-card">
            <X size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-sub">数値キャッチ</p>
            {started && <Bar value={Math.min(round, ROUNDS) / ROUNDS} className="mt-1.5" color="var(--art)" />}
          </div>
          {started && !done && (
            <span className="inline-flex items-center gap-1 rounded-full bg-art-soft px-2.5 py-1 text-xs font-bold text-art">
              <Zap size={12} /> {combo}
            </span>
          )}
        </div>
      </header>

      <main className="pb-safe-plus mx-auto max-w-2xl px-4">
        {!started && (
          <div className="mt-4 space-y-4">
            <Card className="p-5">
              <p className="text-lg font-extrabold">現場の読み方で、数字を聞き取る</p>
              <p className="mt-2 text-sm leading-relaxed text-sub">
                手術室では “four-eighty”（480）や “nine forty-two”（9:42）のように数字を短く読みます。<b>fifteen / fifty</b> のような聞き間違えやすい組み合わせも出ます。
              </p>
              <p className="mt-2 text-xs text-faint">値はランダムに作った例で、臨床の目標値ではありません。</p>
            </Card>
            <div>
              <p className="mb-1.5 px-1 text-sm font-bold">速さ</p>
              <Segmented<Speed> value={speed} onChange={setSpeed} options={[{ value: 'normal', label: 'ふつう' }, { value: 'fast', label: '速い（本番）' }]} />
            </div>
            <div>
              <p className="mb-1.5 px-1 text-sm font-bold">出題する数値</p>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(NUMBER_KINDS) as NumberKind[]).map((k) => {
                  const on = kinds.includes(k)
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setKinds(on ? (kinds.length > 1 ? kinds.filter((x) => x !== k) : kinds) : [...kinds, k])}
                      className={`min-h-11 rounded-full px-3 py-1.5 text-[13px] font-bold ${on ? 'bg-navy text-white' : 'border border-line bg-card text-sub'}`}
                    >
                      {NUMBER_KINDS[k].ja}
                    </button>
                  )
                })}
              </div>
            </div>
            <Button
              block
              size="lg"
              onClick={() => {
                unlockSpeech()
                setStarted(true)
              }}
            >
              スタート（{ROUNDS}問）
            </Button>
          </div>
        )}

        {started && !done && item && (
          <div className="mt-4">
            <Card className="flex flex-col items-center gap-3 p-6">
              <p className="text-sm text-sub">
                <span className="font-bold" style={{ color: ROLES[item.role].color }}>
                  {ROLES[item.role].ja}
                </span>
                ・{NUMBER_KINDS[item.kind].ja}
              </p>
              <button
                type="button"
                onClick={say}
                className={`flex h-20 w-20 items-center justify-center rounded-full text-white shadow-card active:scale-95 ${playingKey?.startsWith('num:') ? 'bg-navy' : 'bg-art'}`}
                aria-label="もう一度聞く"
              >
                {playingKey?.startsWith('num:') ? <Wave /> : <Volume2 size={34} />}
              </button>
              {picked !== null && <p className="en animate-pop text-center text-lg font-bold">{item.sentence}</p>}
            </Card>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {item.options.map((o) => {
                const isAns = o === item.answer
                const st = picked === null ? 'border-line bg-card' : isAns ? 'border-ok bg-ok-soft' : picked === o ? 'border-ng bg-ng-soft' : 'border-line bg-card opacity-50'
                return (
                  <button
                    key={o}
                    type="button"
                    onClick={() => choose(o)}
                    className={`num min-h-16 rounded-2xl border-2 text-2xl font-extrabold transition active:scale-[0.98] ${st}`}
                  >
                    {o}
                    {NUMBER_KINDS[item.kind].unit && <span className="ml-1 text-xs font-normal text-sub">{NUMBER_KINDS[item.kind].unit}</span>}
                  </button>
                )
              })}
            </div>
            {picked !== null && (
              <Button block size="lg" className="animate-pop mt-4" onClick={next}>
                {picked === item.answer ? <Check size={20} /> : null}
                次へ
              </Button>
            )}
          </div>
        )}

        {done && (
          <div className="animate-pop mt-6">
            <Card className="p-6 text-center">
              <Trophy className="mx-auto text-warn" size={36} />
              <p className="num mt-2 text-5xl font-extrabold">
                {right}/{ROUNDS}
              </p>
              <p className="mt-1 text-sm text-sub">最大コンボ {best}</p>
            </Card>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => navigate('/learn')}>
                もどる
              </Button>
              <Button onClick={restart}>
                <RotateCcw size={16} /> もう一度
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
