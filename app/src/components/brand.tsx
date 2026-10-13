// ブランド要素: ローラーポンプのポンプヘッド（回転子と2つのローラー）をモチーフにした記号

interface RotorProps {
  size?: number
  spinning?: boolean
  className?: string
  /** ハブ（中心）の色 */
  hub?: string
}

export function PumpRotor({ size = 24, spinning = false, className = '', hub = 'var(--navy)' }: RotorProps) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.35" />
      <g className={spinning ? 'animate-pump' : ''} style={{ transformOrigin: '24px 24px' }}>
        <rect x="21.5" y="8" width="5" height="32" rx="2.5" fill="currentColor" />
        <circle cx="24" cy="9.5" r="5.2" fill="currentColor" />
        <circle cx="24" cy="38.5" r="5.2" fill="currentColor" />
      </g>
      <circle cx="24" cy="24" r="3.4" fill={hub} />
    </svg>
  )
}

/** ロゴ（記号＋ワードマーク） */
export function Wordmark({ size = 22, className = '' }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-extrabold tracking-tight ${className}`} style={{ fontSize: size }}>
      <span className="text-[#3fd3c3]">
        <PumpRotor size={size * 1.15} hub="#0b1f3a" />
      </span>
      <span className="en">
        Pump On <span className="text-[#ff6b81]">!</span>
      </span>
    </span>
  )
}

/** 送血（赤）と脱血（青）の回路線。見出しの飾りに使う */
export function CircuitLine({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 8" preserveAspectRatio="none" className={className} aria-hidden="true">
      <rect x="0" y="1" width="58" height="6" rx="3" fill="var(--art)" />
      <rect x="62" y="1" width="58" height="6" rx="3" fill="var(--ven)" />
    </svg>
  )
}
