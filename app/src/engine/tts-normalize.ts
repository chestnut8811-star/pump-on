// 表示用の英文を、端末の音声合成で「現場らしく」読ませるための正規化。
// 教材側に tts（読み上げ用の文）があればそれを最優先する。

import { sayCompact, sayTime } from './numbers'

/** 略語・単位・現場の言い回しの読み。上から順に適用 */
const RULES: [RegExp, string][] = [
  [/\bACTs\b/g, 'A C Ts'],
  [/\bACT\b/g, 'A C T'],
  [/\bCPB\b/g, 'C P B'],
  [/\bCABG\b/g, 'cabbage'],
  [/\bAVR\b/g, 'A V R'],
  [/\bMVR\b/g, 'M V R'],
  [/\bLVOT\b/g, 'L V O T'],
  [/\bLV\b/g, 'L V'],
  [/\bRV\b/g, 'R V'],
  [/\bLA\b/g, 'L A'],
  [/\bRA\b/g, 'R A'],
  [/\bSVC\b/g, 'S V C'],
  [/\bIVC\b/g, 'I V C'],
  [/\bCVP\b/g, 'C V P'],
  [/\bPAP\b/g, 'P A P'],
  [/\bPA\b/g, 'P A'],
  [/\bIV\b/g, 'I V'],
  [/\bTEE\b/g, 'T E E'],
  [/\bECG\b/g, 'E C G'],
  [/\bEKG\b/g, 'E K G'],
  [/\bVF\b/g, 'V F'],
  [/\bVT\b/g, 'V T'],
  [/\bSvO2\b/gi, 'S V O 2'],
  [/\bSaO2\b/gi, 'S A O 2'],
  [/\bPaCO2\b/g, 'P A C O 2'],
  [/\bPaO2\b/g, 'P A O 2'],
  [/\bpCO2\b/gi, 'P C O 2'],
  [/\bpO2\b/gi, 'P O 2'],
  [/\bFiO2\b/gi, 'F I O 2'],
  [/\bNIRS\b/g, 'nears'],
  [/\bVAVD\b/g, 'V A V D'],
  [/\bHTK\b/g, 'H T K'],
  [/\bFFP\b/g, 'F F P'],
  [/\bICU\b/g, 'I C U'],
  [/\bABG\b/g, 'A B G'],
  [/\bIABP\b/g, 'I A B P'],
  [/\bECMO\b/g, 'eck-mo'],
  [/\bHb\b/g, 'H B'],
  [/\bHct\b/g, 'crit'],
  [/\bAT\s?III\b/g, 'A T three'],
  [/\bOR\b/g, 'O R'],
  [/\bpleg\b/gi, 'pledge'],
  [/\bplegs\b/gi, 'pledges'],
  [/\bdefib\b/gi, 'dee-fib'],
  [/\s?mmHg\b/g, ''],
  [/\s?°C\b/g, ' degrees'],
  [/\s?L\/min\b/g, ' liters'],
  [/\bmL\/kg\b/g, 'mils per kilo'],
  [/\s?mL\b/g, ' mils'],
  [/\bU\/kg\b/g, 'units per kilo'],
  [/(\d)\s?J\b/g, '$1 joules'],
]

/** 表示用の英文 → 読み上げ用の英文 */
export function normalizeForSpeech(text: string): string {
  let s = text
  // 時刻（09:42）→ nine forty-two
  s = s.replace(/\b(\d{1,2}):(\d{2})\b/g, (_m, h: string, mm: string) => sayTime(`${h}:${mm}`))
  // 3桁の整数（小数・桁区切り・時刻の一部を除く）→ four eighty
  s = s.replace(/(?<!\d|\d[.,:])(\d{3})(?!\d|[.,:]\d)/g, (_m, d: string) => sayCompact(Number(d)))
  for (const [re, to] of RULES) s = s.replace(re, to)
  return s.replace(/\s{2,}/g, ' ').trim()
}

/** 教材の tts があればそれを、なければ正規化した文を返す */
export function speechText(en: string, tts?: string): string {
  return tts && tts.trim() ? tts : normalizeForSpeech(en)
}
