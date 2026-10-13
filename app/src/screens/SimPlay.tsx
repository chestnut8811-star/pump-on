import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useParams, useSearch } from 'wouter'
import { X, RotateCcw, ClipboardList, Check, ChevronRight, Volume2, Timer, Trophy, ArrowLeft } from 'lucide-react'
import { CASE_BY_ID, PHASE_BY_ID, PHRASE_BY_ID } from '../content'
import type { Beat, DialogueLine, PhaseId, SimTask } from '../content/types'
import { ROLES } from '../content/roles'
import { HudPanel } from '../components/HudPanel'
import { SpeakPanel } from '../components/SpeakPanel'
import { AudioButton, useSpeak, Wave } from '../components/audio'
import { RoleAvatar, NoteList, RegisterTag } from '../components/content'
import { PumpRotor } from '../components/brand'
import { Button, Segmented } from '../components/ui'
import { MODE_META, clockAt, hudAt, phaseRange, scoreRun, timeLimitFor, type SimMode, type TaskResult, type SimScore } from '../engine/sim'
import { useProgress } from '../store/progress'
import { useSettings } from '../store/settings'
import { XP } from '../engine/xp'
import { sfx, startAmbient, stopAmbient, unlockAudio } from '../engine/sfx'
import { stopSpeech, unlockSpeech } from '../engine/speech'
import { shuffle } from '../engine/numbers'
import NotFound from './NotFound'

type LogEntry =
  | { k: 'narr'; text: string }
  | { k: 'line'; line: DialogueLine; beat: number; idx: number }
  | { k: 'mine'; text: string; ok: boolean | null }
  | { k: 'fb'; beat: number; ok: boolean; timedOut: boolean; why: string; model?: string; modelJa?: string; modelTts?: string; task: SimTask }

type Stage = 'intro' | 'lines' | 'task' | 'resolved' | 'idle' | 'done'

interface WakeLockLike {
  release: () => Promise<void>
}

export default function SimPlay() {
  const { id } = useParams<{ id: string }>()
  const search = useSearch()
  const c = CASE_BY_ID[id]
  // シーン指定は、その症例に含まれるシーンのときだけ使う（無効な値は症例全体として扱う）
  const rawPhase = new URLSearchParams(search).get('phase')
  const phaseParam =
    c && rawPhase && Object.prototype.hasOwnProperty.call(PHASE_BY_ID, rawPhase) && phaseRange(c, rawPhase as PhaseId) ? (rawPhase as PhaseId) : null
  const [, navigate] = useLocation()
  const defaultMode = useSettings((s) => s.simMode)
  const setSetting = useSettings((s) => s.set)
  const orNoise = useSettings((s) => s.orNoise)
  const goal = useSettings((s) => s.dailyGoal)
  const [mode, setMode] = useState<SimMode>(defaultMode)
  const range = useMemo<[number, number]>(() => {
    if (!c) return [0, 0]
    const r = phaseParam ? phaseRange(c, phaseParam) : null
    return r ?? [0, c.beats.length]
  }, [c, phaseParam])

  const [stage, setStage] = useState<Stage>('intro')
  const [beatIdx, setBeatIdx] = useState(range[0])
  const [log, setLog] = useState<LogEntry[]>([])
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  /** 課題を終えた（または課題のない）ビート: 字幕と日本語訳を開示する */
  const [resolvedBeats, setResolvedBeats] = useState<Set<number>>(new Set())
  const [results, setResults] = useState<TaskResult[]>([])
  const [replays, setReplays] = useState(0)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [options, setOptions] = useState<number[]>([])
  const [finalScore, setFinalScore] = useState<SimScore | null>(null)
  const [confirmExit, setConfirmExit] = useState(false)
  const taskStart = useRef(0)
  const runId = useRef(0)
  const resolvedRef = useRef(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const wake = useRef<WakeLockLike | null>(null)
  const { playAll, play, stop, playingKey } = useSpeak()

  const recordSim = useProgress((s) => s.recordSim)
  const gradePhrase = useProgress((s) => s.gradePhrase)
  const meet = useProgress((s) => s.meet)
  const addXp = useProgress((s) => s.addXp)
  const bump = useProgress((s) => s.bump)
  const setLast = useProgress((s) => s.setLast)

  const meta = MODE_META[mode]
  const beat: Beat | undefined = c?.beats[beatIdx]
  const hud = c ? hudAt(c, stage === 'intro' ? range[0] - 1 : beatIdx) : null
  const clock = c ? clockAt(c, stage === 'intro' ? range[0] : beatIdx) : null
  const totalTasks = c ? c.beats.slice(range[0], range[1]).filter((b) => b.task).length : 0

  useEffect(() => {
    if (c) setLast({ path: `/sim/${c.id}${phaseParam ? `?phase=${phaseParam}` : ''}`, label: `シミュレーター: ${c.titleJa}` })
  }, [c, phaseParam, setLast])

  // 片付け
  useEffect(
    () => () => {
      runId.current++
      stopSpeech()
      stopAmbient()
      void wake.current?.release().catch(() => undefined)
    },
    [],
  )

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [log, stage])

  // リアルORの制限時間
  useEffect(() => {
    if (stage !== 'task' || remaining === null) return
    if (remaining <= 0) {
      resolve(false, true, null)
      return
    }
    const t = setTimeout(() => setRemaining((r) => (r === null ? null : r - 1)), 1000)
    if (remaining <= 3) sfx.tick()
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, remaining])

  const lineKey = (b: number, i: number) => `${b}:${i}`

  const playLines = useCallback(
    async (b: number, lines: DialogueLine[], addToLog: boolean): Promise<boolean> => {
      const my = runId.current
      if (addToLog) setLog((l) => [...l, ...lines.map((line, idx): LogEntry => ({ k: 'line', line, beat: b, idx }))])
      const ok = await playAll(
        `sim:${b}:${addToLog ? 'a' : 'r'}`,
        lines.map((l) => ({ text: l.en, role: l.role, tts: l.tts })),
        (i) => {
          // スタンダード: 話し終えた行から字幕を出す
          if (mode === 'standard' && i > 0) setRevealed((s) => new Set(s).add(lineKey(b, i - 1)))
        },
        meta.rate,
      )
      if (my !== runId.current) return false
      if (mode === 'standard') setRevealed((s) => new Set([...s, ...lines.map((_, i) => lineKey(b, i))]))
      return ok
    },
    [playAll, mode, meta.rate],
  )

  const runBeat = useCallback(
    async (i: number) => {
      if (!c) return
      const my = ++runId.current
      const b = c.beats[i]
      setBeatIdx(i)
      setReplays(0)
      setRemaining(null)
      resolvedRef.current = false
      if (b.narration) setLog((l) => [...l, { k: 'narr', text: b.narration! }])
      if (b.hud?.alarm) sfx.alarm()
      if (mode === 'real' && orNoise) startAmbient()
      if (b.lines?.length) {
        setStage('lines')
        await new Promise((r) => setTimeout(r, 450))
        if (my !== runId.current) return
        await playLines(i, b.lines, true)
        if (my !== runId.current) return
      }
      if (b.task) {
        if (b.task.kind === 'respond') setOptions(shuffle(Math.random, b.task.options.map((_, k) => k)))
        if (b.task.kind === 'catch') setOptions(shuffle(Math.random, b.task.options.map((_, k) => k)))
        taskStart.current = Date.now()
        setRemaining(timeLimitFor(b.task, mode))
        setStage('task')
      } else {
        if (b.after?.length) await playLines(i, b.after, true)
        if (my !== runId.current) return
        setResolvedBeats((s) => new Set(s).add(i))
        setStage('idle')
      }
    },
    [c, mode, orNoise, playLines],
  )

  function start() {
    unlockSpeech()
    unlockAudio()
    setSetting('simMode', mode)
    setLog([])
    setResults([])
    setRevealed(new Set())
    setResolvedBeats(new Set())
    setFinalScore(null)
    const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<WakeLockLike> } }
    nav.wakeLock
      ?.request('screen')
      .then((w) => (wake.current = w))
      .catch(() => undefined)
    void runBeat(range[0])
  }

  function resolve(ok: boolean, timedOut: boolean, chosenText: string | null) {
    if (!c || !beat?.task || resolvedRef.current) return
    resolvedRef.current = true
    const task = beat.task
    const ms = Date.now() - taskStart.current
    setRemaining(null)
    if (ok) sfx.correct()
    else sfx.wrong()
    const r: TaskResult = { beatId: beat.id, kind: task.kind, ok, ms, timedOut, phraseIds: task.phraseIds ?? [] }
    setResults((rs) => [...rs, r])
    // 字幕と日本語訳を開示
    setRevealed((s) => new Set([...s, ...(beat.lines ?? []).map((_, k) => lineKey(beatIdx, k))]))
    setResolvedBeats((s) => new Set(s).add(beatIdx))
    const why =
      timedOut
        ? '時間切れ。手術室では、まず短く復唱して「聞こえた」ことを返すのが大切です。'
        : task.kind === 'respond'
          ? (task.options.find((o) => o.en === chosenText)?.why ?? '')
          : task.kind === 'catch'
            ? (task.why ?? '')
            : ''
    const model = task.kind === 'respond' ? task.model : task.kind === 'speak' ? task.target : undefined
    const modelTts = task.kind === 'respond' ? task.modelTts : task.kind === 'speak' ? task.tts : undefined
    const modelJa = task.kind === 'respond' ? task.modelJa : undefined
    setLog((l) => [
      ...l,
      ...(chosenText ? [{ k: 'mine', text: chosenText, ok } as LogEntry] : []),
      { k: 'fb', beat: beatIdx, ok, timedOut, why, model, modelJa, modelTts, task },
    ])
    setStage('resolved')
    const my = runId.current
    void (async () => {
      // 正しい言い方を「あなたの声」で聞かせてから、相手の返事
      if (model) {
        await new Promise((res) => setTimeout(res, 400))
        if (my !== runId.current) return
        await play(`sim:model:${beat.id}`, { text: model, role: 'perfusionist', tts: modelTts }, meta.rate)
      }
      if (my !== runId.current) return
      if (beat.after?.length) await playLines(beatIdx, beat.after, true)
    })()
  }

  function next() {
    stop()
    if (!c) return
    const n = beatIdx + 1
    if (n >= range[1]) finish()
    else void runBeat(n)
  }

  function finish() {
    if (!c) return
    runId.current++
    stopAmbient()
    void wake.current?.release().catch(() => undefined)
    const s = scoreRun(results, mode)
    setFinalScore(s)
    setStage('done')
    sfx.levelUp()
    const fullRun = range[0] === 0 && range[1] === c.beats.length
    recordSim(phaseParam ? `${c.id}#${phaseParam}` : c.id, s.score, s.rank, mode, fullRun && s.score >= 70)
    for (const r of results) {
      if (r.phraseIds.length) {
        meet(r.phraseIds)
        for (const pid of r.phraseIds) gradePhrase(pid, r.ok)
      }
      if (r.ok && r.kind === 'respond') bump('closedLoop')
    }
    const correct = results.filter((r) => r.ok).length
    addXp(Math.round(correct * XP.simTask * (mode === 'real' ? XP.simRealOrBonus : 1)), goal)
  }

  if (!c) return <NotFound />

  // ===== はじめる前 =====
  if (stage === 'intro') {
    const phase = phaseParam ? PHASE_BY_ID[phaseParam] : null
    return (
      <div className="console min-h-full">
        <header className="pt-safe">
          <div className="mx-auto flex max-w-2xl items-center gap-2 px-3 py-2">
            <button type="button" aria-label="戻る" onClick={() => navigate('/sim')} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
              <ArrowLeft size={20} />
            </button>
            <p className="text-sm font-bold text-console-sub">CPBシミュレーター</p>
          </div>
        </header>
        <main className="pb-safe-plus mx-auto max-w-2xl px-4">
          <p className="en mt-2 text-xs font-bold tracking-widest text-[var(--seg-flow)]">{c.titleEn}</p>
          <h1 className="mt-1 text-2xl font-extrabold leading-tight">{c.titleJa}</h1>
          {phase && <p className="mt-1 text-sm text-[var(--seg-temp)]">シーン単位: {phase.titleJa}</p>}
          <p className="mt-3 text-sm leading-relaxed text-console-ink/85">{c.synopsis}</p>
          <div className="mt-3 rounded-xl border border-console-line bg-console-panel p-3 text-xs leading-relaxed text-console-sub">
            <p>
              <ClipboardList size={14} className="mr-1 inline" />
              {c.patient}
            </p>
          </div>
          <div className="mt-4">
            <HudPanel hud={hudAt(c, range[0] - 1)} clock={clockAt(c, range[0])} />
          </div>
          <p className="mt-5 text-xs font-bold text-console-sub">モード</p>
          <Segmented
            dark
            className="mt-1.5"
            value={mode}
            onChange={setMode}
            options={(Object.keys(MODE_META) as SimMode[]).map((m) => ({ value: m, label: MODE_META[m].label }))}
          />
          <p className="mt-2 text-xs text-console-sub">{meta.desc}</p>
          <p className="mt-4 text-[11px] leading-relaxed text-console-sub">
            症例・会話・モニターの数値はすべて教育用の架空の例です（AI下書き・臨床未監修）。実際の管理は施設のプロトコルと担当医の指示に従ってください。
          </p>
          {c.notes?.length ? (
            <div className="mt-3 rounded-xl bg-console-panel p-3">
              <NoteList notes={c.notes} />
            </div>
          ) : null}
          <button
            type="button"
            onClick={start}
            className="mt-6 flex w-full min-h-16 items-center justify-center gap-3 rounded-2xl bg-brand text-xl font-extrabold text-white shadow-card active:scale-[0.99]"
          >
            <PumpRotor size={34} spinning hub="#0e9f92" />
            Pump On !
          </button>
          <p className="mt-2 text-center text-[11px] text-console-sub">音声が流れます。消音スイッチと音量を確認してください。</p>
        </main>
      </div>
    )
  }

  // ===== 振り返り =====
  if (stage === 'done' && finalScore) {
    const wrong = results.filter((r) => !r.ok)
    const rankColor = { S: '#ffd36b', A: 'var(--seg-flow)', B: 'var(--seg-svo2)', C: 'var(--seg-temp)', D: 'var(--seg-map)' }[finalScore.rank]
    return (
      <div className="console min-h-full">
        <main className="pt-safe pb-safe-plus mx-auto max-w-2xl px-4">
          <div className="animate-pop pt-8 text-center">
            <Trophy className="mx-auto text-[#ffd36b]" size={34} />
            <p className="mt-2 text-sm text-console-sub">{c.titleJa}{phaseParam ? `（${PHASE_BY_ID[phaseParam].titleJa}）` : ''}</p>
            <p className="seg mt-2 text-[84px] font-extrabold leading-none" style={{ color: rankColor }}>
              {finalScore.rank}
            </p>
            <p className="mt-2 text-lg font-bold">
              {finalScore.score}点・{finalScore.correct}/{finalScore.total}問
            </p>
            <p className="text-xs text-console-sub">
              {MODE_META[mode].label}モード{finalScore.avgSec !== null ? `・平均 ${finalScore.avgSec} 秒で応答` : ''}
            </p>
          </div>
          {wrong.length > 0 && (
            <section className="mt-6">
              <p className="text-sm font-bold">見直す表現</p>
              <p className="text-[11px] text-console-sub">「復習」のついた表現は、復習リストに入りました。</p>
              <ul className="mt-2 space-y-2">
                {wrong.map((r) => {
                  const b = c.beats.find((x) => x.id === r.beatId)
                  const t = b?.task
                  const model = t?.kind === 'respond' ? t.model : t?.kind === 'speak' ? t.target : t?.kind === 'catch' ? t.answer : ''
                  const ja = t?.kind === 'respond' ? t.modelJa : t?.prompt
                  return (
                    <li key={r.beatId} className="flex items-center gap-2 rounded-xl border border-console-line bg-console-panel p-3">
                      <div className="min-w-0 flex-1">
                        <p className="en text-[15px] font-semibold">{model}</p>
                        <p className="text-xs text-console-sub">{ja}</p>
                        {r.phraseIds.length > 0 && <span className="mt-1 inline-block rounded bg-[var(--seg-svo2)]/20 px-1.5 text-[10px] font-bold text-[var(--seg-svo2)]">復習</span>}
                      </div>
                      {t?.kind !== 'catch' && model && <AudioButton k={`deb:${r.beatId}`} item={{ text: model, role: 'perfusionist' }} size="sm" tone="dark" />}
                    </li>
                  )
                })}
              </ul>
            </section>
          )}
          <div className="mt-6 grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => navigate('/sim')}>
              一覧へ
            </Button>
            <Button
              onClick={() => {
                setStage('intro')
                setBeatIdx(range[0])
              }}
            >
              <RotateCcw size={16} /> もう一度
            </Button>
          </div>
        </main>
      </div>
    )
  }

  // ===== プレイ中 =====
  const doneTasks = results.length
  const task = beat?.task
  const speaking = playingKey?.startsWith('sim:') ?? false
  const canReplay = !!beat?.lines?.length && (stage === 'task' || stage === 'resolved' || stage === 'idle') && replays < meta.replays

  return (
    <div className="console min-h-full">
      <div className="pt-safe sticky top-0 z-20 bg-[var(--console-bg)]/95 backdrop-blur">
        <div className="mx-auto max-w-2xl px-3 pb-2">
          <div className="flex items-center gap-2 py-1.5">
            <button type="button" aria-label="中断" onClick={() => setConfirmExit(true)} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
              <X size={20} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{c.titleJa}</p>
              <p className="text-[11px] text-console-sub">
                {MODE_META[mode].label}・課題 {Math.min(doneTasks + (stage === 'task' ? 1 : 0), totalTasks)}/{totalTasks}
              </p>
            </div>
            {canReplay && (
              <button
                type="button"
                onClick={() => {
                  setReplays((n) => n + 1)
                  if (beat?.lines) void playLines(beatIdx, beat.lines, false)
                }}
                className="inline-flex h-10 items-center gap-1 rounded-full bg-white/10 px-3 text-xs font-bold"
              >
                <Volume2 size={16} /> 聞き直す{meta.replays !== Infinity ? `（残り${meta.replays - replays}）` : ''}
              </button>
            )}
          </div>
          {hud && <HudPanel hud={hud} clock={clock} />}
        </div>
      </div>

      <main className="pb-safe-plus mx-auto max-w-2xl px-3">
        <ol className="mt-3 space-y-2.5">
          {log.map((e, i) => (
            <li key={i}>
              <LogView
                e={e}
                showEn={e.k !== 'line' || mode === 'guided' || (mode === 'standard' ? revealed.has(lineKey(e.beat, e.idx)) : resolvedBeats.has(e.beat))}
                showJa={e.k !== 'line' || mode === 'guided' || resolvedBeats.has(e.beat)}
                speaking={speaking}
              />
            </li>
          ))}
        </ol>

        {stage === 'lines' && (
          <p className="mt-3 flex items-center gap-2 text-xs text-console-sub">
            <Wave /> 交信中…
          </p>
        )}

        {/* 課題 */}
        {stage === 'task' && task && (
          <div className="animate-pop mt-4 rounded-2xl border border-[var(--seg-flow)]/40 bg-console-panel p-4">
            {remaining !== null && (
              <div className="mb-3 flex items-center gap-2">
                <Timer size={16} className={remaining <= 3 ? 'text-[var(--seg-map)]' : 'text-console-sub'} />
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-console-line">
                  <div
                    className="h-full rounded-full transition-[width] duration-1000 ease-linear"
                    style={{ width: `${(remaining / (timeLimitFor(task, mode) ?? 1)) * 100}%`, background: remaining <= 3 ? 'var(--seg-map)' : 'var(--seg-flow)' }}
                  />
                </div>
                <span className="num w-6 text-right text-xs">{remaining}</span>
              </div>
            )}
            <p className="text-[15px] font-bold leading-snug">{task.prompt}</p>
            {task.kind === 'speak' && task.hint && mode === 'guided' && <p className="mt-1 text-xs text-console-sub">ヒント: {task.hint}</p>}

            {task.kind === 'respond' && (
              <div className="mt-3 grid gap-2">
                {options.map((k) => {
                  const o = task.options[k]
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => resolve(o.correct, false, o.en)}
                      className="en min-h-13 rounded-xl border border-console-line bg-white/5 px-4 py-3 text-left text-[16px] font-semibold active:bg-white/15"
                    >
                      {o.en}
                    </button>
                  )
                })}
              </div>
            )}

            {task.kind === 'catch' && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {options.map((k) => {
                  const o = task.options[k]
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => resolve(o === task.answer, false, null)}
                      className="num min-h-14 rounded-xl border border-console-line bg-white/5 px-3 text-lg font-bold active:bg-white/15"
                    >
                      {o}
                    </button>
                  )
                })}
              </div>
            )}

            {task.kind === 'speak' && (
              <div className="mt-3">
                <SpeakPanel
                  dark
                  target={task.target}
                  tts={task.tts}
                  keywords={task.keywords}
                  accept={task.accept}
                  revealTarget={mode === 'guided'}
                  rateMul={meta.rate}
                  onResult={(r) => resolve(r.ok, false, r.transcript ?? null)}
                />
              </div>
            )}
          </div>
        )}

        {(stage === 'resolved' || stage === 'idle') && (
          <button
            type="button"
            onClick={next}
            className="animate-pop mt-4 flex w-full min-h-14 items-center justify-center gap-2 rounded-2xl bg-brand text-base font-extrabold text-white active:scale-[0.99]"
          >
            {beatIdx + 1 >= range[1] ? '振り返りへ' : '次へ'} <ChevronRight size={20} />
          </button>
        )}
        <div ref={bottomRef} className="h-4" />
      </main>

      {confirmExit && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center" role="dialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-2xl bg-console-panel p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]">
            <p className="font-bold">シミュレーションを中断しますか？</p>
            <p className="mt-1 text-sm text-console-sub">ここまでの結果は保存されません。</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => setConfirmExit(false)}>
                続ける
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  runId.current++
                  stopSpeech()
                  stopAmbient()
                  navigate('/sim')
                }}
              >
                中断する
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function LogView({ e, showEn, showJa, speaking }: { e: LogEntry; showEn: boolean; showJa: boolean; speaking: boolean }) {
  if (e.k === 'narr')
    return (
      <div className="flex gap-2 rounded-xl border border-dashed border-console-line px-3 py-2 text-[13px] leading-relaxed text-console-sub">
        <ClipboardList size={15} className="mt-0.5 shrink-0" />
        <span>{e.text}</span>
      </div>
    )
  if (e.k === 'line') {
    const r = ROLES[e.line.role]
    return (
      <div className="flex gap-2">
        <RoleAvatar role={e.line.role} size={30} />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold" style={{ color: r.color }}>
            {r.ja} <span className="en opacity-70">{r.en}</span>
          </p>
          <div className="mt-0.5 rounded-2xl rounded-tl-md bg-console-panel px-3 py-2" style={{ borderLeft: `3px solid ${r.color}` }}>
            {showEn ? (
              <p className="en text-[16px] font-semibold leading-snug">{e.line.en}</p>
            ) : (
              <p className="flex items-center gap-2 text-sm text-console-sub">
                <Volume2 size={14} /> {speaking ? '話しています…' : '（音声のみ）'}
              </p>
            )}
            {showJa && <p className="mt-0.5 text-xs text-console-sub">{e.line.ja}</p>}
          </div>
        </div>
      </div>
    )
  }
  if (e.k === 'mine')
    return (
      <div className="flex justify-end gap-2">
        <div className={`max-w-[85%] rounded-2xl rounded-tr-md px-3 py-2 ${e.ok === false ? 'bg-[var(--seg-map)]/20' : 'bg-[var(--seg-flow)]/15'}`}>
          <p className="text-right text-[11px] font-bold text-[var(--seg-flow)]">あなた</p>
          <p className="en text-[16px] font-semibold leading-snug">{e.text}</p>
        </div>
      </div>
    )
  // フィードバック
  const t = e.task
  const phrase = t.phraseIds?.length ? PHRASE_BY_ID[t.phraseIds[0]] : undefined
  return (
    <div className={`animate-pop rounded-2xl border p-3.5 ${e.ok ? 'border-[var(--seg-flow)]/50 bg-[var(--seg-flow)]/8' : 'border-[var(--seg-map)]/50 bg-[var(--seg-map)]/8'}`}>
      <p className={`flex items-center gap-1.5 font-extrabold ${e.ok ? 'text-[var(--seg-flow)]' : 'text-[var(--seg-map)]'}`}>
        {e.ok ? <Check size={18} /> : <X size={18} />}
        {e.ok ? 'Good!' : e.timedOut ? '時間切れ' : 'おしい'}
      </p>
      {e.why && <p className="mt-1 text-[13px] leading-relaxed text-console-ink/90">{e.why}</p>}
      {t.kind === 'catch' && (
        <p className="mt-1 text-[13px]">
          正解: <span className="num font-bold text-[var(--seg-temp)]">{t.answer}</span>
        </p>
      )}
      {e.model && (
        <div className="mt-2 flex items-center gap-2 rounded-xl bg-black/25 px-3 py-2">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-console-sub">こう言えば伝わる</p>
            <p className="en text-[15px] font-bold leading-snug">{e.model}</p>
            {e.modelJa && <p className="text-xs text-console-sub">{e.modelJa}</p>}
          </div>
          <AudioButton k={`fb:${e.beat}`} item={{ text: e.model, role: 'perfusionist', tts: e.modelTts }} size="sm" tone="dark" />
        </div>
      )}
      {t.kind === 'respond' && t.alt?.length ? (
        <ul className="mt-2 space-y-1">
          {t.alt.map((v, i) => (
            <li key={i} className="flex items-center gap-2 text-[13px]">
              <RegisterTag register={v.register} />
              <span className="en">{v.en}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {phrase?.notes?.length ? <NoteList className="mt-2" notes={phrase.notes.filter((n) => n.kind !== 'tip').slice(0, 2)} /> : null}
    </div>
  )
}
