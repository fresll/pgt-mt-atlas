import { describe, expect, it } from 'vitest'
import { atlas } from '../../data/atlas'
import { caseTextEn } from './en'

// Source-bound display copy must be reviewed again when a source summary changes.
const fields = ['variant', 'pool_range', 'transferred', 'offspring', 'data_type', 'value_origin'] as const
const numbers = (s: string) => s.replace(/(?<=\d),(?=\d)/g, '.').replace(/(?<=\d) (?=\d{3}(?:\D|$))/g, '').match(/\d+(?:\.\d+)?/g) ?? []

describe('English case summaries', () => {
  it('covers every current source summary requiring English display text', () => {
    for (const row of atlas.table1) for (const field of fields) {
      const source = row[field]
      if (!/[А-Яа-яЁё]/.test(source)) continue
      expect(caseTextEn[source], `source row ${row.row}: ${field}`).toBeTruthy()
      expect(caseTextEn[source]).not.toMatch(/[А-Яа-яЁё]/)
    }
  })

  it('preserves numerical precision, comparison signs and HGVS descriptions', () => {
    for (const [source, english] of Object.entries(caseTextEn)) {
      expect(numbers(english), source).toEqual(numbers(source))
      expect(english.match(/[<>≤≥±→]/g) ?? [], source).toEqual(source.match(/[<>≤≥±→]/g) ?? [])
      expect(english.match(/m\.\d+[ACGT]>[ACGT]/g) ?? [], source).toEqual(source.match(/m\.\d+[ACGT]>[ACGT]/g) ?? [])
    }
  })
})
