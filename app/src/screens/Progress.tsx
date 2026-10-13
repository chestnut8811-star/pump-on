import { Link } from 'wouter'
import { Settings as SettingsIcon, Flame, Trophy, BookOpen, Activity, Info, ChevronRight } from 'lucide-react'
import { ScreenHeader, Page } from '../components/chrome'
import { Bar, Card, Section } from '../components/ui'
import { useProgress } from '../store/progress'
import { useSettings } from '../store/settings'
import { levelOf, LEVELS } from '../engine/xp'
import { BADGES } from '../engine/badges'
import { addDays, mastery, today } from '../engine/srs'
import { PHASES, phrasesOf } from '../content'
import { FLOW_PHASES, TROUBLE_PHASES } from '../content/phase-ids'

export default function Progress() {
  const s = useProgress()
  const goal = useSettings((x) => x.dailyGoal)
  const lv = levelOf(s.xp)
  const day = today()
  const learned = Object.keys(s.phrases).length
  const weeks = 10
  // 今日を含む直近 weeks 週（日曜始まり）
  const start = addDays(day, -(new Date().getDay() + 7 * (weeks - 1)))
  const cells = Array.from({ length: weeks * 7 }, (_, i) => addDays(start, i))
  const byId = (id: string) => PHASES.find((p) => p.id === id)!

  return (
    <>
      <ScreenHeader
        title="記録"
        sub="学習の足あと"
        right={
          <Link href="/settings" aria-label="設定" className="inline-flex h-11 w-11 items-center justify-center rounded-full active:bg-white/10">
            <SettingsIcon size={22} />
          </Link>
        }
      />
      <Page>
        <Card className="mt-4 p-5">
          <p className="text-xs font-bold text-sub">
            Lv{lv.current.level}・<span className="en">{lv.current.title}</span>
          </p>
          <p className="text-xl font-extrabold">{lv.current.ja}</p>
          <Bar value={lv.progress} className="mt-3" />
          <p className="mt-1.5 text-xs text-sub">
            累計 <span className="num font-bold text-ink">{s.xp}</span> XP
            {lv.next ? `・次の「${lv.next.ja}」まで ${lv.next.min - s.xp} XP` : '・最高レベル'}
          </p>
          <div className="mt-4 flex gap-1">
            {LEVELS.map((l) => (
              <span key={l.level} className={`h-1.5 flex-1 rounded-full ${s.xp >= l.min ? 'bg-brand' : 'bg-line'}`} title={l.ja} />
            ))}
          </div>
        </Card>

        <div className="mt-3 grid grid-cols-3 gap-2.5">
          <Stat icon={<Flame size={18} className="text-[#f08a24]" />} label="連続日数" value={`${s.streak.lastDay === day || s.streak.lastDay === addDays(day, -1) ? s.streak.current : 0}`} sub={`最高 ${s.streak.best}`} />
          <Stat icon={<BookOpen size={18} className="text-ven" />} label="出会った表現" value={`${learned}`} sub="フレーズ" />
          <Stat icon={<Activity size={18} className="text-art" />} label="シミュレーター" value={`${s.counters.sims}`} sub="回" />
        </div>

        <Section title={`学習カレンダー（目標 ${goal} XP/日）`}>
          <Card className="p-4">
            <div className="grid grid-flow-col grid-rows-7 gap-1" style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}>
              {cells.map((d) => {
                const xp = s.daily[d] ?? 0
                const lvl = d > day ? -1 : xp === 0 ? 0 : xp < goal / 2 ? 1 : xp < goal ? 2 : 3
                const bg = lvl < 0 ? 'transparent' : ['var(--line)', 'color-mix(in srgb, var(--brand) 35%, transparent)', 'color-mix(in srgb, var(--brand) 65%, transparent)', 'var(--brand)'][lvl]
                return <span key={d} className={`aspect-square rounded-[4px] ${d === day ? 'ring-2 ring-navy/40' : ''}`} style={{ background: bg }} title={`${d}: ${xp} XP`} />
              })}
            </div>
            <p className="mt-2 text-[11px] text-faint">濃いほど目標に近い日</p>
          </Card>
        </Section>

        <Section title="シーンの習熟度">
          <Card className="divide-y divide-line">
            {['basics', ...FLOW_PHASES, ...TROUBLE_PHASES].map((id) => {
              const p = byId(id)
              const m = mastery(phrasesOf(p.id).map((x) => x.id), s.phrases)
              return (
                <Link key={id} href={`/phase/${id}`} className="flex items-center gap-3 px-4 py-2.5 active:bg-card-2">
                  <span className="w-28 shrink-0 truncate text-[13px] font-semibold">{p.titleJa}</span>
                  <Bar value={m} className="flex-1" color={p.group === 'trouble' ? 'var(--art)' : 'var(--brand)'} />
                  <span className="num w-9 text-right text-xs text-sub">{Math.round(m * 100)}%</span>
                </Link>
              )
            })}
          </Card>
        </Section>

        <Section title={`バッジ（${Object.keys(s.badges).length}/${BADGES.length}）`}>
          <div className="grid grid-cols-3 gap-2.5">
            {BADGES.map((b) => {
              const got = s.badges[b.id]
              return (
                <div key={b.id} className={`flex flex-col items-center rounded-2xl p-3 text-center ${got ? 'bg-card shadow-card' : 'border border-dashed border-line'}`}>
                  <span
                    className={`num flex h-11 w-11 items-center justify-center rounded-full text-lg font-extrabold ${got ? 'bg-navy text-[#3fd3c3]' : 'bg-card-2 text-faint'}`}
                  >
                    {b.glyph}
                  </span>
                  <p className={`en mt-1.5 text-[12px] font-bold leading-tight ${got ? '' : 'text-faint'}`}>{b.name}</p>
                  <p className="mt-0.5 text-[10px] leading-snug text-sub">{b.ja}</p>
                </div>
              )
            })}
          </div>
        </Section>

        <Section>
          <Card className="divide-y divide-line">
            <Link href="/settings" className="flex min-h-13 items-center gap-3 px-4 py-3">
              <SettingsIcon size={20} className="text-sub" />
              <span className="flex-1 font-semibold">設定・データの書き出し</span>
              <ChevronRight size={18} className="text-faint" />
            </Link>
            <Link href="/about" className="flex min-h-13 items-center gap-3 px-4 py-3">
              <Info size={20} className="text-sub" />
              <span className="flex-1 font-semibold">このアプリについて・根拠</span>
              <ChevronRight size={18} className="text-faint" />
            </Link>
          </Card>
        </Section>
        <p className="mt-4 flex items-center justify-center gap-1 text-xs text-faint">
          <Trophy size={12} /> 記録はこの端末の中だけに保存されます
        </p>
      </Page>
    </>
  )
}

function Stat({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <Card className="p-3">
      {icon}
      <p className="mt-1 text-[11px] text-sub">{label}</p>
      <p className="num text-2xl font-extrabold leading-tight">{value}</p>
      <p className="text-[10px] text-faint">{sub}</p>
    </Card>
  )
}
