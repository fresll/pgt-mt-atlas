import { Link } from 'react-router-dom'
import { ModelBadge, ObservedBadge } from '../../components/ui'
import { atlas } from '../../data/atlas'
import { useLang, useT } from '../../i18n'
import { PageTitle } from '../../components/Layout'

export default function ScienceIndex() {
  const t = useT()
  const lang = useLang()
  const s = atlas.stats
  const items: [string, string, string, string, boolean][] = [
    ['heteroplasmy-landscape/', t('fig3.title'), t('fig3.subtitle'), t('interfaceCopy.ScienceIndex.copy1', { v0: s.fig3.n }), false],
    ['embryo-concordance/', t('fig4.title'), t('fig4.subtitle'), t('interfaceCopy.ScienceIndex.copy2', { v0: s.fig4.n_embryos, v1: s.fig4.n_cleavage }), false],
    ['embryo-to-offspring/', t('fig5.title'), t('fig5.subtitle'), t('interfaceCopy.ScienceIndex.copy3', { v0: s.fig5.n_pairs, v1: s.fig5.n_children }), false],
    ['pgt-mt-pgt-a-model/', t('fig6.title'), t('fig6.subtitle'), t('interfaceCopy.ScienceIndex.copy4'), true],
  ]
  return (
    <article>
      <PageTitle title={t('nav.science')} />
      <h1>{t('nav.science')}</h1>
      <p className="lead">
        {t('interfaceCopy.ScienceIndex.copy5')}
      </p>
      <div className="cards section-cards">
        {items.map(([to, title, subtitle, sub, model], i) => (
          <div className="card" key={to}>
            <Link className="stretch" to={`/${lang}/science/${to}`}>
              <p className="section-meta"><span className="section-no">{String(i + 1).padStart(2, '0')}</span>{model ? <ModelBadge /> : <ObservedBadge />}</p>
              <h3>{title}</h3>
              <p className="small">{subtitle}</p>
              <p className="muted small">{sub}</p>
            </Link>
          </div>
        ))}
      </div>
      <p>
        <Link to={`/${lang}/science/data/`}>{t('nav.data')}</Link> · <Link to={`/${lang}/science/cases/`}>{t('nav.cases')}</Link> ·{' '}
        <Link to={`/${lang}/science/sources/`}>{t('nav.sources')}</Link> · <Link to={`/${lang}/science/methods/`}>{t('nav.methods')}</Link>
      </p>
    </article>
  )
}
