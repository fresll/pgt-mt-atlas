// 404.html для GitHub Pages: неизвестный путь → выбор языка.
import { writeFileSync } from 'node:fs'
const base = process.env.ATLAS_BASE ?? '/pgt-mt-atlas/'
writeFileSync(
  new URL('../dist/404.html', import.meta.url),
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>PGT-mt Atlas — not found</title></head>
<body style="font-family:system-ui;padding:24px;background:#f9f9f7;color:#0b0b0b"><h1>PGT-mt Atlas</h1><p>Page not found · Страница не найдена</p>
<p><a href="${base}en/">English</a> · <a href="${base}ru/">Русский</a></p></body></html>\n`,
)
console.log('404.html written')
