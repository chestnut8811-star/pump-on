// 数値の「現場読み」と、数値キャッチ（聞き取りミニゲーム）の問題生成。
// 例: ACT 480 → "four eighty"、09:42 → "nine forty-two"、4.5 → "four point five"

const ONES = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
]
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

/** 0〜99 を英単語に */
function under100(n: number): string {
  if (n < 20) return ONES[n]
  const t = Math.floor(n / 10)
  const o = n % 10
  return o === 0 ? TENS[t] : `${TENS[t]}-${ONES[o]}`
}

/** 0〜999999 の整数を英単語に（"four hundred eighty" 型） */
export function numberToWords(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 999999) throw new Error(`unsupported number: ${n}`)
  if (n < 100) return under100(n)
  if (n < 1000) {
    const h = Math.floor(n / 100)
    const r = n % 100
    return r === 0 ? `${ONES[h]} hundred` : `${ONES[h]} hundred ${under100(r)}`
  }
  const th = Math.floor(n / 1000)
  const r = n % 1000
  return r === 0 ? `${numberToWords(th)} thousand` : `${numberToWords(th)} thousand ${numberToWords(r)}`
}

/**
 * 3桁の整数を現場読みに: 480 → "four eighty"、405 → "four oh five"、500 → "five hundred"、100 → "a hundred"
 * 3桁以外は通常の読み。
 */
export function sayCompact(n: number): string {
  if (!Number.isInteger(n)) return sayDecimal(n)
  if (n === 100) return 'a hundred'
  if (n >= 101 && n <= 999) {
    const h = Math.floor(n / 100)
    const r = n % 100
    if (r === 0) return `${ONES[h]} hundred`
    if (r < 10) return `${ONES[h]} oh ${ONES[r]}`
    return `${ONES[h]} ${under100(r)}`
  }
  return numberToWords(n)
}

/** 小数を読む: 4.5 → "four point five"、36.5 → "thirty-six point five"、2 → "two" */
export function sayDecimal(v: number): string {
  const s = String(v)
  if (!s.includes('.')) return numberToWords(Number(s))
  const [i, f] = s.split('.')
  const digits = f
    .split('')
    .map((d) => ONES[Number(d)])
    .join(' ')
  return `${numberToWords(Number(i))} point ${digits}`
}

/** 時刻 'HH:MM' を読む: 09:42 → "nine forty-two"、10:05 → "ten oh five"、11:00 → "eleven o'clock" */
export function sayTime(hhmm: string): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim())
  if (!m) throw new Error(`bad time: ${hhmm}`)
  const h24 = Number(m[1])
  const min = Number(m[2])
  const h = h24 % 12 === 0 ? 12 : h24 % 12
  if (min === 0) return `${ONES[h]} o'clock`
  if (min < 10) return `${ONES[h]} oh ${ONES[min]}`
  return `${ONES[h]} ${under100(min)}`
}

// ===== 数値キャッチ（ミニゲーム） =====

export type NumberKind =
  | 'flow'
  | 'map'
  | 'act'
  | 'temp'
  | 'time'
  | 'hb'
  | 'k'
  | 'svo2'
  | 'volume'
  | 'heparin'
  | 'linePressure'
  | 'clampTime'
  | 'joules'

export interface NumberKindMeta {
  kind: NumberKind
  ja: string
  unit: string
  /** 例文（{v} に表示値、読み上げ時は現場読みが入る） */
  templates: string[]
}

export const NUMBER_KINDS: Record<NumberKind, NumberKindMeta> = {
  flow: { kind: 'flow', ja: 'ポンプ流量', unit: 'L/min', templates: ['Flow is {v} liters.', "We're at {v} liters.", 'Coming down to {v}.'] },
  map: { kind: 'map', ja: '平均血圧', unit: 'mmHg', templates: ['Mean is {v}.', "Pressure's {v}.", 'MAP is {v}.'] },
  act: { kind: 'act', ja: 'ACT', unit: '秒', templates: ['ACT is {v}.', "ACT's back, {v}."] },
  temp: { kind: 'temp', ja: '温度', unit: '℃', templates: ['Nasopharyngeal is {v}.', 'Temp is {v} degrees.', 'Cooling to {v}.'] },
  time: { kind: 'time', ja: '時刻', unit: '', templates: ['Cross-clamp on at {v}.', 'On bypass at {v}.', 'Clamp off at {v}.'] },
  hb: { kind: 'hb', ja: 'ヘモグロビン', unit: 'g/dL', templates: ["Hemoglobin's {v}.", 'Hb is {v}.'] },
  k: { kind: 'k', ja: 'カリウム', unit: 'mmol/L', templates: ['Potassium is {v}.', 'K is {v}.'] },
  svo2: { kind: 'svo2', ja: 'SvO2', unit: '%', templates: ['Venous sats are {v} percent.', 'Sats are {v}.'] },
  volume: { kind: 'volume', ja: '投与量', unit: 'mL', templates: ['Give {v}.', '{v} in.'] },
  heparin: { kind: 'heparin', ja: 'ヘパリン', unit: '単位', templates: ['Giving {v} units of heparin.', '{v} units of heparin in.'] },
  linePressure: { kind: 'linePressure', ja: '送血ライン圧', unit: 'mmHg', templates: ['Line pressure is {v}.', 'Arterial line pressure {v}.'] },
  clampTime: { kind: 'clampTime', ja: '遮断時間', unit: '分', templates: ['Clamp time {v} minutes.', "We're {v} minutes into the clamp."] },
  joules: { kind: 'joules', ja: '除細動エネルギー', unit: 'J', templates: ['Shock at {v} joules.', 'Charging to {v}.'] },
}

export interface NumberItem {
  kind: NumberKind
  /** 正解の表示値（例: '4.5'、'09:42'、'480'） */
  answer: string
  /** 選択肢（answer を含む4つ、シャッフル済み） */
  options: string[]
  /** 表示用の文（例: 'Flow is 4.5 liters.'） */
  sentence: string
  /** 読み上げ用の文（例: 'Flow is four point five liters.'） */
  speech: string
}

export type Rng = () => number

function randInt(rng: Rng, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min
}

function pick<T>(rng: Rng, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

export function shuffle<T>(rng: Rng, arr: readonly T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const fmt1 = (v: number) => v.toFixed(1)
const pad2 = (n: number) => String(n).padStart(2, '0')

/** 値の生成と、聞き間違えやすい選択肢の生成。範囲は表示用の「例」で、推奨値ではない */
function generateValue(kind: NumberKind, rng: Rng): { answer: string; near: string[] } {
  switch (kind) {
    case 'flow': {
      const v = randInt(rng, 15, 55) / 10
      const swapped = Number(fmt1(v).replace('.', '').split('').reverse().join('')) / 10
      return {
        answer: fmt1(v),
        near: [fmt1(swapped), fmt1(v + 0.3), fmt1(v - 0.5), fmt1(v + 1), fmt1(v - 1)].filter((s) => Number(s) >= 0.5 && Number(s) <= 6.5),
      }
    }
    case 'map': {
      const v = randInt(rng, 40, 90)
      return { answer: String(v), near: teenTyNear(v).concat([String(v + 5), String(v - 4), String(v + 10)]) }
    }
    case 'act': {
      const v = randInt(rng, 38, 75) * 10 + pick(rng, [0, 0, 0, 5])
      const h = Math.floor(v / 100)
      const r = v % 100
      const near: string[] = []
      if (r >= 30 && r % 10 === 0) near.push(String(h * 100 + 10 + r / 10)) // 480 ↔ 418（eighty / eighteen）
      near.push(String(v + 50), String(v - 40), String(v + 20))
      return { answer: String(v), near }
    }
    case 'temp': {
      const v = randInt(rng, 56, 74) / 2 // 28.0〜37.0 を 0.5 刻み
      // 十の位の聞き違い（thirty ↔ twenty）は下向きにだけ作る。上向きだと 40℃ 超のありえない値になる
      return { answer: fmt1(v), near: [fmt1(v + 1), fmt1(v - 2), fmt1(v + 0.5), String(Math.round(v) - 10)] }
    }
    case 'time': {
      const h = randInt(rng, 8, 14)
      const m = randInt(rng, 1, 59)
      const near: string[] = []
      if (m >= 13 && m <= 15) near.push(`${pad2(h)}:${pad2((m - 10) * 10)}`) // 14 ↔ 40（16〜19 は 60〜90 分になるので作らない）
      if (m % 10 === 0 && m >= 30) near.push(`${pad2(h)}:${pad2(10 + m / 10)}`) // 40 ↔ 14
      near.push(`${pad2(h)}:${pad2((m + 10) % 60)}`, `${pad2(h + 1)}:${pad2(m)}`, `${pad2(h)}:${pad2(Number(String(pad2(m)).split('').reverse().join('')) % 60)}`)
      return { answer: `${pad2(h)}:${pad2(m)}`, near }
    }
    case 'hb': {
      const v = randInt(rng, 65, 125) / 10
      return { answer: fmt1(v), near: [fmt1(v + 1), fmt1(v - 0.8), fmt1(v + 0.4), fmt1(v - 2)] }
    }
    case 'k': {
      const v = randInt(rng, 32, 65) / 10
      return { answer: fmt1(v), near: [fmt1(v + 1), fmt1(v - 0.5), fmt1(v + 0.3), fmt1(v - 1.2)].filter((s) => Number(s) > 2) }
    }
    case 'svo2': {
      const v = randInt(rng, 55, 85)
      return { answer: String(v), near: teenTyNear(v).concat([String(v + 6), String(v - 5), String(v - 10)]) }
    }
    case 'volume': {
      const v = pick(rng, [50, 100, 150, 200, 250, 300, 500])
      return { answer: String(v), near: ['15', '50', '100', '150', '200', '250', '300', '500'].filter((s) => s !== String(v)) }
    }
    case 'heparin': {
      const v = pick(rng, [5000, 10000, 15000, 20000, 25000, 30000, 35000])
      // 選択肢も現実的な範囲（5,000〜40,000）に収める
      const near = [v + 5000, v - 5000, v + 10000, v - 10000].filter((n) => n >= 5000 && n <= 40000)
      return { answer: v.toLocaleString('en-US'), near: near.map((n) => n.toLocaleString('en-US')) }
    }
    case 'linePressure': {
      const v = randInt(rng, 12, 35) * 10
      return { answer: String(v), near: [String(v + 50), String(v - 30), String(v + 100), String(v - 60)].filter((s) => Number(s) > 0) }
    }
    case 'clampTime': {
      const v = randInt(rng, 13, 150)
      return { answer: String(v), near: teenTyNear(v).concat([String(v + 10), String(v - 7), String(v + 20)]) }
    }
    case 'joules': {
      // 体内除細動は成人で 5〜10 J から（教科書）。レビューの記載に合わせ 20 J までの例に限る
      const v = pick(rng, [5, 10, 15, 20])
      return { answer: String(v), near: ['5', '10', '15', '20'].filter((s) => s !== String(v)) }
    }
  }
}

/** 13〜19 と 30〜90 の聞き間違い（thirteen / thirty） */
function teenTyNear(v: number): string[] {
  if (v >= 13 && v <= 19) return [String((v - 10) * 10)]
  if (v >= 30 && v <= 90 && v % 10 === 0) return [String(10 + v / 10)]
  const last2 = v % 100
  if (v >= 100 && last2 >= 13 && last2 <= 19) return [String(v - last2 + (last2 - 10) * 10)]
  return []
}

/** 表示値を読み上げ用に（種類ごとの現場読み） */
export function sayValue(kind: NumberKind, value: string): string {
  switch (kind) {
    case 'time':
      return sayTime(value)
    case 'flow':
    case 'temp':
    case 'hb':
    case 'k':
      return sayDecimal(Number(value))
    case 'heparin':
      return numberToWords(Number(value.replace(/,/g, '')))
    default:
      return sayCompact(Number(value))
  }
}

export function makeNumberItem(kind: NumberKind, rng: Rng = Math.random): NumberItem {
  const meta = NUMBER_KINDS[kind]
  const { answer, near } = generateValue(kind, rng)
  const uniq: string[] = []
  for (const s of near) if (s !== answer && !uniq.includes(s) && !s.startsWith('-')) uniq.push(s)
  // 候補が足りない場合の保険（種類ごとの表記を保ったまま少しずらす）
  let bump = 1
  while (uniq.length < 3 && bump <= 30) {
    const alt = nudge(kind, answer, bump)
    if (alt !== answer && !uniq.includes(alt)) uniq.push(alt)
    bump++
  }
  const options = shuffle(rng, [answer, ...shuffle(rng, uniq).slice(0, 3)])
  const template = pick(rng, meta.templates)
  return {
    kind,
    answer,
    options,
    sentence: template.replace('{v}', answer),
    // 数値は先に現場読みの単語にしてから、略語だけを読み上げ用に直す
    speech: abbreviationsForSpeech(template.replace('{v}', sayValue(kind, answer))),
  }
}

function nudge(kind: NumberKind, answer: string, bump: number): string {
  const sign = bump % 2 === 0 ? -1 : 1
  const step = Math.ceil(bump / 2)
  switch (kind) {
    case 'time': {
      const [h, m] = answer.split(':').map(Number)
      const total = h * 60 + m + sign * step * 3
      return `${pad2(Math.floor(total / 60))}:${pad2(((total % 60) + 60) % 60)}`
    }
    case 'flow':
    case 'temp':
    case 'hb':
    case 'k':
      return fmt1(Math.max(0.1, Number(answer) + sign * step * 0.2))
    case 'heparin':
      return Math.max(1000, Number(answer.replace(/,/g, '')) + sign * step * 1000).toLocaleString('en-US')
    default:
      return String(Math.max(1, Number(answer) + sign * step * 3))
  }
}

/** 略語の読み（numbers → tts-normalize の循環 import を避けるため最小限をここに持つ） */
function abbreviationsForSpeech(s: string): string {
  return s
    .replace(/\bACT\b/g, 'A C T')
    .replace(/\bMAP\b/g, 'M A P')
    .replace(/\bHb\b/g, 'H B')
}
