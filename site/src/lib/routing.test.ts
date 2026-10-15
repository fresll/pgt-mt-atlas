import { describe, expect, it } from 'vitest'
import { switchLangPath } from '../components/Layout'
import { russianPath } from '../pages/RootRedirect'
import { SLASH_SCRIPT, relativizeHtml } from '../../scripts/postbuild.mjs'

describe('language switch keeps the page', () => {
  it('always links to the static page with a trailing slash (no React #418 on direct entry)', () => {
    expect(switchLangPath('/ru/science/heteroplasmy-landscape', 'ru', 'en')).toBe('/en/science/heteroplasmy-landscape/')
    expect(switchLangPath('/ru/science/heteroplasmy-landscape/', 'ru', 'en')).toBe('/en/science/heteroplasmy-landscape/')
    expect(switchLangPath('/en', 'en', 'ru')).toBe('/ru/')
    expect(switchLangPath('/en/', 'en', 'ru')).toBe('/ru/')
  })

  it('keeps query and hash', () => {
    expect(switchLangPath('/en/fundamentals/how-pgt-mt-works/', 'en', 'ru', '?level=advanced', '#model-blastocyst')).toBe(
      '/ru/fundamentals/how-pgt-mt-works/?level=advanced#model-blastocyst',
    )
  })
})

describe('static HTML does not depend on the hosting path', () => {
  const html = '<html><head><link rel="stylesheet" href="/pgt-mt-atlas/assets/app.css"></head><body><img src="/pgt-mt-atlas/img/p.jpg"><a href="/pgt-mt-atlas/ru/about/">x</a><a href="https://doi.org/10.1/x">d</a></body></html>'

  it('rewrites base-absolute links to page-relative ones', () => {
    const out = relativizeHtml(html, 2, '/pgt-mt-atlas/')
    expect(out).toContain('href="../../assets/app.css"')
    expect(out).toContain('src="../../img/p.jpg"')
    expect(out).toContain('href="../../ru/about/"')
    expect(out).toContain('href="https://doi.org/10.1/x"')
    expect(out).not.toContain('"/pgt-mt-atlas/')
    expect(relativizeHtml(html, 0, '/pgt-mt-atlas/')).toContain('href="./assets/app.css"')
  })

  it('adds the trailing-slash normalisation before any resource is requested', () => {
    const out = relativizeHtml(html, 1, '/pgt-mt-atlas/')
    expect(out.indexOf(SLASH_SCRIPT)).toBe(out.indexOf('<head>') + '<head>'.length)
  })
})


describe('temporarily Russian-only site', () => {
  it('opens the Russian home regardless of the former language preference', () => {
    expect(russianPath('/')).toBe('/ru/')
    expect(russianPath('/en')).toBe('/ru/')
  })

  it('keeps the section, observation query and model anchor when redirecting English links', () => {
    expect(russianPath('/en/science/data', '?id=HL-001', '#content')).toBe('/ru/science/data/?id=HL-001#content')
    expect(russianPath('/en/fundamentals/how-pgt-mt-works/', '', '#advanced')).toBe('/ru/fundamentals/how-pgt-mt-works/#advanced')
  })
})
