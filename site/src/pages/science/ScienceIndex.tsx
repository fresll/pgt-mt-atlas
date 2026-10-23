import { Link } from 'react-router-dom'
import { ModelBadge, ObservedBadge } from '../../components/ui'
import { atlas } from '../../data/atlas'
import { useLang, useT } from '../../i18n'

export default function ScienceIndex() {
  const t = useT()
  const lang = useLang()
  const ru = lang === 'ru'
  const s = atlas.stats
  const items: [string, string, string, string, boolean][] = [
    ['heteroplasmy-landscape/', t('fig3.title'), t('fig3.subtitle'), ru ? `${s.fig3.n} значений, 7 вариантов мтДНК` : lang === 'es' ? `${s.fig3.n} valores, 7 variantes del ADNmt` : `${s.fig3.n} values, 7 mtDNA variants`, false],
    ['embryo-concordance/', t('fig4.title'), t('fig4.subtitle'), ru ? `${s.fig4.n_embryos} бластоцист + ${s.fig4.n_cleavage} эмбрионов дробления` : lang === 'es' ? `${s.fig4.n_embryos} blastocistos + ${s.fig4.n_cleavage} embriones en segmentación` : `${s.fig4.n_embryos} blastocysts + ${s.fig4.n_cleavage} cleavage embryos`, false],
    ['embryo-to-offspring/', t('fig5.title'), t('fig5.subtitle'), ru ? `${s.fig5.n_pairs} сопоставлений, ${s.fig5.n_children} детей` : lang === 'es' ? `${s.fig5.n_pairs} comparaciones, ${s.fig5.n_children} niños` : `${s.fig5.n_pairs} comparisons, ${s.fig5.n_children} children`, false],
    ['pgt-mt-pgt-a-model/', t('fig6.title'), t('fig6.subtitle'), ru ? 'сценарный расчёт' : lang === 'es' ? "cálculo por escenarios" : 'scenario calculation', true],
  ]
  return (
    <article>
      <h1>{t('nav.science')}</h1>
      <p className="lead">
        {ru
          ? 'Четыре научных раздела атласа. Каждый график открывается в базовом виде; дополнительные фильтры помечены «расширенный вид». Каждая точка ведёт к первичной публикации и строке исходной таблицы.'
          : lang === 'es' ? "Cuatro secciones científicas del Atlas. Cada gráfico se abre en su vista de referencia; los filtros adicionales se identifican como «vista ampliada». Cada punto remite a la publicación primaria y a la fila del libro de datos de origen." : 'Four scientific sections of the Atlas. Every chart opens in its reference view; extra filters are labelled “extended view”. Every point leads to the primary publication and the row of the source workbook.'}
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
