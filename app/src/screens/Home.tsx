import { Link, useLocation } from 'wouter'
import { ArrowRight, Flame, Hash, Play, RotateCcw, Sparkles, BookOpenCheck, Share, X } from 'lucide-react'
import { Wordmark, PumpRotor } from '../components/brand'
import { Card, Ring, Section, Bar, Pill } from '../components/ui'
import { Page } from '../components/chrome'
import { useProgress } from '../store/progress'
import { useSettings } from '../store/settings'
import { levelOf } from '../engine/xp'
import { addDays, dueIds, mastery, today } from '../engine/srs'
import { PHASES, PHRASE_BY_ID, phrasesOf } from '../content'
import { FLOW_PHASES } from '../content/phase-ids'

function greeting(): string {
  const h = new Date().getHours()
  if (h < 5) return 'おつかれさまです'
  if (h < 11) return 'おはようございます'
  if (h < 18) return 'こんにちは'
  return 'こんばんは'
}

export default function Home() {
  const [, navigate] = useLocation()
  const xp = useProgress((s) => s.xp)
  const streak = useProgress((s) => s.streak)
  const daily = useProgress((s) => s.daily)
  const phrases = useProgress((s) => s.phrases)
  const phases = useProgress((s) => s.phases)
  const last = useProgress((s) => s.last)
  const goal = useSettings((s) => s.dailyGoal)
  const hintClosed = useSettings((s) => s.installHintClosed)
  const setSetting = useSettings((s) => s.set)
  const standalone =
    (typeof window !== 'undefined' && window.matchMedia?.('(display-mode: standalone)').matches) ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  const lv = levelOf(xp)
  const day = today()
  const todayXp = daily[day] ?? 0
  const due = dueIds(phrases, day).filter((id) => PHRASE_BY_ID[id]).length
  // 昨日までに途切れていたら 0 と表示（記録上の current は次に学習したときに更新される）
  const streakAlive = streak.lastDay === day || streak.lastDay === addDays(day, -1) ? streak.current : 0

  // おすすめ: 手術の流れで、まだドリルをしていない最初のシーン（全部済なら習熟度が一番低いシーン）
  const flow = FLOW_PHASES.map((id) => PHASES.find((p) => p.id === id)!).filter(Boolean)
  const notDone = flow.find((p) => !(phases[p.id]?.drillRuns ?? 0))
  const weakest = [...flow].sort((a, b) => mastery(phrasesOf(a.id).map((x) => x.id), phrases) - mastery(phrasesOf(b.id).map((x) => x.id), phrases))[0]
  const next = notDone ?? weakest
  const basicsDone = (phases.basics?.drillRuns ?? 0) > 0

  return (
    <>
      <header className="hero-grad pt-safe text-white">
        <div className="mx-auto max-w-3xl px-5 pb-8 pt-4">
          <div className="flex items-center justify-between">
            <Wordmark size={22} />
            <Link href="/progress" className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-bold">
              <Flame size={16} className={streakAlive > 0 ? 'text-[#ffb347]' : 'text-white/50'} />
              <span className="num">{streakAlive}</span>
              <span className="text-xs font-normal text-white/70">日連続</span>
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/70">{greeting()}</p>
          <p className="mt-1 text-[22px] font-extrabold leading-tight">今日も、ポンプを回す前の英語から。</p>
          <div className="mt-5 flex items-center gap-4">
            <Ring value={Math.min(1, todayXp / goal)} size={64} stroke={7} color="#3fd3c3" track="rgb(255 255 255 / 15%)">
              <span className="text-center leading-none">
                <span className="num block text-base font-bold">{todayXp}</span>
                <span className="block text-[9px] text-white/60">/{goal}XP</span>
              </span>
            </Ring>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-white/60">
                Lv{lv.current.level} <span className="en">{lv.current.title}</span>
              </p>
              <p className="text-sm font-bold">{lv.current.ja}</p>
              <Bar value={lv.progress} color="#3fd3c3" className="mt-2 bg-white/15" />
              <p className="mt-1 text-[11px] text-white/60">{lv.next ? `次のレベルまで ${lv.next.min - xp} XP` : '最高レベルに到達'}</p>
            </div>
          </div>
        </div>
      </header>

      <Page>
        <div className="-mt-4 space-y-3">
          <Card onClick={() => navigate('/sim')} className="overflow-hidden">
            <div className="flex items-center gap-4 p-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-navy text-[#3fd3c3]">
                <PumpRotor size={38} spinning hub="#0b1f3a" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-brand-ink">CPB英会話シミュレーター</p>
                <p className="font-extrabold leading-snug">手術の流れの中で、英語で応答しよう</p>
                <p className="mt-0.5 text-xs text-sub">外科医・麻酔科医の声に即答。トラブル症例も。</p>
              </div>
              <Play size={22} className="shrink-0 text-brand" />
            </div>
          </Card>

          {!standalone && !hintClosed && (
            <div className="relative rounded-2xl border border-brand/30 bg-brand-soft p-4 pr-11">
              <button
                type="button"
                aria-label="案内を閉じる"
                onClick={() => setSetting('installHintClosed', true)}
                className="absolute right-2 top-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-brand-ink active:bg-white/40"
              >
                <X size={18} />
              </button>
              <p className="font-bold text-brand-ink">iPhone ではホーム画面に追加して使えます</p>
              <p className="mt-1 text-[13px] leading-relaxed text-ink">
                Safari の <Share size={14} className="mx-0.5 inline align-[-2px]" /> 共有 →「ホーム画面に追加」。アイコンから全画面で起動し、2回目からはオフラインでも使えます（追加した直後の初回だけはネットにつないで開いてください）。
              </p>
            </div>
          )}

          {last && (
            <Card onClick={() => navigate(last.path)}>
              <div className="flex items-center gap-3 p-4">
                <BookOpenCheck size={22} className="shrink-0 text-brand" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-sub">続きから</p>
                  <p className="truncate font-bold">{last.label}</p>
                </div>
                <ArrowRight size={18} className="text-faint" />
              </div>
            </Card>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Card onClick={() => navigate('/review')}>
              <div className="p-4">
                <RotateCcw size={20} className="text-ven" />
                <p className="mt-2 text-xs text-sub">今日の復習</p>
                <p className="num text-2xl font-extrabold">
                  {due}
                  <span className="ml-1 text-xs font-normal text-sub">件</span>
                </p>
              </div>
            </Card>
            <Card onClick={() => navigate('/numbers')}>
              <div className="p-4">
                <Hash size={20} className="text-art" />
                <p className="mt-2 text-xs text-sub">数値キャッチ</p>
                <p className="text-sm font-bold leading-snug">
                  four-eighty? <br />
                  four-eighteen?
                </p>
              </div>
            </Card>
          </div>
        </div>

        <Section title="おすすめの次の一歩">
          {!basicsDone ? (
            <Card onClick={() => navigate('/phase/basics')}>
              <div className="flex items-center gap-3 p-4">
                <Sparkles size={22} className="shrink-0 text-warn" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold">まずは「手術室英語の基本」</p>
                  <p className="text-xs text-sub">指示 → 復唱 → 確認の型と、数字の読み方</p>
                </div>
                <ArrowRight size={18} className="text-faint" />
              </div>
            </Card>
          ) : next ? (
            <Card onClick={() => navigate(`/phase/${next.id}`)}>
              <div className="flex items-center gap-3 p-4">
                <span className="num flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand-ink">{next.order}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{next.titleJa}</p>
                  <p className="truncate text-xs text-sub">{next.summary}</p>
                </div>
                <ArrowRight size={18} className="text-faint" />
              </div>
            </Card>
          ) : null}
        </Section>

        <p className="mt-8 px-1 text-[11px] leading-relaxed text-faint">
          <Pill tone="warn" className="mr-1">AI下書き・臨床未監修</Pill>
          教育用の教材です。会話中の数値は例で、実際の管理は施設のプロトコルと担当医の指示に従ってください。
          <Link href="/about" className="ml-1 underline">
            詳しく
          </Link>
        </p>
      </Page>
    </>
  )
}
