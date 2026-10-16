import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import { SectionSelect, useHydrated } from '../../components/Layout'
import { HandRule } from '../../components/Sketch'
import { WIDGET_KEYS, Widget } from '../../components/fundamentals/Widgets'
import type { Lang } from '../../data/atlas'
import { useLang, useT } from '../../i18n'
import { FUNDAMENTALS } from '../../content/fundamentals'
import { Blocks, chapterRefs, citeIds } from '../../content/fundamentals/markup'
import { REFS, doiHref, refById, type Ref } from '../../content/fundamentals/references'
import type { WidgetId } from '../../content/fundamentals/types'

// Раздел Fundamentals / Основы ПГТ-мт: оглавление, шесть глав (два уровня изложения), библиография.
// Адреса: /<язык>/fundamentals/, /<язык>/fundamentals/<slug>/, /<язык>/fundamentals/references/.

const base = (lang: Lang) => `/${lang}/fundamentals/`

export function FundamentalsLayout({ lang }: { lang: Lang }) {
  const t = useT()
  const { pathname } = useLocation()
  const chapters = FUNDAMENTALS[lang].chapters
  // На странице-оглавлении боковое меню повторяет основное содержание — его там нет.
  const isIndex = /\/fundamentals\/?$/.test(pathname)
  const hydrated = useHydrated()
  const options: [string, string][] = [
    [base(lang), t('fundamentals.title')],
    ...chapters.map((c, i): [string, string] => [`${base(lang)}${c.slug}/`, `${i + 1}. ${c.title}`]),
    [`${base(lang)}references/`, t('fundamentals.bibliography')],
  ]
  const rest = pathname.replace(/^.*?\/fundamentals\//, '')
  const current = options.find(([to]) => to !== base(lang) && rest && to.endsWith(`/fundamentals/${rest.replace(/\/?$/, '/')}`))?.[0] ?? base(lang)
  if (isIndex) {
    return (
      <div className="fd-layout fd-layout-index">
        <div className="fd-page">
          <Outlet />
        </div>
      </div>
    )
  }
  return (
    <div className="fd-layout">
      <SectionSelect key={`s-${hydrated}`} label={t('nav.chapterSelect')} items={options} current={current} />
      <nav className="fd-toc" key={`n-${hydrated}`} aria-label={t('fundamentals.tocTitle')}>
        <NavLink className="fd-toc-home" to={base(lang)} end>
          {t('fundamentals.title')}
        </NavLink>
        <ol>
          {chapters.map((c, i) => (
            <li key={c.slug}>
              <NavLink to={`${base(lang)}${c.slug}/`}>
                <span className="fd-toc-no" aria-hidden="true">{i + 1}</span>
                <span>{c.title}</span>
              </NavLink>
            </li>
          ))}
        </ol>
        <NavLink className="fd-toc-refs" to={`${base(lang)}references/`}>
          {t('fundamentals.bibliography')}
        </NavLink>
      </nav>
      <div className="fd-page">
        <Outlet />
      </div>
    </div>
  )
}

function PageHead({ title, description }: { title: string; description: string }) {
  const t = useT()
  return (
    <Head>
      <title>{`${title} — ${t('site.title')}`}</title>
      <meta name="description" content={description} />
    </Head>
  )
}

export function FundamentalsIndex() {
  const t = useT()
  const lang = useLang()
  const chapters = FUNDAMENTALS[lang].chapters
  const models: [WidgetId, string, number][] = [
    ['heteroplasmy', 'fundamentals.het.title', 0],
    ['bottleneck', 'fundamentals.bn.title', 2],
    ['blastocyst', 'fundamentals.bx.title', 3],
  ]
  return (
    <article className="fd-index">
      <PageHead title={t('fundamentals.title')} description={t('fundamentals.lead')} />
      <header className="fd-head">
        <p className="sk-kicker">{t('fundamentals.kicker')}</p>
        <h1>{t('fundamentals.title')}</h1>
        <HandRule className="sk-title-rule" />
        <p className="fd-lead">{t('fundamentals.lead')}</p>
        <p className="fd-howto">{t('fundamentals.howTo')}</p>
      </header>

      <section className="fd-section" aria-labelledby="fd-toc-title">
        <header className="sk-margin">
          <h2 id="fd-toc-title">{t('fundamentals.tocTitle')}</h2>
          <p className="sk-note">{t('fundamentals.tocNote')}</p>
        </header>
        <ol className="sk-index fd-chapter-index">
          {chapters.map((c, i) => (
            <li key={c.slug}>
              <span className="sk-no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <Link to={`${base(lang)}${c.slug}/`}>{c.title}</Link>
                <p>{c.short}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="fd-section" aria-labelledby="fd-models-title">
        <header className="sk-margin">
          <h2 id="fd-models-title">{t('fundamentals.modelsTitle')}</h2>
          <p className="sk-note">{t('fundamentals.modelsNote')}</p>
        </header>
        <div>
          <p className="fd-howto">{t('fundamentals.modelsText')}</p>
          <ul className="fd-model-list">
            {models.map(([id, title, ci], k) => (
              <li key={id}>
                <span className="fd-model-letter" aria-hidden="true">{(lang === 'ru' ? 'АБВ' : 'ABC')[k]}</span>
                <Link to={`${base(lang)}${chapters[ci].slug}/#model-${id}`}>{t(title)}</Link>
                <span className="muted"> — {t('fundamentals.chapter', { n: ci + 1 })}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="fd-section" aria-labelledby="fd-bib-title">
        <header className="sk-margin">
          <h2 id="fd-bib-title">{t('fundamentals.bibliography')}</h2>
          <p className="sk-note">{t('fundamentals.bibliographyNote')}</p>
        </header>
        <div>
          <p className="fd-howto">
            <Link to={`${base(lang)}references/`}>{t('fundamentals.publicationsLink')}</Link>{t('fundamentals.bibliographyTail')}
          </p>
        </div>
      </section>
      <p className="fd-disclaimer">{t('fundamentals.disclaimer')}</p>
    </article>
  )
}

function RefItem({ r, chapters }: { r: Ref; chapters?: number[] }) {
  const t = useT()
  const lang = useLang()
  const list = FUNDAMENTALS[lang].chapters
  return (
    <li id={`ref-${r.id}`}>
      <span className="fd-ref-authors">{r.authors}</span> ({r.yearLabel ?? r.year}). {r.title}. <em>{r.source}</em>.{' '}
      <a href={doiHref(r.doi)} target="_blank" rel="noreferrer">
        doi:{r.doi}
      </a>
      {r.pmid && <span className="muted"> · PMID {r.pmid}</span>}{' '}
      {r.verified !== 'pubmed' && <span className={`fd-ref-status ${r.verified}`}>{t(`fundamentals.refStatus.${r.verified}`)}</span>}
      {chapters && chapters.length > 0 && (
        <span className="fd-ref-used">
          {' '}
          · {t('fundamentals.usedIn')}:{' '}
          {chapters.map((n, k) => (
            <span key={n}>
              {k > 0 && ', '}
              <Link to={`${base(lang)}${list[n].slug}/`}>{n + 1}</Link>
            </span>
          ))}
        </span>
      )}
    </li>
  )
}

/** Строки схем и моделей главы (для ссылок на источники из их подписей). */
function widgetStrings(t: ReturnType<typeof useT>, id: WidgetId): string[] {
  const flat = (v: unknown): string[] => (typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(flat) : v && typeof v === 'object' ? Object.values(v).flatMap(flat) : [])
  return flat(t(`fundamentals.${WIDGET_KEYS[id]}`, { returnObjects: true }))
}

function useChapterRefs(lang: Lang) {
  const t = useT()
  return FUNDAMENTALS[lang].chapters.map((c) => [...new Set([...chapterRefs(c), ...c.widgets.flatMap((w) => widgetStrings(t, w).flatMap(citeIds))])])
}

export function FundamentalsReferences() {
  const t = useT()
  const lang = useLang()
  const byChapter = useChapterRefs(lang)
  const sorted = [...REFS].sort((a, b) => a.authors.localeCompare(b.authors, 'en') || a.year - b.year)
  return (
    <article className="fd-refs-page">
      <PageHead title={`${t('fundamentals.bibliography')} — ${t('fundamentals.title')}`} description={t('fundamentals.bibliographyLead')} />
      <header className="fd-head">
        <p className="sk-kicker">{t('fundamentals.title')}</p>
        <h1>{t('fundamentals.bibliography')}</h1>
        <HandRule className="sk-title-rule" />
        <p className="fd-lead">{t('fundamentals.bibliographyLead')}</p>
      </header>
      <ol className="fd-reflist">
        {sorted.map((r) => (
          <RefItem key={r.id} r={r} chapters={byChapter.flatMap((ids, n) => (ids.includes(r.id) ? [n] : []))} />
        ))}
      </ol>
    </article>
  )
}

type Level = 'essentials' | 'advanced'

export function ChapterPage({ slug }: { slug: string }) {
  const t = useT()
  const lang = useLang()
  const chapters = FUNDAMENTALS[lang].chapters
  const i = chapters.findIndex((c) => c.slug === slug)
  const c = chapters[i]
  const refs = useChapterRefs(lang)[i]
  // до гидратации (и без JavaScript) показаны оба уровня; затем — выбранный
  const [level, setLevel] = useState<Level | null>(null)
  useEffect(() => {
    setLevel('essentials')
  }, [slug])
  const choose = (l: Level) => {
    setLevel(l)
  }
  // Список источников свёрнут; переход по ссылке-цитате [Автор, год] раскрывает его.
  const refsRef = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    const open = () => {
      if (window.location.hash.startsWith('#ref-') && refsRef.current) {
        refsRef.current.open = true
        document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView()
      }
    }
    open()
    window.addEventListener('hashchange', open)
    return () => window.removeEventListener('hashchange', open)
  }, [slug])
  const prev = chapters[i - 1], next = chapters[i + 1]
  return (
    <article className="fd-chapter">
      <PageHead title={`${c.title} — ${t('fundamentals.title')}`} description={c.lead} />
      <header className="fd-head">
        <p className="sk-kicker">
          {t('fundamentals.chapter', { n: i + 1 })} · {t('fundamentals.title')}
        </p>
        <h1>{c.title}</h1>
        <HandRule className="sk-title-rule" />
        <p className="fd-lead">{c.lead}</p>
      </header>

      <div className="fd-level-switch" role="group" aria-label={t('fundamentals.level')}>
        <span className="fd-level-label">{t('fundamentals.level')}</span>
        {(['essentials', 'advanced'] as Level[]).map((l) => (
          <button key={l} type="button" aria-pressed={level === l} onClick={() => choose(l)}>
            {t(`fundamentals.${l}`)}
          </button>
        ))}
      </div>

      <div className="fd-levels" data-level={level ?? 'all'}>
        <section className="fd-text fd-essentials" aria-labelledby={`${slug}-essentials`}>
          <h2 className="fd-level-title" id={`${slug}-essentials`}>{t('fundamentals.essentials')}</h2>
          <Blocks blocks={c.essentials} lang={lang} />
        </section>
        <section className="fd-text fd-advanced" aria-labelledby={`${slug}-advanced`}>
          <h2 className="fd-level-title" id={`${slug}-advanced`}>{t('fundamentals.advanced')}</h2>
          <Blocks blocks={c.advanced} lang={lang} />
        </section>
      </div>

      {c.widgets.length > 0 && (
        <section className="fd-figures" aria-labelledby={`${slug}-figures`}>
          <h2 id={`${slug}-figures`}>
            {t('fundamentals.figures')}
          </h2>
          {c.widgets.map((w) => (
            <Widget key={w} id={w} />
          ))}
        </section>
      )}

      <section className="fd-data" aria-labelledby={`${slug}-data`}>
        <h2 id={`${slug}-data`}>
          {t('fundamentals.toData')}
        </h2>
        <ul>
          {c.data.map((d) => (
            <li key={d.to}>
              <Link to={`/${lang}/${d.to}`}>{d.label} →</Link>
              <p>{d.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <details className="fd-refs" ref={refsRef}>
        <summary>
          <h2 id={`${slug}-refs`}>
            {t('fundamentals.refs')} <span className="fd-refs-count">({refs.length})</span>
          </h2>
        </summary>
        <p className="fd-refs-checked">{t('fundamentals.refsChecked')}</p>
        <ol className="fd-reflist">
          {refs.map((id) => (
            <RefItem key={id} r={refById[id]} />
          ))}
        </ol>
        {slug !== 'mtdna-and-maternal-inheritance' && (
        <p>
          <Link className="sk-link" to={`${base(lang)}references/`}>{t('fundamentals.bibliography')} →</Link>
        </p>
        )}
      </details>

      <nav className="fd-pager" aria-label={t('fundamentals.chapters')}>
        {prev ? (
          <Link className="prev" to={`${base(lang)}${prev.slug}/`}>
            <small>← {t('fundamentals.prev')}</small>
            {prev.title}
          </Link>
        ) : (
          <Link className="prev" to={base(lang)}>
            <small>← {t('fundamentals.allChapters')}</small>
            {t('fundamentals.title')}
          </Link>
        )}
        {next ? (
          <Link className="next" to={`${base(lang)}${next.slug}/`}>
            <small>{t('fundamentals.next')} →</small>
            {next.title}
          </Link>
        ) : (
          <Link className="next" to={`${base(lang)}references/`}>
            <small>{t('fundamentals.bibliography')} →</small>
            {t('fundamentals.bibliography')}
          </Link>
        )}
      </nav>
    </article>
  )
}
