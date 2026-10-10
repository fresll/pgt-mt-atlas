import { describe, expect, it } from 'vitest'
import { simulateOocytes, stackDots, summarize, theoreticalSd } from './bottleneck'

describe('bottleneck model (binomial sampling of N segregating units)', () => {
  it('is deterministic for a given seed', () => {
    expect(simulateOocytes(0.3, 20, 50, 7)).toEqual(simulateOocytes(0.3, 20, 50, 7))
    expect(simulateOocytes(0.3, 20, 50, 7)).not.toEqual(simulateOocytes(0.3, 20, 50, 8))
  })

  it('homoplasmic pools stay homoplasmic', () => {
    expect(new Set(simulateOocytes(0, 10, 30, 1))).toEqual(new Set([0]))
    expect(new Set(simulateOocytes(1, 10, 30, 1))).toEqual(new Set([1]))
  })

  it('values are multiples of 1/N within [0, 1]', () => {
    for (const v of simulateOocytes(0.4, 8, 200, 3)) {
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThanOrEqual(1)
      expect(Math.abs(v * 8 - Math.round(v * 8))).toBeLessThan(1e-9)
    }
  })

  it('mean ≈ h0 and SD ≈ sqrt(h0(1−h0)/N) over many draws', () => {
    const v = simulateOocytes(0.3, 25, 20000, 11)
    const mean = v.reduce((a, b) => a + b, 0) / v.length
    const sd = Math.sqrt(v.reduce((a, b) => a + (b - mean) ** 2, 0) / (v.length - 1))
    expect(mean).toBeCloseTo(0.3, 2)
    expect(sd).toBeCloseTo(theoreticalSd(0.3, 25), 2)
  })

  it('a smaller effective pool gives a wider spread', () => {
    const spread = (N: number) => {
      const s = summarize(simulateOocytes(0.3, N, 2000, 5))
      return s.q3 - s.q1
    }
    expect(spread(10)).toBeGreaterThan(spread(200))
  })

  it('rejects invalid parameters', () => {
    expect(() => simulateOocytes(1.2, 10, 5, 1)).toThrow()
    expect(() => simulateOocytes(0.5, 0, 5, 1)).toThrow()
  })

  it('stacks dots into bins without overlap', () => {
    const d = stackDots([0, 0.01, 0.024, 0.5, 1], 0.025)
    expect(d[0]).toEqual([0.0125, 0])
    expect(d[1]).toEqual([0.0125, 1])
    expect(d[2]).toEqual([0.0125, 2])
    expect(d[4][0]).toBeCloseTo(0.9875)
  })
})
