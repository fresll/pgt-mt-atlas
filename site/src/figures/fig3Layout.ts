// Раскладка рисунка 3: блоки (варианты) → столбцы (источники) → точки.
// Порядок блоков и источников — из etl/atlas_etl/curation/rules.yaml (как в Рисунок_3.py::BLOCKS).
import type { EmbryoObservation } from '../data/atlas'

export interface Column { x: number; variant: string; pub: string; obs: EmbryoObservation[] }
export interface Block { variant: string; x0: number; x1: number; columns: Column[] }
export interface PlacedPoint { x: number; y: number; ids: string[]; count: number; derived: boolean; obs: EmbryoObservation }

export function layoutBlocks(blocks: { variant: string; sources: string[] }[], obs: EmbryoObservation[]): { blocks: Block[]; xmax: number } {
  let x = 0
  const out: Block[] = []
  for (const b of blocks) {
    const width = Math.max(2, b.sources.length)
    const cols = b.sources.map((pub, k) => ({
      x: b.sources.length === 1 ? x + width / 2 : x + 0.5 + k,
      variant: b.variant,
      pub,
      obs: obs.filter((o) => o.variant === b.variant && o.pub === pub),
    }))
    out.push({ variant: b.variant, x0: x, x1: x + width, columns: cols })
    x += width
  }
  return { blocks: out, xmax: x }
}

export const isDerived = (o: EmbryoObservation) => o.derivation !== 'as_reported_in_dataset'

/**
 * Детерминированное разнесение точек внутри столбца: точки с близкими значениями сдвигаются по горизонтали
 * (0, +d, −d, +2d, …). При aggregate ≥ minAgg одинаковых значений сливаются в одну точку «×n».
 */
export function placeColumn(col: Column, opts: { aggregate: boolean; minAgg?: number; dx?: number; dyMin?: number; maxOffset?: number }): PlacedPoint[] {
  const { aggregate, minAgg = 6, dx = 0.1, dyMin = 1.7, maxOffset = 0.42 } = opts
  const exact = col.obs.filter((o) => o.q !== 'interval' && o.value !== null)
  const counts = new Map<number, EmbryoObservation[]>()
  for (const o of exact) {
    const v = o.value as number
    if (!counts.has(v)) counts.set(v, [])
    counts.get(v)!.push(o)
  }
  const items: { y: number; group: EmbryoObservation[] }[] = []
  for (const [v, group] of counts) {
    if (aggregate && group.length >= minAgg) items.push({ y: v, group })
    else for (const o of group) items.push({ y: v, group: [o] })
  }
  items.sort((a, b) => a.y - b.y || a.group[0].id.localeCompare(b.group[0].id))
  const placed: PlacedPoint[] = []
  const offsets = [0]
  for (let j = 1; j * dx <= maxOffset + 1e-9; j++) offsets.push(j * dx, -j * dx)
  for (const it of items) {
    let chosen = offsets[offsets.length - 1]
    for (const off of offsets) {
      const clash = placed.some((p) => Math.abs(p.x - (col.x + off)) < dx * 0.95 && Math.abs(p.y - it.y) < dyMin)
      if (!clash) {
        chosen = off
        break
      }
    }
    placed.push({
      x: col.x + chosen,
      y: it.y,
      ids: it.group.map((o) => o.id),
      count: it.group.length,
      derived: it.group.every(isDerived),
      obs: it.group[0],
    })
  }
  return placed
}
