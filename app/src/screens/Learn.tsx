import { useLocation } from 'wouter'
import { AlertTriangle, BookA, ChevronRight, Hash, ListOrdered, Sparkles } from 'lucide-react'
import { ScreenHeader, Page } from '../components/chrome'
import { Card, Ring, Section } from '../components/ui'
import { PHASES, phrasesOf, dialoguesOf } from '../content'
import { FLOW_PHASES, TROUBLE_PHASES } from '../content/phase-ids'
import { FLOW_SCRIPT } from '../content/flow-script'
import { useProgress } from '../store/progress'
import { mastery } from '../engine/srs'
import type { Phase } from '../content/types'

function usePhaseMastery() {
  const items = useProgress((s) => s.phrases)
  return (p: Phase) => mastery(phrasesOf(p.id).map((x) => x.id), items)
}

export default function Learn() {
  const [, navigate] = useLocation()
  const m = usePhaseMastery()
  const progress = useProgress((s) => s.phases)
  const byId = (id: string) => PHASES.find((p) => p.id === id)!
  const basics = byId('basics')
  const flow = FLOW_PHASES.map(byId)
  const trouble = TROUBLE_PHASES.map(byId)

  return (
    <>
      <ScreenHeader title="学ぶ" sub="手術の流れに沿って、場面ごとの英語を" />
      <Page>
        <Section title="まずはここから">
          <Card onClick={() => navigate(`/phase/${basics.id}`)}>
            <div className="flex items-center gap-3 p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-warn-soft text-warn">
                <Sparkles size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold">{basics.titleJa}</p>
                <p className="truncate text-xs text-sub">{basics.summary}</p>
              </div>
              <Ring value={m(basics)} size={36} stroke={4} />
            </div>
          </Card>
          <Card onClick={() => navigate('/flow')} className="mt-2.5">
            <div className="flex items-center gap-3 p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-ink">
                <ListOrdered size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold">会話リスト（流れで一覧）</p>
                <p className="text-xs text-sub">開始前からプロタミンまでの {FLOW_SCRIPT.reduce((n, s) => n + s.ids.length, 0)} 文を、英語・日本語・音声で</p>
              </div>
              <ChevronRight size={18} className="text-faint" />
            </div>
          </Card>
        </Section>

        <Section title="手術の流れ（人工心肺）">
          <ol className="relative">
            {/* 送血（赤）→ 脱血（青）の回路線 */}
            <span className="circuit-rail absolute bottom-6 left-[21px] top-6 w-1 rounded-full opacity-70" aria-hidden="true" />
            {flow.map((p) => {
              const mm = m(p)
              const pr = progress[p.id]
              const nPhr = phrasesOf(p.id).length
              const nDlg = dialoguesOf(p.id).length
              return (
                <li key={p.id} className="relative mb-2.5 pl-12">
                  <span
                    className={`num absolute left-1 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border-4 border-bg text-sm font-bold ${
                      mm >= 0.66 ? 'bg-brand text-white' : pr?.drillRuns ? 'bg-brand-soft text-brand-ink' : 'bg-card text-sub shadow-card'
                    }`}
                  >
                    {p.order}
                  </span>
                  <Card onClick={() => navigate(`/phase/${p.id}`)}>
                    <div className="flex items-center gap-3 p-3.5">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold leading-tight">{p.titleJa}</p>
                        <p className="en text-xs font-semibold text-brand-ink">{p.titleEn}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-sub">{p.summary}</p>
                        <p className="mt-1 text-[11px] text-faint">
                          フレーズ {nPhr}・会話 {nDlg}
                          {pr?.drillBest ? `・ドリル最高 ${pr.drillBest}%` : ''}
                        </p>
                      </div>
                      <Ring value={mm} size={38} stroke={4}>
                        <span className="num text-[10px] font-bold text-sub">{Math.round(mm * 100)}</span>
                      </Ring>
                    </div>
                  </Card>
                </li>
              )
            })}
          </ol>
        </Section>

        <Section title="トラブル対応">
          <div className="grid grid-cols-2 gap-2.5">
            {trouble.map((p) => (
              <Card key={p.id} onClick={() => navigate(`/phase/${p.id}`)} className="border-l-4 border-l-[var(--art)]">
                <div className="p-3.5">
                  <AlertTriangle size={18} className="text-art" />
                  <p className="mt-1.5 text-sm font-bold leading-snug">{p.titleJa}</p>
                  <p className="en text-[11px] font-semibold text-sub">{p.titleEn}</p>
                  <div className="mt-2">
                    <Ring value={m(p)} size={26} stroke={3} color="var(--art)" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="ツール">
          <div className="space-y-2.5">
            <Card onClick={() => navigate('/numbers')}>
              <div className="flex items-center gap-3 p-4">
                <Hash size={22} className="shrink-0 text-art" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold">数値キャッチ</p>
                  <p className="text-xs text-sub">流量・圧・ACT・温度・時刻を、現場の読み方で聞き取る</p>
                </div>
                <ChevronRight size={18} className="text-faint" />
              </div>
            </Card>
            <Card onClick={() => navigate('/glossary')}>
              <div className="flex items-center gap-3 p-4">
                <BookA size={22} className="shrink-0 text-ven" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold">用語集</p>
                  <p className="text-xs text-sub">略語・短縮形・発音を確認</p>
                </div>
                <ChevronRight size={18} className="text-faint" />
              </div>
            </Card>
          </div>
        </Section>
      </Page>
    </>
  )
}
