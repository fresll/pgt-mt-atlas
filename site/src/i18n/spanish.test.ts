import { describe, expect, it } from 'vitest'
import { createInstance } from 'i18next'
import en from './en'
import ru from './ru'
import es from './es'
import atlasEs from './atlas-es.json'
import raw from '../data/atlas.json'
import template from '../data/submissionTemplate.json'
import templateEs from './template-es.json'
import enContent from '../content/fundamentals/en'
import esContent from '../content/fundamentals/es'
import { blockStrings, citeIds, linkPaths } from '../content/fundamentals/markup'
import { switchLangPath } from '../components/Layout'
import { scientificText } from './scientificText'
import { fmt, pct } from '../lib/format'
import { obsValueText } from '../lib/obs'

function strings(value: unknown, path = ''): Record<string, string> {
  if (typeof value === 'string') return { [path]: value }
  if (!value || typeof value !== 'object') return {}
  return Object.assign({}, ...Object.entries(value).map(([k, v]) => strings(v, `${path}.${k}`)))
}
const placeholders = (s: string) => [...s.matchAll(/\{\{([^}]+)\}\}/g)].map((m) => m[1]).sort()
// Normalise typography only. Values are never rounded.
function numbers(s: string, spanish = false) {
  let text = s.replace(/\[@[^\]]+\]/g, '').replace(/\[\[([^|]+)\|[^\]]+\]\]/g, '$1')
    .replace(/m\.\d+(?:[ACGT>]+(?:\/[ACGT])?|del[ACGT]?)/g, '')
    .replace(/(\d)[\u00a0\u202f](?=\d{3}\b)/g, '$1')
  text = spanish ? text.replace(/(\d),(\d)/g, '$1.$2') : text.replace(/(\d),(\d{3})(?=\D|$)/g, '$1$2')
  return text.match(/\d+(?:\.\d+)?/g) ?? []
}

describe('Spanish localization integrity', () => {
  it('covers all interface leaves and preserves interpolation and citations', () => {
    const base = strings(ru), english = strings(en), spanish = strings(es)
    expect(Object.keys(spanish).sort()).toEqual(Object.keys(base).sort())
    for (const [key, value] of Object.entries(spanish)) {
      expect(value.trim(), key).not.toBe('')
      expect(placeholders(value), key).toEqual(placeholders(english[key]))
      expect(citeIds(value), key).toEqual(citeIds(english[key]))
    }
  })
  for (const [i, chapter] of esContent.chapters.entries()) {
    it(`preserves citations, links, identifiers and numbers: ${chapter.slug}`, () => {
      const source = enContent.chapters[i]
      expect(chapter.slug).toBe(source.slug)
      expect(chapter.widgets).toEqual(source.widgets)
      expect(chapter.data.map((d) => d.to)).toEqual(source.data.map((d) => d.to))
      for (const level of ['essentials', 'advanced'] as const) {
        expect(chapter[level].map((b) => b.t)).toEqual(source[level].map((b) => b.t))
        chapter[level].forEach((block, j) => {
          const a = blockStrings(source[level][j]), b = blockStrings(block), context = `${level}/${j}`
          expect(b.length, context).toBe(a.length)
          expect(b.flatMap(citeIds), context).toEqual(a.flatMap(citeIds))
          expect(b.flatMap(linkPaths), context).toEqual(a.flatMap(linkPaths))
          expect(numbers(b.join(' '), true), context).toEqual(numbers(a.join(' ')))
          const ids = (s: string) => s.match(/m\.\d+(?:[ACGT>]+(?:\/[ACGT])?|del[ACGT]?)|MT-[A-Z0-9]+|rCRS|HGVS/g) ?? []
          expect(ids(b.join(' ')), context).toEqual(ids(a.join(' ')))
        })
      }
    })
  }
  it('covers generated editorial descriptions and template sheets without altering source data', () => {
    let n = 0
    function visit(value: unknown) {
      if (!value || typeof value !== 'object') return
      const v = value as Record<string, unknown>
      if (typeof v.en === 'string' && typeof v.ru === 'string') {
        n++
        expect((atlasEs as Record<string, string>)[v.en], v.en).toBeTruthy()
        const text = { en: v.en, ru: v.ru }
        expect(scientificText(text, 'en')).toBe(v.en)
        expect(scientificText(text, 'ru')).toBe(v.ru)
        expect(scientificText(text, 'es')).toBe((atlasEs as Record<string, string>)[v.en])
      }
      Object.values(v).forEach(visit)
    }
    const before = JSON.stringify(raw)
    visit(raw)
    expect(n).toBeGreaterThan(40)
    expect(JSON.stringify(raw)).toBe(before)
    for (const s of template.sheets) expect((templateEs as Record<string, string>)[s.purpose_en], s.name).toBeTruthy()
  })
  it('preserves the section, query and anchor across all three languages', () => {
    for (const from of ['en', 'ru', 'es'] as const) for (const to of ['en', 'ru', 'es'] as const) {
      expect(switchLangPath(`/pgt-mt-atlas/${from}/science/embryo-concordance`, from, to, '?x=1', '#content'))
        .toBe(`/${to}/science/embryo-concordance/?x=1#content`)
    }
  })
  it('distinguishes non-detection, missing values and intervals with Spanish number formatting', () => {
    expect(fmt(12.5, 'es')).toBe('12,5')
    expect(pct(12.5, 'es')).toBe('12,5\u00a0%')
    expect(fmt(null, 'es')).toBe('—')
    const i18n = createInstance()
    i18n.init({ lng: 'es', resources: { es: { translation: es } }, initAsync: false })
    expect(obsValueText({ q: 'not_detected', value: 0, low: null, high: null, lod: 1.5 }, 'es', i18n.t))
      .toBe('0\u00a0% — variante no detectada (límite de detección 1,5\u00a0%)')
    expect(obsValueText({ q: 'interval', value: null, low: 5, high: 10, lod: null }, 'es', i18n.t))
      .toBe('solo se publicó un intervalo: 5–10\u00a0%')
    expect(es.common.delta).toBe('Δ (tejido − embrión), p. p.')
    expect(es.fig6.meaning).toContain('No es la probabilidad de embarazo')
  })
})
