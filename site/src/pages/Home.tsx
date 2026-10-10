import { Link } from 'react-router-dom'
import { ModelBadge, ObservedBadge, Photo } from '../components/ui'
import { formatDate, summary } from '../data/atlas'
import { creator } from '../data/creator'
import { useLang, useT } from '../i18n'

export default function Home() {
  const t = useT()
  const lang = useLang()
  const ru = lang === 'ru'
  const s = summary
  const stats: [number, string][] = [
    [s.embryoValues, t('home.k1')],
    [s.variants, t('home.kVariants')],
    [s.pubsWithData, t('home.kPubs')],
    [s.blastocystsTeIcm, t('home.k2')],
    [s.offspringPairs, t('home.k3', { children: s.children })],
  ]
  const figs: [string, string, string, boolean][] = [
    ['between-embryos/', t('fig3.title'), ru ? `${s.embryoValues} значений · ${s.variants} вариантов мтДНК` : `${s.embryoValues} values · ${s.variants} mtDNA variants`, false],
    ['within-embryo/', t('fig4.title'), ru ? `${s.blastocystsTeIcm} бластоцист + ${s.cleavage} эмбрионов дробления` : `${s.blastocystsTeIcm} blastocysts + ${s.cleavage} cleavage-stage embryos`, false],
    ['embryo-to-offspring/', t('fig5.title'), ru ? `${s.offspringPairs} сопоставлений · ${s.children} детей` : `${s.offspringPairs} comparisons · ${s.children} children`, false],
    ['pgt-mt-and-pgt-a/', t('fig6.title'), ru ? 'Сценарный расчёт по опубликованным долям' : 'Scenario calculation from published proportions', true],
  ]
  return (
    <article className="home">
      <section className="hero">
        <p className="eyebrow">{t('home.eyebrow')}</p>
        <h1>{t('site.title')}</h1>
        <p className="hero-sub">{t('site.tagline')}</p>
        <p className="hero-credit">
          <Link to={`/${lang}/creator/`}>{t('site.credit')}</Link>
        </p>
        <p className="lead">{t('home.lead')}</p>
        <div className="hero-actions">
          <Link className="btn primary" to={`/${lang}/science/between-embryos/`}>
            {ru ? 'Открыть визуализации' : 'Explore the visualisations'}
          </Link>
          <Link className="btn" to={`/${lang}/science/data/`}>
            {ru ? 'Данные' : 'Browse the data'}
          </Link>
        </div>
      </section>

      <section aria-labelledby="h-stats" className="section">
        <div className="section-head">
          <h2 id="h-stats">{t('home.statsTitle')}</h2>
          <p className="muted small">
            {t('home.updated')}: <time dateTime={s.updated}>{formatDate(s.updated, lang)}</time>
          </p>
        </div>
        <dl className="stats">
          {stats.map(([n, l]) => (
            <div className="stat" key={l}>
              <dt className="lbl">{l}</dt>
              <dd className="num">{n}</dd>
            </div>
          ))}
        </dl>
        <p className="muted small">{t('home.statsNote')}</p>
      </section>

      <section aria-labelledby="h-figs" className="section">
        <div className="section-head">
          <h2 id="h-figs">{t('home.figsTitle')}</h2>
          <Link className="small" to={`/${lang}/science/`}>{t('home.allFigs')} →</Link>
        </div>
        <div className="cards cards-4">
          {figs.map(([to, title, sub, model]) => (
            <div className="card card-link" key={to}>
              <Link className="stretch" to={`/${lang}/science/${to}`}>
                <p className="card-badge">{model ? <ModelBadge /> : <ObservedBadge />}</p>
                <h3>{title}</h3>
                <p className="muted small">{sub}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="section audiences" aria-label={ru ? 'Аудитории' : 'Audiences'}>
        <div className="audience">
          <h2>{t('home.sciTitle')}</h2>
          <p>{t('home.sciText')}</p>
          <ul className="link-list">
            <li><Link to={`/${lang}/science/data/`}>{t('nav.data')}</Link></li>
            <li><Link to={`/${lang}/science/cases/`}>{t('nav.cases')}</Link></li>
            <li><Link to={`/${lang}/science/sources/`}>{t('nav.sources')}</Link> <span className="muted small">({s.publications})</span></li>
            <li><Link to={`/${lang}/science/methods/`}>{t('nav.methods')}</Link></li>
          </ul>
        </div>
        <div className="audience audience-patients">
          <h2>{t('home.patTitle')}</h2>
          <p>{t('home.patText')}</p>
          <p>
            <Link className="btn" to={`/${lang}/patients/`}>{t('home.patCta')} →</Link>
          </p>
        </div>
      </section>

      <section className="section creator-card" aria-labelledby="h-creator">
        <Photo className="creator-photo" {...creator.photoSmall} alt={creator.name[lang]} />
        <div>
          <p className="eyebrow">{t('home.creatorTitle')}</p>
          <h2 id="h-creator">{creator.name[lang]}</h2>
          <p className="muted">{creator.degree[lang]}</p>
          <ul className="plain small">
            {creator.headline.map((h) => (
              <li key={h.en}>{h[lang]}</li>
            ))}
          </ul>
          <p>
            <Link to={`/${lang}/creator/`}>{t('home.creatorCta')} →</Link>
          </p>
        </div>
      </section>
    </article>
  )
}
