import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import type { Lang } from '../data/atlas'
import { LangProvider, useT } from '../i18n'
import { Illustration } from './Sketch'

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
  const t = useT()
  const label = t('nav.theme', { mode: t(`nav.themeMode.${theme}`) })
  const next: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' }
  const icon: Record<Theme, string> = { system: '◐', light: '☀', dark: '☾' }
  return (
    <button className="ghost" type="button" onClick={() => setTheme(next[theme])} aria-label={label} title={label}>
      {icon[theme]}
    </button>
  )
}

/** Тот же раздел на другом языке: путь без base и языка, всегда с завершающим слешем (как у статических страниц). */
export function switchLangPath(pathname: string, lang: Lang, other: Lang, search = '', hash = ''): string {
  let rest = pathname.replace(new RegExp(`^.*?/${lang}(?=/|$)`), '')
  if (!rest.endsWith('/')) rest += '/'
  return `/${other}${rest}${search}${hash}`
}

function Header({ lang }: { lang: Lang }) {
  const t = useT()
  const { pathname } = useLocation()
  const rest = pathname.replace(new RegExp(`^.*?/${lang}(?=/|$)`), '')
  const inScience = /\/science(\/|$)/.test(rest) && !/\/science\/data(\/|$)/.test(rest)
  return (
    <header className="site">
      <div className="header-inner">
        <Link className="brand" to={`/${lang}/`}>
          <Illustration name="mark" className="brand-mark" />
          <span>
            {t('site.title')}
          </span>
        </Link>
        <nav className="primary" aria-label={t('nav.primaryLabel')}>
          <NavLink to={`/${lang}/fundamentals/`}>{t('nav.fundamentals')}</NavLink>
          <NavLink to={`/${lang}/patients/`}>{t('nav.patients')}</NavLink>
          <NavLink to={`/${lang}/science/`} className={() => (inScience ? 'active' : '')}>{t('nav.science')}</NavLink>
          <NavLink to={`/${lang}/science/data/`}>{t('nav.data')}</NavLink>
          <NavLink to={`/${lang}/contribute/`}>{t('nav.contribute')}</NavLink>
          <NavLink to={`/${lang}/about/`}>{t('nav.about')}</NavLink>
        </nav>
        <div className="header-tools">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="site">
      <div className="inner">
        <p className="muted">Атлас ПГТ-мт</p>
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
      <Footer />
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
      <nav className="side" aria-label={t('nav.scienceLabel')}>
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
