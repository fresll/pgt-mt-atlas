// Compare the actual published source build with all three localized renderings.
const { chromium } = require('playwright')
const ts = require('typescript')
const vm = require('node:vm')
const fs = require('node:fs')
const path = require('node:path')
const assert = require('node:assert/strict')
const sandbox = { exports: {} }
vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname, '../e2e-public/drawing-contract.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, sandbox)
const drawing = sandbox.exports.drawing
const routes = [
  ['', 0, '.sk-hero-figure .sk-plate, .sk-side-figure .sk-illustration, .sk-data-figure .sk-illustration', 3],
  ['contribute/', 0, '.sk-c-figure .sk-plate', 1],
  ['science/heteroplasmy-landscape/', 1, '.js-plotly-plot', 1],
  ['science/embryo-concordance/', 3, '.js-plotly-plot', 3],
  ['science/embryo-to-offspring/', 2, '.js-plotly-plot', 2],
  ['science/pgt-mt-pgt-a-model/', 3, '.js-plotly-plot', 3],
  ['fundamentals/mtdna-and-maternal-inheritance/', 0, '.fd-het-plate', 1],
  ['fundamentals/heteroplasmy-and-threshold-effects/', 0, '.fd-chart', 1],
  ['fundamentals/mitochondrial-genetic-bottleneck/', 0, '.fd-chart', 1],
  ['fundamentals/embryo-development-and-biopsy/', 0, '.fd-dev, .fd-bx-plate', 2],
]
const base = process.env.ATLAS_BASELINE_URL || 'http://127.0.0.1:4180/pgt-mt-atlas/'
const translated = process.env.ATLAS_TRANSLATED_URL || 'http://127.0.0.1:4173/pgt-mt-atlas/'
const reportPath = process.env.ATLAS_REPORT_PATH || '/workspace/artifacts/spanish-public/published-drawing-comparison.json'
function scientific(contract) {
  // UI persistence is intentionally added by localization. It is not scientific geometry.
  const next = structuredClone(contract)
  if (next.layout) delete next.layout.uirevision
  return next
}
;(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true })
  const context = await browser.newContext({ viewport: { width: 1600, height: 1100 }, reducedMotion: 'reduce' })
  await context.route('https://gc.zgo.at/**', r => r.fulfill({ status: 200, body: '' }))
  await context.route('https://*.goatcounter.com/**', r => r.fulfill({ status: 204, body: '' }))
  const page = await context.newPage()
  const results = []
  try {
    for (const [route, plots, selector, count] of routes) {
      let original
      for (const [root, lang] of [[base,'en'], [base,'ru'], [translated,'en'], [translated,'ru'], [translated,'es']]) {
        await page.goto(root + lang + '/' + route)
        await page.locator('h1').first().waitFor()
        await page.waitForFunction(n => document.querySelectorAll('.js-plotly-plot .main-svg').length >= n, plots, { timeout: 30000 })
        await page.evaluate(() => document.fonts.ready)
        const figures = page.locator(selector)
        assert.equal(await figures.count(), count, route)
        const contracts = []
        for (let i=0;i<count;i++) contracts.push(scientific(await drawing(figures.nth(i))))
        if (!original) original = contracts
        else assert.deepEqual(contracts, original, `${root}/${lang}/${route}`)
        results.push({ route, source: root===base?'published 2957996':'localized', lang, figures: count, scientific_contract: 'identical' })
      }
      console.log('PASS', route || 'home')
    }
    fs.writeFileSync(reportPath, JSON.stringify({ published_commit: '2957996f253b408ec0d09bfaeb04b4e787851d4e', results },null,2))
  } finally { await browser.close() }
})().catch(e => { console.error(e); process.exit(1) })
