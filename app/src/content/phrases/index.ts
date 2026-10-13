// シーンごとのフレーズを集める（手術の流れの順）。
import type { Phrase } from '../types'
import { phrases as basics } from './basics'
import { phrases as prebypass } from './prebypass'
import { phrases as cannulation } from './cannulation'
import { phrases as initiation } from './initiation'
import { phrases as venting } from './venting'
import { phrases as cooling } from './cooling'
import { phrases as crossclamp } from './crossclamp'
import { phrases as cardioplegia } from './cardioplegia'
import { phrases as onbypass } from './onbypass'
import { phrases as rewarming } from './rewarming'
import { phrases as deairing } from './deairing'
import { phrases as weaning } from './weaning'
import { phrases as protamine } from './protamine'
import { phrases as t_pressure } from './t-pressure'
import { phrases as t_air } from './t-air'
import { phrases as t_drainage } from './t-drainage'
import { phrases as t_oxygenator } from './t-oxygenator'
import { phrases as t_power } from './t-power'
import { phrases as t_anticoag } from './t-anticoag'

export const ALL_PHRASES: Phrase[] = [
  ...basics,
  ...prebypass,
  ...cannulation,
  ...initiation,
  ...venting,
  ...cooling,
  ...crossclamp,
  ...cardioplegia,
  ...onbypass,
  ...rewarming,
  ...deairing,
  ...weaning,
  ...protamine,
  ...t_pressure,
  ...t_air,
  ...t_drainage,
  ...t_oxygenator,
  ...t_power,
  ...t_anticoag,
]
