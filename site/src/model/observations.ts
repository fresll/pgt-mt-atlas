import type { EmbryoObservation } from '../data/atlas'
import { wilson95 } from './scenario'

export type Boundary = 'inclusive' | 'strict'

/** Descriptive input statistics. Does not modify or reclassify the Atlas dataset. */
export function summarizeInput(obs: EmbryoObservation[], threshold: number, boundary: Boundary = 'inclusive') {
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 100) throw new RangeError('Threshold must be within [0, 100]')
  if (boundary !== 'inclusive' && boundary !== 'strict') throw new RangeError('Invalid boundary rule')
  const passes = (value: number) => boundary === 'inclusive' ? value <= threshold : value < threshold
  const k = obs.filter((o) => {
    const value = o.q === 'interval' ? o.high : o.value
    return value !== null && passes(value)
  }).length
  const crossingIntervals = obs.filter((o) => o.q === 'interval' && o.low !== null && o.high !== null && passes(o.low) && !passes(o.high)).length
  return {
    k,
    n: obs.length,
    fraction: obs.length ? k / obs.length : null,
    wilson: wilson95(k, obs.length),
    sources: new Set(obs.map((o) => o.pub)).size,
    blastocysts: obs.filter((o) => o.stage === 'blastocyst').length,
    unspecifiedStage: obs.filter((o) => o.stage === 'unspecified').length,
    ndWithoutLod: obs.filter((o) => o.q === 'not_detected' && o.lod === null).length,
    crossingIntervals,
  }
}
