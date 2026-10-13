// 人工心肺コンソール風のモニター表示（シミュレーター用）。値は教材の「例」。

import { useEffect, useRef, useState } from 'react'
import type { HudState } from '../content/types'
import { minutesBetween } from '../engine/sim'

const fmt = (v: number | null, digits = 0) => (v === null || v === undefined ? '---' : v.toFixed(digits))

function Cell({ label, value, unit, color, changed, compact }: { label: string; value: string; unit: string; color: string; changed: boolean; compact: boolean }) {
  if (compact)
    return (
      <div className={`rounded-lg border border-console-line bg-console-panel px-2 py-1 transition-colors ${changed ? 'bg-white/10' : ''}`}>
        <p className="flex items-baseline justify-between gap-1 text-[10px] text-console-sub">
          <span className="font-bold tracking-wider">{label}</span>
          <span>{unit}</span>
        </p>
        <p className="seg mt-0.5 text-[19px] font-bold leading-none" style={{ color }}>
          {value}
        </p>
      </div>
    )
  return (
    <div className={`rounded-xl border border-console-line bg-console-panel px-2 py-1.5 transition-colors ${changed ? 'bg-white/10' : ''}`}>
      <p className="text-[10px] font-bold tracking-wider text-console-sub">{label}</p>
      <p className="seg text-[26px] font-bold leading-none" style={{ color }}>
        {value}
      </p>
      <p className="text-[10px] text-console-sub">{unit}</p>
    </div>
  )
}

/** compact: 進行中に上へ固定して出すときの小さい表示（主要4値の文字を小さくし、単位を項目名の横に置く） */
export function HudPanel({ hud, clock, compact = false }: { hud: HudState; clock: string | null; compact?: boolean }) {
  const prev = useRef<HudState>(hud)
  const [changed, setChanged] = useState<Set<keyof HudState>>(new Set())

  useEffect(() => {
    const diff = new Set<keyof HudState>()
    for (const k of Object.keys(hud) as (keyof HudState)[]) if (hud[k] !== prev.current[k]) diff.add(k)
    prev.current = hud
    if (diff.size === 0) return
    setChanged(diff)
    const t = setTimeout(() => setChanged(new Set()), 1200)
    return () => clearTimeout(t)
  }, [hud])

  const cpb = hud.cpbStart && clock ? minutesBetween(hud.cpbStart, clock) : null
  const xc = hud.clampStart && clock ? minutesBetween(hud.clampStart, clock) : null
  const pleg = hud.plegAt && clock ? minutesBetween(hud.plegAt, clock) : null
  const levelBars = hud.level === 'ok' ? 4 : hud.level === 'low' ? 2 : 1
  const levelColor = hud.level === 'ok' ? 'var(--seg-flow)' : hud.level === 'low' ? 'var(--seg-temp)' : 'var(--seg-map)'

  return (
    <div className={`console rounded-2xl border border-console-line ${compact ? 'p-2' : 'p-2.5'}`} aria-label="人工心肺モニター（例）">
      <div className={`flex items-center gap-2 px-1 text-[11px] font-bold ${compact ? 'pb-1.5' : 'pb-2'}`}>
        <span className={`h-2 w-2 rounded-full ${hud.cpbStart ? 'bg-[var(--seg-flow)]' : 'bg-console-sub'}`} />
        <span className="tracking-wider text-console-ink">{hud.stage}</span>
        <span className="ml-auto flex gap-2.5 text-console-sub">
          {clock && <span className="num text-console-ink">{clock}</span>}
          {cpb !== null && <span className="num">CPB {cpb}m</span>}
          {xc !== null && <span className="num text-[var(--seg-map)]">XC {xc}m</span>}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        <Cell label="FLOW" value={fmt(hud.flow, 1)} unit="L/min" color="var(--seg-flow)" changed={changed.has('flow')} compact={compact} />
        <Cell label="MAP" value={fmt(hud.map)} unit="mmHg" color="var(--seg-map)" changed={changed.has('map')} compact={compact} />
        <Cell label="TEMP" value={fmt(hud.temp, 1)} unit="°C" color="var(--seg-temp)" changed={changed.has('temp')} compact={compact} />
        <Cell label="ACT" value={fmt(hud.act)} unit="sec" color="var(--seg-act)" changed={changed.has('act')} compact={compact} />
      </div>
      <div className="mt-1.5 grid grid-cols-4 gap-1.5 text-[11px]">
        <div className={`rounded-lg border border-console-line bg-console-panel px-2 py-1 ${changed.has('svo2') ? 'bg-white/10' : ''}`}>
          <span className="text-console-sub">SvO2 </span>
          <span className="seg font-bold" style={{ color: 'var(--seg-svo2)' }}>
            {fmt(hud.svo2)}
          </span>
        </div>
        <div className={`rounded-lg border border-console-line bg-console-panel px-2 py-1 ${changed.has('linePressure') ? 'bg-white/10' : ''}`}>
          <span className="text-console-sub">LINE </span>
          <span className="seg font-bold" style={{ color: hud.alarm && /LINE PRESSURE/i.test(hud.alarm) ? 'var(--seg-map)' : 'var(--console-ink)' }}>
            {fmt(hud.linePressure)}
          </span>
        </div>
        <div className={`flex items-center gap-1 rounded-lg border border-console-line bg-console-panel px-2 py-1 ${changed.has('level') ? 'bg-white/10' : ''}`}>
          <span className="text-console-sub">LVL</span>
          <span className="flex items-end gap-[2px]" aria-label={`リザーバーレベル ${hud.level}`}>
            {[1, 2, 3, 4].map((i) => (
              <span key={i} className="w-1.5 rounded-sm" style={{ height: 4 + i * 2.5, background: i <= levelBars ? levelColor : 'var(--console-line)' }} />
            ))}
          </span>
        </div>
        <div className="rounded-lg border border-console-line bg-console-panel px-2 py-1">
          <span className="text-console-sub">PLEG </span>
          {/* 追加投与の間隔は施設・心筋保護液で異なるため、閾値で色を変えない */}
          <span className="seg font-bold" style={{ color: 'var(--console-ink)' }}>
            {pleg === null ? '---' : `${pleg}m`}
          </span>
        </div>
      </div>
      {hud.alarm && (
        <div className="animate-alarm mt-1.5 rounded-lg bg-[var(--seg-map)] px-2 py-1 text-center text-xs font-extrabold tracking-wider text-black">
          ⚠ {hud.alarm}
        </div>
      )}
    </div>
  )
}
