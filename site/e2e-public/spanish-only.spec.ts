import { readFileSync } from 'node:fs'
import { expect, test } from '../e2e/fixtures'
import type { Locator } from '@playwright/test'

async function foreignInterfaceText(root: Locator) {
  return root.evaluate(node => {
    const found: string[] = []
    const foreign = /(?<![\p{L}\p{N}_])(?:polymorphism|biopsy|blastocyst|cleavage|remaining|blood|tissues|months|weeks|birth|euploid|aneuploid|mosaic|preprint|Zoom|Reset axes|Click to enter|Download plot|Share chart)(?![\p{L}\p{N}_])/u
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT)
    while (walker.nextNode()) {
      const n = walker.currentNode
      const parent = n.parentElement
      // Original bibliographic titles, proper names and worksheet identifiers
      // are evidence, not interface translations. Inspect surrounding UI.
      if (!parent || parent.closest('[lang="en"], .fd-ref-authors, .language-switch, .sk-c-sheet, script, style, noscript')) continue
      if (parent.closest('.sources-table td:first-child details p.small:first-of-type')) continue
      const text = (n.textContent ?? '').replace(/references\/[^)]+\.(?:pdf|xlsx|docx)/g, '')
      if (foreign.test(text)) found.push(text.trim())
    }
    return found
  })
}

const paths = ['', 'patients/', 'about/', 'ilya-mazunin/', 'contribute/', 'science/', 'science/data/',
  'science/heteroplasmy-landscape/', 'science/embryo-concordance/', 'science/embryo-to-offspring/',
  'science/pgt-mt-pgt-a-model/', 'science/cases/', 'science/sources/', 'science/methods/', 'fundamentals/',
  'fundamentals/mtdna-and-maternal-inheritance/', 'fundamentals/heteroplasmy-and-threshold-effects/',
  'fundamentals/mitochondrial-genetic-bottleneck/', 'fundamentals/embryo-development-and-biopsy/',
  'fundamentals/how-pgt-mt-works/', 'fundamentals/interpretation-and-limitations/', 'fundamentals/references/']

test('all Spanish pages, expanded tables, 446 details and chart text contain no Cyrillic', async ({ page }) => {
  test.setTimeout(180_000)
  let selections = 0
  const foreign: string[] = []
  for (const path of paths) {
    await page.goto(`es/${path}`)
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
    await page.evaluate(() => document.querySelectorAll('details').forEach(el => { el.open = true }))
    await expect(page.locator('body'), path).not.toContainText(/[А-Яа-яЁё]/)
    foreign.push(...(await foreignInterfaceText(page.locator('body'))).map(text => `${path}: ${text}`))
    await expect(page.locator('head title')).toHaveCount(1)
    expect(await page.title()).not.toMatch(/[А-Яа-яЁё]/)
    const rows = page.locator('table.data tbody tr[tabindex="0"]')
    for (let i = 0; i < await rows.count(); i++) {
      await rows.nth(i).dispatchEvent('click')
      await expect(page.locator('.detail'), `${path}, row ${i + 1}`).not.toContainText(/[А-Яа-яЁё]/)
      foreign.push(...(await foreignInterfaceText(page.locator('.detail'))).map(text => `${path}, row ${i + 1}: ${text}`))
      selections++
    }
    const untranslated = await page.evaluate(() => {
      const re = /[А-Яа-яЁё]/
      const found: string[] = []
      for (const el of document.querySelectorAll('[alt],[title],[aria-label],[aria-description],[placeholder]')) {
        if (el.closest('.language-switch')) continue
        for (const name of ['alt', 'title', 'aria-label', 'aria-description', 'placeholder']) {
          const text = el.getAttribute(name)
          if (text && re.test(text)) found.push(`${name}: ${text}`)
        }
      }
      const inspect = (value: unknown, depth = 0) => {
        if (depth > 18 || value == null) return
        if (typeof value === 'string') { if (re.test(value)) found.push(value); return }
        if (Array.isArray(value)) value.forEach(v => inspect(v, depth + 1))
        else if (typeof value === 'object') for (const [key, v] of Object.entries(value)) if (!key.startsWith('_')) inspect(v, depth + 1)
      }
      for (const element of document.querySelectorAll('.js-plotly-plot')) {
        const plot = element as HTMLElement & { data?: unknown; layout?: unknown }
        inspect(plot.data); inspect(plot.layout)
      }
      return found
    })
    expect(untranslated, path).toEqual([])
    await expect(page.locator('header .language-switch a[lang=ru]')).toHaveAttribute('title', 'Idioma: Русский')
  }
  expect(selections).toBe(446)
  expect(foreign).toEqual([])
})

