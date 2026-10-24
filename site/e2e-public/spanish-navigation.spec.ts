import { expect, test } from '../e2e/fixtures'

const paths = ['', 'patients/', 'about/', 'ilya-mazunin/', 'contribute/', 'science/', 'science/data/',
  'science/heteroplasmy-landscape/', 'science/embryo-concordance/', 'science/embryo-to-offspring/',
  'science/pgt-mt-pgt-a-model/', 'science/cases/', 'science/sources/', 'science/methods/', 'fundamentals/',
  'fundamentals/mtdna-and-maternal-inheritance/', 'fundamentals/heteroplasmy-and-threshold-effects/',
  'fundamentals/mitochondrial-genetic-bottleneck/', 'fundamentals/embryo-development-and-biopsy/',
  'fundamentals/how-pgt-mt-works/', 'fundamentals/interpretation-and-limitations/', 'fundamentals/references/']

test('every Spanish internal link and anchor resolves; real page transitions and history work', async ({ page, request }, info) => {
  test.setTimeout(240_000)
  const root = 'http://localhost:4174/pgt-mt-atlas/'
  const cached = new Map<string, string>()
  const edges: { from: string; to: string; label: string }[] = []
  const failures: string[] = []
  for (const path of paths) {
    const url = `${root}es/${path}`
    await page.goto(url)
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
    await page.evaluate(() => document.querySelectorAll('details').forEach(d => { d.open = true }))
    const links = await page.locator('a[href]').evaluateAll(ns => ns.map(n => ({ href: (n as HTMLAnchorElement).href, label: n.textContent?.trim() ?? '' })))
    for (const { href, label } of links) {
      const target = new URL(href)
      if (target.origin !== new URL(root).origin || !/^https?:$/.test(target.protocol)) continue
      edges.push({ from: url, to: href, label })
      const key = target.origin + target.pathname + target.search
      let body = cached.get(key)
      if (body === undefined) {
        const response = await request.get(key)
        if (!response.ok()) failures.push(`${url} → ${href}: HTTP ${response.status()}`)
        body = await response.text()
        cached.set(key, body)
        if (['en', 'ru', 'es'].some(lang => target.pathname.startsWith(`${new URL(root).pathname}${lang}/`))) {
          if (!body.includes('rel="canonical"') || body.includes('<title>Página no encontrada')) failures.push(`${url} → ${href}: missing page`)
        }
      }
      if (target.hash) {
        const id = decodeURIComponent(target.hash.slice(1))
        const ids = [...body.matchAll(/\bid="([^"]+)"/g)].map(m => m[1])
        if (!ids.includes(id)) failures.push(`${url} → ${href}: missing anchor ${id}`)
      }
    }
    // Exercise React Router and browser history from every source page as well.
    const next = page.locator('article a[href*="/es/"]').filter({ visible: true }).first()
    const candidate = await next.count() ? next : page.locator('nav.primary a[href*="/es/"]').filter({ visible: true }).first()
    const destination = await candidate.getAttribute('href')
    await candidate.click()
    await expect(page).toHaveURL(new URL(destination!, url).href)
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
    await expect(page.locator('h1').first()).toBeVisible()
    await page.goBack()
    await expect(page).toHaveURL(url)
    await page.goForward()
    await expect(page).toHaveURL(new URL(destination!, url).href)
  }
  await info.attach('spanish-navigation.json', { body: JSON.stringify({ pages: paths.length, edges: edges.length, uniqueTargets: cached.size, failures, links: edges }, null, 2), contentType: 'application/json' })
  expect(failures).toEqual([])
})

test('Spanish mobile menu and chapter pager navigate and close correctly', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('es/')
  await page.getByRole('button', { name: 'Menú', exact: true }).click()
  await page.locator('nav.primary').getByRole('link', { name: 'Fundamentos', exact: true }).click()
  await expect(page).toHaveURL(/\/es\/fundamentals\/$/)
  await expect(page.getByRole('button', { name: 'Menú', exact: true })).toHaveAttribute('aria-expanded', 'false')
  await page.locator('.fd-index a').first().click()
  for (let n = 1; n < 6; n++) {
    await page.locator('.fd-pager a.next').click()
    await expect(page.locator('.sk-kicker').first()).toContainText(`Capítulo ${n + 1}`)
  }
  for (let n = 6; n > 1; n--) {
    await page.locator('.fd-pager a.prev').click()
    await expect(page.locator('.sk-kicker').first()).toContainText(`Capítulo ${n - 1}`)
  }
})
