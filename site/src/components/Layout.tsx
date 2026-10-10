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
          <BrandMark />
          <span>
            {t('site.title')}
            <small>{t('site.curated')}</small>
          </span>
        </Link>
        <nav className="primary" aria-label="primary">
          <NavLink to={`/${lang}/science/`}>{t('nav.science')}</NavLink>
          <NavLink to={`/${lang}/patients/`}>{t('nav.patients')}</NavLink>
          <NavLink to={`/${lang}/about/`}>{t('nav.about')}</NavLink>
          <NavLink to={`/${lang}/ilya-mazunin/`}>{t('nav.curator')}</NavLink>
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

/** Знак атласа: кольцо мтДНК (teal) с медным маркером варианта. */
function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="12" fill="none" stroke="#137F80" strokeWidth="4" />
      <circle cx="16" cy="16" r="12" fill="none" stroke="#D7EDE5" strokeWidth="4" strokeDasharray="10 65.4" strokeDashoffset="-6" />
      <circle cx="24.5" cy="7.5" r="3.6" fill="#D28A56" />
    </svg>
  )
}

function Footer({ lang }: { lang: Lang }) {
  const t = useT()
  return (
    <footer className="site">
      <div className="inner">
        <p className="curated" style={{ margin: 0 }}>
          {t('site.title')} · <Link to={`/${lang}/ilya-mazunin/`}>{t('site.curated')}</Link>
        </p>
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
        <meta name="author" content="Ilya Mazunin" />
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
  const items: [string, string][] = [
    ['', 'nav.science'],
    ['data/', 'nav.data'],
    ['heteroplasmy-landscape/', 'nav.fig3'],
    ['embryo-concordance/', 'nav.fig4'],
    ['embryo-to-offspring/', 'nav.fig5'],
    ['pgt-mt-pgt-a-model/', 'nav.fig6'],
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
