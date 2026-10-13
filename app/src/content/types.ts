// 教材データの型。教材は実行時に生成せず、この型に沿った固定データとして持つ。
// 医学的内容は監修状態（status）と注記（notes）で不確実性・施設差を明示する。

import type { SourceId } from './sources'

/** 話者。学習者は常に perfusionist（あなた）。team は全員への宣言（タイムアウトなど） */
export type RoleId = 'surgeon' | 'assistant' | 'anesthesiologist' | 'perfusionist' | 'nurse' | 'team'

export type PhaseId =
  | 'basics'
  | 'prebypass'
  | 'cannulation'
  | 'initiation'
  | 'venting'
  | 'cooling'
  | 'crossclamp'
  | 'cardioplegia'
  | 'onbypass'
  | 'rewarming'
  | 'deairing'
  | 'weaning'
  | 'protamine'
  | 't-pressure'
  | 't-air'
  | 't-drainage'
  | 't-oxygenator'
  | 't-power'
  | 't-anticoag'

export type PhaseGroup = 'basics' | 'flow' | 'trouble'

/** simple=初心者でも言いやすい基本形 / natural=現場で自然な標準形 / shorthand=現場の短縮形・スラング */
export type Register = 'simple' | 'natural' | 'shorthand'

export type Region = 'common' | 'US' | 'UK' | 'AU' | 'EU'

/**
 * facility=施設差あり / region=地域差（米英豪など）/ caution=安全上の注意 /
 * verify=要確認（根拠を確認できていない）/ tip=学習のコツ
 */
export type NoteKind = 'facility' | 'region' | 'caution' | 'verify' | 'tip'

/**
 * ai-draft=AI下書き・臨床未監修（初期値）/ needs-check=要確認の内容を含む /
 * reviewed=監修済み（監修者だけが付ける。AI は付けない）
 */
export type ReviewStatus = 'ai-draft' | 'needs-check' | 'reviewed'

/** 1=基本 2=標準 3=実践（短縮形・速い会話・トラブル） */
export type Level = 1 | 2 | 3

/**
 * 表現の裏付け（docs/research/01 の確度に対応）
 * verbatim=論文・学会基準で文言を確認（確度 高）/
 * observed=教育動画・実務者報告で確認（確度 中。音声での確認待ち）/
 * constructed=出典で未確認（AI が作った自然な英文。監修で確認が必要）
 */
export type Evidence = 'verbatim' | 'observed' | 'constructed'

export interface Note {
  kind: NoteKind
  text: string
  sources?: SourceId[]
}

export interface Keyword {
  en: string
  ja: string
  kind?: 'term' | 'number' | 'time'
}

export interface Variant {
  en: string
  register: Register
  ja?: string
  region?: Region
  /** この言い方についての補足（日本語） */
  note?: string
  /** 読み上げ用（省略時は自動正規化） */
  tts?: string
  /** 裏付け。shorthand（現場の短縮形）では必須 */
  evidence?: Evidence
}

export interface Reply {
  role: RoleId
  en: string
  ja: string
  tts?: string
}

export interface Phrase {
  /** 例: 'init-01'。全教材で一意 */
  id: string
  phase: PhaseId
  speaker: RoleId
  to: RoleId | 'all'
  /** 代表表現（現場で自然な標準形）。数値は数字で書く */
  en: string
  /** 読み上げ用（数値・略語の現場読み）。省略時は engine/tts-normalize で自動変換 */
  tts?: string
  /** 意味（自然な日本語） */
  ja: string
  /** 使う場面（日本語・1文） */
  when: string
  /** 同じ意味の別表現（簡単 / 自然 / 短縮）。代表表現は含めなくてよい */
  variants: Variant[]
  /** 典型的な返答（closed-loop の復唱を含む） */
  replies: Reply[]
  /** 聞き取るべき語・数値 */
  keywords: Keyword[]
  notes?: Note[]
  level: Level
  /** 代表表現（en）の裏付け */
  evidence: Evidence
  sources?: SourceId[]
  status: ReviewStatus
}

export interface DialogueLine {
  role: RoleId
  en: string
  ja: string
  tts?: string
  /** 対応するフレーズ（復習との連携用） */
  phraseId?: string
}

export interface Dialogue {
  id: string
  phase: PhaseId
  title: string
  /** 状況説明（日本語） */
  setting: string
  lines: DialogueLine[]
  level: Level
  notes?: Note[]
  status: ReviewStatus
}

export interface Phase {
  id: PhaseId
  order: number
  group: PhaseGroup
  titleJa: string
  titleEn: string
  /** 1行の要約 */
  summary: string
  /** 何が起きているか・誰が誰に何を伝えるか（日本語の段落） */
  overview: string[]
  /** コミュニケーション上・安全上の要点 */
  keyPoints: string[]
  /** このシーンでよく聞く語 */
  listenFor: Keyword[]
  notes?: Note[]
  sources: SourceId[]
  status: ReviewStatus
}

/** シミュレーターのモニター表示（人工心肺コンソール風） */
export interface HudState {
  /** 表示ラベル（英語）例: 'PRE-BYPASS' / 'ON BYPASS' / 'WEANING' / 'OFF BYPASS' */
  stage: string
  /** ポンプ流量 L/min */
  flow: number | null
  /** 平均血圧 mmHg */
  map: number | null
  /** 患者温（鼻咽頭温など）℃ */
  temp: number | null
  /** ACT 秒 */
  act: number | null
  /** 混合静脈血酸素飽和度 % */
  svo2: number | null
  /** 送血ライン圧 mmHg */
  linePressure: number | null
  /** リザーバーレベル */
  level: 'ok' | 'low' | 'critical'
  /** CPB 開始時刻 'HH:MM' */
  cpbStart: string | null
  /** 大動脈遮断の開始時刻 'HH:MM' */
  clampStart: string | null
  /** 直近の心筋保護投与の時刻 'HH:MM' */
  plegAt: string | null
  /** 表示中のアラーム（英語） */
  alarm: string | null
}

export interface RespondOption {
  en: string
  correct: boolean
  /** なぜ正解/不正解か（日本語）。誤答は「数値違い」「安全でない」「復唱なし」「不自然」などを具体的に */
  why: string
  tts?: string
}

/** 状況に合う返答を選ぶ */
export interface RespondTask {
  kind: 'respond'
  /** 設問（日本語） */
  prompt: string
  /** 3〜4択。正解はちょうど1つ */
  options: RespondOption[]
  /** 正解の英語（あなたの声で再生） */
  model: string
  modelJa: string
  modelTts?: string
  /** 他の言い方 */
  alt?: Variant[]
  phraseIds?: string[]
}

/** 聞こえた数値・語を選ぶ */
export interface CatchTask {
  kind: 'catch'
  prompt: string
  /** 表示用の選択肢（例: '2.5 L/min'） */
  options: string[]
  /** options のどれか */
  answer: string
  why?: string
  phraseIds?: string[]
}

/** 自分で言う（音声認識、または録音して自己評価） */
export interface SpeakTask {
  kind: 'speak'
  prompt: string
  /** お手本（英語） */
  target: string
  tts?: string
  /** ほかの正解例 */
  accept?: string[]
  /** 自動判定で必須の語（target に含まれること） */
  keywords: string[]
  /** ヒント（日本語。ガイドモードで表示） */
  hint?: string
  phraseIds?: string[]
}

export type SimTask = RespondTask | CatchTask | SpeakTask

export interface Beat {
  id: string
  phase: PhaseId
  /** 模擬時刻 'HH:MM' */
  clock?: string
  /** 状況（日本語） */
  narration?: string
  /** この時点のモニター表示の変化 */
  hud?: Partial<HudState>
  /** 相手の発話（課題の前に流れる） */
  lines?: DialogueLine[]
  task?: SimTask
  /** 課題のあとに流れる発話（相手の了解など） */
  after?: DialogueLine[]
}

export interface SimCase {
  id: string
  titleJa: string
  titleEn: string
  difficulty: Level
  /** 目安の所要時間（分） */
  minutes: number
  synopsis: string
  /** 架空の患者・術式の説明 */
  patient: string
  tags: ('standard' | 'trouble')[]
  initialHud: HudState
  beats: Beat[]
  notes?: Note[]
  sources?: SourceId[]
  status: ReviewStatus
}

export type GlossaryCategory =
  | 'circuit'
  | 'procedure'
  | 'drug'
  | 'monitor'
  | 'lab'
  | 'communication'
  | 'anatomy'
  | 'role'

export interface GlossaryEntry {
  term: string
  tts?: string
  ja: string
  /** 短い説明（日本語） */
  desc: string
  category: GlossaryCategory
  /** 別名・略語 */
  aka?: string[]
  notes?: Note[]
  sources?: SourceId[]
  status: ReviewStatus
}

export type SourceKind = 'guideline' | 'standard' | 'paper' | 'textbook' | 'domestic' | 'web'

export interface Source {
  title: string
  org?: string
  year?: number
  url?: string
  kind: SourceKind
  /** 何の根拠として使っているか（日本語） */
  usedFor?: string
  /** 参照日 YYYY-MM-DD */
  accessed?: string
}
