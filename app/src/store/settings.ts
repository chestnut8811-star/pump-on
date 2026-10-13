// 設定（端末内のみ）

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { RoleId } from '../content/types'
import type { SimMode } from './progress'
import { DAILY_GOAL_DEFAULT } from '../engine/xp'

export type Theme = 'system' | 'light' | 'dark'
export type Subtitles = 'en+ja' | 'en' | 'none'

export interface SettingsData {
  theme: Theme
  /** 読み上げ速度（1 = 標準） */
  rate: number
  /** 話者ごとの声（voiceURI）。未設定は自動 */
  voices: Partial<Record<RoleId, string>>
  subtitles: Subtitles
  simMode: SimMode
  orNoise: boolean
  useRecognition: boolean
  sfx: boolean
  dailyGoal: number
  /** ホーム画面追加の案内を閉じた */
  installHintClosed: boolean
}

export const defaultSettings = (): SettingsData => ({
  theme: 'system',
  rate: 0.95,
  voices: {},
  subtitles: 'en+ja',
  simMode: 'guided',
  orNoise: false,
  useRecognition: false,
  sfx: true,
  dailyGoal: DAILY_GOAL_DEFAULT,
  installHintClosed: false,
})

interface Actions {
  set: <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => void
  setVoice: (role: RoleId, voiceURI: string | null) => void
  replaceAll: (data: Partial<SettingsData>) => void
  reset: () => void
}

export const useSettings = create<SettingsData & Actions>()(
  persist(
    (set, get) => ({
      ...defaultSettings(),
      set: (key, value) => set({ [key]: value } as Partial<SettingsData>),
      setVoice: (role, voiceURI) => {
        const voices = { ...get().voices }
        if (voiceURI) voices[role] = voiceURI
        else delete voices[role]
        set({ voices })
      },
      replaceAll: (data) => set({ ...defaultSettings(), ...data }),
      reset: () => set(defaultSettings()),
    }),
    {
      name: 'pumpon:settings:v1',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (s) => {
        const { set: _s, setVoice: _v, replaceAll: _r, reset: _x, ...data } = s
        return data
      },
    },
  ),
)

export function snapshotSettings(): SettingsData {
  const { set: _s, setVoice: _v, replaceAll: _r, reset: _x, ...data } = useSettings.getState()
  return data
}
