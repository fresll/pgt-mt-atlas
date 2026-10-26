import { writeFileSync } from 'node:fs'
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

test('all 22 Chinese pages and every data detail: language and disclosure audit', async ({ page }, info) => {
  test.setTimeout(240_000)
  const audit: unknown[] = []
  let selections = 0
  const errors: string[] = []
  page.on('pageerror', e => errors.push(e.message))
  for (const path of paths) {
    await page.goto(`zh-Hans/${path}`)
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hans')
    await page.evaluate(() => document.querySelectorAll('details').forEach(el => { el.open = true }))
    const texts = await page.locator('main').innerText()
    const attr = await page.locator('main').evaluate(node => [...node.querySelectorAll('[title],[aria-label],[alt],[placeholder]')].map(el => ['title','aria-label','alt','placeholder'].map(a => el.getAttribute(a)).filter(Boolean).join(' ')))
    expect(attr.join(' '), `${path}: accessible labels`).not.toMatch(/[А-Яа-яЁё]|\b(?:biopsy|blood|cells|threshold|Click|Show|Zoom|Reset|months|weeks)\b/u)
    const foreign = await foreignInterfaceText(page.locator('main'))
    const cyrillic = texts.split('\n').filter(t=>/[А-Яа-яЁё]/.test(t))
    const rows = page.locator('table.data tbody tr[tabindex="0"]')
    const details: unknown[] = []
    for (let i = 0; i < await rows.count(); i++) {
      await rows.nth(i).dispatchEvent('click')
      const detail = await page.locator('.detail').innerText()
      details.push({ row:i, foreign: await foreignInterfaceText(page.locator('.detail')), cyrillic: detail.split('\n').filter(t=>/[А-Яа-яЁё]/.test(t)) })
      selections++
    }
    const latinNodes = await page.locator('main').evaluate(node => {
      const results: string[] = []
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT)
      while(walker.nextNode()) {
        const el = walker.currentNode.parentElement
        if(!el || el.closest('script,style,noscript,.fd-refs,.pub-list,.fd-cite,.language-switch,.sk-c-sheet')) continue
        const t = walker.currentNode.textContent?.trim() ?? ''
        if(/[A-Za-z]{2,}/.test(t)) results.push(t)
      }
      return [...new Set(results)]
    })
    let advanced: string[] = []
    if(path.startsWith('fundamentals/') && await page.getByRole('button', {name:'进阶',exact:true}).count()) {
      await page.getByRole('button', {name:'进阶',exact:true}).click()
      advanced = (await page.locator('main').innerText()).split('\n').filter(t=>/[A-Za-z]{2,}/.test(t))
      expect(await page.locator('main').innerText()).not.toMatch(/[А-Яа-яЁё]/)
    }
    audit.push({ path, foreign, cyrillic, attr, details, latinNodes, advanced })
    writeFileSync(info.outputPath((path.replaceAll('/','_') || 'home')+'.txt'),texts)
  }
  writeFileSync(info.outputPath('page-audit.json'), JSON.stringify({ audit, selections, errors },null,2))
  expect(errors).toEqual([])
  expect(selections).toBe(446)
  const bad = (audit as any[]).flatMap(a=>[...a.foreign,...a.cyrillic,...a.details.flatMap((d:any)=>[...d.foreign,...d.cyrillic])])
  expect(bad).toEqual([])
})
