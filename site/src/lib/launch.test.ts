import { describe, expect, it } from 'vitest'
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

describe('launch remains an explicit build choice', () => {
  it('keeps previews noindex and creates canonical/sitemap only behind the launch flag', () => {
    const root = mkdtempSync(join(tmpdir(), 'atlas-launch-'))
    const script = join(root, 'scripts/postbuild.mjs')
    const html = '<html><head><meta name="robots" content="noindex, nofollow"></head><body></body></html>'
    try {
      mkdirSync(join(root, 'scripts')); mkdirSync(join(root, 'dist/ru/about'), { recursive: true })
      copyFileSync(fileURLToPath(new URL('../../scripts/postbuild.mjs', import.meta.url)), script)
      const page = join(root, 'dist/ru/about/index.html')
      const run = (launch: string, privatePreview = '') => execFileSync(process.execPath, [script], { env: { ...process.env, ATLAS_BASE: '/', ATLAS_PUBLIC_LAUNCH: launch, VITE_ATLAS_PRIVATE_PREVIEW: privatePreview, ATLAS_CANONICAL_BASE: 'https://atlas.example/preview/' } })
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
})
