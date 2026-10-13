import { useLocation } from 'wouter'
import { Clock, Play, Star, AlertTriangle, ChevronRight, Ear, MessageSquareReply, Mic } from 'lucide-react'
import { ScreenHeader, Page } from '../components/chrome'
import { Card, Pill, Section, Segmented, Empty } from '../components/ui'
import { StatusPill } from '../components/content'
import { PumpRotor } from '../components/brand'
import { CASES, PHASE_BY_ID } from '../content'
import { FLOW_PHASES } from '../content/phase-ids'
import { MODE_META, phaseRange, type SimMode } from '../engine/sim'
import { useSettings } from '../store/settings'
import { useProgress } from '../store/progress'

export default function SimList() {
  const [, navigate] = useLocation()
  const mode = useSettings((s) => s.simMode)
  const set = useSettings((s) => s.set)
  const sims = useProgress((s) => s.sims)
  const standard = CASES.find((c) => c.tags.includes('standard'))
  const scenes = standard ? FLOW_PHASES.filter((p) => phaseRange(standard, p)) : []

  return (
    <>
      <ScreenHeader title="CPBシミュレーター" sub="手術の進行に沿って、英語で応答する" />
      <Page>
        <Card className="hero-grad mt-4 overflow-hidden p-5 text-white">
          <div className="flex items-start gap-4">
            <span className="text-[#3fd3c3]">
              <PumpRotor size={44} spinning hub="#0b1f3a" />
            </span>
            <div className="min-w-0">
              <p className="font-extrabold leading-snug">人工心肺の操作席に座ったつもりで</p>
              <ul className="mt-2 space-y-1 text-[13px] text-white/80">
                <li className="flex items-center gap-1.5"><Ear size={14} /> 外科医・麻酔科医の英語を聞き取る</li>
                <li className="flex items-center gap-1.5"><MessageSquareReply size={14} /> 状況に合う返答・復唱を選ぶ</li>
                <li className="flex items-center gap-1.5"><Mic size={14} /> 報告を自分の口で言う</li>
              </ul>
            </div>
          </div>
        </Card>

        <Section title="モード">
          <Segmented value={mode} onChange={(m: SimMode) => set('simMode', m)} options={(Object.keys(MODE_META) as SimMode[]).map((m) => ({ value: m, label: MODE_META[m].label }))} />
          <p className="mt-2 px-1 text-xs text-sub">{MODE_META[mode].desc}</p>
        </Section>

        <Section title="症例（すべて架空）">
          {CASES.length === 0 && <Empty title="症例は準備中です" />}
          <div className="space-y-3">
            {CASES.map((c) => {
              const p = sims[c.id]
              return (
                <Card key={c.id} onClick={() => navigate(`/sim/${c.id}`)}>
                  <div className="p-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {c.tags.includes('trouble') ? (
                        <Pill tone="art">
                          <AlertTriangle size={12} />
                          トラブル
                        </Pill>
                      ) : (
                        <Pill tone="brand">標準の流れ</Pill>
                      )}
                      <Pill>
                        {Array.from({ length: 3 }, (_, i) => (
                          <Star key={i} size={11} className={i < c.difficulty ? 'fill-current text-warn' : 'text-faint'} />
                        ))}
                      </Pill>
                      <Pill>
                        <Clock size={11} />約{c.minutes}分
                      </Pill>
                      <StatusPill status={c.status} />
                    </div>
                    <p className="mt-2 text-[17px] font-extrabold leading-snug">{c.titleJa}</p>
                    <p className="en text-xs font-semibold text-brand-ink">{c.titleEn}</p>
                    <p className="mt-1.5 line-clamp-2 text-sm text-sub">{c.synopsis}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-sub">
                        {p ? `ベスト ${p.bestRank || '-'}（${p.bestScore}点）・${p.runs}回` : 'まだ挑戦していません'}
                        {p?.cleared.includes('real') ? ' ・リアルOR達成' : ''}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1.5 text-sm font-bold text-white">
                        <Play size={14} /> 開始
                      </span>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </Section>

        {standard && scenes.length > 0 && (
          <Section title="シーン単位で練習（標準の症例から）">
            <div className="overflow-hidden rounded-2xl bg-card shadow-card">
              {scenes.map((pid, i) => {
                const ph = PHASE_BY_ID[pid]
                const p = sims[`${standard.id}#${pid}`]
                return (
                  <button
                    key={pid}
                    type="button"
                    onClick={() => navigate(`/sim/${standard.id}?phase=${pid}`)}
                    className={`flex min-h-13 w-full items-center gap-3 px-4 py-3 text-left active:bg-card-2 ${i ? 'border-t border-line' : ''}`}
                  >
                    <span className="num flex h-7 w-7 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand-ink">{ph.order}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-bold">{ph.titleJa}</span>
                      <span className="en block text-[11px] text-sub">{ph.titleEn}</span>
                    </span>
                    {p && <span className="text-xs font-bold text-brand-ink">{p.bestRank}</span>}
                    <ChevronRight size={18} className="text-faint" />
                  </button>
                )
              })}
            </div>
          </Section>
        )}
      </Page>
    </>
  )
}
