import { readFileSync } from 'node:fs'
import { expect, test } from './fixtures'

const atlas = JSON.parse(readFileSync(new URL('../src/data/atlas.json', import.meta.url), 'utf8')) as {
  fig5: { id: string; q: string; emb_q: string; in_figure: boolean }[]
  stats: { fig5: { n_both_nd_pairs: number; n_both_nd_children: number } }
}

test('ND-to-ND pairs are counted but never plotted as exact delta zero', async ({ page }) => {
  const bothND = atlas.fig5.filter(p => p.in_figure && p.q === 'not_detected' && p.emb_q === 'not_detected')
  expect(bothND).toHaveLength(16)
  expect(atlas.stats.fig5.n_both_nd_children).toBe(12)
  await page.goto('ru/science/embryo-to-offspring/')
  const delta = page.locator('.chart-frame .js-plotly-plot').nth(1)
  await expect(delta).toBeVisible()
  const ids = await delta.evaluate(element => {
    const plot = element as unknown as { data: { customdata?: string[] }[] }
    return plot.data.flatMap(trace => trace.customdata ?? [])
  })
  expect(ids).toHaveLength(14)
  expect(ids.some(id => bothND.some(p => p.id === id))).toBe(false)
  await expect(page.locator('article')).toContainText('У 12 плодов и детей оба результата «не выявлено» (16 сопоставлений)')
  await page.locator('.table-details summary').click()
  const row = page.locator('table.data tbody tr', { hasText: 'C15' })
  await expect(row).toContainText('н/в → н/в')
  await expect(row).toContainText('Table 1')
})
