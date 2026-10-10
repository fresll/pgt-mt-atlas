import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import { atlas, formatDate, type Lang } from '../data/atlas'
import { LangProvider, useT } from '../i18n'

type Theme = 'system' | 'light' | 'dark'

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system')
  useEffect(() => {
    try {
      const saved = localStorage.getItem('atlas-theme') as Theme | null
      if (saved) setTheme(saved)
    } catch {
      /* хранилище недоступно — используется системная тема */
    }
  }, [])
  useEffect(() => {
    const el = document.documentElement
    if (theme === 'system') el.removeAttribute('data-theme')
    else el.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('atlas-theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])
  const next: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' }
  const icon: Record<Theme, string> = { system: '◐', light: '☀', dark: '☾' }
  return (
    <button className="ghost" type="button" onClick={() => setTheme(next[theme])} aria-label={`Theme: ${theme}`} title={`Theme: ${theme}`}>
      {icon[theme]}
    </button>
  )
}

function Header({ lang }: { lang: Lang }) {
  const t = useT()
  const { pathname } = useLocation()
  const other: Lang = lang === 'en' ? 'ru' : 'en'
  // путь без base и языка → тот же раздел на другом языке
  const rest = pathname.replace(new RegExp(`^.*?/${lang}(?=/|$)`), '')
  return (
    <header className="site">
      <div className="header-inner">
        <Link className="brand" to={`/${lang}/`}>
          <span className="brand-mark" aria-hidden>
            mt
          </span>
          <span>{t('site.title')}</span>
        </Link>
        <nav className="primary" aria-label={t('nav.menu')}>
          <NavLink to={`/${lang}/science/`}>{t('nav.science')}</NavLink>
          <NavLink to={`/${lang}/patients/`}>{t('nav.patients')}</NavLink>
          <NavLink to={`/${lang}/creator/`}>{t('nav.creator')}</NavLink>
          <NavLink to={`/${lang}/about/`}>{t('nav.about')}</NavLink>
        </nav>
        <div className="header-tools">
          <Link
            className="btn-link lang-switch"
            to={`/${other}${rest || '/'}`}
            hrefLang={other}
            lang={other}
          >
            <span aria-hidden className="lang-code">{other.toUpperCase()}</span> {t('nav.switchTo')}
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

function Footer({ lang }: { lang: Lang }) {
  const t = useT()
  return (
    <footer className="site">
      <div className="inner footer-grid">
        <div>
          <p className="footer-title">{t('site.title')}</p>
          <p>{t('site.tagline')}.</p>
          <p>
            <Link to={`/${lang}/creator/`}>{t('site.credit')}</Link>
          </p>
        </div>
        <nav aria-label={lang === 'ru' ? 'Разделы' : 'Sections'}>
          <ul className="footer-links">
            <li><Link to={`/${lang}/science/`}>{t('nav.science')}</Link></li>
            <li><Link to={`/${lang}/science/data/`}>{t('nav.data')}</Link></li>
            <li><Link to={`/${lang}/science/sources/`}>{t('nav.sources')}</Link></li>
            <li><Link to={`/${lang}/patients/`}>{t('nav.patients')}</Link></li>
            <li><Link to={`/${lang}/creator/`}>{t('nav.creator')}</Link></li>
            <li><Link to={`/${lang}/about/`}>{t('nav.about')}</Link></li>
          </ul>
        </nav>
        <div className="small">
          <p>{t('home.caveat')}</p>
          <p className="muted">
            {t('home.updated')}: {formatDate(atlas.meta.dataset_version, lang)} · v{atlas.meta.dataset_version} · SHA-256 {atlas.meta.source_sha256.slice(0, 12)}…
          </p>
        </div>
      </div>
    </footer>
  )
}

export function Shell({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem('atlas-lang', lang)
    } catch {
      /* ignore */
    }
  }, [lang])
  return (
    <LangProvider lang={lang}>
      <ShellInner lang={lang} />
    </LangProvider>
  )
}

function ShellInner({ lang }: { lang: Lang }) {
  const t = useT()
  return (
    <>
      <Head>
        <html lang={lang} />
        <title>{t('site.title')}</title>
        <meta name="description" content={t('site.tagline')} />
      </Head>
      <a className="skip" href="#content">
        {t('site.skip')}
      </a>
      <div className="preview-bar" role="note">
        {t('site.preview')}
      </div>
      <Header lang={lang} />
      <main id="content">
        <Outlet />
      </main>
      <Footer lang={lang} />
    </>
  )
}

export function ScienceLayout({ lang }: { lang: Lang }) {
  const t = useT()
  const groups: [string, [string, string][]][] = [
    ['nav.sciGroupOverview', [['', 'nav.science']]],
    ['nav.sciGroupFigures', [
      ['between-embryos/', 'nav.fig3'],
      ['within-embryo/', 'nav.fig4'],
      ['embryo-to-offspring/', 'nav.fig5'],
      ['pgt-mt-and-pgt-a/', 'nav.fig6'],
    ]],
    ['nav.sciGroupData', [
      ['data/', 'nav.data'],
      ['cases/', 'nav.cases'],
      ['sources/', 'nav.sources'],
      ['methods/', 'nav.methods'],
    ]],
  ]
  return (
    <div className="layout-science">
      <nav className="side" aria-label={t('nav.science')}>
        {groups.map(([g, items]) => (
          <div className="side-group" key={g}>
            <p className="side-title">{t(g)}</p>
            <ul>
              {items.map(([p, k]) => (
                <li key={p}>
                  <NavLink to={`/${lang}/science/${p}`} end={p === ''}>
                    {t(k)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="page">
        <Outlet />
      </div>
    </div>
  )
}
