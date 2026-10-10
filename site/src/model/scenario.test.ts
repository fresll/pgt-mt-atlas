import { describe, expect, it } from 'vitest'
import { atlas, fractionAtOrBelow, obsByVariant } from '../data/atlas'
import { curve, pAtLeastOne, pBoth } from './scenario'

describe('scenario model (Figure 6)', () => {
  it('reproduces the manuscript example: m.3243A>G, age 35 → ≈24 / 55 / 80 % for N = 1 / 3 / 6', () => {
    const { k, n } = fractionAtOrBelow(obsByVariant().get('m.3243A>G')!, 18)
    expect([k, n]).toEqual([41, 87])
    const got = [1, 3, 6].map((N) => Math.round(pAtLeastOne(k / n, 0.5, N) * 100))
    expect(got).toEqual([24, 55, 80])
  })

  it('uses observed fractions that match the ETL statistics', () => {
    for (const [v, obs] of obsByVariant()) {
      expect(fractionAtOrBelow(obs, 18)).toEqual(atlas.stats.fig3.by_variant[v].le18)
      expect(fractionAtOrBelow(obs, 30)).toEqual(atlas.stats.fig3.by_variant[v].le30)
    }
  })

  it('handles edges and rejects invalid input', () => {
    expect(pAtLeastOne(1, 1, 1)).toBe(1)
    expect(pAtLeastOne(0, 0.7, 8)).toBe(0)
    expect(pBoth(0.5, 0.5)).toBe(0.25)
    expect(curve(0.5, 0.5, 8)).toHaveLength(8)
    expect(() => pBoth(1.2, 0.5)).toThrow()
    expect(() => pAtLeastOne(0.5, 0.5, 1.5)).toThrow()
  })

  it('counts intervals by their upper bound (no midpoint imputation)', () => {
    const m10197 = obsByVariant().get('m.10197G>A')!
    expect(fractionAtOrBelow(m10197, 30)).toEqual({ k: 5, n: 9 })
    expect(fractionAtOrBelow(m10197, 50)).toEqual({ k: 6, n: 9 }) // 26–45 % ≤ 50, 84–88 % нет
  })
})
