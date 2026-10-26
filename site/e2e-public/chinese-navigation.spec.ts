import { test, expect } from '../e2e/fixtures'
import { readdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
const root = resolve('dist/zh-Hans')
const pages = readdirSync(root, { recursive: true }).filter(p => p.endsWith('index.html')).map(p => 'zh-Hans/' + p.replace(/index\.html$/, ''))

test('Chinese full-page navigation, mobile menu and local links', async ({ page, request }, info) => {
  test.setTimeout(180_000)
  const links = new Map<string, string[]>()
  const errors: string[] = []
  const failed: string[] = []
  const corpus: unknown[] = []
  page.on('pageerror', e => errors.push(e.message))
  page.on('response', r => { if(r.status() >= 400 && r.url().startsWith('http://localhost')) failed.push(`${r.status()} ${r.url()}`) })
  for (const path of pages) {
    const response = await page.goto(path)
    expect(response?.status(), path).toBe(200)
    await expect(page.locator('main h1')).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('lang','zh-Hans')
    await page.evaluate(() => document.querySelectorAll('details').forEach(d => { d.open = true }))
    const body = await page.locator('body').innerText()
    expect.soft(body, path).not.toMatch(/[А-Яа-яЁё]|Research Data Submission|Maternal Pathogenic Variant|\bAtlas\b|\bFig\.|Русский|Español|English/u)
    const attrs = await page.locator('[aria-label],[title],[placeholder],[alt]').evaluateAll(nodes => nodes.flatMap(n => ['aria-label','title','placeholder','alt'].map(a=>n.getAttribute(a)).filter(Boolean)))
    expect.soft(attrs.join('\n'),path).not.toMatch(/[А-Яа-яЁё]|Русский|Español|English/u)
    for(const item of await page.locator('a[href]').evaluateAll(nodes=>nodes.map(n=>({href:(n as HTMLAnchorElement).href, language:!!n.closest('.language-switch')})))) {
      const u = new URL(item.href)
      if(u.origin !== new URL(page.url()).origin || item.language) continue
      if(/^\/pgt-mt-atlas\/(ru|en|es)\//.test(u.pathname)) throw new Error(`Chinese navigation leaves language: ${path} -> ${u.pathname}`)
      const key=u.origin+u.pathname
      links.set(key,[...(links.get(key)??[]),u.hash])
    }
    corpus.push({path, body, attrs})
    await page.setViewportSize({width:390,height:844})
    await expect(page.getByRole('button', {name:'菜单',exact:true})).toBeVisible()
    await page.locator('.menu-toggle').click()
    await expect(page.locator('#primary-nav')).toBeVisible()
    await page.locator('.menu-toggle').click()
    await page.setViewportSize({width:1280,height:900})
  }
  const checks: unknown[]=[]
  for(const [url, hashes] of links) {
    const r=await request.get(url)
    expect(r.status(),url).toBe(200)
    const body=await r.text()
    for(const hash of new Set(hashes.filter(Boolean))) {
      const id=decodeURIComponent(hash.slice(1))
      expect(body.includes(`id="${id}"`),`${url}${hash}`).toBe(true)
    }
    checks.push({path:new URL(url).pathname,status:r.status(),anchors:[...new Set(hashes)]})
  }
  writeFileSync(info.outputPath('navigation.json'),JSON.stringify({pages:pages.length,checks,errors,failed},null,2))
  writeFileSync(info.outputPath('full-page-text.json'),JSON.stringify(corpus,null,2))
  expect(errors).toEqual([])
  expect(failed).toEqual([])
})
