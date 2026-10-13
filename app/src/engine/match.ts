// 発話（音声認識の結果）とお手本の照合。
// 数字の書き方の揺れ（"480" / "four eighty" / "four hundred eighty"、"09:42" / "nine forty-two"）を
// 同じ表記にそろえてから、必須語（keywords）の網羅率と語の一致率で採点する。
// on/off・up/down・否定・数値がお手本と食い違うときは、点数にかかわらず不合格にする（意味が逆になるため）。

const SMALL: Record<string, number> = {
  zero: 0, oh: 0, o: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
  eighteen: 18, nineteen: 19,
}
const TENS: Record<string, number> = {
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
}

function isNumWord(t: string): boolean {
  return t in SMALL || t in TENS || t === 'hundred' || t === 'thousand' || t === 'point'
}

/** 数詞の連なりを数字の文字列に */
function runToDigits(run: string[]): string {
  const pointAt = run.indexOf('point')
  if (pointAt >= 0) {
    const int = runToDigits(run.slice(0, pointAt)) || '0'
    const frac = run
      .slice(pointAt + 1)
      .map((t) => (t in SMALL && SMALL[t] < 10 ? String(SMALL[t]) : ''))
      .join('')
    return frac ? `${int}.${frac}` : int
  }
  if (run.includes('hundred') || run.includes('thousand')) {
    // 標準の読み: four hundred eighty / thirty thousand
    let total = 0
    let cur = 0
    for (const t of run) {
      if (t in SMALL) cur += SMALL[t]
      else if (t in TENS) cur += TENS[t]
      else if (t === 'hundred') cur = (cur || 1) * 100
      else if (t === 'thousand') {
        total += (cur || 1) * 1000
        cur = 0
      }
    }
    return String(total + cur)
  }
  // 現場の読み: four eighty → 480、nine forty two → 942、four oh five → 405
  let out = ''
  for (let i = 0; i < run.length; i++) {
    const t = run[i]
    if (t in TENS) {
      const next = run[i + 1]
      if (next !== undefined && next in SMALL && SMALL[next] > 0 && SMALL[next] < 10 && next !== 'oh' && next !== 'o') {
        out += String(TENS[t] + SMALL[next])
        i++
      } else out += String(TENS[t])
    } else if (t in SMALL) out += String(SMALL[t])
  }
  return out
}

/** 照合用に正規化したトークン列 */
export function canonicalTokens(text: string): string[] {
  let s = text.toLowerCase()
  s = s.replace(/(\d),(\d{3})/g, '$1$2') // 30,000 → 30000
  s = s.replace(/\b0?(\d{1,2}):(\d{2})\b/g, (_m, h: string, mm: string) => `${Number(h)}${mm}`) // 09:42 → 942
  s = s.replace(/[’']s\b/g, '') // flow's → flow（短縮形の 's は落とす）
  s = s.replace(/[’']/g, '') // we're → were など、その他の ' は消す
  s = s.replace(/-/g, ' ')
  s = s.replace(/[^a-z0-9.\s]/g, ' ')
  s = s.replace(/(?<!\d)\.|\.(?!\d)/g, ' ') // 文末のピリオドは消し、小数点は残す
  const raw = s.split(/\s+/).filter(Boolean)
  const out: string[] = []
  for (let i = 0; i < raw.length; i++) {
    const t = raw[i]
    // "o" / "oh" は数の途中でだけ 0 とみなす
    const startsNumber = (t in SMALL && t !== 'oh' && t !== 'o') || t in TENS
    if (startsNumber) {
      const run: string[] = [t]
      let j = i + 1
      while (j < raw.length) {
        const nx = raw[j]
        // "four hundred and eighty" の and は数の一部として読み飛ばす
        const andInNumber =
          nx === 'and' && (run.includes('hundred') || run.includes('thousand')) && j + 1 < raw.length && isNumWord(raw[j + 1])
        if (!isNumWord(nx) && !andInNumber) break
        if (!andInNumber) run.push(nx)
        j++
      }
      out.push(runToDigits(run))
      i = j - 1
    } else if (t === 'hundred' && out[out.length - 1] === 'a') {
      out[out.length - 1] = '100'
    } else if (t === 'oclock' && /^\d{1,2}$/.test(out[out.length - 1] ?? '')) {
      out[out.length - 1] = `${out[out.length - 1]}00` // eleven o'clock → 1100（11:00 と一致）
    } else {
      out.push(t)
    }
  }
  // 4.0 と 4、2.20 と 2.2 を同じ数として扱う
  return out.map((t) => (/^\d+\.\d+$/.test(t) ? String(Number(t)) : t))
}

function levenshtein<T>(a: readonly T[], b: readonly T[], eq: (x: T, y: T) => boolean = (x, y) => x === y): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (eq(a[i - 1], b[j - 1]) ? 0 : 1))
    }
  }
  return dp[a.length][b.length]
}

/** 認識誤りを少し許す単語の一致（5文字以上は1文字違いまで） */
function wordEq(x: string, y: string): boolean {
  if (x === y) return true
  if (/^[\d.]+$/.test(x) || /^[\d.]+$/.test(y)) return false
  if (x.length >= 5 && y.length >= 5) return levenshtein([...x], [...y]) <= 1
  return false
}

function containsSeq(hay: string[], needle: string[]): boolean {
  if (needle.length === 0) return true
  for (let i = 0; i + needle.length <= hay.length; i++) {
    let ok = true
    for (let k = 0; k < needle.length; k++) {
      if (!wordEq(hay[i + k], needle[k])) {
        ok = false
        break
      }
    }
    if (ok) return true
  }
  return false
}

export interface MatchResult {
  /** 0〜100 */
  score: number
  pass: boolean
  coverage: number
  similarity: number
  hits: { keyword: string; hit: boolean }[]
  /** お手本と食い違った、意味を変える語（on/off・up/down・否定・数値）。空なら食い違いなし */
  conflicts: string[]
  /** 最も近かったお手本 */
  best: string
}

/** 不合格のうち「おしい」と表示する点数の下限（表示の文言だけに使い、合否には使わない） */
export const CLOSE_SCORE = 50

const OPPOSITE = new Map([
  ['on', 'off'],
  ['off', 'on'],
  ['up', 'down'],
  ['down', 'up'],
])
const NEGATION = new Set(['no', 'not', 'dont', 'didnt', 'doesnt', 'cant', 'cannot', 'isnt', 'arent', 'wasnt', 'werent', 'wont', 'never'])
const isNumberToken = (t: string) => /^\d+(\.\d+)?$/.test(t)

/** a の要素が、この順番で b の中に現れるか */
function isSubsequence(a: string[], b: string[]): boolean {
  let j = 0
  for (const x of b) if (j < a.length && x === a[j]) j++
  return j === a.length
}

/**
 * 意味を変える食い違い（お手本側の語を返す）。
 * - 数値: お手本の数値を、お手本と同じ順番で言う必要がある（"Naso 36.4, bladder 35.1" の入れ替えを防ぐ）
 * - on/off・up/down: お手本と逆の語を言ったら不合格（"increase" のような言い換えで省くのは許す）
 * - 否定: 否定の語の数がお手本と違えば不合格（"No clamps, kinks." のような否定の抜けを防ぐ）
 */
function conflictsOf(said: string[], tgt: string[]): string[] {
  const s = new Set(said)
  const t = new Set(tgt)
  const out: string[] = []
  const tn = tgt.filter(isNumberToken)
  const sn = said.filter(isNumberToken)
  for (const w of tn) if (!s.has(w) && !out.includes(w)) out.push(w)
  if (out.length === 0 && !isSubsequence(tn, sn)) out.push(`${tn.join(' → ')} の順`)
  for (const w of s) {
    const opp = OPPOSITE.get(w)
    if (opp && !t.has(w) && t.has(opp) && !out.includes(opp)) out.push(opp)
  }
  const negations = (arr: string[]) => arr.filter((w) => NEGATION.has(w)).length
  if (negations(said) !== negations(tgt)) out.push('no / not')
  return out
}

function scoreOne(said: string[], target: string, keywords: string[]): MatchResult {
  const tgt = canonicalTokens(target)
  const hits = keywords.map((k) => ({ keyword: k, hit: containsSeq(said, canonicalTokens(k)) }))
  const coverage = keywords.length ? hits.filter((h) => h.hit).length / keywords.length : 1
  const dist = levenshtein(said, tgt, wordEq)
  const similarity = Math.max(0, 1 - dist / Math.max(tgt.length, said.length, 1))
  const conflicts = conflictsOf(said, tgt)
  let score = Math.round(100 * (keywords.length ? 0.7 * coverage + 0.3 * similarity : similarity))
  // 必須語のないお手本は語の一致率だけで判定するので、基準を上げる
  let pass = keywords.length ? (coverage === 1 && similarity >= 0.4) || score >= 85 : similarity >= 0.6
  if (conflicts.length) {
    pass = false
    score = Math.min(score, 60)
  }
  return { score, pass, coverage, similarity, hits, conflicts, best: target }
}

/** 合格を優先し、同じなら点数の高い方 */
export function betterMatch<T extends MatchResult>(a: T, b: T): T {
  if (a.pass !== b.pass) return b.pass ? b : a
  return b.score > a.score ? b : a
}

/** 発話をお手本（と許容例）に照らして採点。最も良い結果を返す */
export function matchUtterance(transcript: string, target: string, keywords: string[], accept: string[] = []): MatchResult {
  const said = canonicalTokens(transcript)
  const results = [target, ...accept].map((t, i) => {
    // 許容例は、その文に含まれる必須語だけで採点する（言い換えには必須語が入らないことがある）
    const tokens = canonicalTokens(t)
    const kws = i === 0 ? keywords : keywords.filter((k) => containsSeq(tokens, canonicalTokens(k)))
    return scoreOne(said, t, kws)
  })
  return results.reduce((a, b) => betterMatch(a, b))
}
