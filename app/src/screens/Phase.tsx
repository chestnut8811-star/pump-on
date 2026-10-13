import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'wouter'
import { ChevronRight, Ear, Info, ListChecks, MessagesSquare, Mic, Play, Square, Target } from 'lucide-react'
import { ScreenHeader, Page } from '../components/chrome'
import { Button, Card, Pill, Section, Segmented, Empty } from '../components/ui'
import { NoteList, PhraseCard, RoleAvatar, SourceRefs, StatusPill } from '../components/content'
import { useSpeak } from '../components/audio'
import { CASES, PHASE_BY_ID, dialoguesOf, phrasesOf } from '../content'
import type { PhaseId } from '../content/types'
import { useProgress } from '../store/progress'
import NotFound from './NotFound'

type Tab = 'overview' | 'phrases' | 'dialogues' | 'drill'
const TABS: { value: Tab; label: string }[] = [
  { value: 'overview', label: '解説' },
  { value: 'phrases', label: 'フレーズ' },
  { value: 'dialogues', label: '会話' },
  { value: 'drill', label: 'ドリル' },
]

export default function PhaseScreen() {
  const params = useParams<{ id: string; tab?: string }>()
  const [, navigate] = useLocation()
  const phase = PHASE_BY_ID[params.id as PhaseId]
  const tab = (TABS.some((t) => t.value === params.tab) ? params.tab : 'overview') as Tab
  const visit = useProgress((s) => s.visitPhase)
  const setLast = useProgress((s) => s.setLast)

  useEffect(() => {
    if (!phase) return
    visit(phase.id)
    setLast({ path: `/phase/${phase.id}`, label: `${phase.titleJa}（${phase.titleEn}）` })
  }, [phase, visit, setLast])

  if (!phase) return <NotFound />
  const setTab = (t: Tab) => navigate(`/phase/${phase.id}/${t}`, { replace: true })

  return (
    <>
      <ScreenHeader title={phase.titleJa} sub={phase.titleEn} back="/learn">
        <div className="mx-auto max-w-3xl px-3 pb-2.5">
          <Segmented dark value={tab} onChange={setTab} options={TABS} />
        </div>
      </ScreenHeader>
      <Page>
        {tab === 'overview' && <Overview id={phase.id} onTab={setTab} />}
        {tab === 'phrases' && <Phrases id={phase.id} />}
        {tab === 'dialogues' && <Dialogues id={phase.id} />}
        {tab === 'drill' && <DrillIntro id={phase.id} />}
      </Page>
    </>
  )
}

function Overview({ id, onTab }: { id: PhaseId; onTab: (t: Tab) => void }) {
  const phase = PHASE_BY_ID[id]
  const [, navigate] = useLocation()
  const simCase = CASES.find((c) => c.tags.includes('standard') && c.beats.some((b) => b.phase === id))
  return (
    <>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusPill status={phase.status} />
        {phase.group === 'trouble' && <Pill tone="art">トラブル対応</Pill>}
      </div>
      <p className="mt-3 text-[15px] font-bold leading-relaxed">{phase.summary}</p>

      {phase.overview.length > 0 && (
        <Section title="この場面で起きていること">
          <Card className="space-y-3 p-4 text-[15px] leading-relaxed">
            {phase.overview.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </Card>
        </Section>
      )}

      {phase.keyPoints.length > 0 && (
        <Section title="コミュニケーションの要点">
          <ul className="space-y-2">
            {phase.keyPoints.map((t, i) => (
              <li key={i} className="flex gap-3 rounded-2xl bg-card p-3.5 text-[14px] leading-relaxed shadow-card">
                <Target size={18} className="mt-0.5 shrink-0 text-brand" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {phase.listenFor.length > 0 && (
        <Section title="よく聞く言葉">
          <div className="flex flex-wrap gap-1.5">
            {phase.listenFor.map((k, i) => (
              <span key={i} className="rounded-lg border border-line bg-card px-2.5 py-1.5 text-sm">
                <span className="en font-bold">{k.en}</span>
                <span className="ml-1.5 text-xs text-sub">{k.ja}</span>
              </span>
            ))}
          </div>
        </Section>
      )}

      {phase.notes?.length ? (
        <Section title="注意・施設差">
          <Card className="p-4">
            <NoteList notes={phase.notes} />
          </Card>
        </Section>
      ) : null}

      <Section title="練習する">
        <div className="grid gap-2.5">
          <Button variant="secondary" block onClick={() => onTab('phrases')}>
            <Ear size={18} /> フレーズを聞く（{phrasesOf(id).length}）
          </Button>
          <Button variant="secondary" block onClick={() => onTab('dialogues')}>
            <MessagesSquare size={18} /> 会話を聞く・演じる（{dialoguesOf(id).length}）
          </Button>
          <Button block onClick={() => navigate(`/drill/${id}`)} disabled={phrasesOf(id).length === 0}>
            <ListChecks size={18} /> ドリルに挑戦
          </Button>
          {simCase && (
            <Button variant="dark" block onClick={() => navigate(`/sim/${simCase.id}?phase=${id}`)}>
              <Play size={18} /> この場面をシミュレーターで
            </Button>
          )}
        </div>
      </Section>

      {phase.sources.length > 0 && (
        <p className="mt-6 flex items-start gap-1.5 px-1 text-xs text-faint">
          <Info size={14} className="mt-0.5 shrink-0" />
          <span>
            根拠: <SourceRefs ids={phase.sources} />
          </span>
        </p>
      )}
    </>
  )
}

type Filter = 'all' | 'listen' | 'speak'

function Phrases({ id }: { id: PhaseId }) {
  const list = phrasesOf(id)
  const [filter, setFilter] = useState<Filter>('all')
  const [showJa, setShowJa] = useState(true)
  const { playAll, stop, playingKey } = useSpeak()
  const [lineIdx, setLineIdx] = useState(-1)
  const meet = useProgress((s) => s.meet)
  const shown = useMemo(
    () => list.filter((p) => (filter === 'all' ? true : filter === 'speak' ? p.speaker === 'perfusionist' : p.speaker !== 'perfusionist')),
    [list, filter],
  )
  const allKey = `phase-all:${id}:${filter}`
  const playingAll = playingKey === allKey

  useEffect(() => {
    if (list.length) meet(list.map((p) => p.id))
  }, [list, meet])

  if (list.length === 0) return <Empty title="フレーズは準備中です" />

  return (
    <>
      <div className="mt-4 flex items-center gap-2">
        <Segmented
          className="flex-1"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'すべて' },
            { value: 'listen', label: <span className="inline-flex items-center gap-1"><Ear size={14} />聞く</span> },
            { value: 'speak', label: <span className="inline-flex items-center gap-1"><Mic size={14} />話す</span> },
          ]}
        />
        <button
          type="button"
          onClick={() => setShowJa(!showJa)}
          className={`min-h-11 rounded-xl border px-3 text-[13px] font-bold ${showJa ? 'border-brand bg-brand-soft text-brand-ink' : 'border-line bg-card text-sub'}`}
          aria-pressed={showJa}
        >
          日本語
        </button>
      </div>
      <p className="mt-2 px-1 text-xs text-sub">
        「聞く」は相手（外科医・麻酔科医など）の発話、「話す」はあなたが言う表現です。カードを開くと、言い方の幅と返答、注意点が見られます。
      </p>

      <Button
        variant={playingAll ? 'dark' : 'secondary'}
        block
        className="mt-3"
        onClick={() => {
          if (playingAll) {
            stop()
            setLineIdx(-1)
            return
          }
          void playAll(
            allKey,
            shown.map((p) => ({ text: p.en, role: p.speaker, tts: p.tts })),
            setLineIdx,
          ).then(() => setLineIdx(-1))
        }}
      >
        {playingAll ? <Square size={16} /> : <Play size={16} />}
        {playingAll ? '停止' : `${shown.length}件を続けて聞く`}
      </Button>

      <div className="mt-3 space-y-3">
        {shown.map((p, i) => (
          <div key={p.id} className={playingAll && lineIdx === i ? 'rounded-2xl ring-2 ring-brand' : ''}>
            <PhraseCard phrase={p} showJa={showJa} />
          </div>
        ))}
      </div>
    </>
  )
}

function Dialogues({ id }: { id: PhaseId }) {
  const list = dialoguesOf(id)
  const done = useProgress((s) => s.phases[id]?.dialoguesDone ?? [])
  if (list.length === 0) return <Empty title="会話は準備中です" />
  return (
    <div className="mt-4 space-y-3">
      {list.map((d) => (
        <Link key={d.id} href={`/dialogue/${d.id}`} className="block">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Pill tone="brand">Lv{d.level}</Pill>
              {done.includes(d.id) && <Pill tone="ok">完了</Pill>}
              <StatusPill status={d.status} />
            </div>
            <p className="mt-2 font-bold">{d.title}</p>
            <p className="mt-1 line-clamp-2 text-sm text-sub">{d.setting}</p>
            <div className="mt-3 flex items-center gap-1">
              {[...new Set(d.lines.map((l) => l.role))].map((r) => (
                <RoleAvatar key={r} role={r} size={24} />
              ))}
              <span className="ml-auto inline-flex items-center gap-1 text-sm font-bold text-brand-ink">
                {d.lines.length}行 <ChevronRight size={16} />
              </span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}

function DrillIntro({ id }: { id: PhaseId }) {
  const [, navigate] = useLocation()
  const best = useProgress((s) => s.phases[id]?.drillBest ?? 0)
  const runs = useProgress((s) => s.phases[id]?.drillRuns ?? 0)
  const n = phrasesOf(id).length
  return (
    <div className="mt-4 space-y-4">
      <Card className="p-5">
        <p className="text-lg font-extrabold">ドリル（約10問）</p>
        <ul className="mt-3 space-y-2 text-sm text-sub">
          <li>・英語を聞いて意味を選ぶ／数値を聞き取る</li>
          <li>・状況から、あなたが言うべき英語を選ぶ</li>
          <li>・相手の指示に、正しく復唱して返す</li>
          <li>・短縮形の意味、会話の並べ替え、発話</li>
        </ul>
        <p className="mt-3 text-xs text-faint">間違えた表現は自動で「復習」に入ります。</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-sub">最高 {best}%・挑戦 {runs}回</span>
        </div>
        <Button block size="lg" className="mt-4" onClick={() => navigate(`/drill/${id}`)} disabled={n === 0}>
          <ListChecks size={20} /> はじめる
        </Button>
      </Card>
    </div>
  )
}
