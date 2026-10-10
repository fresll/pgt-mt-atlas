import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { HandRule, Illustration } from '../components/Sketch'
import { atlas } from '../data/atlas'
import { useLang, useT } from '../i18n'
import labels from '../illustrations/labels.json'

export default function Home() {
  const t = useT()
  const lang = useLang()
  const s = atlas.stats
  const sci = `/${lang}/science/`
  const sections: [string, string, string, boolean][] = [
    ['heteroplasmy-landscape/', 'fig3.title', 'fig3.subtitle', false],
    ['embryo-concordance/', 'fig4.title', 'fig4.subtitle', false],
    ['embryo-to-offspring/', 'fig5.title', 'fig5.subtitle', false],
    ['pgt-mt-pgt-a-model/', 'fig6.title', 'fig6.subtitle', true],
  ]
  const ledger: [number, string][] = [
    [s.fig3.n, t('home.k1')],
    [s.fig4.n_embryos, t('home.k2')],
    [s.fig5.n_pairs, t('home.k3', { children: s.fig5.n_children })],
    [atlas.publications.length, t('home.k4')],
  ]
  return (
    <article className="sk-home">
      <section className="sk-hero">
        <div className="sk-hero-text">
          <p className="sk-kicker">{t('home.kicker')}</p>
          <h1>
            PGT-mt <em>Atlas</em>
          </h1>
          <HandRule className="sk-title-rule" />
          <p className="sk-subtitle">{t('site.tagline')}</p>
          <div className="sk-actions">
            <Link className="sk-btn" to={`${sci}data/`}>
              {t('home.explore')} <span aria-hidden="true">→</span>
            </Link>
            <Link className="sk-link" to={sci}>{t('home.allSections')}</Link>
            <Link className="sk-link" to={`/${lang}/patients/`}>{t('home.patTitle')}</Link>
          </div>
          <p className="sk-signature">
            <Link to={`/${lang}/ilya-mazunin/`}>{t('site.curated')}</Link>
          </p>
        </div>
        <figure className="sk-hero-figure">
          <div className="sk-plate">
            <Illustration name="hero" />
            {labels.hero.map((l) => (
              <span
                key={l.key}
                className={`sk-label ${l.align} ${l.tone === 'r' ? 'red' : ''}`}
                style={{ '--x': `${l.x}%`, '--y': `${l.y}%` } as CSSProperties}
                aria-hidden="true"
              >
                {t(`home.labels.${l.key}`)}
              </span>
            ))}
          </div>
          <figcaption>{t('home.figCaption')}</figcaption>
        </figure>
      </section>

      <section className="sk-section sk-about" aria-labelledby="sk-about">
        <header className="sk-margin">
          <h2 id="sk-about">{t('home.aboutTitle')}</h2>
          <p className="sk-note">{t('home.aboutNote')}</p>
        </header>
        <div>
          <p className="sk-lead">{t('home.lead')}</p>
          <dl className="sk-ledger">
            {ledger.map(([n, label]) => (
              <div key={label}>
                <dt>{n}</dt>
                <dd>{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="sk-section sk-sections" aria-labelledby="sk-sections">
        <header className="sk-margin">
          <h2 id="sk-sections">{t('home.sectionsTitle')}</h2>
          <p className="sk-note">{t('home.sectionsNote')}</p>
        </header>
        <div className="sk-sections-body">
          <ol className="sk-index">
            {sections.map(([to, title, sub, model], i) => (
              <li key={to}>
                <span className="sk-no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <Link to={`${sci}${to}`}>{t(title)}</Link>
                  <p>{t(sub)}</p>
                  <span className={`sk-kind ${model ? 'model' : 'observed'}`}>{t(model ? 'badge.model' : 'badge.observed')}</span>
                </div>
              </li>
            ))}
          </ol>
          <figure className="sk-side-figure">
            <Illustration name="teBiopsy" />
            <figcaption>{t('home.biopsyCaption')}</figcaption>
          </figure>
        </div>
      </section>

      <section className="sk-section sk-data" aria-labelledby="sk-data">
        <figure className="sk-data-figure">
          <Illustration name="mitochondrion" />
          <figcaption>{t('home.mitoCaption')}</figcaption>
        </figure>
        <div>
          <h2 id="sk-data">{t('home.dataTitle')}</h2>
          <p className="sk-lead">{t('home.dataText')}</p>
          <div className="sk-actions">
            <Link className="sk-btn" to={`${sci}data/`}>
              {t('home.explore')} <span aria-hidden="true">→</span>
            </Link>
            <Link className="sk-link" to={`${sci}sources/`}>{t('home.sourcesLink')}</Link>
            <Link className="sk-link" to={`${sci}methods/`}>{t('home.methodsLink')}</Link>
          </div>
        </div>
      </section>

      <section className="sk-section sk-audiences">
        <div>
          <h2>
            <Link to={sci}>{t('home.sciTitle')}</Link>
          </h2>
          <p>{t('home.sciText')}</p>
        </div>
        <div>
          <h2>
            <Link to={`/${lang}/patients/`}>{t('home.patTitle')}</Link>
          </h2>
          <p>{t('home.patText')}</p>
        </div>
      </section>

      <section className="sk-section sk-curator">
        <img src={`${import.meta.env.BASE_URL}img/ilya-mazunin.jpg`} alt={t('curator.title')} width={96} height={120} />
        <div>
          <p className="sk-note">{t('curator.role')}</p>
          <p className="sk-curator-name">{t('curator.title')}</p>
          <p>{t('home.curatorBio')}</p>
          <Link className="sk-link" to={`/${lang}/ilya-mazunin/`}>{t('home.biography')}</Link>
        </div>
      </section>

    </article>
  )
}
