import { Link } from 'react-router-dom'
import { ModelBadge, ObservedBadge } from '../../components/ui'
import { atlas } from '../../data/atlas'
import { useLang, useT } from '../../i18n'
import { PageTitle } from '../../components/Layout'

export default function ScienceIndex() {
  const t = useT()
  const lang = useLang()
  const ru = lang === 'ru'
  const s = atlas.stats
  const items: [string, string, string, string, boolean][] = [
    ['heteroplasmy-landscape/', t('fig3.title'), t('fig3.subtitle'), ru ? `${s.fig3.n} значений, 7 вариантов мтДНК` : `${s.fig3.n} values, 7 mtDNA variants`, false],
    ['embryo-concordance/', t('fig4.title'), t('fig4.subtitle'), ru ? `${s.fig4.n_embryos} бластоцист + ${s.fig4.n_cleavage} эмбрионов дробления` : `${s.fig4.n_embryos} blastocysts + ${s.fig4.n_cleavage} cleavage embryos`, false],
    ['embryo-to-offspring/', t('fig5.title'), t('fig5.subtitle'), ru ? `${s.fig5.n_pairs} сопоставлений, ${s.fig5.n_children} плодов и детей` : `${s.fig5.n_pairs} comparisons, ${s.fig5.n_children} fetuses and children`, false],
    ['pgt-mt-pgt-a-model/', t('fig6.title'), t('fig6.subtitle'), ru ? 'сценарный расчёт' : 'scenario calculation', true],
  ]
  return (
    <article>
      <PageTitle title={t('nav.science')} />
      <h1>{t('nav.science')}</h1>
      <p className="lead">
        {ru
          ? 'Четыре научных раздела атласа. Каждый график открывается в базовом виде; дополнительные фильтры помечены «расширенный вид». Каждая точка ведёт к первичной публикации и строке исходной таблицы.'
          : 'Four scientific sections of the Atlas. Every chart opens in its reference view; extra filters are labelled “extended view”. Every point leads to the primary publication and the row of the source workbook.'}
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
