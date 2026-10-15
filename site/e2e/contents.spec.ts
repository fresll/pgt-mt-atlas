import { expect, test } from './fixtures'

const routes = ['science/methods/', 'science/pgt-mt-pgt-a-model/', 'contribute/']

test('contents and stable heading anchors are included in SSG HTML', async ({ request }) => {
  for (const route of routes) {
    const response = await request.get(`ru/${route}`)
    const html = await response.text()
    const contents = html.match(/<nav class="page-contents"[\s\S]*?<\/nav>/)?.[0] ?? ''
    const links = [...contents.matchAll(/href="#([^"]+)"/g)].map(match => match[1])
    expect(links.length, route).toBeGreaterThan(3)
    for (const id of links) expect(html, `${route}#${id}`).toContain(`<h2 id="${id}"`)
    expect(html, route).toContain('class="back-to-top"')
    expect(contents, route).not.toContain('href="#content"')
  }
})

test('mobile contents links reach headings and bottom link returns to top', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const route of routes) {
    await page.goto(`ru/${route}`)
    const link = page.locator('.page-contents a').last()
    const hash = await link.getAttribute('href')
    await link.click()
    await expect(page).toHaveURL(new RegExp(`${hash}$`))
    const top = page.locator('.back-to-top a')
    await top.click()
    await expect(page).toHaveURL(/#content$/)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})
