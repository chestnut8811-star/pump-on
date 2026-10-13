// ドリル・復習の問題をフレーズと会話から作る（純粋関数。乱数は注入できる）

import type { Dialogue, DialogueLine, Keyword, Phrase, RoleId } from '../content/types'
import { shuffle, type Rng } from './numbers'

export interface Audio {
  text: string
  role: RoleId
  tts?: string
}

interface Base {
  /** 正誤を復習データに反映するフレーズ */
  phraseId?: string
}

export type DrillQ =
  | (Base & { kind: 'listen'; audio: Audio; options: string[]; answer: string })
  | (Base & { kind: 'situation'; prompt: string; options: Audio[]; answer: number })
  | (Base & { kind: 'catch'; audio: Audio; prompt: string; options: string[]; answer: string })
  | (Base & { kind: 'reply'; audio: Audio; options: Audio[]; answer: number })
  | (Base & { kind: 'shorthand'; shown: Audio; options: string[]; answer: string })
  | (Base & { kind: 'order'; dialogueId: string; lines: DialogueLine[]; shuffled: number[] })
  | (Base & { kind: 'speak'; prompt: string; target: Audio; keywords: string[]; accept: string[] })

export type DrillKind = DrillQ['kind']

export const KIND_LABEL: Record<DrillKind, string> = {
  listen: '聞いて意味を選ぶ',
  situation: '状況から英語を選ぶ',
  catch: '聞き取る',
  reply: '指示に返す',
  shorthand: '短縮形の意味',
  order: '会話を並べ替え',
  speak: '英語で言う',
}

function pickN<T>(rng: Rng, arr: T[], n: number): T[] {
  return shuffle(rng, arr).slice(0, n)
}

function uniqBy<T>(arr: T[], key: (t: T) => string): T[] {
  const seen = new Set<string>()
  return arr.filter((x) => {
    const k = key(x)
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

/** 数値・時刻の聞き間違えやすい候補 */
/**
 * 数値キャッチの設問ラベル。答えの数値を含めない（'鼻咽頭温 36.4℃' → '鼻咽頭温'、'10時46分' → '時刻'）。
 * PO2・DO2i のように語の中の数字は残す。
 */
export function catchLabel(kw: Pick<Keyword, 'ja' | 'kind'>): string {
  const UNIT = '(?:時\\s*\\d+\\s*分|単位\\/kg|mL\\/分|L\\/分|mmHg|mmol\\/L|g\\/dL|mL|m²|µg|μg|mg|時|分|秒|℃|L|J|単位|%|％)'
  // 約4 L/分、2万1000（単位）、500（mL/分）のような「数値＋単位」をまとめて消す
  const NUM = new RegExp(`約?(?<![A-Za-z])\\d[\\d.,:：]*(?:万\\d*)?\\s*(?:[（(]\\s*${UNIT}\\s*[)）]|${UNIT})?`, 'g')
  const rest = kw.ja.replace(NUM, '').replace(/[\s（）()・、]+/gu, ' ').trim()
  if (rest) return rest
  const j = kw.ja
  if (kw.kind === 'time' || /\d\s*時\s*\d+\s*分/.test(j)) return '時刻'
  if (j.includes('℃')) return '温度'
  if (j.includes('mmHg')) return '圧'
  if (j.includes('L/分')) return '流量'
  if (/mL|µg|μg|mg/.test(j)) return '量'
  if (j.includes('J')) return 'エネルギー'
  if (j.includes('単位')) return 'ヘパリンの量'
  if (j.includes('秒')) return '秒数'
  if (j.includes('分')) return '時間（分）'
  return '数値'
}

export function nearNumbers(value: string, rng: Rng): string[] {
  const out: string[] = []
  const time = /^(\d{1,2}):(\d{2})$/.exec(value)
  if (time) {
    const h = Number(time[1])
    const m = Number(time[2])
    const p = (n: number) => String(n).padStart(2, '0')
    const hh = time[1]
    if (m >= 13 && m <= 15) out.push(`${hh}:${p((m - 10) * 10)}`) // 16〜19 は 60〜90 分になるので作らない
    if (m >= 30 && m % 10 === 0) out.push(`${hh}:${p(10 + m / 10)}`)
    out.push(`${hh}:${p((m + 10) % 60)}`, `${p((h + 1) % 24)}:${p(m)}`, `${hh}:${p((m + 50) % 60)}`)
    return uniqBy(out, (s) => s).filter((s) => s !== value)
  }
  const num = Number(value.replace(/,/g, ''))
  if (!Number.isFinite(num)) return []
  const isDec = value.includes('.')
  const fmt = (n: number) => (isDec ? n.toFixed(1) : value.includes(',') ? Math.round(n).toLocaleString('en-US') : String(Math.round(n)))
  if (!isDec) {
    const last2 = num % 100
    if (last2 >= 13 && last2 <= 19) out.push(fmt(num - last2 + (last2 - 10) * 10))
    if (last2 >= 30 && last2 % 10 === 0) out.push(fmt(num - last2 + 10 + last2 / 10))
  } else {
    const swapped = Number(value.replace('.', '').split('').reverse().join('')) / 10
    if (swapped > 0 && swapped !== num) out.push(fmt(swapped))
  }
  const step = isDec ? 0.5 : num >= 1000 ? 5000 : num >= 100 ? 50 : num >= 20 ? 10 : 1
  out.push(fmt(num + step), fmt(num - step), fmt(num + step * 2))
  return shuffle(
    rng,
    uniqBy(out, (s) => s).filter((s) => s !== value && !s.startsWith('-') && s !== '0' && s !== '0.0'),
  )
}

const GENERIC_BAD_REPLIES: Audio[] = [
  { text: 'OK.', role: 'perfusionist' },
  { text: 'Yes.', role: 'perfusionist' },
]

export interface BuildOptions {
  count?: number
  /** 発話問題を入れるか */
  speaking?: boolean
}

/** あるシーンのドリル問題を作る */
export function buildDrill(
  phrases: Phrase[],
  dialogues: Dialogue[],
  pool: Phrase[],
  rng: Rng,
  opts: BuildOptions = {},
): DrillQ[] {
  const count = opts.count ?? 10
  const speaking = opts.speaking ?? true
  if (phrases.length === 0) return []
  const qs: DrillQ[] = []
  const used = new Map<DrillKind, number>()
  const order = shuffle(rng, phrases)
  const wantOrder = dialogues.some((d) => d.lines.length >= 4)
  const target = wantOrder ? count - 1 : count
  let guard = 0
  while (qs.length < target && guard < 200) {
    const p = order[guard % order.length]
    guard++
    const kinds = candidateKinds(p, speaking)
    // 同じ形式に偏らないよう、使用回数の少ない形式から
    const sorted = shuffle(rng, kinds).sort((a, b) => (used.get(a) ?? 0) - (used.get(b) ?? 0))
    for (const k of sorted) {
      const q = makeQuestion(k, p, phrases, pool, rng)
      if (q) {
        qs.push(q)
        used.set(k, (used.get(k) ?? 0) + 1)
        break
      }
    }
  }
  if (wantOrder) {
    const d = shuffle(rng, dialogues.filter((x) => x.lines.length >= 4))[0]
    const q = makeOrder(d, rng)
    if (q) qs.splice(Math.floor(rng() * (qs.length + 1)), 0, q)
  }
  return qs.slice(0, count)
}

export function candidateKinds(p: Phrase, speaking = true): DrillKind[] {
  const ks: DrillKind[] = []
  const mine = p.speaker === 'perfusionist'
  if (mine) {
    ks.push('situation')
    if (speaking) ks.push('speak')
  } else {
    ks.push('listen')
    if (p.replies.some((r) => r.role === 'perfusionist')) ks.push('reply')
  }
  if (p.keywords.some((k) => (k.kind === 'number' || k.kind === 'time') && p.en.includes(k.en))) ks.push('catch')
  if (p.variants.some((v) => v.register === 'shorthand')) ks.push('shorthand')
  return ks
}

export function makeQuestion(kind: DrillKind, p: Phrase, phase: Phrase[], pool: Phrase[], rng: Rng): DrillQ | null {
  const others = phase.filter((x) => x.id !== p.id)
  const widen = (need: number, list: Phrase[]) =>
    list.length >= need ? list : [...list, ...shuffle(rng, pool.filter((x) => x.id !== p.id && !list.includes(x)))]
  const audio: Audio = { text: p.en, role: p.speaker, tts: p.tts }
  switch (kind) {
    case 'listen': {
      const distract = uniqBy(widen(3, others), (x) => x.ja)
        .filter((x) => x.ja !== p.ja)
        .slice(0, 12)
      const opts = pickN(rng, distract, 3).map((x) => x.ja)
      if (opts.length < 2) return null
      return { kind, phraseId: p.id, audio, options: shuffle(rng, [p.ja, ...opts]), answer: p.ja }
    }
    case 'situation': {
      const mine = widen(3, others.filter((x) => x.speaker === 'perfusionist'))
        .filter((x) => x.speaker === 'perfusionist' && x.en !== p.en)
      const distract = pickN(rng, uniqBy(mine, (x) => x.en), 3).map((x): Audio => ({ text: x.en, role: 'perfusionist', tts: x.tts }))
      if (distract.length < 2) return null
      const options = shuffle(rng, [audio, ...distract])
      return { kind, phraseId: p.id, prompt: `${p.when}\n「${p.ja}」と伝えるには？`, options, answer: options.indexOf(audio) }
    }
    case 'catch': {
      const kw = p.keywords.find((k) => (k.kind === 'number' || k.kind === 'time') && p.en.includes(k.en))
      if (!kw) return null
      const near = nearNumbers(kw.en, rng).slice(0, 3)
      if (near.length < 2) return null
      return {
        kind,
        phraseId: p.id,
        audio,
        prompt: `聞こえた「${catchLabel(kw)}」は？`,
        options: shuffle(rng, [kw.en, ...near]),
        answer: kw.en,
      }
    }
    case 'reply': {
      const good = p.replies.find((r) => r.role === 'perfusionist')
      if (!good) return null
      const correct: Audio = { text: good.en, role: 'perfusionist', tts: good.tts }
      const otherReplies = widen(4, others)
        .flatMap((x) => x.replies.filter((r) => r.role === 'perfusionist'))
        .filter((r) => r.en !== good.en)
        .map((r): Audio => ({ text: r.en, role: 'perfusionist', tts: r.tts }))
      const pool2 = uniqBy([...pickN(rng, uniqBy(otherReplies, (a) => a.text), 2), pickN(rng, GENERIC_BAD_REPLIES, 1)[0]], (a) => a.text).filter(
        (a) => a.text !== good.en,
      )
      if (pool2.length < 2) return null
      const options = shuffle(rng, [correct, ...pool2.slice(0, 3)])
      return { kind, phraseId: p.id, audio, options, answer: options.indexOf(correct) }
    }
    case 'shorthand': {
      const sh = p.variants.find((v) => v.register === 'shorthand')
      if (!sh) return null
      const distract = pickN(rng, uniqBy(widen(3, others), (x) => x.ja).filter((x) => x.ja !== p.ja), 3).map((x) => x.ja)
      if (distract.length < 2) return null
      return {
        kind,
        phraseId: p.id,
        shown: { text: sh.en, role: p.speaker, tts: sh.tts },
        options: shuffle(rng, [p.ja, ...distract]),
        answer: p.ja,
      }
    }
    case 'speak': {
      const lower = p.en.toLowerCase()
      const keywords = p.keywords.map((k) => k.en).filter((k) => lower.includes(k.toLowerCase()))
      return {
        kind,
        phraseId: p.id,
        prompt: `${p.when}\n「${p.ja}」`,
        target: audio,
        keywords,
        accept: p.variants.filter((v) => v.register !== 'shorthand').map((v) => v.en),
      }
    }
    case 'order':
      return null
  }
}

export function makeOrder(d: Dialogue | undefined, rng: Rng): DrillQ | null {
  if (!d || d.lines.length < 4) return null
  const lines = d.lines.slice(0, 6)
  let shuffled = shuffle(
    rng,
    lines.map((_, i) => i),
  )
  // 元の順のままにならないように
  if (shuffled.every((v, i) => v === i)) shuffled = [...shuffled.slice(1), shuffled[0]]
  return { kind: 'order', dialogueId: d.id, lines, shuffled }
}

/** 復習用: フレーズ1つにつき1問（相手の発話は聞き取り型、自分の発話は日本語→英語型） */
export function buildReviewItem(p: Phrase, pool: Phrase[], rng: Rng, speaking: boolean): DrillQ | null {
  const phase = pool.filter((x) => x.phase === p.phase)
  const kinds: DrillKind[] =
    p.speaker === 'perfusionist'
      ? speaking && rng() < 0.4
        ? ['speak', 'situation']
        : ['situation', 'shorthand', 'speak']
      : ['listen', 'reply', 'catch', 'shorthand']
  for (const k of kinds) {
    if (k === 'speak' && !speaking) continue
    const q = makeQuestion(k, p, phase, pool, rng)
    if (q) return q
  }
  return null
}
