import { readFileSync } from 'node:fs'
import { expect, test } from './fixtures'

// Навигация (components/Layout.tsx): основное меню из четырёх разделов, на телефоне — кнопка «Меню»;
// подвал с куратором, датой обновления данных, дисклеймером и служебными ссылками;
// на узком экране боковое меню раздела «Данные для специалистов» заменено выпадающим списком.
const PRIMARY = ['Пациентам', 'Основы ПГТ-мт', 'Данные для специалистов', 'О проекте']
const SCIENCE = ['Обзор разделов', 'Между разными эмбрионами', 'Внутри индивидуальных эмбрионов', 'Эмбрион, плод и ребёнок', 'Модель ПГТ-мт + ПГТ-А', 'Опубликованные случаи', 'Таблица значений', 'Источники', 'Методы и ограничения']
const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

/** Дата версии набора данных (src/data/atlas.json, meta.dataset_version) по-русски: «11 октября 2026». */
function datasetDate(): string {
  const atlas = JSON.parse(readFileSync(new URL('../src/data/atlas.json', import.meta.url), 'utf8'))
  const [y, m, d] = String(atlas.meta.dataset_version).split('-').map(Number)
  return `${d} ${MONTHS[m - 1]} ${y}`
}

test('main menu: four sections on a wide screen; on a 390 px phone the «Меню» button opens nav.primary', async ({ page }) => {
  await page.goto('ru/')
  const header = page.locator('header.site')
  const toggle = header.locator('.menu-toggle')
  const nav = page.locator('nav.primary')
  await expect(nav.getByRole('link')).toHaveText(PRIMARY)
  await expect(nav).toBeVisible()
  await expect(toggle).toBeHidden()

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('ru/science/')
  // после гидратации меню свёрнуто в кнопку
  await expect(header).toHaveAttribute('data-menu', 'closed')
  await expect(nav).toBeHidden()
  await expect(toggle).toBeVisible()
  await expect(toggle).toHaveText(/Меню/)
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.click()
  await expect(header).toHaveAttribute('data-menu', 'open')
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(toggle).toHaveText(/Закрыть/)
  await expect(nav).toBeVisible()
  await expect(nav.getByRole('link')).toHaveText(PRIMARY)
  for (const name of PRIMARY) await expect(nav.getByRole('link', { name })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0)
  // переход по пункту меню закрывает меню
  await nav.getByRole('link', { name: 'Пациентам' }).click()
  await expect(page).toHaveURL(/\/ru\/patients\/$/)
  await expect(page.locator('h1')).toHaveText('Пациентам и семьям')
  await expect(header).toHaveAttribute('data-menu', 'closed')
  await expect(nav).toBeHidden()
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })

  test('the phone menu stays expanded', async ({ page }) => {
    await page.goto('ru/')
    await expect(page.locator('header.site')).toHaveAttribute('data-menu', 'static')
    await expect(page.locator('nav.primary')).toBeVisible()
    await expect(page.locator('nav.primary').getByRole('link')).toHaveText(PRIMARY)
  })
})

test('footer names the creator and curator, the data update date, the disclaimer and service links', async ({ page }) => {
  const date = datasetDate()
  for (const p of ['', 'patients/', 'fundamentals/how-pgt-mt-works/', 'science/methods/']) {
    await page.goto(`ru/${p}`)
    const footer = page.locator('footer.site')
    const curator = footer.getByRole('link', { name: 'Создатель и куратор — Илья Мазунин' })
    await expect(curator, p).toHaveAttribute('href', /\/ru\/ilya-mazunin\/$/)
    await expect(footer, p).toContainText(`Данные обновлены ${date}`)
    await expect(footer, p).toContainText('Атлас ПГТ-мт не заменяет консультацию врача-генетика. Создатель и куратор Атласа ПГТ-мт не оказывает медицинских консультаций.')
    await expect(footer.getByRole('navigation').getByRole('link'), p).toHaveText(['О проекте', 'Методы и ограничения', 'Источники', 'Исследователям: передать данные'])
  }
  await page.locator('footer.site').getByRole('link', { name: 'Создатель и куратор — Илья Мазунин' }).click()
  await expect(page).toHaveURL(/\/ru\/ilya-mazunin\/$/)
  await expect(page.locator('h1')).toHaveText('Илья Мазунин')
})

test('on a 390 px phone the section select of the data pages opens the chosen section', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('ru/science/data/')
  await expect(page.locator('h1')).toHaveText('Таблица значений')
  const select = page.locator('.layout-science > .section-select select')
  await expect(page.locator('.layout-science > nav.side')).toBeHidden()
  await expect(select).toBeVisible()
  await expect(select.locator('option')).toHaveText(SCIENCE)
  // (выбранный пункт при прямом входе проверяется отдельным тестом ниже)
  // статическая страница интерактивна только после гидратации — повторяем выбор до перехода
  await expect(async () => {
    await select.selectOption({ label: 'Модель ПГТ-мт + ПГТ-А' })
    await expect(page).toHaveURL(/\/ru\/science\/pgt-mt-pgt-a-model\/$/, { timeout: 1000 })
  }).toPass()
  await expect(page.locator('h1')).toHaveText('Совместная модель ПГТ-мт и ПГТ-А')
  await expect(select).toHaveValue('/ru/science/pgt-mt-pgt-a-model/')
  await expect(page.locator('.chart-frame .js-plotly-plot')).toHaveCount(3, { timeout: 20_000 })
  await select.selectOption({ label: 'Опубликованные случаи' })
  await expect(page).toHaveURL(/\/ru\/science\/cases\/$/)
  await expect(select).toHaveValue('/ru/science/cases/')
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0)
})

// Прямой вход (или перезагрузка) на страницу раздела: текущий раздел должен быть отмечен так же, как после перехода
// внутри сайта. Статические страницы генерируются с адресом без завершающего слеша, поэтому ScienceLayout и NavLink
// не узнают текущий раздел, а гидратация React не исправляет атрибуты.
test('direct entry marks the current section in nav.side, .section-select and .fd-toc', async ({ page }) => {
  await page.goto('ru/science/data/')
  await expect(page.locator('header.site')).toHaveAttribute('data-menu', 'closed') // гидратация завершена
  await expect(page.locator('nav.side a.active')).toHaveText(['Таблица значений'])
  await expect(page.locator('.layout-science > .section-select select')).toHaveValue('/ru/science/data/')
  await page.goto('ru/fundamentals/how-pgt-mt-works/')
  await expect(page.locator('header.site')).toHaveAttribute('data-menu', 'closed')
  await expect(page.locator('.fd-toc ol a.active')).toHaveCount(1)
  await expect(page.locator('.fd-toc ol a.active')).toHaveAttribute('href', /\/ru\/fundamentals\/how-pgt-mt-works\/$/)
})
