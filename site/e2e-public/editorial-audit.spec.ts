import { expect, test } from '../e2e/fixtures'

test('Methods localises source explanations and distinguishes all records from matched pairs', async ({ page }) => {
  await page.goto('en/science/methods/')
  await expect(page.locator('main')).not.toContainText(/[А-Яа-яЁё]/)
  const counts = page.getByTestId('release-counts')
  await expect(counts.getByRole('row', { name: /all embryo–offspring records/ })).toContainText('17')
  await expect(counts.getByRole('row', { name: /matched embryo–tissue pairs/ })).toContainText('16')
  await expect(page.locator('main')).toContainText('checked against the PubMed abstract')
})

test('Model source note states that E is a scenario parameter without assigning an age', async ({ page }) => {
  await page.goto('en/science/pgt-mt-pgt-a-model/')
  await expect(page.getByTestId('p-eupl')).toContainText('E values are scenario parameters')
  await expect(page.getByTestId('p-eupl')).toContainText('not assigned to specific ages')
  await expect(page.locator('main')).not.toContainText(/[А-Яа-яЁё]/)
})

test('C13 retains the embryo bound, control signal and qualitative author interpretation', async ({ page }) => {
  await page.goto('en/science/embryo-to-offspring/')
  await expect(page.locator('main')).toContainText('In 16 paired comparisons from 12 foetuses and children')
  await expect(page.getByTestId('key-finding')).toContainText('descriptive grouping, not a clinical threshold')
  await page.getByRole('button', { name: 'C13', exact: true }).click()
  const detail = page.locator('.detail')
  await expect(detail).toContainText('<5% in each of the two transferred embryos')
  await expect(detail).toContainText('authors interpreted the variant as not detected')
  await expect(detail).toContainText('0.17%')
  await expect(detail).toContainText('0.28%')
  await expect(detail).toContainText('excluded from the set of exact embryo–tissue pairs')
  await expect(detail).not.toContainText('below —%')
  await expect(detail).toContainText('Figure 5')
  const text = await detail.innerText()
  expect(text).not.toMatch(/[А-Яа-яЁё]/)
})

test('Hu supplementary samples retain the distinction between TE/ICM and TE', async ({ page }) => {
  await page.goto('en/science/embryo-concordance/')
  const section = page.locator('details.table-details').filter({ hasText: 'Additional data: 16 samples from one blastocyst' })
  await section.locator('summary').click()
  await expect(section.getByRole('cell', { name: 'TE/ICM (3)', exact: true }).first()).toBeVisible()
  await expect(section.getByRole('cell', { name: /^TE \(/ }).first()).toBeVisible()
  await expect(section).not.toContainText(/[А-Яа-яЁё]/)
})

test('English chapter revisions render on Essentials and Advanced with working citations', async ({ page }) => {
  await page.goto('en/fundamentals/embryo-development-and-biopsy/')
  await expect(page.locator('.fd-essentials')).toContainText('study of embryos from m.3243A>G carriers')
  await page.goto('en/fundamentals/how-pgt-mt-works/')
  const advanced = page.locator('.fd-advanced')
  await expect(async () => {
    await page.getByRole('button', { name: 'Advanced', exact: true }).click()
    await expect(advanced).toBeVisible({ timeout: 500 })
  }).toPass()
  await expect(advanced).toContainText('statistical correction for droplet occupancy')
  await expect(advanced).toContainText('under the validated test conditions')
  await advanced.locator('.fd-cite a').first().click()
  await expect(page.locator('details.fd-refs')).toHaveAttribute('open', '')
})
