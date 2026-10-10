import { Link } from 'react-router-dom'
import { ModelBadge, ObservedBadge } from '../../components/ui'
import { atlas } from '../../data/atlas'
import { useLang, useT } from '../../i18n'

export default function ScienceIndex() {
  const t = useT()
  const lang = useLang()
  const ru = lang === 'ru'
  const s = atlas.stats
  const items: [string, string, string, boolean][] = [
    ['between-embryos/', t('fig3.title'), ru ? `Рисунок 3 обзора · ${s.fig3.n} значений, 7 вариантов` : `Review Figure 3 · ${s.fig3.n} values, 7 variants`, false],
    ['within-embryo/', t('fig4.title'), ru ? `Рисунок 4 · ${s.fig4.n_embryos} бластоцист + ${s.fig4.n_cleavage} эмбрионов дробления` : `Figure 4 · ${s.fig4.n_embryos} blastocysts + ${s.fig4.n_cleavage} cleavage embryos`, false],
    ['embryo-to-offspring/', t('fig5.title'), ru ? `Рисунок 5 · ${s.fig5.n_pairs} сопоставлений, ${s.fig5.n_children} детей` : `Figure 5 · ${s.fig5.n_pairs} comparisons, ${s.fig5.n_children} children`, false],
    ['pgt-mt-and-pgt-a/', t('fig6.title'), ru ? 'Рисунок 6 · сценарный расчёт' : 'Figure 6 · scenario calculation', true],
  ]
  return (
    <article>
      <h1>{t('nav.science')}</h1>
      <p className="lead">
        {ru
          ? 'Интерактивные версии рисунков 3–6 обзора. По умолчанию каждый рисунок показан так, как в статье; дополнительные фильтры помечены «вне рисунка статьи».'
          : 'Interactive versions of review Figures 3–6. By default each figure is shown as in the article; extra filters are labelled “not in the article figure”.'}
      </p>
      <div className="cards">
        {items.map(([to, title, sub, model]) => (
          <div className="card" key={to}>
            <Link className="stretch" to={`/${lang}/science/${to}`}>
              <p style={{ margin: '0 0 6px' }}>{model ? <ModelBadge /> : <ObservedBadge />}</p>
              <h3>{title}</h3>
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
