import { expect, test } from '../e2e/fixtures'

const base = 'https://fresll.github.io/pgt-mt-atlas/'

test('canonical and language alternates follow in-app navigation without query or hash', async ({ page }) => {
  await page.goto('en/?example=1#content')
  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', `${base}en/`)
  await page.locator('header').getByRole('link', { name: 'For patients', exact: true }).click()
  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', `${base}en/patients/`)
  await page.locator('header .language-switch').click()
  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', `${base}ru/patients/`)
  await expect(page.locator('head link[rel="canonical"]')).toHaveCount(1)
  for (const language of ['ru', 'en']) await expect(page.locator(`head link[rel="alternate"][hreflang="${language}"]`)).toHaveAttribute('href', `${base}${language}/patients/`)
})

test('sitemap lists both languages while redirects and error pages stay noindex', async ({ request }) => {
  const sitemapResponse = await request.get('sitemap.xml')
  expect(sitemapResponse.status()).toBe(200)
  const sitemap = await sitemapResponse.text()
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1])
  expect(locations).toHaveLength(44)
  expect(new Set(locations).size).toBe(44)
  for (const language of ['ru', 'en']) expect(locations.filter(url => url.startsWith(`${base}${language}/`))).toHaveLength(22)
  expect(sitemap.match(/<xhtml:link /g)).toHaveLength(88)
  expect(await (await request.get('robots.txt')).text()).toBe(`User-agent: *\nAllow: /\nSitemap: ${base}sitemap.xml\n`)
  for (const path of ['', '404.html']) expect(await (await request.get(path)).text()).toContain('content="noindex')
})
