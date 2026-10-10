import { describe, expect, it } from 'vitest'
import en from './en'
import ru from './ru'
import { blockStrings, chapterStrings, citeIds, linkPaths } from './markup'
import { REFS, refById } from './references'
import enDict from '../../i18n/en'
import ruDict from '../../i18n/ru'

const ROUTES = new Set([
  'science/', 'science/data/', 'science/heteroplasmy-landscape/', 'science/embryo-concordance/', 'science/embryo-to-offspring/',
  'science/pgt-mt-pgt-a-model/', 'science/cases/', 'science/sources/', 'science/methods/', 'patients/', 'contribute/', 'about/',
  'fundamentals/', 'fundamentals/references/', ...ru.chapters.map((c) => `fundamentals/${c.slug}/`),
])
const words = (s: string) => s.replace(/\[@[^\]]+\]/g, '').replace(/\[\[([^|\]]+)\|[^\]]+\]\]/g, '$1').split(/\s+/).filter((w) => /[\p{L}\d]/u.test(w)).length
const flat = (v: unknown): string[] => (typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(flat) : v && typeof v === 'object' ? Object.values(v).flatMap(flat) : [])

describe('Fundamentals content', () => {
  it('has six chapters with the same permanent slugs in both languages', () => {
    expect(ru.chapters).toHaveLength(6)
    expect(en.chapters.map((c) => c.slug)).toEqual(ru.chapters.map((c) => c.slug))
    for (const c of ru.chapters) expect(c.slug).toMatch(/^[a-z0-9-]+$/)
  })

  it('EN mirrors the RU block structure, citations and links', () => {
    ru.chapters.forEach((r, i) => {
      const e = en.chapters[i]
      expect(e.widgets).toEqual(r.widgets)
      expect(e.data.map((d) => d.to)).toEqual(r.data.map((d) => d.to))
      for (const level of ['essentials', 'advanced'] as const) {
        expect(e[level].map((b) => b.t), `${r.slug}/${level}`).toEqual(r[level].map((b) => b.t))
        r[level].forEach((b, k) => {
          const eb = e[level][k]
          expect(blockStrings(eb).length, `${r.slug}/${level}/${k}`).toBe(blockStrings(b).length)
          expect(blockStrings(eb).flatMap(citeIds), `${r.slug}/${level}/${k}`).toEqual(blockStrings(b).flatMap(citeIds))
          expect(blockStrings(eb).flatMap(linkPaths)).toEqual(blockStrings(b).flatMap(linkPaths))
        })
      }
    })
  })

  it('every citation resolves to a bibliography entry with a DOI', () => {
    const cited = new Set<string>()
    for (const c of [...ru.chapters, ...en.chapters]) for (const id of chapterStrings(c).flatMap(citeIds)) cited.add(id)
    for (const dict of [ruDict, enDict]) for (const id of flat(dict.fundamentals).flatMap(citeIds)) cited.add(id)
    for (const id of cited) {
      expect(refById[id], id).toBeDefined()
      expect(refById[id].doi).toMatch(/^10\.\d{4,}\//)
    }
    // каждая запись библиографии цитируется хотя бы в одной главе
    for (const r of REFS) expect(cited.has(r.id), r.id).toBe(true)
    expect(new Set(REFS.map((r) => r.id)).size).toBe(REFS.length)
  })

  it('internal links point to existing pages', () => {
    for (const c of [...ru.chapters, ...en.chapters]) {
      for (const p of [...chapterStrings(c).flatMap(linkPaths), ...c.data.map((d) => d.to)]) expect(ROUTES.has(p), p).toBe(true)
    }
  })

  it('each chapter is a full text, not a stub (≥600 words per language)', () => {
    for (const set of [ru, en]) for (const c of set.chapters) expect(words(chapterStrings(c).join(' ')), c.slug).toBeGreaterThanOrEqual(600)
  })

  it('both reading levels are present and Essentials is not empty', () => {
    for (const c of [...ru.chapters, ...en.chapters]) {
      expect(c.essentials.length).toBeGreaterThanOrEqual(3)
      expect(c.advanced.length).toBeGreaterThan(3)
    }
  })

  it('texts stay independent of any single publication and of figure numbering', () => {
    const all = [...ru.chapters, ...en.chapters].flatMap(chapterStrings).join('\n') + flat(ruDict.fundamentals).join('\n') + flat(enDict.fundamentals).join('\n')
    expect(all).not.toMatch(/Acta Naturae|Тофило|Figure [0-9]|Fig\. [0-9]|Рис(унок|\.) [0-9]/)
  })
})
