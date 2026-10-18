import { describe, expect, it } from 'vitest'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { englishRows, englishText } from './english-text'

describe('English provenance and downloads', () => {
  it('translates worksheet names and embedded locators without changing coordinates', () => {
    expect(englishText('Рисунок 5')).toBe('Figure 5')
    expect(englishText('Table 1; Treff 2012, Methods; Atlas worksheet «Рисунок 5», row 10')).toBe('Table 1; Treff 2012, Methods; Atlas worksheet «Figure 5», row 10')
  })

  it('localises export text while retaining identifiers, values, qualifiers and nulls', () => {
    const source = [{ id: 'C13', value_pct: null, qualifier: 'qualitative', signal: 0.17, control: 0.28, included: false, text: 'вариант не выявлен; сигнал 0,17% ниже контрольного образца 0,28%' }]
    const translated = englishRows(source)
    expect({ ...translated[0], text: source[0].text }).toEqual(source[0])
    expect(translated[0].text).toContain('authors interpreted the variant as not detected')
    expect(translated[0].text).not.toMatch(/[А-Яа-яЁё]/)
    expect(source[0].text).toContain('вариант не выявлен')
  })

  it('checks all static CSV exports and the Excel template against their originals', () => {
    execFileSync('python3', [fileURLToPath(new URL('../../scripts/test_english_downloads.py', import.meta.url))], { stdio: 'pipe' })
  })
})
