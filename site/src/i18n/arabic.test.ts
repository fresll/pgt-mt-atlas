import { describe, expect, it, vi } from 'vitest'
import en from './en'
import ar from './ar'
import enChapters from '../content/fundamentals/en'
import arChapters from '../content/fundamentals/ar'
import raw from '../data/atlas.json'
import display from './display-ar.json'
import { arabicText } from './arabic-text'
import { citeIds, linkPaths } from '../content/fundamentals/markup'
import { fmt, plural } from '../lib/format'
function leaves(value: unknown, prefix = ''): Record<string, string> {
  if (typeof value === 'string') return { [prefix]: value }
  if (!value || typeof value !== 'object') return {}
  return Object.assign({}, ...Object.entries(value).map(([k, v]) => leaves(v, `${prefix}.${k}`)))
}
const slots = (s: string) => [...s.matchAll(/\{\{([^}]+)\}\}/g)].map(m => m[1]).sort()
const numbers = (s: string) => s.replace(/\[@[^\]]+\]/g, '').replace(/(\d),(\d{3})(?=\D|$)/g, '$1$2').match(/\d+(?:\.\d+)?/g)?.sort() ?? []
const codes = (s: string) => s.match(/m\.\d+(?:[ACGT>]+(?:\/[ACGT])?|del[ACGT]?)|MT-[A-Z0-9]+/g) ?? []
describe('Arabic private localization', () => {
  it('keeps all UI and chapter keys, citations, links, molecular codes and numerical values', () => {
    for (const [source, target] of [[en, ar], [enChapters, arChapters]]) {
      const a = leaves(source), b = leaves(target)
      expect(Object.keys(b)).toEqual(Object.keys(a))
      for (const [key, text] of Object.entries(b)) {
        expect(text.trim(), key).not.toBe('')
        expect(text, key).not.toMatch(/[А-Яа-яЁё\u3400-\u9fff\u202a-\u202e\u2066-\u2069]/)
        expect(slots(text), key).toEqual(slots(a[key]))
        expect(citeIds(text), key).toEqual(citeIds(a[key]))
        expect(linkPaths(text), key).toEqual(linkPaths(a[key]))
        expect(codes(text), key).toEqual(codes(a[key]))
        expect(numbers(text), key).toEqual(numbers(a[key]))
        if (/\.(slug|t|to)$/.test(key) || key.includes('.widgets.')) expect(text).toBe(a[key])
      }
    }
  })
  it('covers every bilingual scientific record through a display overlay without modifying data', () => {
    const before = JSON.stringify(raw)
    function visit(v: unknown) {
      if (!v || typeof v !== 'object') return
      const o = v as Record<string, unknown>
      if (typeof o.en === 'string' && typeof o.ru === 'string') {
        expect(Object.hasOwn(display, o.en), o.en).toBe(true)
        expect(arabicText(o.en), o.en).not.toMatch(/[А-Яа-яЁё\u3400-\u9fff]/)
      }
      Object.values(o).forEach(visit)
    }
    visit(raw)
    expect(JSON.stringify(raw)).toBe(before)
  })
  it('formats decimal data with ASCII digits and handles Arabic dual/few/singular counts', () => {
    expect(fmt(12.5, 'ar')).toBe('12.5')
    const forms: [string,string,string] = ['قيمة','قيم','قيم']
    expect(plural(2,'ar',forms)).toBe('قيمتان')
    expect(plural(7,'ar',forms)).toBe('قيم')
    expect(plural(18,'ar',forms)).toBe('قيمة')
  })
  it('requires both private review flags and never exposes Arabic from a public flag', async () => {
    for (const privateFlag of ['0','1']) for (const reviewFlag of ['0','1']) {
      vi.stubEnv('VITE_ATLAS_PRIVATE_PREVIEW',privateFlag)
      vi.stubEnv('VITE_ATLAS_ARABIC_REVIEW',reviewFlag)
      vi.stubEnv('VITE_ATLAS_ARABIC_PUBLIC','1')
      vi.resetModules()
      const { LANGS } = await import('./index')
      expect(LANGS.includes('ar')).toBe(privateFlag === '1' ? reviewFlag === '1' : true)
    }
    vi.unstubAllEnvs(); vi.resetModules()
  })
})
