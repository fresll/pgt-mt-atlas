import { SITE_BASE } from '../lib/base'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import { atlas, type Lang } from '../data/atlas'
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

/** Высота липкой шапки в CSS-переменной --header-h: по ней выравниваются липкие оглавления и переключатели. */
function useHeaderHeight(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const set = () => document.documentElement.style.setProperty('--header-h', `${Math.round(el.getBoundingClientRect().height)}px`)
    set()
    const ro = new ResizeObserver(set)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
}

function Header({ lang }: { lang: Lang }) {
  const t = useT()
  const { pathname } = useLocation()
  const ref = useRef<HTMLElement>(null)
  // Без JavaScript меню всегда раскрыто; после загрузки на телефоне оно сворачивается в кнопку «Меню».
  const [menu, setMenu] = useState<'static' | 'closed' | 'open'>('static')
  useHeaderHeight(ref)
  useEffect(() => setMenu('closed'), [pathname])
  return (
    <header className="site" ref={ref} data-menu={menu}>
      <div className="header-inner">
        <Link className="brand" to={`/${lang}/`}>
          <Illustration name="mark" className="brand-mark" />
          <span>
            {t('site.title')}
          </span>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menu === 'open'}
          aria-controls="primary-nav"
          onClick={() => setMenu(menu === 'open' ? 'closed' : 'open')}
        >
          <span aria-hidden="true">{menu === 'open' ? '×' : '☰'}</span> {t(menu === 'open' ? 'nav.menuClose' : 'nav.menu')}
        </button>
        <nav className="primary" id="primary-nav" aria-label={t('nav.primaryLabel')}>
          <NavLink to={`/${lang}/patients/`}>{t('nav.patients')}</NavLink>
          <NavLink to={`/${lang}/fundamentals/`}>{t('nav.fundamentals')}</NavLink>
          <NavLink to={`/${lang}/science/`}>{t('nav.science')}</NavLink>
          <NavLink to={`/${lang}/about/`}>{t('nav.about')}</NavLink>
        </nav>
        <div className="header-tools">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

export function formatDate(iso: string, lang: Lang): string {
  const d = new Date(`${iso}T00:00:00Z`)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

/** Публичное число посещений: чтение статистики не регистрирует новый просмотр. */
function VisitorCount() {
  const t = useT()
  const [count, setCount] = useState<string | null>(null)
  useEffect(() => {
    if (import.meta.env.VITE_ATLAS_PRIVATE_PREVIEW === '1') return
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)
    fetch('https://pgt-mt-atlas.goatcounter.com/counter/TOTAL.json', {
      credentials: 'omit', signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) return
        const data: unknown = await response.json()
        const value = data && typeof data === 'object' && 'count' in data ? data.count : null
        if (typeof value === 'string' && /^\d[\d\s,.]*$/.test(value) && value.length <= 32 && !controller.signal.aborted) {
          setCount(value)
        }
      })
      .catch(() => { /* Недоступность статистики не мешает работе сайта. */ })
      .finally(() => clearTimeout(timer))
    return () => { clearTimeout(timer); controller.abort() }
  }, [])
  if (import.meta.env.VITE_ATLAS_PRIVATE_PREVIEW === '1') return null
  return (
    <p className="visitor-count" title={t(count === null ? 'footer.visitsUnavailable' : 'footer.visitsHelp')}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <span>{t('footer.visits')}</span>
      <span className="visitor-count-value" aria-live="polite">{count ?? '—'}</span>
    </p>
  )
}

function Footer({ lang }: { lang: Lang }) {
  const t = useT()
  return (
    <footer className="site">
      <div className="inner footer-grid">
        <div>
          <p className="footer-title">{t('site.title')}</p>
          <p>
            <Link to={`/${lang}/ilya-mazunin/`}>{t('site.curated')}</Link>
          </p>
          <p className="muted">{t('footer.updated', { date: formatDate(atlas.meta.dataset_version, lang), version: atlas.meta.dataset_version })}</p>
          <VisitorCount />
        </div>
        <nav aria-label={t('footer.linksLabel')}>
          <ul>
            <li><Link to={`/${lang}/about/`}>{t('nav.about')}</Link></li>
            <li><Link to={`/${lang}/science/methods/`}>{t('nav.methods')}</Link></li>
            <li><Link to={`/${lang}/science/sources/`}>{t('nav.sources')}</Link></li>
            <li><Link to={`/${lang}/contribute/`}>{t('footer.contribute')}</Link></li>
          </ul>
        </nav>
        <p className="footer-disclaimer">{t('footer.disclaimer')}</p>
      </div>
    </footer>
  )
}

/**
 * Статические страницы генерируются по адресу без завершающего слеша, а в браузере адрес со слешем:
 * гидратация не исправляет класс активного пункта. После загрузки меню перестраивается (новый key).
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}

/** На узком экране длинное боковое меню раздела заменяется выпадающим списком. */
export function SectionSelect({ label, items, current }: { label: string; items: [string, string][]; current: string }) {
  const navigate = useNavigate()
  return (
    <label className="section-select">
      <span>{label}</span>
      <select value={current} onChange={(e) => navigate(e.target.value)}>
        {items.map(([to, title]) => (
          <option key={to} value={to}>
            {title}
          </option>
        ))}
      </select>
    </label>
  )
}

/** GoatCounter считает только первую загрузку; переходы внутри SPA отправляются вручную. */
function PageviewCounter() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (import.meta.env.VITE_ATLAS_PRIVATE_PREVIEW === '1') return
    const path = SITE_BASE.replace(/\/$/, '') + pathname
    let cancelled = false
    let attempt = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    const count = () => {
      if (cancelled) return
      const gc = (window as unknown as { goatcounter?: { count?: (v: { path: string }) => void } }).goatcounter
      if (gc?.count) gc.count({ path })
      else if (++attempt < 40) timer = setTimeout(count, 250)
    }
    count()
    return () => { cancelled = true; if (timer) clearTimeout(timer) }
  }, [pathname])
  return null
}

/** Новые страницы открываются сверху; явные ссылки на рисунки и источники сохраняют якорь. */
function PageScroll() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    let frame: number
    const scroll = () => {
      // Уровень главы меняет её высоту: якорь рассчитывается после показа «Основного».
      if (document.querySelector('.fd-levels[data-level="all"]')) {
        frame = requestAnimationFrame(scroll)
        return
      }
      if (!hash) {
        window.scrollTo(0, 0)
        return
      }
      try {
        document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
      } catch {
        // Некорректный якорь не должен мешать открытию страницы.
      }
    }
    frame = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])
  return null
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
      <PageviewCounter />
      <PageScroll />
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
      <Header lang={lang} />
      <main id="content">
        <Outlet />
      </main>
      <Footer lang={lang} />
    </>
  )
}

/** Заголовок вкладки браузера для отдельной страницы: «Раздел — Атлас ПГТ-мт». */
export function PageTitle({ title, description }: { title: string; description?: string }) {
  const t = useT()
  return (
    <Head>
      <title>{`${title} — ${t('site.title')}`}</title>
      {description ? <meta name="description" content={description} /> : null}
    </Head>
  )
}

export function ScienceLayout({ lang }: { lang: Lang }) {
  const t = useT()
  const { pathname } = useLocation()
  const items: [string, string][] = [
    ['', 'nav.scienceIndex'],
    ['heteroplasmy-landscape/', 'nav.landscape'],
    ['embryo-concordance/', 'nav.concordance'],
    ['embryo-to-offspring/', 'nav.offspring'],
    ['pgt-mt-pgt-a-model/', 'nav.model'],
    ['cases/', 'nav.cases'],
    ['data/', 'nav.data'],
    ['sources/', 'nav.sources'],
    ['methods/', 'nav.methods'],
  ]
  const hydrated = useHydrated()
  const root = `/${lang}/science/`
  const rest = `${pathname.replace(/^.*?\/science\/?/, '')}/`.replace(/\/+$/, '/')
  const current = `${root}${items.find(([p]) => p !== '' && rest.startsWith(p))?.[0] ?? ''}`
  return (
    <div className="layout-science">
      <SectionSelect key={`s-${hydrated}`} label={t('nav.sectionSelect')} items={items.map(([p, k]) => [`${root}${p}`, t(k)])} current={current} />
      <nav className="side" key={`n-${hydrated}`} aria-label={t('nav.scienceLabel')}>
        <ul>
          {items.map(([p, k]) => (
            <li key={p}>
              <NavLink to={`${root}${p}`} end={p === ''}>
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
