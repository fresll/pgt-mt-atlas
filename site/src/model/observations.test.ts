import { describe, expect, it } from 'vitest'
import { atlas, obsByVariant } from '../data/atlas'
import { summarizeInput } from './observations'

describe('scenario input composition', () => {
  it('preserves every legacy numerator and denominator without changing observations', () => {
    const before = JSON.stringify(atlas.landscape)
    for (const [v, obs] of obsByVariant()) {
      for (const cut of [18, 30]) {
        const got = summarizeInput(obs, cut)
        expect({ k: got.k, n: got.n }).toEqual(atlas.stats.fig3.by_variant[v][cut === 18 ? 'le18' : 'le30'])
      }
    }
    expect(JSON.stringify(atlas.landscape)).toBe(before)
  })

  it('distinguishes strict <30 from inclusive <=30 for an exact boundary value', () => {
    const obs = obsByVariant().get('m.3243A>G')!
    expect(summarizeInput(obs, 30).k).toBe(52)
    expect(summarizeInput(obs, 30, 'strict').k).toBe(51)
  })

  it('reports missing stages/LOD and crossing intervals without inventing classifications', () => {
    expect(summarizeInput(atlas.landscape, 18)).toMatchObject({ n: 187, sources: 12, blastocysts: 64, unspecifiedStage: 71, ndWithoutLod: 53 })
    expect(summarizeInput(obsByVariant().get('m.10197G>A')!, 30)).toMatchObject({ k: 5, n: 9, crossingIntervals: 1 })
    expect(summarizeInput([], 18)).toMatchObject({ k: 0, n: 0, fraction: null, wilson: null })
    expect(() => summarizeInput([], NaN)).toThrow(RangeError)
  })
})
