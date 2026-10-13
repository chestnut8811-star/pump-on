// シーンごとの会話を集める（手術の流れの順）。
import type { Dialogue } from '../types'
import { dialogues as basics } from './basics'
import { dialogues as prebypass } from './prebypass'
import { dialogues as cannulation } from './cannulation'
import { dialogues as initiation } from './initiation'
import { dialogues as venting } from './venting'
import { dialogues as cooling } from './cooling'
import { dialogues as crossclamp } from './crossclamp'
import { dialogues as cardioplegia } from './cardioplegia'
import { dialogues as onbypass } from './onbypass'
import { dialogues as rewarming } from './rewarming'
import { dialogues as deairing } from './deairing'
import { dialogues as weaning } from './weaning'
import { dialogues as protamine } from './protamine'
import { dialogues as t_pressure } from './t-pressure'
import { dialogues as t_air } from './t-air'
import { dialogues as t_drainage } from './t-drainage'
import { dialogues as t_oxygenator } from './t-oxygenator'
import { dialogues as t_power } from './t-power'
import { dialogues as t_anticoag } from './t-anticoag'

export const ALL_DIALOGUES: Dialogue[] = [
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
