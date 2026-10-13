// 音声認識（Web Speech API）。使える端末でだけ有効にし、使えない端末は録音＋自己評価に切り替える。

interface RecognitionAlternative {
  transcript: string
  confidence: number
}
interface RecognitionResult {
  isFinal: boolean
  length: number
  [index: number]: RecognitionAlternative
}
interface RecognitionEvent extends Event {
  resultIndex: number
  results: { length: number; [index: number]: RecognitionResult }
}
interface RecognitionErrorEvent extends Event {
  error: string
}
interface Recognition extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onresult: ((e: RecognitionEvent) => void) | null
  onerror: ((e: RecognitionErrorEvent) => void) | null
  onend: (() => void) | null
}
type RecognitionCtor = new () => Recognition

function ctor(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export const recognitionSupported = ctor() !== null

let listening = false

/** 聞き取り中か（読み上げを始めないための確認に使う） */
export function isListening(): boolean {
  return listening
}

export interface ListenResult {
  transcript: string
  alternatives: string[]
}

export interface ListenHandle {
  promise: Promise<ListenResult>
  stop: () => void
}

/** 1回分の発話を聞き取る。stop() で終了（結果があれば返す） */
export function listenOnce(opts: { lang?: string; timeoutMs?: number; onInterim?: (text: string) => void } = {}): ListenHandle {
  const C = ctor()
  if (!C) return { promise: Promise.reject(new Error('unsupported')), stop: () => undefined }
  const rec = new C()
  rec.lang = opts.lang ?? 'en-US'
  rec.continuous = false
  rec.interimResults = true
  rec.maxAlternatives = 3
  let finalText = ''
  let interim = ''
  const alts: string[] = []
  let settled = false
  let timer: ReturnType<typeof setTimeout> | undefined

  let finishRef: (() => void) | null = null
  listening = true

  const promise = new Promise<ListenResult>((resolve, reject) => {
    const finish = () => {
      if (settled) return
      settled = true
      listening = false
      if (timer) clearTimeout(timer)
      const transcript = (finalText || interim).trim()
      resolve({ transcript, alternatives: alts })
    }
    finishRef = finish
    rec.onresult = (e) => {
      interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]
        if (r.isFinal) {
          finalText += r[0].transcript
          for (let k = 1; k < r.length; k++) alts.push(r[k].transcript)
        } else interim += r[0].transcript
      }
      opts.onInterim?.((finalText + ' ' + interim).trim())
    }
    rec.onerror = (e) => {
      if (settled) return
      if (e.error === 'no-speech' || e.error === 'aborted') return finish()
      settled = true
      listening = false
      if (timer) clearTimeout(timer)
      reject(new Error(e.error))
    }
    rec.onend = finish
    try {
      rec.start()
    } catch (err) {
      settled = true
      listening = false
      reject(err instanceof Error ? err : new Error(String(err)))
      return
    }
    timer = setTimeout(stopAndWatch, opts.timeoutMs ?? 9000)
  })

  // stop() のあと onend / onerror が来ない端末がある（iOS）。少し待っても来なければ、手元の結果で終える
  function stopAndWatch() {
    try {
      rec.stop()
    } catch {
      /* 何もしない */
    }
    setTimeout(() => finishRef?.(), 1500)
  }

  return { promise, stop: stopAndWatch }
}

/** 認識エラーを日本語に */
export function recognitionErrorJa(code: string): string {
  switch (code) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'マイクまたは音声認識が許可されていません。設定アプリで Safari のマイクと「Siri と音声入力」を確認してください。'
    case 'network':
      return '音声認識にネットワークが必要な状態です。通信環境を確認するか、録音モードで練習してください。'
    case 'audio-capture':
      return 'マイクが見つかりません。'
    case 'unsupported':
      return 'この端末・ブラウザでは音声認識が使えません。録音モードで練習してください。'
    default:
      return `音声認識でエラーが起きました（${code}）。録音モードで練習してください。`
  }
}
