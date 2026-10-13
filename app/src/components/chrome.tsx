// 画面の枠: ヘッダー、下のタブバー、通知

import { useEffect, type ReactNode } from 'react'
import { Link, useLocation } from 'wouter'
import { ChevronLeft, House, Map, RotateCcw, BarChart3, Award, Target, Info, AlertTriangle } from 'lucide-react'
import { PumpRotor } from './brand'
import { useUi, type Toast } from '../store/ui'

/** 濃紺のヘッダー（ステータスバーの下まで伸ばす） */
export function ScreenHeader({
  title,
  sub,
  back,
  right,
  children,
}: {
  title: ReactNode
  sub?: ReactNode
  back?: string | (() => void)
  right?: ReactNode
  children?: ReactNode
}) {
  const [, navigate] = useLocation()
  return (
    <header className="pt-safe sticky top-0 z-20 bg-navy text-white">
      <div className="mx-auto flex min-h-14 max-w-3xl items-center gap-2 px-3">
        {back !== undefined && (
          <button
            type="button"
            aria-label="戻る"
            onClick={() => (typeof back === 'function' ? back() : navigate(back))}
            className="-ml-1 inline-flex h-11 w-11 items-center justify-center rounded-full active:bg-white/10"
          >
            <ChevronLeft size={26} />
          </button>
        )}
        <div className="min-w-0 flex-1 py-2">
          <h1 className="truncate text-[17px] font-bold leading-tight">{title}</h1>
          {sub && <p className="truncate text-xs text-white/65">{sub}</p>}
        </div>
        {right}
      </div>
      {children}
    </header>
  )
}

/** 画面本体の余白（タブバーぶん下を空ける） */
export function Page({ children, tabbed = true, className = '' }: { children: ReactNode; tabbed?: boolean; className?: string }) {
  return (
    <main className={`mx-auto w-full max-w-3xl px-4 ${tabbed ? 'pb-tabbar' : 'pb-safe-plus'} ${className}`}>
      {children}
    </main>
  )
}

const TABS = [
  { to: '/', label: 'ホーム', icon: House, match: (p: string) => p === '/' },
  { to: '/learn', label: '学ぶ', icon: Map, match: (p: string) => p.startsWith('/learn') || p.startsWith('/phase') || p.startsWith('/glossary') || p.startsWith('/numbers') || p.startsWith('/flow') },
  { to: '/sim', label: 'シミュレーター', icon: null, match: (p: string) => p.startsWith('/sim') },
  { to: '/review', label: '復習', icon: RotateCcw, match: (p: string) => p.startsWith('/review') },
  { to: '/progress', label: '記録', icon: BarChart3, match: (p: string) => p.startsWith('/progress') || p.startsWith('/settings') || p.startsWith('/about') },
]

export function TabBar() {
  const [path] = useLocation()
  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card/95 backdrop-blur" aria-label="メインメニュー">
      <div className="mx-auto grid h-16 max-w-3xl grid-cols-5">
        {TABS.map((t) => {
          const on = t.match(path)
          if (!t.icon) {
            return (
              <Link key={t.to} href={t.to} className="relative flex flex-col items-center justify-end pb-1.5" aria-current={on ? 'page' : undefined}>
                <span
                  className={`absolute -top-5 flex h-14 w-14 items-center justify-center rounded-full border-4 border-bg shadow-card transition ${
                    on ? 'bg-navy text-[#3fd3c3]' : 'bg-brand text-white'
                  }`}
                >
                  <PumpRotor size={34} spinning={on} hub={on ? '#0b1f3a' : '#0e9f92'} />
                </span>
                <span className={`text-[10px] font-bold ${on ? 'text-ink' : 'text-sub'}`}>{t.label}</span>
              </Link>
            )
          }
          const Icon = t.icon
          return (
            <Link key={t.to} href={t.to} className="flex flex-col items-center justify-center gap-0.5" aria-current={on ? 'page' : undefined}>
              <Icon size={22} strokeWidth={on ? 2.6 : 2} className={on ? 'text-brand-ink' : 'text-faint'} />
              <span className={`text-[10px] font-bold ${on ? 'text-ink' : 'text-sub'}`}>{t.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

/**
 * 通知。hold のあいだ（ドリル・シミュレーターなど、タブバーを隠した画面の途中）は表示せずにためておき、
 * その画面を出たときに表示する（上部のヘッダーや閉じるボタンに重ねないため）
 */
export function ToastHost({ hold = false }: { hold?: boolean }) {
  const toasts = useUi((s) => s.toasts)
  if (hold || toasts.length === 0) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center gap-2 px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)]">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  )
}

function ToastItem({ toast: t }: { toast: Toast }) {
  const dismiss = useUi((s) => s.dismiss)
  // 表示した時点から数えて消す
  useEffect(() => {
    const timer = setTimeout(() => dismiss(t.id), 3600)
    return () => clearTimeout(timer)
  }, [t.id, dismiss])
  return (
    <button
      type="button"
      onClick={() => dismiss(t.id)}
      className="animate-pop pointer-events-auto mt-2 flex w-full max-w-md items-center gap-3 rounded-2xl bg-navy px-4 py-3 text-left text-white shadow-card"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#3fd3c3]">
        {t.kind === 'badge' ? <Award size={20} /> : t.kind === 'goal' ? <Target size={20} /> : t.kind === 'error' ? <AlertTriangle size={20} /> : <Info size={20} />}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold">{t.title}</span>
        {t.body && <span className="block text-xs text-white/70">{t.body}</span>}
      </span>
    </button>
  )
}
