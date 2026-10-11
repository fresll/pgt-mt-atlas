// Постобработка статической сборки:
//  1. HTML-страницы получают относительные ссылки на ресурсы и страницы вместо зашитого base,
//     поэтому фото, стили, скрипты и графики грузятся при любом пути размещения
//     (GitHub Pages /pgt-mt-atlas/, свой домен, локальный сервер в dist/).
//  2. Адрес страницы без завершающего слеша (/ru/about) до загрузки ресурсов заменяется на /ru/about/:
//     иначе серверы без перенаправления (vite preview и др.) отдают чужой HTML и гидратация падает (React #418).
//  3. 404.html для GitHub Pages: неизвестный путь → выбор языка.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const base = process.env.ATLAS_BASE ?? '/pgt-mt-atlas/'
const dist = fileURLToPath(new URL('../dist/', import.meta.url))

export const SLASH_SCRIPT =
  '<script>(function(l){var p=l.pathname;if(p.slice(-1)!=="/"&&!/\\.[a-z0-9]+$/i.test(p))l.replace(p+"/"+l.search+l.hash)})(location)</script>'

/** Абсолютные ссылки с base → относительные для страницы на глубине depth (dist/ru/about/index.html → 2). */
export function relativizeHtml(html, depth, siteBase = base) {
  const prefix = depth === 0 ? './' : '../'.repeat(depth)
  const esc = siteBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return html
    .replace(new RegExp(`(\\s(?:href|src|content)=["'])${esc}`, 'g'), `$1${prefix}`)
    .replace(/<head>/, `<head>${SLASH_SCRIPT}`)
}

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) yield* htmlFiles(p)
    else if (name === 'index.html') yield p
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  let n = 0
  for (const file of htmlFiles(dist)) {
    const depth = relative(dist, file).split(sep).length - 1
    const html = readFileSync(file, 'utf8')
    const out = relativizeHtml(html, depth)
    if (out.includes(`"${base}`) || out.includes(`'${base}`)) throw new Error(`absolute base left in ${file}`)
    writeFileSync(file, out)
    n++
  }
  console.log(`relative links: ${n} pages`)

  writeFileSync(
    join(dist, '404.html'),
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>PGT-mt Atlas — not found</title></head>
<body style="font-family:system-ui;padding:24px;background:#F7F8F4;color:#182A40"><h1>PGT-mt Atlas</h1><p>Page not found · Страница не найдена</p>
<p><a href="${base}en/">English</a> · <a href="${base}ru/">Русский</a></p></body></html>\n`,
  )
  console.log('404.html written')
}
