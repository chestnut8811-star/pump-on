// 教材表示の部品: 話者、監修状態、注記、言い方の幅、フレーズカード

import { useState, type ReactNode } from 'react'
import { Building2, ChevronDown, Globe2, HelpCircle, Lightbulb, ShieldAlert, BookOpen } from 'lucide-react'
import type { Evidence, Note, NoteKind, Phrase, Register, ReviewStatus, RoleId } from '../content/types'
import { ROLES } from '../content/roles'
import { SOURCES, type SourceId } from '../content/sources'
import { AudioButton } from './audio'
import { Pill, type Tone } from './ui'

export function RoleAvatar({ role, size = 32 }: { role: RoleId; size?: number }) {
  const r = ROLES[role]
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{ width: size, height: size, background: r.color, fontSize: size * 0.45 }}
      aria-label={r.ja}
      title={r.ja}
    >
      {r.mark}
    </span>
  )
}

export function RoleLabel({ role, to }: { role: RoleId; to?: RoleId | 'all' }) {
  const r = ROLES[role]
  const toLabel = to === undefined ? null : to === 'all' ? '全員' : to === 'perfusionist' ? 'あなた' : ROLES[to].ja
  return (
    <span className="text-xs font-bold" style={{ color: r.color }}>
      {role === 'perfusionist' ? 'あなた' : r.ja}
      <span className="en ml-1 font-semibold opacity-70">{r.en}</span>
      {toLabel && <span className="ml-1 font-normal text-faint">→ {toLabel}</span>}
    </span>
  )
}

const STATUS: Record<ReviewStatus, { label: string; tone: Tone }> = {
  'ai-draft': { label: 'AI下書き・臨床未監修', tone: 'warn' },
  'needs-check': { label: '要確認を含む', tone: 'ng' },
  reviewed: { label: '監修済み', tone: 'ok' },
}

const EVIDENCE: Record<Evidence, { label: string; tone: Tone; desc: string }> = {
  verbatim: { label: '論文・基準で確認', tone: 'ok', desc: '論文・学会基準で文言を確認した表現' },
  observed: { label: '教育動画・報告で確認', tone: 'ven', desc: '教育動画や実務者の報告で確認した表現（音声での確認待ち）' },
  constructed: { label: '出典未確認', tone: 'ng', desc: 'AI が作った自然な英文。現場での使用は未確認' },
}

export function EvidenceTag({ evidence }: { evidence: Evidence }) {
  const e = EVIDENCE[evidence]
  return (
    <Pill tone={e.tone} className="shrink-0">
      {e.label}
    </Pill>
  )
}

export function evidenceDesc(evidence: Evidence): string {
  return EVIDENCE[evidence].desc
}

export function StatusPill({ status }: { status: ReviewStatus }) {
  const s = STATUS[status]
  return <Pill tone={s.tone}>{s.label}</Pill>
}

const NOTE: Record<NoteKind, { label: string; tone: Tone; icon: ReactNode }> = {
  facility: { label: '施設差あり', tone: 'warn', icon: <Building2 size={14} /> },
  region: { label: '地域差', tone: 'ven', icon: <Globe2 size={14} /> },
  caution: { label: '安全', tone: 'ng', icon: <ShieldAlert size={14} /> },
  verify: { label: '要確認', tone: 'ng', icon: <HelpCircle size={14} /> },
  tip: { label: 'コツ', tone: 'brand', icon: <Lightbulb size={14} /> },
}

export function NoteList({ notes, className = '' }: { notes?: Note[]; className?: string }) {
  if (!notes?.length) return null
  return (
    <ul className={`space-y-2 ${className}`}>
      {notes.map((n, i) => {
        const m = NOTE[n.kind]
        return (
          <li key={i} className="flex gap-2 text-[13px] leading-relaxed">
            <Pill tone={m.tone} className="mt-0.5 shrink-0 self-start">
              {m.icon}
              {m.label}
            </Pill>
            <span className="text-ink">
              {n.text}
              {n.sources?.length ? <SourceRefs ids={n.sources} /> : null}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export function SourceRefs({ ids }: { ids: SourceId[] }) {
  return (
    <span className="ml-1 text-[11px] text-faint">
      <BookOpen size={11} className="mr-0.5 inline" />
      {ids.map((id) => SOURCES[id]?.org ?? id).join(' / ')}
    </span>
  )
}

const REGISTER: Record<Register, { label: string; tone: Tone; desc: string }> = {
  simple: { label: '簡単', tone: 'ok', desc: '初心者でも言いやすい基本形' },
  natural: { label: '自然', tone: 'brand', desc: '現場で自然な標準形' },
  shorthand: { label: '短縮', tone: 'violet', desc: '現場の短縮形・スラング（聞き取れればOK）' },
}

export function RegisterTag({ register }: { register: Register }) {
  const r = REGISTER[register]
  return (
    <Pill tone={r.tone} className="shrink-0">
      {r.label}
    </Pill>
  )
}

export function registerDesc(register: Register): string {
  return REGISTER[register].desc
}

export function KeywordChips({ phrase }: { phrase: Phrase }) {
  if (!phrase.keywords.length) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {phrase.keywords.map((k, i) => (
        <span key={i} className="rounded-lg border border-line bg-card-2 px-2 py-1 text-xs">
          <span className={`en font-bold ${k.kind === 'number' || k.kind === 'time' ? 'num text-art' : 'text-ink'}`}>{k.en}</span>
          <span className="ml-1 text-sub">{k.ja}</span>
        </span>
      ))}
    </div>
  )
}

/** フレーズカード（一覧で使う。タップで詳細を展開） */
export function PhraseCard({ phrase, showJa = true, defaultOpen = false }: { phrase: Phrase; showJa?: boolean; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const all: { en: string; register: Register; tts?: string; note?: string; region?: string; evidence?: Evidence }[] = [
    { en: phrase.en, register: 'natural', tts: phrase.tts, evidence: phrase.evidence },
    ...phrase.variants,
  ]
  const variants = phrase.variants
  return (
    <article className="rounded-2xl bg-card p-4 shadow-card">
      <header className="flex items-start gap-3">
        <RoleAvatar role={phrase.speaker} size={30} />
        <div className="min-w-0 flex-1">
          <RoleLabel role={phrase.speaker} to={phrase.to} />
          <p className="en mt-0.5 text-[18px] font-bold leading-snug">{phrase.en}</p>
          {showJa && <p className="mt-1 text-sm text-sub">{phrase.ja}</p>}
          {phrase.evidence === 'constructed' && (
            <p className="mt-1 text-[11px] font-bold text-ng">この言い方は出典未確認（要確認）</p>
          )}
        </div>
        <AudioButton k={`ph:${phrase.id}`} item={{ text: phrase.en, role: phrase.speaker, tts: phrase.tts }} />
      </header>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="mt-3 flex w-full items-center justify-between rounded-lg px-1 py-1 text-[13px] font-bold text-brand-ink"
        aria-expanded={open}
      >
        <span>
          {open ? '閉じる' : '言い方の幅・返答・注意点'}
          {!open && (variants.length > 0 || phrase.notes?.length) ? (
            <span className="ml-2 text-xs font-normal text-faint">
              {variants.length > 0 && `${variants.length + 1}通り`}
              {phrase.notes?.length ? ` ・注記${phrase.notes.length}` : ''}
            </span>
          ) : null}
        </span>
        <ChevronDown size={18} className={`transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="animate-pop mt-2 space-y-4 border-t border-line pt-3">
          <p className="text-[13px] text-sub">
            <span className="font-bold text-ink">場面: </span>
            {phrase.when}
          </p>

          {variants.length > 0 && (
            <div>
              <h4 className="mb-1.5 text-xs font-bold text-sub">同じ意味の言い方</h4>
              <ul className="space-y-1.5">
                {all.map((v, i) => (
                  <li key={i} className="flex items-center gap-2 rounded-xl bg-card-2 px-3 py-2">
                    <RegisterTag register={v.register} />
                    <div className="min-w-0 flex-1">
                      <p className="en text-[15px] font-semibold leading-snug">{v.en}</p>
                      {(v.note || (v.region && v.region !== 'common') || ('evidence' in v && v.evidence === 'constructed' && v.register === 'shorthand')) && (
                        <p className="text-[11px] text-sub">
                          {v.region && v.region !== 'common' ? `[${v.region}] ` : ''}
                          {v.note}
                          {'evidence' in v && v.evidence === 'constructed' && v.register === 'shorthand' ? '（現場での使用は未確認）' : ''}
                        </p>
                      )}
                    </div>
                    <AudioButton k={`ph:${phrase.id}:v${i}`} size="sm" tone="light" item={{ text: v.en, role: phrase.speaker, tts: v.tts }} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {phrase.replies.length > 0 && (
            <div>
              <h4 className="mb-1.5 text-xs font-bold text-sub">相手からの返答（復唱）</h4>
              <ul className="space-y-1.5">
                {phrase.replies.map((r, i) => (
                  <li key={i} className="flex items-center gap-2 rounded-xl border border-line px-3 py-2">
                    <RoleAvatar role={r.role} size={24} />
                    <div className="min-w-0 flex-1">
                      <p className="en text-[15px] font-semibold leading-snug">{r.en}</p>
                      <p className="text-xs text-sub">{r.ja}</p>
                    </div>
                    <AudioButton k={`ph:${phrase.id}:r${i}`} size="sm" tone="light" item={{ text: r.en, role: r.role, tts: r.tts }} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {phrase.keywords.length > 0 && (
            <div>
              <h4 className="mb-1.5 text-xs font-bold text-sub">聞き取りポイント</h4>
              <KeywordChips phrase={phrase} />
            </div>
          )}

          <NoteList notes={phrase.notes} />

          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={phrase.status} />
            <EvidenceTag evidence={phrase.evidence} />
            <Pill>Lv{phrase.level}</Pill>
            {phrase.sources?.length ? <SourceRefs ids={phrase.sources} /> : null}
          </div>
        </div>
      )}
    </article>
  )
}
