import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { ScreenHeader, Page } from '../components/chrome'
import { Card, Empty } from '../components/ui'
import { AudioButton } from '../components/audio'
import { NoteList, StatusPill } from '../components/content'
import { GLOSSARY_SORTED } from '../content'
import type { GlossaryCategory } from '../content/types'

const CATS: { value: GlossaryCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'circuit', label: '回路・装置' },
  { value: 'procedure', label: '手技・操作' },
  { value: 'monitor', label: 'モニター' },
  { value: 'lab', label: '検査値' },
  { value: 'drug', label: '薬剤' },
  { value: 'communication', label: '会話の型' },
  { value: 'anatomy', label: '解剖' },
  { value: 'role', label: '職種' },
]

export default function Glossary() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<GlossaryCategory | 'all'>('all')
  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return GLOSSARY_SORTED.filter(
      (g) =>
        (cat === 'all' || g.category === cat) &&
        (!s || g.term.toLowerCase().includes(s) || g.ja.includes(q.trim()) || g.aka?.some((a) => a.toLowerCase().includes(s)) || g.desc.includes(q.trim())),
    )
  }, [q, cat])

  return (
    <>
      <ScreenHeader title="用語集" sub="略語・短縮形・発音" back="/learn">
        <div className="mx-auto max-w-3xl px-3 pb-3">
          <label className="flex items-center gap-2 rounded-xl bg-white/10 px-3">
            <Search size={18} className="text-white/60" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="英語・日本語で検索"
              className="min-h-11 w-full bg-transparent text-white outline-none placeholder:text-white/50"
            />
          </label>
        </div>
      </ScreenHeader>
      <Page>
        <div className="-mx-4 mt-3 flex gap-1.5 overflow-x-auto px-4 pb-1">
          {CATS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCat(c.value)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] font-bold ${cat === c.value ? 'bg-navy text-white' : 'border border-line bg-card text-sub'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <p className="mt-2 px-1 text-xs text-sub">{list.length} 語</p>
        {list.length === 0 && <Empty title="見つかりません" body="別の言葉で検索してください" />}
        <div className="mt-2 space-y-2.5">
          {list.map((g) => (
            <Card key={g.term} className="p-4">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="en text-[17px] font-bold leading-snug">{g.term}</p>
                  {g.aka?.length ? <p className="en text-xs text-sub">= {g.aka.join(' / ')}</p> : null}
                  <p className="mt-0.5 text-sm font-semibold text-brand-ink">{g.ja}</p>
                </div>
                <AudioButton k={`gl:${g.term}`} item={{ text: g.term, role: 'perfusionist', tts: g.tts }} size="sm" tone="light" />
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-ink">{g.desc}</p>
              <NoteList className="mt-2" notes={g.notes} />
              {g.status !== 'ai-draft' && (
                <div className="mt-2">
                  <StatusPill status={g.status} />
                </div>
              )}
            </Card>
          ))}
        </div>
        {list.length > 0 && (
          <p className="mt-4 px-1 text-[11px] text-faint">
            すべての用語は AI 下書き・臨床未監修です。施設で使う呼び方と異なる場合があります。
          </p>
        )}
      </Page>
    </>
  )
}
