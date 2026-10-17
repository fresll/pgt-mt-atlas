import { COUNTER_ENDPOINT, COUNTER_SCRIPT, expect, test } from './fixtures'

// Счётчик просмотров GoatCounter (index.html, components/Layout.tsx). Внешняя сеть в тестах не используется:
// fixtures.ts подменяет скрипт; здесь проверяется, что он подключён в собранном HTML и получает переходы SPA.

test('the GoatCounter script is present in the built HTML', async ({ request }) => {
  for (const p of ['', 'ru/', 'ru/science/data/', 'ru/fundamentals/how-pgt-mt-works/', 'en/science/embryo-concordance/']) {
    const res = await request.get(p)
    expect(res.status(), p).toBe(200)
    const tags = (await res.text()).match(/<script\b[^>]*\bsrc="https:\/\/gc\.zgo\.at\/count\.js"[^>]*>/g) ?? []
    expect(tags, p).toHaveLength(1)
    expect(tags[0], p).toContain(`src="${COUNTER_SCRIPT}"`)
    expect(tags[0], p).toContain(`data-goatcounter="${COUNTER_ENDPOINT}"`)
    expect(tags[0], p).toMatch(/\basync\b/)
  }
})

test('the counter is loaded from the stub (no network) and client-side navigation reports the new path', async ({ page }) => {
  const requested: string[] = []
  await page.route('https://gc.zgo.at/**', (route) => {
    requested.push(route.request().url())
    return route.fulfill({
      status: 200,
      contentType: 'text/javascript',
      body: 'window.goatcounter = { count: function (v) { (window.__gcPaths = window.__gcPaths || []).push(v.path) } }',
    })
  })
  await page.goto('ru/')
  await expect.poll(() => requested).toEqual([COUNTER_SCRIPT])
  await expect.poll(() => page.evaluate(() => typeof (window as unknown as { goatcounter?: { count?: unknown } }).goatcounter?.count)).toBe('function')
  // data-menu="closed" выставляется после гидратации: дальше переходы выполняет SPA
  await expect(page.locator('header.site')).toHaveAttribute('data-menu', 'closed')
  await page.locator('nav.primary').getByRole('link', { name: 'Основы ПГТ-мт' }).click()
  await expect(page).toHaveURL(/\/ru\/fundamentals\/$/)
  await expect.poll(() => page.evaluate(() => (window as unknown as { __gcPaths?: string[] }).__gcPaths)).toEqual(['/pgt-mt-atlas/ru/', '/pgt-mt-atlas/ru/fundamentals/'])
  expect(requested).toEqual([COUNTER_SCRIPT])
})

test('root redirect counts only the destination and retains the hosting base', async ({ page }) => {
  await page.route('https://gc.zgo.at/**', route => route.fulfill({ contentType: 'text/javascript', body: 'window.goatcounter={count:v=>(window.__gcPaths=window.__gcPaths||[]).push(v.path)}' }))
  await page.goto('')
  await expect(page).toHaveURL(/\/pgt-mt-atlas\/ru\/$/)
  await expect.poll(() => page.evaluate(() => (window as unknown as { __gcPaths?: string[] }).__gcPaths)).toEqual(['/pgt-mt-atlas/ru/'])
})

test('long pages provide working section anchors', async ({ page }) => {
  for (const path of ['ru/science/methods/', 'ru/science/pgt-mt-pgt-a-model/', 'ru/contribute/']) {
    await page.goto(path)
    const toc = page.getByRole('navigation', { name: 'На этой странице' })
    await expect(toc.locator('li')).not.toHaveCount(0)
    const href = await toc.locator('li a').first().getAttribute('href')
    expect(href).toMatch(/^#.+/)
    await expect(page.locator(href!)).toHaveCount(1)
  }
})

for (const count of ['1,234', '0']) {
  test(`the shared footer displays total visits ${count} on desktop, mobile and SPA navigation`, async ({ page }) => {
    const reads: string[] = []
    await page.route('https://pgt-mt-atlas.goatcounter.com/counter/TOTAL.json', route => {
      reads.push(route.request().method())
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ count }) })
    })
    await page.route('https://gc.zgo.at/**', route => route.fulfill({
      contentType: 'text/javascript',
      body: 'window.goatcounter={count:v=>(window.__gcPaths=window.__gcPaths||[]).push(v.path)}',
    }))
    await page.goto('ru/')
    const counter = page.locator('footer.site .visitor-count')
    await counter.scrollIntoViewIfNeeded()
    await expect(counter.locator('svg')).toBeVisible()
    await expect(counter.locator('.visitor-count-value')).toHaveText(count)
    await page.locator('footer.site nav').getByRole('link', { name: 'Методы и ограничения' }).click()
    await expect(page).toHaveURL(/\/ru\/science\/methods\/$/)
    await expect(counter.locator('.visitor-count-value')).toHaveText(count)
    expect(reads).toEqual(['GET'])
    await expect.poll(() => page.evaluate(() => (window as unknown as { __gcPaths?: string[] }).__gcPaths)).toEqual([
      '/pgt-mt-atlas/ru/', '/pgt-mt-atlas/ru/science/methods/',
    ])
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('ru/science/embryo-concordance/')
    await counter.scrollIntoViewIfNeeded()
    await expect(counter.locator('svg')).toBeVisible()
    await expect(counter.locator('.visitor-count-value')).toHaveText(count)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2)).toBe(true)
    expect(reads).toEqual(['GET', 'GET'])
  })
}

test('unavailable and malformed visit counts keep pages usable and never display a false zero', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  for (const body of ['', '{"count":"not a number"}']) {
    await page.route('https://pgt-mt-atlas.goatcounter.com/counter/TOTAL.json', route =>
      route.fulfill({ status: body ? 200 : 403, contentType: 'application/json', body }))
    await page.goto('ru/about/')
    const counter = page.locator('footer.site .visitor-count')
    await expect(counter.locator('.visitor-count-value')).toHaveText('—')
    await expect(counter).toHaveAttribute('title', 'Число посещений временно недоступно')
    await expect(page.locator('h1')).toBeVisible()
  }
  expect(errors).toEqual([])
})
