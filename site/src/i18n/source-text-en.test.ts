import { describe, expect, it } from 'vitest'
import { atlas } from '../data/atlas'
import { sourceText, sourceTextEn } from './source-text-en'

const cyrillic = /[А-Яа-яЁё]/
const numbers = (text: string) => (text.replace(/(?<=\d),(?=\d)/g, '.').match(/\d+(?:\.\d+)?/g) ?? []).map(Number)

describe('source-bound English explanations', () => {
  it('covers the current Russian notes, limits, classification evidence and offspring details', () => {
    const displayed = [
      ...atlas.offspring.flatMap(p => [p.age, p.method, p.tissue_raw, p.emb_raw, p.value_raw, p.on_plot_raw]),
      ...atlas.landscape.flatMap(p => [p.note, p.derivation_evidence]),
      ...atlas.thresholds.flatMap(p => [p.locator, p.checked]),
      ...Object.values(atlas.variant_classes).map(p => p.locator),
      ...atlas.hu2026_within_embryo.samples.map(p => p.cells_raw),
      ...atlas.publications.map(p => p.doi_exception),
      atlas.model.p_eupl_locator,
    ]
    for (const raw of displayed) {
      if (!raw || !cyrillic.test(raw)) continue
      expect(sourceTextEn[raw], raw).toBeDefined()
    }
  })

  it('retains all numerical tokens and preserves the original Russian display', () => {
    for (const [raw, en] of Object.entries(sourceTextEn)) {
      expect(numbers(en.replaceAll(' [Table 1]', '')), raw).toEqual(numbers(raw))
      expect(sourceText(raw, 'ru')).toBe(raw)
      // Original workbook sheet names remain searchable; explanatory prose is English.
      expect(en.replaceAll('Таблица 1', '')).not.toMatch(cyrillic)
    }
  })
})
