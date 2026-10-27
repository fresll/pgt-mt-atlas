// Постобработка статической сборки:
//  1. HTML-страницы получают относительные ссылки на ресурсы и страницы вместо зашитого base,
//     поэтому фото, стили, скрипты и графики грузятся при любом пути размещения
//     (GitHub Pages /pgt-mt-atlas/, свой домен, локальный сервер в dist/).
//  2. Адрес страницы без завершающего слеша (/ru/about) до загрузки ресурсов заменяется на /ru/about/:
//     иначе серверы без перенаправления (vite preview и др.) отдают чужой HTML и гидратация падает (React #418).
//  3. 404.html для GitHub Pages: неизвестный путь → выбор языка.
import { rmSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

// по умолчанию тот же base, что в vite.config.ts (GitHub Pages); Sites собирается с ATLAS_BASE=/ явно
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
  const softLaunch = process.env.ATLAS_SOFT_LAUNCH === '1'
  const englishEnabled = process.env.VITE_ATLAS_PRIVATE_PREVIEW === '1'
    ? process.env.VITE_ATLAS_ENGLISH_REVIEW === '1'
    : process.env.VITE_ATLAS_ENGLISH_PUBLIC === '1'
  const chineseEnabled = process.env.VITE_ATLAS_PRIVATE_PREVIEW === '1' ? process.env.VITE_ATLAS_CHINESE_REVIEW === '1' : process.env.VITE_ATLAS_CHINESE_PUBLIC === '1'
  const arabicEnabled = process.env.VITE_ATLAS_PRIVATE_PREVIEW === '1' ? process.env.VITE_ATLAS_ARABIC_REVIEW === '1' : process.env.VITE_ATLAS_ARABIC_PUBLIC === '1'
  const launch = !softLaunch && process.env.ATLAS_PUBLIC_LAUNCH === '1' && process.env.VITE_ATLAS_PRIVATE_PREVIEW !== '1'
  let canonicalBase
  if (launch) {
    canonicalBase = new URL(process.env.ATLAS_CANONICAL_BASE || '')
    if (canonicalBase.protocol !== 'https:' || canonicalBase.search || canonicalBase.hash) throw new Error('ATLAS_CANONICAL_BASE must be an https URL with the deployment base path')
    if (!canonicalBase.pathname.endsWith('/')) canonicalBase.pathname += '/'
  }
  const sitemap = []
  // A later preview build must not retain launch artifacts from a previous build.
  for (const name of ['sitemap.xml', 'robots.txt']) rmSync(join(dist, name), { force: true })
  let n = 0
  for (const file of htmlFiles(dist)) {
    const depth = relative(dist, file).split(sep).length - 1
    const html = readFileSync(file, 'utf8')
    let out = relativizeHtml(html, depth)
    const route = relative(dist, file).split(sep).join('/')
    if (softLaunch) {
      out = out.replace(/<meta name="robots" content="[^"]*"\s*\/?>/g, '<meta name="robots" content="noindex, follow">')
    }
    if (launch && (route.startsWith('ru/') || route.startsWith('es/') || (englishEnabled && route.startsWith('en/')) || (chineseEnabled && route.startsWith('zh-Hans/')) || (arabicEnabled && route.startsWith('ar/')))) {
      const canonical = new URL(route.replace(/index\.html$/, ''), canonicalBase).href
      out = out.replace(/<meta name="robots" content="noindex, nofollow"\s*\/?>/g, '<meta name="robots" content="index, follow">')
      const languages = ['ru', ...(englishEnabled ? ['en'] : []), 'es', ...(chineseEnabled ? ['zh-Hans'] : []), ...(arabicEnabled ? ['ar'] : [])]
      const alternates = languages.map(lang => ({ lang, url: new URL(route.replace(/^(?:ru|en|es|zh-Hans|ar)\//, `${lang}/`).replace(/index\.html$/, ''), canonicalBase).href }))
      if (!out.includes('rel="canonical"')) out = out.replace('</head>', `<link rel="canonical" href="${canonical}"></head>`)
      if (!out.includes('rel="alternate"')) out = out.replace('</head>', alternates.map(({ lang, url }) => `<link rel="alternate" hreflang="${lang}" href="${url}">`).join('') + '</head>')
      sitemap.push({ canonical, alternates })
    }
    if (route.startsWith('en/') && !englishEnabled) {
      const destination = '../'.repeat(depth) + route.replace(/^en\//, 'ru/').replace(/index\.html$/, '')
      out = out.replace('<head>', `<head><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${destination}"><script>location.replace(location.pathname.replace(/\\/en(?=\\/|$)/,'/ru')+location.search+location.hash)</script>`)
    }
    if (base !== "/" && (out.includes(`"${base}`) || out.includes(`'${base}`))) throw new Error(`absolute base left in ${file}`)
    writeFileSync(file, out)
    n++
  }
  console.log(`relative links: ${n} pages`)
  if (launch) {
    const xml = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    writeFileSync(join(dist, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' + sitemap.map(({ canonical, alternates }) => `<url><loc>${xml(canonical)}</loc>${alternates.map(({ lang, url }) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${xml(url)}"/>`).join('')}</url>`).join('') + '</urlset>')
    writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', canonicalBase).href}\n`)
  } else if (softLaunch) {
    writeFileSync(join(dist, 'robots.txt'), 'User-agent: *\nAllow: /\n')
  }

  const arabic404 = arabicEnabled
    ? `<script>if(/\\/ar(?:\\/|$)/.test(location.pathname)){document.documentElement.lang="ar";document.documentElement.dir="rtl";document.title="أطلس PGT-mt — الصفحة غير موجودة";document.querySelector("h1").textContent="أطلس PGT-mt";document.getElementById("not-found").textContent="الصفحة غير موجودة";var root=location.pathname.split("/ar/")[0]+"/";document.querySelectorAll("a[hreflang]").forEach(function(a){a.textContent=({ru:"الروسية",en:"الإنجليزية",es:"الإسبانية","zh-Hans":"الصينية المبسطة"})[a.hreflang];a.lang="ar";a.href=root+a.hreflang+"/"});var a=document.createElement("a");a.href=root+"ar/";a.textContent="الرئيسية";document.querySelector("p:last-of-type").prepend(a," · ")}document.currentScript.remove()</script>` : ''
  const title404 = englishEnabled ? 'PGT-mt Atlas — page not found' : 'Атлас ПГТ-мт — страница не найдена'
  const heading404 = englishEnabled ? 'PGT-mt Atlas' : 'Атлас ПГТ-мт'
  const message404 = englishEnabled ? 'Page not found' : 'Страница не найдена'
  const russian404 = englishEnabled ? `<script>if(/\\/ru(?:\\/|$)/.test(location.pathname)){document.documentElement.lang="ru";document.title="Атлас ПГТ-мт — страница не найдена";document.querySelector("h1").textContent="Атлас ПГТ-мт";document.getElementById("not-found").textContent="Страница не найдена";document.getElementById("russian-link").textContent="Русский"}document.currentScript.remove()</script>` : ''
  writeFileSync(
    join(dist, '404.html'),
    `<!doctype html><html lang="${englishEnabled ? 'en' : 'ru'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="${softLaunch ? 'noindex, follow' : 'noindex'}"><title>${title404}</title></head>
<body style="font-family:system-ui;padding:24px;background:#F7F8F4;color:#182A40"><h1>${heading404}</h1><p id="not-found">${message404}</p>
<p><a id="russian-link" href="${base}ru/" lang="ru" hreflang="ru">${englishEnabled ? 'Russian' : 'Русский'}</a>${englishEnabled ? ` · <a href="${base}en/" lang="en" hreflang="en">English</a>` : ''} · <a href="${base}es/" lang="es" hreflang="es">Español</a></p>${chineseEnabled ? `<script>var a=document.createElement("a");a.href="${base}zh-Hans/";a.hreflang="zh-Hans";a.lang="zh-Hans";a.textContent="简体中文";document.querySelector("p:last-of-type").append(" · ",a)</script>` : ''}${russian404}<script>var root=location.pathname.match(/^(.*?\\/)(?:ru|en|es|zh-Hans|ar)(?:\\/|$)/);if(root)document.querySelectorAll("a[hreflang]").forEach(function(a){a.href=root[1]+a.hreflang+"/"});if(/\\/es(?:\\/|$)/.test(location.pathname)){document.documentElement.lang="es";document.title="PGT-mt Atlas — página no encontrada";document.getElementById("not-found").textContent="Página no encontrada";document.getElementById("russian-link").textContent="Ruso";var enLink=document.querySelector('a[lang="en"]');if(enLink)enLink.textContent="Inglés"}if(/\\/zh-Hans(?:\\/|$)/.test(location.pathname)){document.documentElement.lang="zh-Hans";document.title="PGT-mt图谱 — 页面未找到";document.querySelector("h1").textContent="PGT-mt图谱";document.getElementById("not-found").textContent="页面未找到";document.querySelectorAll("a[hreflang]").forEach(function(a){a.textContent=({ru:"俄语",en:"英语",es:"西班牙语","zh-Hans":"简体中文"})[a.hreflang]})}document.currentScript.remove()</script>${arabic404}</body></html>\n`,
  )
  console.log('404.html written')
}
