import { Link } from 'react-router-dom'
import { ModelBadge, ObservedBadge } from '../../components/ui'
import { atlas } from '../../data/atlas'
import { useCountWord, useLang, useT } from '../../i18n'
import { PageTitle } from '../../components/Layout'

export default function ScienceIndex() {
  const t = useT()
  const word = useCountWord()
  const lang = useLang()
  const s = atlas.stats
  const items: [string, string, string, string, boolean][] = [
    ['heteroplasmy-landscape/', t('landscape.title'), t('landscape.subtitle'), t('interfaceCopy.ScienceIndex.landscapeSummary', { v0: s.fig3.n, values: word(s.fig3.n, 'value'), variants: atlas.meta.current_counts.landscape_variants, variantWord: word(atlas.meta.current_counts.landscape_variants, 'variant') }), false],
    ['embryo-concordance/', t('concordance.title'), t('concordance.subtitle'), t('interfaceCopy.ScienceIndex.concordanceSummary', { v0: s.fig4.n_embryos, v1: s.fig4.n_cleavage, blastocysts: word(s.fig4.n_embryos, 'blastocyst'), embryos: word(s.fig4.n_cleavage, 'embryo') }), false],
    ['embryo-to-offspring/', t('offspring.title'), t('offspring.subtitle'), t('interfaceCopy.ScienceIndex.offspringSummary', { v0: s.fig5.n_pairs, v1: s.fig5.n_children, comparisons: word(s.fig5.n_pairs, 'comparison') }), false],
    ['pgt-mt-pgt-a-model/', t('model.title'), t('model.subtitle'), t('interfaceCopy.ScienceIndex.scenarioSummary'), true],
  ]
  return (
    <article>
      <PageTitle title={t('nav.science')} />
      <h1>{t('nav.science')}</h1>
      <p className="lead">
        {t('interfaceCopy.ScienceIndex.lead')}
      </p>
      <p className="small">{t('offspring.bothNDChildren', { children: s.fig5.n_both_nd_children, pairs: s.fig5.n_both_nd_pairs })}</p>
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
