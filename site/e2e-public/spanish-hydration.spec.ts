import { expect, test, stubCounter } from '../e2e/fixtures'

test('Spanish language links retain keyboard focus through hydration and keep query', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await stubCounter(context)
  let release = () => {}
  const hydration = new Promise<void>(resolve => { release = resolve })
  await context.route('**/assets/*.js', async route => { await hydration; await route.continue() })
  const page = await context.newPage()
  try {
    // A fragment on the initial document makes the browser itself reset focus
    // after load. The six hosting/viewport tests cover query+fragment retention.
    const suffix = 'fundamentals/how-pgt-mt-works/?focus=1'
    // Focus the actual static link before the client code is allowed to load.
    await page.goto(`http://localhost:4173/pgt-mt-atlas/es/${suffix}`, { waitUntil: 'commit' })
    const link = page.locator('header .language-switch a[lang=en]')
    await expect(link).toBeVisible()
    await link.focus()
    await expect(link).toBeFocused()
    release()
    await expect(link).toHaveAttribute('href', `/pgt-mt-atlas/en/${suffix}`)
    await expect(link).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(`http://localhost:4173/pgt-mt-atlas/en/${suffix}`)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  } finally {
    release()
    await context.close()
  }
})
