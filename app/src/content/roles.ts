import type { RoleId } from './types'

export interface RoleMeta {
  id: RoleId
  ja: string
  en: string
  /** アバターに出す1文字 */
  mark: string
  /** 話者の色（CSS 変数名ではなく実色。ライト/ダーク両方で読める中間色） */
  color: string
  /** 既定の声の好み（engine/speech が端末の音声から選ぶ） */
  voice: { langs: string[]; prefer: 'male' | 'female' | 'any' }
}

export const ROLES: Record<RoleId, RoleMeta> = {
  surgeon: {
    id: 'surgeon',
    ja: '外科医',
    en: 'Surgeon',
    mark: '外',
    color: '#6457D6',
    voice: { langs: ['en-US', 'en-GB', 'en-AU'], prefer: 'male' },
  },
  assistant: {
    id: 'assistant',
    ja: '助手',
    en: 'Assistant',
    mark: '助',
    color: '#8B7FE6',
    voice: { langs: ['en-AU', 'en-US', 'en-GB'], prefer: 'male' },
  },
  anesthesiologist: {
    id: 'anesthesiologist',
    ja: '麻酔科医',
    en: 'Anesthesiologist',
    mark: '麻',
    color: '#159A63',
    voice: { langs: ['en-GB', 'en-US', 'en-AU'], prefer: 'any' },
  },
  perfusionist: {
    id: 'perfusionist',
    ja: 'あなた（臨床工学技士）',
    en: 'Perfusionist',
    mark: '臨',
    color: '#0E9F92',
    voice: { langs: ['en-US', 'en-GB'], prefer: 'female' },
  },
  nurse: {
    id: 'nurse',
    ja: '看護師',
    en: 'Nurse',
    mark: '看',
    color: '#D9730D',
    voice: { langs: ['en-AU', 'en-US', 'en-GB'], prefer: 'female' },
  },
  team: {
    id: 'team',
    ja: 'チーム全員',
    en: 'Team',
    mark: '全',
    color: '#64748B',
    voice: { langs: ['en-US', 'en-GB'], prefer: 'any' },
  },
}

export const ROLE_IDS = Object.keys(ROLES) as RoleId[]
