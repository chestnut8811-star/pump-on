import { useEffect, useRef, useState } from 'react'
import { useParams } from 'wouter'
import { Eye, Play, Square, UserRound, Headphones, PartyPopper } from 'lucide-react'
import { ScreenHeader, Page } from '../components/chrome'
import { Button, Card, Segmented, Pill } from '../components/ui'
import { NoteList, RoleAvatar, RoleLabel, StatusPill } from '../components/content'
import { AudioButton, useSpeak } from '../components/audio'
import { SpeakPanel } from '../components/SpeakPanel'
import { DIALOGUE_BY_ID, PHASE_BY_ID } from '../content'
import { useProgress } from '../store/progress'
import { useSettings, type Subtitles } from '../store/settings'
import { XP } from '../engine/xp'
import { sfx } from '../engine/sfx'
import { stopSpeech } from '../engine/speech'
import NotFound from './NotFound'

type Mode = 'listen' | 'role'

export default function DialogueScreen() {
  const { id } = useParams<{ id: string }>()
  const d = DIALOGUE_BY_ID[id]
  const defaultSubs = useSettings((s) => s.subtitles)
  const [mode, setMode] = useState<Mode>('listen')
  const [subs, setSubs] = useState<Subtitles>(defaultSubs)
  const [cursor, setCursor] = useState(-1) // listen: 再生中の行 / role: 表示済みの最後の行
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})
  const [finished, setFinished] = useState(false)
  const { playAll, stop, play, playingKey } = useSpeak()
  const recordDialogue = useProgress((s) => s.recordDialogue)
  const addXp = useProgress((s) => s.addXp)
  const meet = useProgress((s) => s.meet)
  const setLast = useProgress((s) => s.setLast)
  const goal = useSettings((s) => s.dailyGoal)
  const endRef = useRef<HTMLDivElement>(null)
  // 再生の実行番号。やり直し・モード切替・画面を離れるたびに進め、古い再生の続きを無効にする
  const runRef = useRef(0)
  const finishedRef = useRef(false)

  useEffect(() => {
    if (!d) return
    setLast({ path: `/dialogue/${d.id}`, label: `会話: ${d.title}` })
    const ids = d.lines.map((l) => l.phraseId).filter((x): x is string => !!x)
    if (ids.length) meet(ids)
    // 離れるときは最新の実行番号を進めたいので、ref の値ではなく ref 自体を持っておく
    const runs = runRef
    return () => {
      runs.current++
      stopSpeech()
    }
  }, [d, meet, setLast])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [cursor, finished])

  if (!d) return <NotFound />
  const phase = PHASE_BY_ID[d.phase]
  const allKey = `dlg:${d.id}`

  function complete(run: number) {
    if (run !== runRef.current || finishedRef.current) return
    finishedRef.current = true
    setFinished(true)
    recordDialogue(d.phase, d.id)
    addXp(XP.dialogue, goal)
    sfx.levelUp()
  }

  /** 再生を止め、表示を最初の状態に戻す。新しい実行番号を返す */
  function resetRun(): number {
    runRef.current++
    stop()
    setCursor(-1)
    setRevealed({})
    setFinished(false)
    finishedRef.current = false
    return runRef.current
  }

  // ロールプレイ: 自分の行の手前まで相手の行を順に流す
  async function runRoleFrom(start: number, run: number) {
    let i = start
    while (i < d.lines.length && d.lines[i].role !== 'perfusionist') {
      if (run !== runRef.current) return
      setCursor(i)
      const line = d.lines[i]
      const ok = await playAll(`${allKey}:r${i}`, [{ text: line.en, role: line.role, tts: line.tts }])
      if (!ok || run !== runRef.current) return
      i++
    }
    if (run !== runRef.current) return
    if (i >= d.lines.length) {
      setCursor(d.lines.length - 1)
      complete(run)
      return
    }
    setCursor(i) // 自分の番
  }

  function startListen() {
    if (playingKey === allKey) {
      runRef.current++
      stop()
      return
    }
    const run = resetRun()
    void playAll(
      allKey,
      d.lines.map((l) => ({ text: l.en, role: l.role, tts: l.tts })),
      (i) => {
        if (run === runRef.current) setCursor(i)
      },
    ).then((ok) => {
      if (ok) complete(run)
    })
  }

  function startRole() {
    void runRoleFrom(0, resetRun())
  }

  function switchMode(m: Mode) {
    resetRun()
    setMode(m)
  }

  const visible = mode === 'listen' ? d.lines.map((_, i) => i) : d.lines.map((_, i) => i).filter((i) => i <= cursor)
  const myTurn = mode === 'role' && cursor >= 0 && d.lines[cursor]?.role === 'perfusionist' && !revealed[cursor]

  return (
    <>
      <ScreenHeader title={d.title} sub={`${phase.titleJa}・会話`} back={`/phase/${d.phase}/dialogues`} />
      <Page tabbed={false}>
        <Card className="mt-4 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={d.status} />
            <Pill tone="brand">Lv{d.level}</Pill>
          </div>
          <p className="mt-2 text-sm leading-relaxed">{d.setting}</p>
        </Card>

        <div className="mt-4 grid gap-2">
          <Segmented
            value={mode}
            onChange={switchMode}
            options={[
              { value: 'listen', label: <span className="inline-flex items-center gap-1"><Headphones size={14} />通して聞く</span> },
              { value: 'role', label: <span className="inline-flex items-center gap-1"><UserRound size={14} />あなたの役を演じる</span> },
            ]}
          />
          <Segmented
            value={subs}
            onChange={setSubs}
            options={[
              { value: 'en+ja', label: '英＋日' },
              { value: 'en', label: '英のみ' },
              { value: 'none', label: '字幕なし' },
            ]}
          />
        </div>

        {mode === 'listen' ? (
          <Button block size="lg" className="mt-4" variant={playingKey === allKey ? 'dark' : 'primary'} onClick={startListen}>
            {playingKey === allKey ? <Square size={18} /> : <Play size={18} />}
            {playingKey === allKey ? '停止' : '最初から再生'}
          </Button>
        ) : (
          cursor < 0 && (
            <Card className="mt-4 p-4">
              <p className="text-sm leading-relaxed">
                相手のセリフは自動で流れます。<b>あなた（臨床工学技士）の番</b>で止まるので、英語で言ってから進めてください。
              </p>
              <Button block size="lg" className="mt-3" onClick={startRole}>
                <Play size={18} /> スタート
              </Button>
            </Card>
          )
        )}

        <ol className="mt-4 space-y-3">
          {visible.map((i) => {
            const l = d.lines[i]
            const mine = l.role === 'perfusionist'
            const hidden = mode === 'role' && mine && !revealed[i]
            const active = cursor === i && (playingKey?.startsWith(allKey) ?? false)
            return (
              <li key={i} className={`flex gap-2.5 ${mine ? 'flex-row-reverse' : ''}`}>
                <RoleAvatar role={l.role} size={32} />
                <div className={`min-w-0 max-w-[85%] ${mine ? 'items-end text-right' : ''}`}>
                  <RoleLabel role={l.role} />
                  <div
                    className={`mt-1 rounded-2xl px-3.5 py-2.5 text-left shadow-card transition ${
                      mine ? 'rounded-tr-md bg-brand-soft' : 'rounded-tl-md bg-card'
                    } ${active ? 'ring-2 ring-brand' : ''}`}
                  >
                    {hidden ? (
                      <p className="text-sm font-bold text-brand-ink">あなたの番 — 下で英語で言ってみましょう</p>
                    ) : (
                      <>
                        {subs !== 'none' && <p className="en text-[16px] font-semibold leading-snug">{l.en}</p>}
                        {subs === 'en+ja' && <p className="mt-0.5 text-[13px] text-sub">{l.ja}</p>}
                        {subs === 'none' && <p className="text-xs text-faint">（字幕なし）</p>}
                      </>
                    )}
                  </div>
                  {!hidden && (
                    <div className={`mt-1 flex ${mine ? 'justify-end' : ''}`}>
                      <AudioButton k={`${allKey}:l${i}`} size="sm" tone="light" item={{ text: l.en, role: l.role, tts: l.tts }} />
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ol>

        {myTurn && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-bold">
              あなたの番: <span className="text-brand-ink">{d.lines[cursor].ja}</span>
            </p>
            <SpeakPanel
              key={cursor}
              target={d.lines[cursor].en}
              tts={d.lines[cursor].tts}
              keywords={[]}
              onResult={() => {
                const run = runRef.current
                setRevealed((r) => ({ ...r, [cursor]: true }))
                void play(`${allKey}:me${cursor}`, { text: d.lines[cursor].en, role: 'perfusionist', tts: d.lines[cursor].tts }).then(() =>
                  runRoleFrom(cursor + 1, run),
                )
              }}
            />
            <button
              type="button"
              className="mt-2 inline-flex items-center gap-1 text-xs text-sub underline"
              onClick={() => {
                setRevealed((r) => ({ ...r, [cursor]: true }))
                void runRoleFrom(cursor + 1, runRef.current)
              }}
            >
              <Eye size={14} />
              答えを見て進む
            </button>
          </div>
        )}

        {finished && (
          <Card className="animate-pop mt-5 p-5 text-center">
            <PartyPopper className="mx-auto text-warn" size={28} />
            <p className="mt-2 font-extrabold">会話を最後まで進めました</p>
            <p className="text-sm text-sub">+{XP.dialogue} XP</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => (mode === 'listen' ? startListen() : startRole())}>
                もう一度
              </Button>
              <Button onClick={() => switchMode(mode === 'listen' ? 'role' : 'listen')}>{mode === 'listen' ? '役を演じる' : '通して聞く'}</Button>
            </div>
          </Card>
        )}

        {d.notes?.length ? (
          <Card className="mt-5 p-4">
            <NoteList notes={d.notes} />
          </Card>
        ) : null}
        <div ref={endRef} />
      </Page>
    </>
  )
}
