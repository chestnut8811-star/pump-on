import { describe, expect, it } from 'vitest'
import { normalizeForSpeech, speechText } from '../src/engine/tts-normalize'

describe('読み上げ用の正規化', () => {
  it('略語と数値', () => {
    expect(normalizeForSpeech('ACT is 480.')).toBe('A C T is four eighty.')
    expect(normalizeForSpeech('Cross-clamp on at 09:42.')).toBe('Cross-clamp on at nine forty-two.')
    expect(normalizeForSpeech('Flow is 4.5 L/min.')).toBe('Flow is 4.5 liters.')
    expect(normalizeForSpeech('Give 30,000 units.')).toBe('Give 30,000 units.')
    expect(normalizeForSpeech('Pleg is going in.')).toBe('pledge is going in.')
    expect(normalizeForSpeech('CVP is 12, PA is 30.')).toBe('C V P is 12, P A is 30.')
    expect(normalizeForSpeech('Temp 32°C.')).toBe('Temp 32 degrees.')
  })
  it('教材の tts を優先', () => {
    expect(speechText('ACT is 480.', 'A C T is four-eighty.')).toBe('A C T is four-eighty.')
    expect(speechText('ACT is 480.')).toBe('A C T is four eighty.')
  })
})
