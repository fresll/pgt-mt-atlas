import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import { atlas, type Lang } from '../data/atlas'
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
          {t('site.title')}
        </Link>
        <nav className="primary" aria-label="primary">
          <NavLink to={`/${lang}/science/`}>{t('nav.science')}</NavLink>
          <NavLink to={`/${lang}/patients/`}>{t('nav.patients')}</NavLink>
          <NavLink to={`/${lang}/about/`}>{t('nav.about')}</NavLink>
        </nav>
        <div className="header-tools">
          <Link className="btn-link" to={`/${other}${rest || '/'}`} hrefLang={other} lang={other}>
            {t('nav.switchTo')}
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

function Footer() {
  const t = useT()
  return (
    <footer className="site">
      <div className="inner">
        <p>{t('home.caveat')}</p>
        <p className="muted">
          v{atlas.meta.dataset_version} · {atlas.meta.source_file} · SHA-256 {atlas.meta.source_sha256.slice(0, 12)}…
        </p>
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
        <title>{`${t('site.title')} — ${t('site.tagline')}`}</title>
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
      <Footer />
    </>
  )
}

export function ScienceLayout({ lang }: { lang: Lang }) {
  const t = useT()
  const items: [string, string][] = [
    ['', 'nav.science'],
    ['data/', 'nav.data'],
    ['between-embryos/', 'nav.fig3'],
    ['within-embryo/', 'nav.fig4'],
    ['embryo-to-offspring/', 'nav.fig5'],
    ['pgt-mt-and-pgt-a/', 'nav.fig6'],
    ['cases/', 'nav.cases'],
    ['sources/', 'nav.sources'],
    ['methods/', 'nav.methods'],
  ]
  return (
    <div className="layout-science">
      <nav className="side" aria-label="science">
        <ul>
          {items.map(([p, k]) => (
            <li key={p}>
              <NavLink to={`/${lang}/science/${p}`} end={p === ''}>
                {t(k)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="page">
        <Outlet />
      </div>
    </div>
  )
}
