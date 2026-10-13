// 読み上げボタンと再生状態（同時に鳴るのは1つだけ）

import { useCallback } from 'react'
import { create } from 'zustand'
import { Volume2, Square } from 'lucide-react'
import type { RoleId } from '../content/types'
import { speak, stopSpeech, unlockSpeech, speakSequence } from '../engine/speech'
import { isRecording, stopPlayback } from '../engine/recorder'
import { isListening } from '../engine/recognition'
import { unlockAudio } from '../engine/sfx'
import { useSettings } from '../store/settings'
import { useProgress } from '../store/progress'

interface PlayerState {
  key: string | null
  setKey: (k: string | null) => void
}

export const usePlayer = create<PlayerState>()((set) => ({ key: null, setKey: (key) => set({ key }) }))

export interface SpeakItem {
  text: string
  role: RoleId
  tts?: string
}

/** 読み上げのフック。rateMul はモード（ガイドはゆっくり等）による倍率 */
export function useSpeak() {
  const rate = useSettings((s) => s.rate)
  const voices = useSettings((s) => s.voices)
  const bump = useProgress((s) => s.bump)
  const key = usePlayer((s) => s.key)
  const setKey = usePlayer((s) => s.setKey)

  const stop = useCallback(() => {
    stopSpeech()
    setKey(null)
  }, [setKey])

  const play = useCallback(
    async (k: string, item: SpeakItem, rateMul = 1) => {
      // 録音・聞き取りの最中は読み上げない（お手本の声が録音に入るのを防ぐ）
      if (isRecording() || isListening()) return
      unlockSpeech()
      unlockAudio()
      stopPlayback()
      if (usePlayer.getState().key === k) {
        stop()
        return
      }
      setKey(k)
      bump('plays')
      await speak(item.text, { role: item.role, tts: item.tts, rate: rate * rateMul, voiceURI: voices[item.role] })
      if (usePlayer.getState().key === k) setKey(null)
    },
    [bump, rate, setKey, stop, voices],
  )

  /** 複数行を順に。onLine で今どの行かを受け取る。最後まで流れたら true */
  const playAll = useCallback(
    async (k: string, items: SpeakItem[], onLine?: (i: number) => void, rateMul = 1) => {
      if (isRecording() || isListening()) return false
      unlockSpeech()
      unlockAudio()
      stopPlayback()
      stopSpeech()
      setKey(k)
      bump('plays')
      const ok = await speakSequence(items, { rate: rate * rateMul, voiceFor: (r) => voices[r], onLine })
      if (usePlayer.getState().key === k) setKey(null)
      return ok
    },
    [bump, rate, setKey, voices],
  )

  return { play, playAll, stop, playingKey: key }
}

export function AudioButton({
  k,
  item,
  size = 'md',
  rateMul = 1,
  label,
  className = '',
  tone = 'brand',
}: {
  k: string
  item: SpeakItem
  size?: 'sm' | 'md' | 'lg'
  rateMul?: number
  label?: string
  className?: string
  tone?: 'brand' | 'light' | 'dark'
}) {
  const { play, playingKey } = useSpeak()
  const on = playingKey === k
  // sm は見た目 36px のまま、押せる範囲を 44px にする（-m-1 で周りの余白は変えない）
  const box = size === 'sm' ? '-m-1 h-11 w-11' : size === 'lg' ? 'h-14 w-14' : 'h-11 w-11'
  const dot = size === 'sm' ? 'h-9 w-9' : 'h-full w-full'
  const icon = size === 'lg' ? 26 : size === 'sm' ? 16 : 20
  const color =
    tone === 'dark'
      ? on
        ? 'bg-white text-navy'
        : 'bg-white/12 text-white'
      : tone === 'light'
        ? on
          ? 'bg-brand text-white'
          : 'bg-card-2 text-brand-ink border border-line'
        : on
          ? 'bg-navy text-white'
          : 'bg-brand text-white'
  return (
    <button
      type="button"
      aria-label={label ?? (on ? '停止' : '再生')}
      onClick={(e) => {
        e.stopPropagation()
        void play(k, item, rateMul)
      }}
      className={`inline-flex shrink-0 items-center justify-center rounded-full transition active:scale-95 ${box} ${className}`}
    >
      <span className={`inline-flex items-center justify-center rounded-full ${dot} ${color}`}>
        {on ? <Wave /> : <Volume2 size={icon} strokeWidth={2.4} />}
      </span>
      {label && <span className="sr-only">{label}</span>}
    </button>
  )
}

/** 再生中の波形（タップで停止できることも示す） */
export function Wave({ className = '' }: { className?: string }) {
  return (
    <span className={`relative inline-flex h-4 items-center gap-[3px] ${className}`} aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="animate-wave h-4 w-[3px] rounded-full bg-current" style={{ animationDelay: `${i * 0.12}s` }} />
      ))}
      <Square size={0} />
    </span>
  )
}
