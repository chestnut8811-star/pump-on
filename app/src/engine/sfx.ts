// 効果音と手術室の環境音を Web Audio で合成する（音声ファイルを持たない）

let ctx: AudioContext | null = null
let master: GainNode | null = null
let enabled = true

function ac(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const C = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!C) return null
    ctx = new C()
    master = ctx.createGain()
    master.gain.value = 0.5
    master.connect(ctx.destination)
  }
  return ctx
}

/** ユーザー操作の中で呼ぶ（iOS で音を出せる状態にする） */
export function unlockAudio(): void {
  const c = ac()
  if (c && c.state === 'suspended') void c.resume()
}

export function setSfxEnabled(v: boolean): void {
  enabled = v
  if (!v) stopAmbient()
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', gain = 0.25): void {
  const c = ac()
  if (!c || !master) return
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.setValueAtTime(0, c.currentTime + start)
  g.gain.linearRampToValueAtTime(gain, c.currentTime + start + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur)
  o.connect(g).connect(master)
  o.start(c.currentTime + start)
  o.stop(c.currentTime + start + dur + 0.05)
}

export const sfx = {
  correct() {
    if (!enabled) return
    tone(880, 0, 0.12, 'sine', 0.22)
    tone(1320, 0.09, 0.22, 'sine', 0.2)
  },
  wrong() {
    if (!enabled) return
    tone(196, 0, 0.22, 'triangle', 0.25)
    tone(164, 0.12, 0.28, 'triangle', 0.22)
  },
  tap() {
    if (!enabled) return
    tone(660, 0, 0.05, 'sine', 0.08)
  },
  levelUp() {
    if (!enabled) return
    ;[523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.09, 0.25, 'sine', 0.18))
  },
  /** 生体情報モニタ風のアラーム（3連音） */
  alarm() {
    if (!enabled) return
    ;[0, 0.18, 0.36].forEach((t) => tone(960, t, 0.12, 'square', 0.08))
  },
  tick() {
    if (!enabled) return
    tone(1200, 0, 0.03, 'square', 0.03)
  },
}

// ===== 環境音（ポンプのうなり＋モニタ音） =====
let ambientNodes: AudioNode[] = []
let beepTimer: ReturnType<typeof setInterval> | null = null

export function startAmbient(level = 0.35): void {
  const c = ac()
  if (!c || !master || !enabled || ambientNodes.length) return
  // ピンクノイズ風（ローパスしたノイズ）
  const len = c.sampleRate * 2
  const buf = c.createBuffer(1, len, c.sampleRate)
  const data = buf.getChannelData(0)
  let last = 0
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1
    last = (last + 0.02 * white) / 1.02
    data[i] = last * 3.5
  }
  const noise = c.createBufferSource()
  noise.buffer = buf
  noise.loop = true
  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 600
  const ng = c.createGain()
  ng.gain.value = 0.18 * level
  noise.connect(lp).connect(ng).connect(master)
  noise.start()
  // ローラーポンプの周期的なうなり（約 1.2 Hz で揺らす）
  const hum = c.createOscillator()
  hum.type = 'sawtooth'
  hum.frequency.value = 58
  const hg = c.createGain()
  hg.gain.value = 0.02 * level
  const lfo = c.createOscillator()
  lfo.frequency.value = 1.2
  const lfoGain = c.createGain()
  lfoGain.gain.value = 0.015 * level
  lfo.connect(lfoGain).connect(hg.gain)
  const hlp = c.createBiquadFilter()
  hlp.type = 'lowpass'
  hlp.frequency.value = 240
  hum.connect(hlp).connect(hg).connect(master)
  hum.start()
  lfo.start()
  ambientNodes = [noise, lp, ng, hum, hg, lfo, lfoGain, hlp]
  // 心拍モニタ風の短いビープ（CPB 中なので控えめ・不規則に）
  beepTimer = setInterval(() => {
    if (Math.random() < 0.5) tone(1046, 0, 0.06, 'sine', 0.025 * level)
  }, 1100)
}

export function stopAmbient(): void {
  for (const n of ambientNodes) {
    try {
      if (n instanceof AudioScheduledSourceNode) n.stop()
      n.disconnect()
    } catch {
      /* 何もしない */
    }
  }
  ambientNodes = []
  if (beepTimer) clearInterval(beepTimer)
  beepTimer = null
}
