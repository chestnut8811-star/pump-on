// 端末の音声合成（Web Speech API）で英語を読み上げる。
// - 話者（外科医・麻酔科医・看護師・あなた）ごとに、端末にある英語音声から別々の声を自動で割り当てる
// - iOS では最初の発話をユーザー操作の中で行う必要があるため unlock() を用意する
// - onend が来ない端末があるため、文字数からのタイムアウトで必ず先へ進める

import type { RoleId } from '../content/types'
import { ROLES } from '../content/roles'
import { speechText } from './tts-normalize'

/** 端末に入っているが訓練に向かない（効果音的・ロボット的な）音声 */
const NOVELTY = new Set(
  [
    'Albert', 'Bad News', 'Bahh', 'Bells', 'Boing', 'Bubbles', 'Cellos', 'Good News', 'Jester', 'Organ',
    'Superstar', 'Trinoids', 'Whisper', 'Wobble', 'Zarvox', 'Deranged', 'Hysterical', 'Pipe Organ',
    'Princess', 'Junior', 'Ralph', 'Kathy', 'Fred',
    'Eddy', 'Flo', 'Grandma', 'Grandpa', 'Reed', 'Rocko', 'Sandy', 'Shelley',
  ].map((s) => s.toLowerCase()),
)

const FEMALE = new Set(
  ['samantha', 'karen', 'moira', 'tessa', 'fiona', 'victoria', 'allison', 'ava', 'susan', 'zoe', 'nicky', 'serena',
    'kate', 'catherine', 'martha', 'matilda', 'joelle', 'noelle', 'veena', 'isha', 'stephanie', 'sandy', 'flo',
    'shelley', 'grandma', 'female', 'aria', 'jenny', 'sonia', 'libby', 'natasha', 'emma', 'olivia'],
)
const MALE = new Set(
  ['daniel', 'alex', 'tom', 'aaron', 'arthur', 'gordon', 'lee', 'oliver', 'rishi', 'evan', 'nathan', 'fred', 'ralph',
    'eddy', 'reed', 'rocko', 'grandpa', 'male', 'guy', 'ryan', 'william', 'thomas', 'george', 'james', 'jamie'],
)

function nameKey(v: SpeechSynthesisVoice): string {
  return v.name.toLowerCase()
}

function baseName(v: SpeechSynthesisVoice): string {
  return nameKey(v).replace(/\(.*?\)/g, '').replace(/(enhanced|premium|compact)/g, '').trim().split(/\s+/)[0] ?? ''
}

export function voiceGender(v: SpeechSynthesisVoice): 'male' | 'female' | 'unknown' {
  const n = nameKey(v)
  const b = baseName(v)
  if (FEMALE.has(b) || /\bfemale\b/.test(n)) return 'female'
  if (MALE.has(b) || /\bmale\b/.test(n)) return 'male'
  return 'unknown'
}

function isNovelty(v: SpeechSynthesisVoice): boolean {
  const b = baseName(v)
  // 日本語環境では効果音的な音声の名前が「ささやき声」「オルガン」などに訳される。
  // 人の声の英語音声は英字名（Samantha、Daniel など）なので、英字以外の名前は除外する
  // eslint-disable-next-line no-control-regex
  return NOVELTY.has(b) || NOVELTY.has(nameKey(v)) || /[^\x00-\x7F]/.test(b)
}

function quality(v: SpeechSynthesisVoice): number {
  const n = nameKey(v)
  let q = 0
  if (n.includes('premium')) q += 3
  else if (n.includes('enhanced')) q += 2
  if (v.localService) q += 1
  if (n.includes('google') || n.includes('microsoft')) q += 1
  return q
}

export const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

let voicesCache: SpeechSynthesisVoice[] = []

/** 端末の音声一覧を読み込む（iOS/Chrome は非同期で入ってくる） */
export function loadVoices(timeoutMs = 2500): Promise<SpeechSynthesisVoice[]> {
  if (!speechSupported) return Promise.resolve([])
  const now = window.speechSynthesis.getVoices()
  if (now.length) {
    voicesCache = now
    return Promise.resolve(now)
  }
  return new Promise((resolve) => {
    let done = false
    const finish = () => {
      if (done) return
      done = true
      voicesCache = window.speechSynthesis.getVoices()
      resolve(voicesCache)
    }
    window.speechSynthesis.addEventListener('voiceschanged', finish, { once: true })
    // voiceschanged が来ない端末向けに短い間隔で確認
    const started = Date.now()
    const poll = () => {
      if (done) return
      if (window.speechSynthesis.getVoices().length || Date.now() - started > timeoutMs) finish()
      else setTimeout(poll, 150)
    }
    poll()
  })
}

/** 訓練に使える英語音声（効果音的な音声を除く） */
export function englishVoices(all: SpeechSynthesisVoice[] = voicesCache): SpeechSynthesisVoice[] {
  return all.filter((v) => v.lang.replace('_', '-').toLowerCase().startsWith('en') && !isNovelty(v))
}

const ASSIGN_ORDER: RoleId[] = ['perfusionist', 'surgeon', 'anesthesiologist', 'nurse', 'assistant', 'team']

/** 話者ごとの自動割り当て（なるべく別の声・別のアクセントにする） */
export function autoAssign(voices: SpeechSynthesisVoice[]): Partial<Record<RoleId, SpeechSynthesisVoice>> {
  const result: Partial<Record<RoleId, SpeechSynthesisVoice>> = {}
  const used = new Set<string>()
  for (const role of ASSIGN_ORDER) {
    const pref = ROLES[role].voice
    let best: SpeechSynthesisVoice | undefined
    let bestScore = -Infinity
    for (const v of voices) {
      const lang = v.lang.replace('_', '-')
      const li = pref.langs.findIndex((l) => lang.toLowerCase() === l.toLowerCase())
      let s = li >= 0 ? 10 - li * 2 : 2
      const g = voiceGender(v)
      if (pref.prefer !== 'any') s += g === pref.prefer ? 4 : g === 'unknown' ? 0 : -3
      s += quality(v)
      if (used.has(v.voiceURI)) s -= 12
      if (s > bestScore) {
        bestScore = s
        best = v
      }
    }
    if (best) {
      result[role] = best
      used.add(best.voiceURI)
    }
  }
  return result
}

/** 同じ声を複数の話者で使うときに少し音程を変えて聞き分けやすくする */
const PITCH: Record<RoleId, number> = {
  surgeon: 0.92,
  assistant: 1.0,
  anesthesiologist: 1.0,
  perfusionist: 1.05,
  nurse: 1.1,
  team: 1.0,
}

export interface SpeakOptions {
  role?: RoleId
  rate?: number
  /** ユーザーが設定した声（voiceURI） */
  voiceURI?: string
  /** 教材の読み上げ用テキスト */
  tts?: string
}

let assignment: Partial<Record<RoleId, SpeechSynthesisVoice>> = {}

export async function initSpeech(): Promise<void> {
  const voices = await loadVoices()
  assignment = autoAssign(englishVoices(voices))
}

export function voiceFor(role: RoleId, voiceURI?: string): SpeechSynthesisVoice | undefined {
  if (voiceURI) {
    const v = voicesCache.find((x) => x.voiceURI === voiceURI)
    if (v) return v
  }
  return assignment[role] ?? englishVoices()[0]
}

export function currentAssignment(): Partial<Record<RoleId, SpeechSynthesisVoice>> {
  return assignment
}

let unlocked = false

/** iOS の制限解除。ボタンのタップ処理の中で呼ぶ */
export function unlockSpeech(): void {
  if (!speechSupported || unlocked) return
  try {
    const u = new SpeechSynthesisUtterance(' ')
    u.volume = 0
    window.speechSynthesis.speak(u)
    unlocked = true
  } catch {
    /* 何もしない */
  }
}

let currentToken = 0

/** 読み上げ。終わったら resolve（停止・エラー・タイムアウトでも resolve） */
export function speak(text: string, opts: SpeakOptions = {}): Promise<void> {
  if (!speechSupported) return Promise.resolve()
  const say = speechText(text, opts.tts)
  const role = opts.role ?? 'team'
  const rate = Math.min(1.6, Math.max(0.5, opts.rate ?? 1))
  const token = ++currentToken
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(say)
    const v = voiceFor(role, opts.voiceURI)
    if (v) {
      u.voice = v
      u.lang = v.lang
    } else {
      u.lang = 'en-US'
    }
    u.rate = rate
    const sharedVoice = Object.entries(assignment).some(([r, vv]) => r !== role && vv?.voiceURI === v?.voiceURI)
    u.pitch = sharedVoice ? PITCH[role] : 1
    let finished = false
    const done = () => {
      if (finished) return
      finished = true
      clearTimeout(timer)
      resolve()
    }
    u.onend = done
    u.onerror = done
    const words = say.split(/\s+/).length
    const timer = setTimeout(done, Math.max(2500, (words * 520) / rate + 2000))
    const synth = window.speechSynthesis
    const start = () => {
      if (token !== currentToken) return done()
      // バックグラウンド復帰後に一時停止のまま固まる端末への対策
      if (synth.paused) synth.resume()
      synth.speak(u)
    }
    // 直前の発話が残っていると詰まるため止めてから、少し待って話す（cancel 直後の speak が落ちる端末がある）
    if (synth.speaking || synth.pending) {
      synth.cancel()
      setTimeout(start, 80)
    } else start()
  })
}

export function stopSpeech(): void {
  currentToken++
  if (speechSupported) window.speechSynthesis.cancel()
}

/** 複数の発話を順番に（間を少し空ける）。途中で stopSpeech() されたら打ち切る */
export async function speakSequence(
  items: { text: string; role: RoleId; tts?: string }[],
  base: Omit<SpeakOptions, 'role' | 'tts'> & { voiceFor?: (role: RoleId) => string | undefined; onLine?: (i: number) => void },
  gapMs = 350,
): Promise<boolean> {
  if (!speechSupported) return false
  const startToken = currentToken
  for (let i = 0; i < items.length; i++) {
    if (currentToken !== startToken + i) return false
    base.onLine?.(i)
    const it = items[i]
    await speak(it.text, { rate: base.rate, role: it.role, tts: it.tts, voiceURI: base.voiceFor?.(it.role) })
    // 話している間に止められた（または別の読み上げが始まった）
    if (currentToken !== startToken + i + 1) return false
    if (gapMs) await new Promise((r) => setTimeout(r, gapMs))
  }
  return currentToken === startToken + items.length
}
