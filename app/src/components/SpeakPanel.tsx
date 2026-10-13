// 発話練習パネル。3つの方式:
// - 録音（既定）: 録音してお手本と聞き比べ → 自己評価。iPhone のホーム画面アプリでも安定して使える
// - 入力: キーボードの音声入力（マイクキー）または文字入力で答え、自動判定する
// - 音声認識（試験的）: Web Speech API。iPhone では動かない・2回目以降止まる報告があるため設定で有効にしたときだけ
// 音声の機能は同時に使わない（読み上げ・録音・認識は1つずつ）

import { useEffect, useRef, useState } from 'react'
import { Check, Keyboard, Mic, RotateCcw, Square, Volume2, X } from 'lucide-react'
import { recognitionSupported, listenOnce, recognitionErrorJa, type ListenHandle } from '../engine/recognition'
import { recorderSupported, startRecording, prepareMic, micReady, playUrl, releaseMic, stopPlayback, type RecorderHandle } from '../engine/recorder'
import { CLOSE_SCORE, betterMatch, matchUtterance, type MatchResult } from '../engine/match'
import { stopSpeech } from '../engine/speech'
import { stopAmbient } from '../engine/sfx'
import { useSettings } from '../store/settings'
import { useProgress } from '../store/progress'
import { useSpeak, Wave } from './audio'

export type SelfRating = 'good' | 'ok' | 'again'

export interface SpeakOutcome {
  ok: boolean
  /** 自動判定のとき 0〜100 */
  score?: number
  transcript?: string
  self?: SelfRating
}

interface Props {
  target: string
  tts?: string
  keywords: string[]
  accept?: string[]
  /** お手本の英文を最初から見せるか */
  revealTarget?: boolean
  dark?: boolean
  rateMul?: number
  onResult: (r: SpeakOutcome) => void
}

type Mode = 'record' | 'type' | 'auto'
type Step = 'idle' | 'preparing' | 'ready' | 'recording' | 'listening' | 'review' | 'scored'

export function SpeakPanel({ target, tts, keywords, accept, revealTarget = false, dark = false, rateMul = 1, onResult }: Props) {
  const recognitionOn = useSettings((s) => s.useRecognition) && recognitionSupported
  const bump = useProgress((s) => s.bump)
  const { play, playingKey, stop } = useSpeak()
  const [mode, setMode] = useState<Mode>(recognitionOn ? 'auto' : recorderSupported ? 'record' : 'type')
  const [step, setStep] = useState<Step>('idle')
  const [interim, setInterim] = useState('')
  const [typed, setTyped] = useState('')
  const [result, setResult] = useState<(MatchResult & { transcript: string }) | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [recUrl, setRecUrl] = useState<string | null>(null)
  const [show, setShow] = useState(revealTarget)
  const listenRef = useRef<ListenHandle | null>(null)
  const recRef = useRef<RecorderHandle | null>(null)
  const mounted = useRef(true)
  const formRef = useRef<HTMLFormElement>(null)
  /** 「入力」に切り替えたときだけ、入力欄が画面に入るまでスクロールする */
  const revealForm = useRef(false)

  useEffect(() => {
    if (mode !== 'type' || !revealForm.current) return
    revealForm.current = false
    formRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [mode])

  // 画面を離れたら、認識・録音・録音の再生を止め、マイクを解放する
  // （マイクを開いたままだと、iPhone では読み上げの音量や出力先が変わることがある）
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      listenRef.current?.stop()
      recRef.current?.cancel()
      stopPlayback()
      releaseMic()
    }
  }, [])

  const modelKey = `speak-model:${target}`
  const tone = dark ? 'text-console-ink' : 'text-ink'
  const sub = dark ? 'text-console-sub' : 'text-sub'
  const panel = dark ? 'bg-console-panel border border-console-line' : 'bg-card-2 border border-line'
  const softBtn = dark ? 'bg-white/10 text-white' : 'bg-card border border-line text-ink'

  function quietAll() {
    stop()
    stopSpeech()
    stopAmbient()
    stopPlayback()
  }

  /** 録音・認識の最中は、お手本の再生を受け付けない（お手本が録音に入るのを防ぐ） */
  const busy = step === 'recording' || step === 'listening' || step === 'preparing'

  function playModel() {
    if (busy) return
    stopPlayback()
    void play(modelKey, { text: target, role: 'perfusionist', tts }, rateMul)
  }

  function score(transcripts: string[]) {
    const best = transcripts
      .filter((t) => t.trim())
      .map((t) => ({ ...matchUtterance(t, target, keywords, accept), transcript: t }))
      .reduce<(MatchResult & { transcript: string }) | null>((a, b) => (!a ? b : betterMatch(a, b)), null)
    if (!best) return
    setResult(best)
    setShow(true)
    setStep('scored')
    bump('spoken')
  }

  // ===== 音声認識（試験的） =====
  function startAuto() {
    quietAll()
    setError(null)
    setInterim('')
    setResult(null)
    setStep('listening')
    // start() はこのタップ処理の中で同期的に呼ばれる
    const h = listenOnce({ onInterim: setInterim })
    listenRef.current = h
    h.promise
      .then((r) => {
        if (!r.transcript) {
          setStep('idle')
          setError('声が聞き取れませんでした。もう一度、または「入力」「録音」の方式をお使いください。')
          return
        }
        score([r.transcript, ...r.alternatives])
      })
      .catch((e: unknown) => {
        setError(recognitionErrorJa(e instanceof Error ? e.message : 'unknown'))
        setStep('idle')
        setMode(recorderSupported ? 'record' : 'type')
      })
  }

  // ===== 録音 =====
  function onRecordTap() {
    if (step === 'recording') {
      void stopRec()
      return
    }
    quietAll()
    setError(null)
    if (!micReady()) {
      // 初回はマイクの準備だけ行い、次のタップで同期的に録音を始める（iOS の不具合対策）
      setStep('preparing')
      prepareMic()
        .then(() => {
          // 準備中に画面を離れていたら、取得したマイクをすぐ解放する
          if (!mounted.current) {
            releaseMic()
            return
          }
          setStep('ready')
        })
        .catch(() => {
          if (!mounted.current) return
          setStep('idle')
          setError('マイクを使えませんでした。設定アプリで Safari（またはこのアプリ）のマイクを許可するか、「入力」方式をお使いください。')
        })
      return
    }
    startRecording()
      .then((h) => {
        recRef.current = h
        setStep('recording')
      })
      .catch(() => {
        setStep('idle')
        setError('録音を開始できませんでした。もう一度タップしてください。')
      })
  }

  async function stopRec() {
    try {
      const r = await recRef.current?.stop()
      recRef.current = null
      if (r) setRecUrl(r.url)
      setShow(true)
      setStep('review')
      bump('spoken')
    } catch {
      recRef.current = null
      setStep('idle')
      setError('録音が空でした（iPhone の既知の不具合）。もう一度タップしてマイクを準備し直してください。')
    }
  }

  const rate = (self: SelfRating) => {
    releaseMic()
    onResult({ ok: self !== 'again', self })
  }

  const recLabel =
    step === 'recording' ? '録音を止める' : step === 'preparing' ? 'マイクを準備しています…' : step === 'ready' || micReady() ? '録音して言ってみる' : 'マイクを準備する'

  return (
    <div className={`rounded-2xl p-4 ${panel}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`text-xs font-bold ${sub}`}>お手本</p>
          {show ? (
            <p className={`en mt-0.5 text-[17px] font-bold leading-snug ${tone}`}>{target}</p>
          ) : (
            <button type="button" onClick={() => setShow(true)} className={`mt-1 text-sm font-bold underline ${sub}`}>
              英文を表示する
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={playModel}
          disabled={busy}
          className={`inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-bold disabled:opacity-40 ${softBtn}`}
        >
          {playingKey === modelKey ? <Wave /> : <Volume2 size={18} />}
          聞く
        </button>
      </div>

      {/* 方式の切り替え */}
      {step !== 'scored' && step !== 'review' && step !== 'recording' && step !== 'listening' && step !== 'preparing' && (
        <div className={`mt-3 grid gap-1 rounded-xl p-1 ${dark ? 'bg-white/5' : 'bg-card border border-line'}`} style={{ gridTemplateColumns: `repeat(${recognitionOn ? 3 : 2}, 1fr)` }}>
          {(
            [
              recorderSupported ? { v: 'record', label: '録音', icon: <Mic size={14} /> } : null,
              { v: 'type', label: '入力', icon: <Keyboard size={14} /> },
              recognitionOn ? { v: 'auto', label: '認識', icon: <Mic size={14} /> } : null,
            ].filter(Boolean) as { v: Mode; label: string; icon: React.ReactNode }[]
          ).map((o) => (
            <button
              key={o.v}
              type="button"
              onClick={() => {
                // 録音以外の方式に切り替えたら、準備済みのマイクを解放する
                if (o.v !== 'record') {
                  releaseMic()
                  if (step === 'ready') setStep('idle')
                }
                if (o.v === 'type' && mode !== 'type') revealForm.current = true
                setMode(o.v)
                setError(null)
              }}
              className={`inline-flex min-h-9 items-center justify-center gap-1 rounded-lg text-[13px] font-bold ${
                mode === o.v ? (dark ? 'bg-white text-navy' : 'bg-brand text-white') : sub
              }`}
            >
              {o.icon}
              {o.label}
            </button>
          ))}
        </div>
      )}

      {error && <p className="mt-3 rounded-lg bg-warn-soft px-3 py-2 text-xs text-warn">{error}</p>}

      {/* 録音して聞き比べ → 自己評価 */}
      {mode === 'record' && step !== 'scored' && (
        <div className="mt-3">
          {step !== 'review' && (
            <button
              type="button"
              onClick={onRecordTap}
              disabled={step === 'preparing'}
              className={`flex w-full min-h-14 items-center justify-center gap-2 rounded-2xl text-base font-bold text-white transition active:scale-[0.99] disabled:opacity-60 ${
                step === 'recording' ? 'bg-art' : 'bg-brand'
              }`}
            >
              {step === 'recording' ? <Square size={20} /> : <Mic size={22} />}
              {recLabel}
            </button>
          )}
          {step === 'ready' && <p className={`mt-2 text-center text-xs ${sub}`}>準備OK。もう一度タップすると録音が始まります。</p>}
          {step === 'review' && (
            <div className="animate-pop">
              {recUrl && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      stop()
                      void playUrl(recUrl)
                    }}
                    className={`min-h-11 rounded-xl font-bold ${softBtn}`}
                  >
                    <Volume2 size={16} className="mr-1 inline" />
                    自分の声
                  </button>
                  <button type="button" onClick={playModel} className={`min-h-11 rounded-xl font-bold ${softBtn}`}>
                    <Volume2 size={16} className="mr-1 inline" />
                    お手本
                  </button>
                </div>
              )}
              <p className={`mt-3 text-xs font-bold ${sub}`}>お手本と比べて、どうでしたか？</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <button type="button" onClick={() => rate('again')} className="min-h-11 rounded-xl bg-ng-soft font-bold text-ng">
                  もう一回
                </button>
                <button type="button" onClick={() => rate('ok')} className="min-h-11 rounded-xl bg-warn-soft font-bold text-warn">
                  おしい
                </button>
                <button type="button" onClick={() => rate('good')} className="min-h-11 rounded-xl bg-ok-soft font-bold text-ok">
                  言えた
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setRecUrl(null)
                  setStep(micReady() ? 'ready' : 'idle')
                }}
                className={`mt-3 w-full text-center text-xs underline ${sub}`}
              >
                録り直す
              </button>
            </div>
          )}
        </div>
      )}

      {/* キーボードの音声入力・文字入力で判定 */}
      {mode === 'type' && step !== 'scored' && (
        <form
          ref={formRef}
          className="mt-3 scroll-mb-[calc(env(safe-area-inset-bottom)+1rem)]"
          onSubmit={(e) => {
            e.preventDefault()
            score([typed])
          }}
        >
          {/* 判定ボタンは入力欄の横に置く（キーボードを出したとき、入力欄の下にあるとキーボードに隠れる） */}
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="text"
              lang="en"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="done"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="英語で入力"
              className={`en min-w-0 flex-1 rounded-xl px-3 py-3 outline-none ${dark ? 'bg-white/10 text-white placeholder:text-white/40' : 'border border-line bg-card text-ink'}`}
            />
            <button type="submit" disabled={!typed.trim()} className="min-h-12 shrink-0 rounded-xl bg-brand px-4 font-bold text-white disabled:opacity-40">
              判定
            </button>
          </div>
          <p className={`mt-1.5 text-[11px] leading-relaxed ${sub}`}>
            キーボードを英語に切り替えてマイクキーを押すと、話した英語が入力されます。
          </p>
        </form>
      )}

      {/* 音声認識（試験的） */}
      {mode === 'auto' && step !== 'scored' && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => (step === 'listening' ? listenRef.current?.stop() : startAuto())}
            className={`flex w-full min-h-14 items-center justify-center gap-2 rounded-2xl text-base font-bold text-white transition active:scale-[0.99] ${
              step === 'listening' ? 'bg-art' : 'bg-brand'
            }`}
          >
            {step === 'listening' ? <Wave /> : <Mic size={22} />}
            {step === 'listening' ? '聞いています…（タップで終了）' : '押して英語で言う'}
          </button>
          {step === 'listening' && interim && <p className={`en mt-2 text-sm ${sub}`}>{interim}</p>}
        </div>
      )}

      {/* 自動判定の結果（入力・認識） */}
      {step === 'scored' && result && (
        <div className="animate-pop mt-3">
          <p className={`text-xs font-bold ${sub}`}>あなたの答え</p>
          <p className={`en mt-0.5 text-[15px] ${tone}`}>“{result.transcript}”</p>
          {result.hits.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {result.hits.map((h) => (
                <span key={h.keyword} className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold ${h.hit ? 'bg-ok-soft text-ok' : 'bg-ng-soft text-ng'}`}>
                  {h.hit ? <Check size={12} /> : <X size={12} />}
                  <span className="en">{h.keyword}</span>
                </span>
              ))}
            </div>
          )}
          {result.conflicts.length > 0 && (
            <p className="mt-2 rounded-lg bg-ng-soft px-3 py-2 text-xs font-bold text-ng">
              意味が変わる語・数値がお手本と違います: <span className="en">{result.conflicts.join(', ')}</span>
            </p>
          )}
          <p className={`mt-3 text-sm font-bold ${result.pass ? 'text-ok' : 'text-warn'}`}>
            {result.pass ? '伝わります！' : result.score >= CLOSE_SCORE ? 'おしい。キーワードを確認してもう一度' : 'お手本を聞いて、もう一度'}（{result.score}点）
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setResult(null)
                setStep('idle')
              }}
              className={`min-h-11 rounded-xl font-bold ${softBtn}`}
            >
              <RotateCcw size={16} className="mr-1 inline" />
              もう一度
            </button>
            <button
              type="button"
              onClick={() => onResult({ ok: result.pass, score: result.score, transcript: result.transcript })}
              className="min-h-11 rounded-xl bg-brand font-bold text-white"
            >
              次へ
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
