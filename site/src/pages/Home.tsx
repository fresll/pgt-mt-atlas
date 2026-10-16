import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { HandRule, Illustration } from '../components/Sketch'
import { plural } from '../lib/format'
import { atlas } from '../data/atlas'
import { useCountWord, useLang, useT } from '../i18n'
import labels from '../illustrations/labels.json'

export default function Home() {
  const t = useT()
  const word = useCountWord()
  const lang = useLang()
  const s = atlas.stats
  const sci = `/${lang}/science/`
  const sections: [string, string, string, boolean][] = [
    ['heteroplasmy-landscape/', 'landscape.title', 'landscape.subtitle', false],
    ['embryo-concordance/', 'concordance.title', 'concordance.subtitle', false],
    ['embryo-to-offspring/', 'offspring.title', 'offspring.subtitle', false],
    ['pgt-mt-pgt-a-model/', 'model.title', 'model.subtitle', true],
  ]
  const ledger: [number, string][] = [
    [s.fig3.n, t('home.k1')],
    [s.fig4.n_embryos, t('home.k2', { icm: new Set(atlas.concordance.filter((f) => f.fraction === 'icm').map((f) => f.embryo)).size, word: plural(s.fig4.n_embryos, lang, lang === 'ru' ? ['бластоциста', 'бластоцисты', 'бластоцист'] : ['blastocyst', 'blastocysts', 'blastocysts']) })],
    [s.fig5.n_pairs, t('home.k3', { children: s.fig5.n_children, ndChildren: s.fig5.n_both_nd_children, word: word(s.fig5.n_pairs, 'comparison') })],
    [atlas.publications.length, t('home.k4', { doi: atlas.publications.filter((p) => p.doi).length, word: plural(atlas.publications.length, lang, lang === 'ru' ? ['публикация', 'публикации', 'публикаций'] : ['publication', 'publications', 'publications']) })],
  ]
  return (
    <article className="sk-home">
      <section className="sk-hero">
        <div className="sk-hero-text">
          <h1>
            {lang === 'ru' ? <>Атлас<br /><em>ПГТ-мт</em></> : <>PGT-mt <em>Atlas</em></>}
          </h1>
          <HandRule className="sk-title-rule" />
          <p className="sk-subtitle">{t('site.tagline')}</p>
          <div className="sk-actions">
            <Link className="sk-btn" to={`/${lang}/patients/`}>
              {t('home.ctaPatients')} <span aria-hidden="true">→</span>
            </Link>
            <Link className="sk-btn" to={sci}>
              {t('home.ctaSpecialists')} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <figure className="sk-hero-figure" role="img" aria-label={t('home.figCaption')}>
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
        </figure>
      </section>

      <section className="sk-section sk-audiences">
        <div>
          <h2>
            <Link to={`/${lang}/patients/`}>{t('home.patTitle')}</Link>
          </h2>
          <p>{t('home.patText')}</p>
        </div>
        <div>
          <h2>
            <Link to={`/${lang}/fundamentals/`}>{t('home.fundTitle')}</Link>
          </h2>
          <p>{t('home.fundText')}</p>
        </div>
        <div>
          <h2>
            <Link to={sci}>{t('home.sciTitle')}</Link>
          </h2>
          <p>{t('home.sciText')}</p>
        </div>
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
            <Link className="sk-link" to={`/${lang}/contribute/`}>{t('nav.contribute')}</Link>
          </div>
        </div>
      </section>
    </article>
  )
}
