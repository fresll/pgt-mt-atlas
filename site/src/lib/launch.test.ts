import { describe, expect, it } from 'vitest'
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

describe('launch remains an explicit build choice', () => {
  it('opens English HTML for an explicit public release or an owner-only review', () => {
    const root = mkdtempSync(join(tmpdir(), 'atlas-english-review-'))
    const script = join(root, 'scripts/postbuild.mjs')
    const page = join(root, 'dist/en/about/index.html')
    try {
      mkdirSync(join(root, 'scripts'))
      mkdirSync(join(root, 'dist/en/about'), { recursive: true })
      copyFileSync(fileURLToPath(new URL('../../scripts/postbuild.mjs', import.meta.url)), script)
      for (const privatePreview of ['0', '1']) {
        for (const englishReview of ['0', '1']) {
          for (const englishPublic of ['0', '1']) {
            writeFileSync(page, '<html><head><meta name="robots" content="noindex, nofollow"></head><body>English review</body></html>')
            execFileSync(process.execPath, [script], { env: {
              ...process.env, ATLAS_BASE: '/', ATLAS_SOFT_LAUNCH: '0', ATLAS_PUBLIC_LAUNCH: '0',
              VITE_ATLAS_PRIVATE_PREVIEW: privatePreview, VITE_ATLAS_ENGLISH_REVIEW: englishReview, VITE_ATLAS_ENGLISH_PUBLIC: englishPublic,
            } })
            const output = readFileSync(page, 'utf8')
            const enabled = privatePreview === '1' ? englishReview === '1' : englishPublic === '1'
            expect(output.includes('http-equiv="refresh"')).toBe(!enabled)
            expect(readFileSync(join(root, 'dist/404.html'), 'utf8').includes('hreflang="en"')).toBe(enabled)
            expect(output).toContain('noindex')
            expect(existsSync(join(root, 'dist/sitemap.xml'))).toBe(false)
          }
        }
      }
    } finally { rmSync(root, { recursive: true, force: true }) }
  })

  it('keeps previews noindex and creates canonical/sitemap only behind the launch flag', () => {
    const root = mkdtempSync(join(tmpdir(), 'atlas-launch-'))
    const script = join(root, 'scripts/postbuild.mjs')
    const html = '<html><head><meta name="robots" content="noindex, nofollow"></head><body></body></html>'
    try {
      mkdirSync(join(root, 'scripts')); mkdirSync(join(root, 'dist/ru/about'), { recursive: true })
      copyFileSync(fileURLToPath(new URL('../../scripts/postbuild.mjs', import.meta.url)), script)
      const page = join(root, 'dist/ru/about/index.html')
      const run = (launch: string, privatePreview = '') => execFileSync(process.execPath, [script], { env: { ...process.env, ATLAS_BASE: '/', ATLAS_PUBLIC_LAUNCH: launch, ATLAS_SOFT_LAUNCH: '', VITE_ATLAS_PRIVATE_PREVIEW: privatePreview, ATLAS_CANONICAL_BASE: 'https://atlas.example/preview/' } })
      writeFileSync(page, html); run('')
      expect(readFileSync(page, 'utf8')).toContain('noindex, nofollow')
      expect(existsSync(join(root, 'dist/sitemap.xml'))).toBe(false)
      writeFileSync(page, html); run('1')
      expect(readFileSync(page, 'utf8')).toContain('href="https://atlas.example/preview/ru/about/"')
      expect(readFileSync(join(root, 'dist/sitemap.xml'), 'utf8')).toContain('https://atlas.example/preview/ru/about/')
      expect(readFileSync(join(root, 'dist/robots.txt'), 'utf8')).toContain('Sitemap: https://atlas.example/preview/sitemap.xml')
      writeFileSync(page, html); run('1', '1')
      expect(readFileSync(page, 'utf8')).toContain('noindex, nofollow')
      expect(readFileSync(page, 'utf8')).not.toContain('rel="canonical"')
      expect(existsSync(join(root, 'dist/sitemap.xml'))).toBe(false)
      expect(existsSync(join(root, 'dist/robots.txt'))).toBe(false)
    } finally { rmSync(root, { recursive: true, force: true }) }
  })

  it('indexes both published languages with reciprocal hreflang and excludes closed English', () => {
    const root = mkdtempSync(join(tmpdir(), 'atlas-bilingual-indexing-'))
    const script = join(root, 'scripts/postbuild.mjs')
    const html = '<html><head><meta name="robots" content="noindex, nofollow"></head><body></body></html>'
    try {
      mkdirSync(join(root, 'scripts'))
      copyFileSync(fileURLToPath(new URL('../../scripts/postbuild.mjs', import.meta.url)), script)
      for (const english of ['0', '1']) {
        for (const route of ['', 'ru/about', 'en/about', 'es/about']) {
          mkdirSync(join(root, 'dist', route), { recursive: true })
          writeFileSync(join(root, 'dist', route, 'index.html'), html)
        }
        execFileSync(process.execPath, [script], { env: { ...process.env,
          ATLAS_BASE: '/', ATLAS_SOFT_LAUNCH: '0', ATLAS_PUBLIC_LAUNCH: '1',
          VITE_ATLAS_PRIVATE_PREVIEW: '0', VITE_ATLAS_ENGLISH_PUBLIC: english,
          ATLAS_CANONICAL_BASE: 'https://atlas.example/atlas/',
        } })
        const sitemap = readFileSync(join(root, 'dist/sitemap.xml'), 'utf8')
        const russian = readFileSync(join(root, 'dist/ru/about/index.html'), 'utf8')
        const englishPage = readFileSync(join(root, 'dist/en/about/index.html'), 'utf8')
        expect(russian).toContain('content="index, follow"')
        expect(russian).toContain('rel="canonical" href="https://atlas.example/atlas/ru/about/"')
        expect(sitemap.match(/<loc>/g)).toHaveLength(english === '1' ? 3 : 2)
        if (english === '1') {
          expect(englishPage).toContain('content="index, follow"')
          expect(englishPage).not.toContain('noindex')
          for (const page of [russian, englishPage]) for (const lang of ['ru', 'en', 'es']) {
            expect(page).toContain(`rel="alternate" hreflang="${lang}" href="https://atlas.example/atlas/${lang}/about/"`)
          }
          expect(sitemap.match(/<xhtml:link /g)).toHaveLength(9)
        } else {
          expect(englishPage).toContain('noindex')
          expect(englishPage).not.toContain('rel="canonical"')
          expect(sitemap).not.toContain('/en/')
        }
        expect(readFileSync(join(root, 'dist/index.html'), 'utf8')).toContain('noindex')
        expect(readFileSync(join(root, 'dist/404.html'), 'utf8')).toContain('noindex')
      }
    } finally { rmSync(root, { recursive: true, force: true }) }
  })

  it('soft launch writes noindex, follow into static HTML and overrides the indexing flag', () => {
    const root = mkdtempSync(join(tmpdir(), 'atlas-soft-launch-'))
    const script = join(root, 'scripts/postbuild.mjs')
    const html = '<html><head><meta name="robots" content="noindex, nofollow"></head><body></body></html>'
    const routes = ['', 'ru/about', 'en/about', 'es/about']
    try {
      mkdirSync(join(root, 'scripts'))
      copyFileSync(fileURLToPath(new URL('../../scripts/postbuild.mjs', import.meta.url)), script)
      for (const privatePreview of ['', '1']) {
        for (const route of routes) {
          mkdirSync(join(root, 'dist', route), { recursive: true })
          writeFileSync(join(root, 'dist', route, 'index.html'), html)
        }
        writeFileSync(join(root, 'dist/sitemap.xml'), 'stale sitemap')
        writeFileSync(join(root, 'dist/robots.txt'), 'User-agent: *\nDisallow: /\n')
        execFileSync(process.execPath, [script], { env: {
          ...process.env, ATLAS_BASE: '/', ATLAS_SOFT_LAUNCH: '1', ATLAS_PUBLIC_LAUNCH: '1',
          VITE_ATLAS_PRIVATE_PREVIEW: privatePreview, ATLAS_CANONICAL_BASE: '',
        } })
        for (const route of [...routes.map((r) => `${r ? `${r}/` : ''}index.html`), '404.html']) {
          const output = readFileSync(join(root, 'dist', route), 'utf8')
          expect(output).toContain('<meta name="robots" content="noindex, follow">')
          expect(output).not.toContain('content="index, follow"')
          expect(output).not.toContain('rel="canonical"')
        }
        expect(readFileSync(join(root, 'dist/robots.txt'), 'utf8')).toBe('User-agent: *\nAllow: /\n')
        expect(existsSync(join(root, 'dist/sitemap.xml'))).toBe(false)
      }
    } finally { rmSync(root, { recursive: true, force: true }) }
  })
})
