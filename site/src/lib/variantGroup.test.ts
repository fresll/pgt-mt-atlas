import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { atlas } from '../data/atlas'
import ruFund from '../content/fundamentals/ru'
import enFund from '../content/fundamentals/en'

// A1: m.3250T>C в наборе — вариант неопределённого значения (VUS), поэтому группа из семи вариантов
// распределения гетероплазмии не называется «патогенной». Индивидуальные классификации сохраняются.
const SRC = join(__dirname, '..')
const sources = (dir: string): string[] =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n)
    if (statSync(p).isDirectory()) return sources(p)
    return /\.(ts|tsx)$/.test(n) && !/\.test\.ts$/.test(n) ? [p] : []
  })

describe('neutral name of the seven-variant group (A1)', () => {
  it('no interface text calls all seven variants pathogenic', () => {
    for (const file of sources(SRC)) {
      const text = readFileSync(file, 'utf8')
      expect(text, file).not.toMatch(/(сем[иь]|7)\s+патогенн/i)
      expect(text, file).not.toMatch(/(seven|7)\s+pathogenic/i)
    }
  })

  it('uses the approved neutral wording in RU and EN', () => {
    const link = (c: typeof ruFund) => c.chapters.flatMap((ch) => ch.data).find((l) => l.to === 'science/heteroplasmy-landscape/')
    expect(link(ruFund)?.text).toBe('Опубликованные значения гетероплазмии в эмбрионах для семи исследуемых вариантов мтДНК: распределение значений в реальных циклах.')
    expect(link(enFund)?.text).toContain('seven mtDNA variants included in the dataset')
  })

  it('keeps m.3250T>C in the dataset with its individual VUS classification', () => {
    const vus = atlas.fig3.filter((m) => m.variant === 'm.3250T>C')
    expect(vus).toHaveLength(8)
    expect(new Set(atlas.fig3.map((m) => m.variant)).size).toBe(7)
    const csv = readFileSync(join(SRC, '..', 'public', 'data', 'csv', 'variant.csv'), 'utf8')
    expect(csv).toMatch(/^m\.3250T>C,uncertain_significance$/m)
    expect(csv).toMatch(/^m\.3243A>G,pathogenic$/m)
    expect(atlas.labels.variant_class.uncertain_significance.ru).toBe('Вариант неопределённого значения')
  })
})
