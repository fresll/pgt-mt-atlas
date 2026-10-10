import { Link } from 'react-router-dom'
import { ModelBadge, ObservedBadge } from '../components/ui'
import { atlas } from '../data/atlas'
import { useLang, useT } from '../i18n'

export default function Home() {
  const t = useT()
  const lang = useLang()
  const ru = lang === 'ru'
  const s = atlas.stats
  const sections: [string, string, string, boolean][] = [
    ['heteroplasmy-landscape/', 'fig3.title', 'fig3.subtitle', false],
    ['embryo-concordance/', 'fig4.title', 'fig4.subtitle', false],
    ['embryo-to-offspring/', 'fig5.title', 'fig5.subtitle', false],
    ['pgt-mt-pgt-a-model/', 'fig6.title', 'fig6.subtitle', true],
  ]
  return (
    <article>
      <section className="hero">
        <p className="eyebrow">{ru ? 'Международная научная база данных' : 'International scientific database'}</p>
        <h1>{t('site.title')}</h1>
        <p className="lead">{t('site.tagline')}</p>
        <div className="hero-actions">
          <Link className="btn primary" to={`/${lang}/science/`}>{t('home.sciTitle')} →</Link>
          <Link className="btn secondary" to={`/${lang}/science/data/`}>{t('nav.data')}</Link>
          <Link className="btn secondary" to={`/${lang}/patients/`}>{t('home.patTitle')}</Link>
        </div>
        <p className="curated">
          <Link to={`/${lang}/ilya-mazunin/`}>{t('site.curated')}</Link>
        </p>
      </section>

      <p className="prose" style={{ marginTop: 28 }}>{t('home.lead')}</p>
      <div className="stats">
        <div className="stat"><div className="num">{s.fig3.n}</div><div className="lbl">{t('home.k1')}</div></div>
        <div className="stat"><div className="num">{s.fig4.n_embryos}</div><div className="lbl">{t('home.k2')}</div></div>
        <div className="stat"><div className="num">{s.fig5.n_pairs}</div><div className="lbl">{t('home.k3', { children: s.fig5.n_children })}</div></div>
        <div className="stat"><div className="num">{atlas.publications.length}</div><div className="lbl">{ru ? 'первичных и справочных публикаций с DOI и авторством' : 'primary and reference publications with DOI and authorship'}</div></div>
      </div>

      <section className="home-section">
        <h2>{ru ? 'Научные разделы' : 'Scientific sections'}</h2>
        <div className="cards section-cards">
          {sections.map(([to, title, sub, model], i) => (
            <div className="card" key={to}>
              <Link className="stretch" to={`/${lang}/science/${to}`}>
                <p className="section-meta"><span className="section-no">{String(i + 1).padStart(2, '0')}</span>{model ? <ModelBadge /> : <ObservedBadge />}</p>
                <h3>{t(title)}</h3>
                <p className="small muted" style={{ margin: 0 }}>{t(sub)}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="cards">
          <div className="card">
            <Link className="stretch" to={`/${lang}/science/`}>
              <h3>{t('home.sciTitle')} →</h3>
              <p style={{ margin: 0 }}>{t('home.sciText')}</p>
            </Link>
          </div>
          <div className="card">
            <Link className="stretch" to={`/${lang}/patients/`}>
              <h3>{t('home.patTitle')} →</h3>
              <p style={{ margin: 0 }}>{t('home.patText')}</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="card curator-teaser">
          <img src={`${import.meta.env.BASE_URL}img/ilya-mazunin.jpg`} alt={ru ? 'Илья Мазунин' : 'Ilya Mazunin'} width={112} height={140} />
          <div>
            <p className="eyebrow">{t('curator.role')}</p>
            <h3 style={{ margin: '0 0 6px' }}>{t('curator.title')}</h3>
            <p className="small" style={{ margin: '0 0 8px' }}>
              {ru
                ? 'Генетик, доктор биологических наук; заведующий кафедрой биологии и генетики Медицинского университета Петровского; Сколтех.'
                : 'Geneticist, DSc; Head of the Department of Biology and Genetics, Petrovsky Medical University; Skoltech.'}
            </p>
            <Link to={`/${lang}/ilya-mazunin/`}>{ru ? 'Научная биография →' : 'Scientific biography →'}</Link>
          </div>
        </div>
      </section>

      <div className="callout" style={{ marginTop: 28 }}>{t('home.caveat')}</div>
    </article>
  )
}
