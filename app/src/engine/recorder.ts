// 自分の発話を録音して、お手本と聞き比べる（音声認識が使えない端末でも使える）
// iOS の既知の不具合への対策（docs/research/03_ios_pwa_capabilities.md の 3-4）:
// - MediaRecorder.start() はタップ処理の中で同期的に呼ぶ（ハンドラ外だとマイクが止まる報告: iOS 27）
// - 再生が自然に終わった直後の録音が 0 バイトになる報告（iOS 26）→ 再生は終端の手前で pause() し、0 バイトは検知して再取得
// - timeslice は指定しない

export const recorderSupported =
  typeof window !== 'undefined' && typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined'

function pickMime(): string | undefined {
  const types = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus']
  for (const t of types) {
    try {
      if (MediaRecorder.isTypeSupported(t)) return t
    } catch {
      /* 何もしない */
    }
  }
  return undefined
}

export interface Recording {
  url: string
  blob: Blob
  ms: number
}

export interface RecorderHandle {
  stop: () => Promise<Recording>
  cancel: () => void
}

let stream: MediaStream | null = null
let recording = false

/** 録音中か（読み上げを始めないための確認に使う） */
export function isRecording(): boolean {
  return recording
}

function liveStream(): MediaStream | null {
  return stream && stream.getAudioTracks().some((t) => t.readyState === 'live' && t.enabled) ? stream : null
}

/** マイクを準備する（初回は許可ダイアログが出る）。録音ボタンのタップ処理から呼ぶ */
export async function prepareMic(): Promise<void> {
  if (liveStream()) return
  stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
}

export function micReady(): boolean {
  return liveStream() !== null
}

/** マイクを解放する（録音を使わない画面に移るとき・0 バイト録音のあと） */
export function releaseMic(): void {
  stream?.getTracks().forEach((t) => t.stop())
  stream = null
}

/**
 * 録音を開始する。マイクが準備済みならタップ処理の中で同期的に start() する。
 * 未準備なら許可を取ってから開始する（初回のみ）。
 */
export function startRecording(maxMs = 10000): Promise<RecorderHandle> {
  const s = liveStream()
  if (s) return Promise.resolve(begin(s, maxMs))
  return prepareMic().then(() => begin(liveStream()!, maxMs))
}

function begin(s: MediaStream, maxMs: number): RecorderHandle {
  const mimeType = pickMime()
  const rec = new MediaRecorder(s, mimeType ? { mimeType } : undefined)
  const chunks: Blob[] = []
  const started = Date.now()
  rec.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data)
  }
  rec.start()
  recording = true
  rec.addEventListener('stop', () => {
    recording = false
  })
  const auto = setTimeout(() => {
    if (rec.state === 'recording') rec.stop()
  }, maxMs)
  return {
    stop: () =>
      new Promise<Recording>((resolve, reject) => {
        const finish = () => {
          clearTimeout(auto)
          const blob = new Blob(chunks, { type: rec.mimeType || mimeType || 'audio/mp4' })
          if (blob.size === 0) {
            // 0 バイト: 次回はマイクを取り直す
            releaseMic()
            reject(new Error('empty-recording'))
            return
          }
          resolve({ url: URL.createObjectURL(blob), blob, ms: Date.now() - started })
        }
        if (rec.state === 'inactive') return finish()
        rec.onstop = finish
        rec.stop()
      }),
    cancel: () => {
      clearTimeout(auto)
      if (rec.state === 'recording') rec.stop()
    },
  }
}

let stopCurrent: (() => void) | null = null

/** 録音の再生を止める（お手本の読み上げ・録音・画面を離れる前に呼ぶ） */
export function stopPlayback(): void {
  stopCurrent?.()
}

/** 録音の再生。終端の手前で pause() して止める（ended 後の録音が 0 バイトになる不具合の回避）。同時に鳴るのは1つだけ */
export function playUrl(url: string): Promise<void> {
  stopPlayback()
  return new Promise((resolve) => {
    const a = new Audio(url)
    let done = false
    const finish = () => {
      if (done) return
      done = true
      if (stopCurrent === finish) stopCurrent = null
      try {
        a.pause()
      } catch {
        /* 何もしない */
      }
      resolve()
    }
    stopCurrent = finish
    a.ontimeupdate = () => {
      if (Number.isFinite(a.duration) && a.duration > 0 && a.currentTime >= a.duration - 0.12) finish()
    }
    a.onended = finish
    a.onerror = finish
    a.play().catch(finish)
    setTimeout(finish, 15000)
  })
}
