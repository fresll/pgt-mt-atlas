import { createInstance } from 'i18next'
import { beforeAll, describe, expect, it } from 'vitest'
import en from '../i18n/en'
import ru from '../i18n/ru'
import { obsValueText, pairValueText } from './obs'

const i18n = createInstance()
beforeAll(async () => {
  await i18n.init({ lng: 'en', resources: { en: { translation: en }, ru: { translation: ru } }, interpolation: { escapeValue: false } })
})

describe('result wording', () => {
  it('distinguishes non-detection from an exact zero in English', () => {
    const t = i18n.getFixedT('en')
    expect(pairValueText(0, 'not_detected', null, 'en', t)).toBe('not detected')
    expect(pairValueText(0, 'exact', null, 'en', t)).toBe('0%')
    expect(obsValueText({ q: 'not_detected', value: 0, low: null, high: null, lod: 3 }, 'en', t)).toBe('not detected (limit of detection: 3%)')
  })

  it('keeps a less-than result distinct from non-detection and retains interval bounds', () => {
    const t = i18n.getFixedT('en')
    expect(pairValueText(3, 'less_than', '<3%', 'en', t)).toBe('below 3%')
    expect(obsValueText({ q: 'interval', value: null, low: 26, high: 45, lod: null }, 'en', t)).toBe('published interval only: 26–45%')
  })

  it('preserves the existing Russian display convention', () => {
    expect(pairValueText(0, 'not_detected', null, 'ru', i18n.getFixedT('ru'))).toBe('0% — не выявлено')
  })
})
