// 汎用 UI 部品

import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark'

const VARIANT: Record<Variant, string> = {
  primary: 'bg-brand text-white shadow-card active:brightness-95 disabled:opacity-40',
  secondary: 'bg-card text-ink border border-line active:bg-card-2 disabled:opacity-40',
  ghost: 'bg-transparent text-brand-ink active:bg-brand-soft disabled:opacity-40',
  danger: 'bg-ng text-white active:brightness-95 disabled:opacity-40',
  dark: 'bg-navy text-white active:brightness-110 disabled:opacity-40',
}

export function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  className = '',
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: 'sm' | 'md' | 'lg'; block?: boolean }) {
  const sz = size === 'sm' ? 'min-h-9 px-3 text-sm' : size === 'lg' ? 'min-h-14 px-6 text-lg' : 'min-h-11 px-4 text-[15px]'
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold transition ${sz} ${VARIANT[variant]} ${block ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  const base = `rounded-2xl bg-card shadow-card ${className}`
  if (onClick)
    return (
      <button type="button" onClick={onClick} className={`${base} block w-full text-left transition active:scale-[0.99]`}>
        {children}
      </button>
    )
  return <div className={base}>{children}</div>
}

export function Pill({ children, tone = 'neutral', className = '' }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold leading-5 ${TONE[tone]} ${className}`}>
      {children}
    </span>
  )
}

export type Tone = 'neutral' | 'brand' | 'art' | 'ven' | 'warn' | 'ok' | 'ng' | 'violet'

export const TONE: Record<Tone, string> = {
  neutral: 'bg-card-2 text-sub border border-line',
  brand: 'bg-brand-soft text-brand-ink',
  art: 'bg-art-soft text-art',
  ven: 'bg-ven-soft text-ven',
  warn: 'bg-warn-soft text-warn',
  ok: 'bg-ok-soft text-ok',
  ng: 'bg-ng-soft text-ng',
  violet: 'bg-violet-soft text-violet',
}

export function Section({ title, action, children, className = '' }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`mt-6 ${className}`}>
      {(title || action) && (
        <div className="mb-2 flex items-end justify-between px-1">
          {title && <h2 className="text-[13px] font-bold tracking-wide text-sub">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className = '',
  dark = false,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: ReactNode }[]
  className?: string
  dark?: boolean
}) {
  return (
    <div
      role="tablist"
      className={`grid gap-1 rounded-xl p-1 ${dark ? 'bg-white/10' : 'bg-card-2 border border-line'} ${className}`}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(o.value)}
            className={`min-h-11 rounded-lg px-2 text-[13px] font-bold transition ${
              on ? (dark ? 'bg-white text-navy' : 'bg-card text-ink shadow-card') : dark ? 'text-white/70' : 'text-sub'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/** 円形の進捗（0〜1） */
export function Ring({
  value,
  size = 44,
  stroke = 5,
  color = 'var(--brand)',
  track = 'var(--line)',
  children,
}: {
  value: number
  size?: number
  stroke?: number
  color?: string
  track?: string
  children?: ReactNode
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const v = Math.max(0, Math.min(1, value))
  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v)}
          style={{ transition: 'stroke-dashoffset 500ms ease' }}
        />
      </svg>
      {children && <span className="absolute inset-0 flex items-center justify-center">{children}</span>}
    </span>
  )
}

export function Bar({ value, color = 'var(--brand)', className = '' }: { value: number; color?: string; className?: string }) {
  return (
    <div className={`h-2 overflow-hidden rounded-full bg-line ${className}`}>
      <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, background: color }} />
    </div>
  )
}

export function Empty({ title, body, children }: { title: string; body?: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line px-5 py-8 text-center">
      <p className="font-bold">{title}</p>
      {body && <p className="mt-1 text-sm text-sub">{body}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}

export function Toggle({ checked, onChange, label, desc }: { checked: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center justify-between gap-3 py-2">
      <span>
        <span className="block text-[15px] font-semibold">{label}</span>
        {desc && <span className="block text-xs text-sub">{desc}</span>}
      </span>
      <span className="relative inline-flex shrink-0">
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="h-7 w-12 rounded-full bg-line transition peer-checked:bg-brand" />
        <span className="absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
      </span>
    </label>
  )
}
