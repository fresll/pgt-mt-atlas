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
  await expect.poll(() => page.evaluate(() => (window as unknown as { __gcPaths?: string[] }).__gcPaths)).toEqual(['/ru/fundamentals/'])
  expect(requested).toEqual([COUNTER_SCRIPT])
})
