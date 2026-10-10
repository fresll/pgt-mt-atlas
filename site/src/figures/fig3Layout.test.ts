import { describe, expect, it } from 'vitest'
import { atlas } from '../data/atlas'
import { layoutBlocks, placeColumn } from './fig3Layout'

describe('Figure 3 layout', () => {
  const { blocks, xmax } = layoutBlocks(atlas.fig3_blocks, atlas.fig3)
  it('covers all 187 observations exactly once', () => {
    const ids = blocks.flatMap((b) => b.columns.flatMap((c) => c.obs.map((o) => o.id)))
    expect(ids).toHaveLength(187)
    expect(new Set(ids).size).toBe(187)
    expect(xmax).toBe(5 + 2 + 4 + 2 + 2 + 2 + 2)
  })
  it('aggregates ≥6 identical values only when asked, and never loses points', () => {
    for (const b of blocks)
      for (const c of b.columns) {
        const n = c.obs.filter((o) => o.q !== 'interval').length
        const agg = placeColumn(c, { aggregate: true })
        const flat = placeColumn(c, { aggregate: false })
        expect(agg.reduce((s, p) => s + p.count, 0)).toBe(n)
        expect(flat).toHaveLength(n)
      }
  })
  it('places Spath m.8993T>G zeros as one ×n point', () => {
    const col = blocks.find((b) => b.variant === 'm.8993T>G')!.columns.find((c) => c.pub === 'spath2021')!
    const zero = placeColumn(col, { aggregate: true }).find((p) => p.y === 0)!
    expect(zero.count).toBe(19)
  })
})
