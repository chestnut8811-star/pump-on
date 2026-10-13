// シミュレーターの症例を集める（一覧の表示順）。
import type { SimCase } from '../types'
import { cabgStandard } from './cabg-standard'
import { troubleAirLock } from './trouble-air-lock'
import { troubleLinePressure } from './trouble-line-pressure'

export const ALL_CASES: SimCase[] = [cabgStandard, troubleAirLock, troubleLinePressure]
