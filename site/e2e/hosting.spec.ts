import { expect, test, type Page } from './fixtures'

// Собранный сайт в условиях реального размещения (раунд 1 рецензии):
// фото, SVG и все четыре графика при прямом входе, без завершающего слеша, после перезагрузки,
// при навигации и по прежним английским адресам; GitHub Pages (/pgt-mt-atlas/) и другой путь размещения (корень сервера).
// Английская версия закрыта (64f6686): /en/<раздел>/ перенаправляется на /ru/<раздел>/ с сохранением query и hash.
const HOSTS = {
  'GitHub Pages /pgt-mt-atlas/': 'http://localhost:4174/pgt-mt-atlas/',
  'other hosting path /': 'http://localhost:4175/',
}
const CHARTS: Record<string, number> = { 'science/heteroplasmy-landscape/': 1, 'science/embryo-concordance/': 3, 'science/embryo-to-offspring/': 2, 'science/pgt-mt-pgt-a-model/': 3 }

function watch(page: Page) {
  const problems: string[] = []
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`))
  page.on('console', (m) => m.type() === 'error' && problems.push(`console: ${m.text()}`))
  page.on('response', (r) => r.status() >= 400 && problems.push(`HTTP ${r.status()} ${r.url()}`))
  return problems
}

async function expectPhoto(page: Page, selector: string) {
  const img = page.locator(selector).first()
  await expect(img).toBeVisible()
  await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth)).toBeGreaterThan(0)
}

async function expectIllustration(page: Page) {
  const svg = page.locator('.sk-illustration svg').first()
  await expect(svg).toBeVisible()
  const box = await svg.boundingBox()
  expect(box && box.width > 0 && box.height > 0).toBeTruthy()
}

for (const [host, root] of Object.entries(HOSTS)) {
  for (const entry of ['ru', 'en']) {
    test(`${host} ${entry}: photos, illustrations and all four charts load on direct entry${entry === 'en' ? ' (redirected to ru)' : ''}`, async ({ page }) => {
      const problems = watch(page)
      const open = async (p: string) => {
        await page.goto(`${root}${entry}/${p}`)
        await expect(page).toHaveURL(`${root}ru/${p}`)
        await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
      }
      await open('')
      await expectPhoto(page, '.sk-home img')
      await expectIllustration(page)
      await open('ilya-mazunin/')
      await expectPhoto(page, 'img.portrait')
      for (const [p, n] of Object.entries(CHARTS)) {
        await open(p)
        await expect(page.locator('.chart-frame .js-plotly-plot'), p).toHaveCount(n, { timeout: 20_000 })
        await expect(page.locator('.chart-placeholder')).toHaveCount(0)
        await expectIllustration(page)
      }
      expect(problems).toEqual([])
    })
  }
}

// Ссылки статического HTML относительны (scripts/postbuild.mjs) и должны вести к существующим файлам сборки
// при любом пути размещения; base в postbuild.mjs должен совпадать с base сборки (vite.config.ts).
test('static HTML: scripts, styles, icon and photos resolve on both hosting paths', async ({ request }) => {
  const missing: string[] = []
  for (const root of Object.values(HOSTS)) {
    for (const p of ['ru/', 'ru/science/data/', 'ru/fundamentals/how-pgt-mt-works/', 'ru/ilya-mazunin/']) {
      const pageUrl = new URL(p, root).href
      const html = await (await request.get(pageUrl)).text()
      const links = [...html.matchAll(/\s(?:src|href)="([^"#?]+\.(?:js|css|svg|jpg|png|woff2?))"/g)].map((m) => m[1]).filter((u) => !/^https?:/.test(u))
      expect(links.length, pageUrl).toBeGreaterThan(2)
      for (const link of new Set(links)) {
        const url = new URL(link, pageUrl).href
        const res = await request.get(url)
        if (res.status() !== 200 || (link.endsWith('.js') && !/javascript/.test(res.headers()['content-type'] ?? ''))) missing.push(`${pageUrl}: ${link} → ${url} (${res.status()})`)
      }
    }
  }
  expect(missing).toEqual([])
})

test('direct entry without a trailing slash: same page, no hydration error (React #418)', async ({ page }) => {
  for (const root of ['http://localhost:4174/pgt-mt-atlas/', 'http://localhost:4173/pgt-mt-atlas/']) {
    for (const p of ['ru/about', 'en/science/heteroplasmy-landscape', 'ru/fundamentals/how-pgt-mt-works', 'en/ilya-mazunin']) {
      const problems = watch(page)
      await page.goto(`${root}${p}?q=1#content`)
      await expect(page).toHaveURL(`${root}${p.replace(/^en\//, 'ru/')}/?q=1#content`)
      await expect(page.locator('h1').first()).toBeVisible()
      await page.waitForLoadState('networkidle')
      expect(problems, `${root}${p}`).toEqual([])
      page.removeAllListeners('pageerror')
      page.removeAllListeners('console')
      page.removeAllListeners('response')
    }
  }
})

test('static English pages redirect without JavaScript to the same Russian page with a trailing slash', async ({ request }) => {
  const html = await (await request.get('http://localhost:4174/pgt-mt-atlas/en/science/embryo-concordance/')).text()
  expect(html).toMatch(/<meta name="robots" content="noindex">/)
  const refresh = html.match(/<meta http-equiv="refresh" content="0; url=([^"]+)"/)?.[1]
  expect(refresh).toBe('../../../ru/science/embryo-concordance/')
  // переключателя языка в статическом HTML больше нет
  const ru = await (await request.get('http://localhost:4174/pgt-mt-atlas/ru/science/embryo-concordance/')).text()
  expect(ru).not.toMatch(/href="[^"]*\/en\//)
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('an English address still opens the Russian page (meta refresh)', async ({ page }) => {
    await page.goto('http://localhost:4174/pgt-mt-atlas/en/science/embryo-concordance/')
    await expect(page).toHaveURL('http://localhost:4174/pgt-mt-atlas/ru/science/embryo-concordance/')
    await expect(page.locator('h1')).toHaveText('Совпадение фракций эмбриона')
  })
})

test('user path: home → specialists → chart → old English link → reload → back → curator → contribute e-mail', async ({ page }) => {
  const root = 'http://localhost:4174/pgt-mt-atlas/'
  const problems = watch(page)
  await page.goto(`${root}ru/`)
  await page.locator('nav.primary').getByRole('link', { name: 'Данные для специалистов' }).click()
  await page.locator('nav.side a[href$="heteroplasmy-landscape/"]').click()
  await expect(page.locator('.chart-frame .js-plotly-plot')).toHaveCount(1, { timeout: 20_000 })
  // взаимодействие: режим исследования и пользовательская граница пересчитывают график
  await page.locator('.controls .seg button', { hasText: 'Исследовать' }).click()
  await page.locator('.controls input[type=number]').fill('25')
  await expect(page.locator('.chart-frame')).toContainText('25')
  await page.evaluate(() => history.replaceState(null, '', `${location.pathname}#content`))
  await page.locator('nav.side a[href$="embryo-concordance/"]').click()
  await expect(page.locator('.chart-frame .js-plotly-plot')).toHaveCount(3, { timeout: 20_000 })
  // прежняя английская ссылка открывает тот же раздел на русском и сохраняет query и hash
  await page.goto(`${root}en/science/embryo-concordance/?from=en#content`)
  await expect(page).toHaveURL(`${root}ru/science/embryo-concordance/?from=en#content`)
  await expect(page.locator('h1')).toHaveText('Совпадение фракций эмбриона')
  await expect(page.locator('.chart-frame .js-plotly-plot')).toHaveCount(3, { timeout: 20_000 })
  await page.reload()
  await expect(page.locator('.chart-frame .js-plotly-plot')).toHaveCount(3, { timeout: 20_000 })
  await page.goBack()
  await expect(page).toHaveURL(/\/ru\/science\/embryo-concordance\/$/)
  await expect(page.locator('.chart-frame .js-plotly-plot')).toHaveCount(3, { timeout: 20_000 })
  await page.goBack()
  await expect(page).toHaveURL(/\/ru\/science\/heteroplasmy-landscape\//)
  await expect(page.locator('.chart-frame .js-plotly-plot')).toHaveCount(1, { timeout: 20_000 })
  // страница куратора — из подвала; адрес для связи — на странице «Поделиться данными»
  await page.locator('footer.site a[href$="ilya-mazunin/"]').click()
  await expectPhoto(page, 'img.portrait')
  await page.locator('footer.site').getByRole('link', { name: 'Исследователям: передать данные' }).click()
  await expect(page).toHaveURL(/\/ru\/contribute\/$/)
  const mail = page.locator('#contact a[href^="mailto:"]')
  await expect(mail).toHaveAttribute('href', /^mailto:ilya\.mazunin@gmail\.com\?/)
  await expect(page.locator('#contact .email-address')).toHaveText('ilya.mazunin@gmail.com')
  expect(problems).toEqual([])
})

test('English address keeps query and hash; after hydration client-side /en/ links redirect too', async ({ page }) => {
  const root = 'http://localhost:4174/pgt-mt-atlas/'
  await page.goto(`${root}en/fundamentals/how-pgt-mt-works/?x=1#model-blastocyst`)
  await expect(page).toHaveURL(`${root}ru/fundamentals/how-pgt-mt-works/?x=1#model-blastocyst`)
  await expect(page.locator('h1')).toBeVisible()
  // клиентский RootRedirect: переход на /en/… внутри приложения (например, по старой записи в истории)
  await expect(page.locator('header.site')).toHaveAttribute('data-menu', 'closed') // гидратация завершена
  await page.evaluate((url) => {
    history.pushState(null, '', url)
    dispatchEvent(new PopStateEvent('popstate'))
  }, `${root}en/science/data/?id=f3-183#content`)
  await expect(page).toHaveURL(`${root}ru/science/data/?id=f3-183#content`)
  await expect(page.locator('h1')).toHaveText('Таблица значений')
  await expect(page.locator('.detail')).toContainText('f3-183')
})

test('pages fit phone and wide screens with visible photo and chart', async ({ page }) => {
  for (const width of [390, 820, 1920]) {
    await page.setViewportSize({ width, height: 900 })
    for (const p of ['ru/', 'ru/ilya-mazunin/', 'ru/science/heteroplasmy-landscape/', 'ru/science/pgt-mt-pgt-a-model/']) {
      await page.goto(`http://localhost:4174/pgt-mt-atlas/${p}`)
      if (p.includes('science')) await expect(page.locator('.chart-frame .js-plotly-plot').first()).toBeVisible({ timeout: 20_000 })
      else await expectPhoto(page, p.includes('ilya') ? 'img.portrait' : '.sk-home img')
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      expect(overflow, `${width} ${p}`).toBeLessThanOrEqual(0)
    }
  }
})
