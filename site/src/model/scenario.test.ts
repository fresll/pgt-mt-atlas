import { describe, expect, it } from 'vitest'
import { atlas, fractionAtOrBelow, obsByVariant } from '../data/atlas'
import { betaBinomialAtLeastOne, curve, independentAtLeastOne, jointBounds, pAtLeastOne, pBoth, scenarioProbability, wilson95 } from './scenario'

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

  it('reproduces independently verified beta-binomial sensitivity at the same mean', () => {
    const mu = 41 / 87 * 0.5
    // Independently reproduced Python results.csv from the mathematical review.
    const expected = [0.8005590399313863, 0.7564316734541708, 0.715787131483766, 0.642662393081316, 0.5189203542242852]
    ;[0, 0.05, 0.1, 0.2, 0.4].forEach((rho, i) => {
      expect(betaBinomialAtLeastOne(mu, rho, 6)).toBeCloseTo(expected[i], 8)
    })
    expect(scenarioProbability(41 / 87, 0.5, 6, 0)).toBe(pAtLeastOne(41 / 87, 0.5, 6))
  })

  it('has the correct limits, retains tiny probabilities and validates every parameter', () => {
    expect(independentAtLeastOne(1e-20, 8)).toBeCloseTo(8e-20, 33)
    expect(betaBinomialAtLeastOne(0.2, 1e-320, 6)).toBeCloseTo(independentAtLeastOne(0.2, 6), 14)
    for (const mu of [0, 0.2, 1]) {
      for (const rho of [0, 0.1, 1]) {
        expect(betaBinomialAtLeastOne(mu, rho, 0)).toBe(0)
        expect(betaBinomialAtLeastOne(mu, rho, 1)).toBeCloseTo(mu, 14)
      }
      expect(betaBinomialAtLeastOne(mu, 1, 8)).toBe(mu)
    }
    for (const bad of [-1, 1.1, NaN, Infinity]) {
      expect(() => betaBinomialAtLeastOne(bad, 0.1, 6)).toThrow(RangeError)
      expect(() => betaBinomialAtLeastOne(0.2, bad, 6)).toThrow(RangeError)
    }
    for (const bad of [-1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
      expect(() => betaBinomialAtLeastOne(0.2, 0.1, bad)).toThrow(RangeError)
      expect(() => curve(0.2, 0.5, bad)).toThrow(RangeError)
    }
    expect(curve(0.2, 0.5, 0)).toEqual([])
  })

  it('increases with embryo count and decreases with shared-Q dependence', () => {
    for (const mu of [0.001, 0.2, 0.5, 0.99]) {
      for (const rho of [0, 0.05, 0.2, 0.4, 1]) {
        const values = [0, 1, 3, 6, 50].map((n) => betaBinomialAtLeastOne(mu, rho, n))
        for (let i = 1; i < values.length; i++) expect(values[i]).toBeGreaterThanOrEqual(values[i - 1])
      }
      const values = [0, 0.05, 0.2, 0.4, 1].map((rho) => betaBinomialAtLeastOne(mu, rho, 6))
      for (let i = 1; i < values.length; i++) expect(values[i]).toBeLessThanOrEqual(values[i - 1])
    }
  })

  it('separates Frechet bounds from conditional iid Wilson uncertainty', () => {
    expect(jointBounds(41 / 87, 0.5)).toEqual({ low: 0, high: 41 / 87 })
    expect(jointBounds(0.9, 0.7)).toEqual({ low: 0.6000000000000001, high: 0.7 })
    const w = wilson95(41, 87)!
    expect(w.low).toBeCloseTo(0.369823, 6)
    expect(w.high).toBeCloseTo(0.575136, 6)
    expect(wilson95(8, 8)!.low).toBeCloseTo(0.675592, 6)
    expect(wilson95(8, 8)!.high).toBe(1)
    expect(wilson95(0, 0)).toBeNull()
    expect(() => wilson95(2, 1)).toThrow(RangeError)
  })
})
