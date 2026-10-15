import { PubRef } from '../../components/ui'
import { atlas, label, pubById } from '../../data/atlas'
import { useLang, useT } from '../../i18n'
import { fmt } from '../../lib/format'
import { PageTitle } from '../../components/Layout'

export default function Methods() {
  const t = useT()
  const lang = useLang()
  const ru = lang === 'ru'
  const c = atlas.meta.current_counts
  const COUNT_LABEL: Record<string, [string, string]> = {
    landscape_values: ['значения гетероплазмии эмбрионов', 'embryo heteroplasmy values'],
    landscape_variants: ['варианты мтДНК в распределении гетероплазмии', 'mtDNA variants in the heteroplasmy landscape'],
    concordance_blastocysts: ['бластоцисты с измерениями нескольких фракций', 'blastocysts with several fractions measured'],
    concordance_records: ['записи по фракциям бластоцист', 'blastocyst fraction records'],
    cleavage_embryos: ['эмбрионы стадии дробления (два бластомера)', 'cleavage-stage embryos (two blastomeres)'],
    offspring_records: ['записи «эмбрион → потомство»', 'embryo → offspring records'],
    offspring_children: ['дети в записях «эмбрион → потомство»', 'children in embryo → offspring records'],
    offspring_children_exact_pair: ['дети с точной парой «перенесённый эмбрион — ткань»', 'children with an exact transferred-embryo–tissue pair'],
    publications: ['публикации', 'publications'],
  }
  const ROLE: Record<string, [string, string]> = {
    study_estimate: ['оценка риска в конкретном исследовании', 'risk estimate from a specific study'],
    programme_criterion: ['рабочий критерий клинической программы', 'working criterion of a clinical programme'],
    literature_range: ['диапазон, приводимый в литературе', 'range cited in the literature'],
    chart_convention: ['условное обозначение графика', 'chart convention'],
  }
  return (
    <article className="prose">
      <PageTitle title={t('methods.title')} />
      <h1>{t('methods.title')}</h1>

      <h2>{ru ? 'Что собрано' : 'What was collected'}</h2>
      <p>
        {ru
          ? `Значения гетероплазмии извлечены из первичных публикаций для эмбрионов, по которым опубликованы индивидуальные значения. В текущей версии: ${c.landscape_values} значений для ${c.landscape_variants} исследуемых вариантов мтДНК; ${c.concordance_blastocysts} бластоцист с измерениями нескольких фракций (биоптат ТЭ, ВКМ, оставшаяся ТЭ или объединённая фракция ВКМ+ТЭ); постимплантационные данные ${c.offspring_children_exact_pair} детей, для которых известен уровень в перенесённом эмбрионе. Значения берутся из первичных публикаций; обзоры использованы только там, где оригинал недоступен, и это отмечено.`
          : `Heteroplasmy values were extracted from primary publications for the embryos whose individual values were published. Current version: ${c.landscape_values} values for the ${c.landscape_variants} mtDNA variants included in the dataset; ${c.concordance_blastocysts} blastocysts with several fractions measured (TE biopsy, ICM, remaining TE or a combined ICM+TE fraction); post-implantation data for ${c.offspring_children_exact_pair} children whose transferred-embryo level is known. Values come from primary publications; reviews were used only where the original is unavailable, and this is flagged.`}
      </p>
      <p>
        {ru
          ? 'Публикации не всегда приводят значения для всех эмбрионов цикла, поэтому набор не равен полному числу эмбрионов в циклах. По объединённым случаям из разных публикаций нельзя рассчитать частоту клинического успеха ПГТ-мт.'
          : 'Publications do not always report values for every embryo of a cycle, so the dataset does not equal the full number of embryos in the cycles. A clinical success rate of PGT-mt cannot be calculated from cases pooled across publications.'}
      </p>

      <h2>{ru ? 'Объём данных' : 'Dataset size'}</h2>
      <div className="table-wrap">
        <table className="data" data-testid="release-counts">
          <thead><tr><th>{ru ? 'Показатель' : 'Measure'}</th><th>{ru ? 'Количество' : 'Count'}</th></tr></thead>
          <tbody>
            {Object.keys(COUNT_LABEL).map((k) => (
              <tr key={k}><td>{COUNT_LABEL[k][ru ? 0 : 1]}</td><td className="num">{c[k]}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>{ru ? 'Как представлены значения' : 'How values are represented'}</h2>
      <ul>
        <li>{ru ? '«0» означает, что вариант не выявлен использованным методом, а не доказанный молекулярный ноль. Предел обнаружения показывается, только если он указан в источнике.' : '“0” means the variant was not detected by the method used, not a proven molecular zero. The detection limit is shown only when the source states it.'}</li>
        <li>{ru ? 'Если опубликован только интервал, хранятся его границы; середина не подставляется.' : 'If only an interval was published, its bounds are stored; no midpoint is imputed.'}</li>
        <li>{ru ? 'Каждое значение помечено способом получения. Пометка ставится, только если правило записано в сопроводительной таблице:' : 'Every value carries how it was obtained. A label is set only if the rule is recorded in the supplementary workbook:'}</li>
      </ul>
      <ul>
        {Object.keys(atlas.labels.derivation).map((d) => (
          <li key={d}>
            <strong>{label('derivation', d, lang)}</strong> — {atlas.fig3.filter((o) => o.derivation === d).length} {ru ? 'значений в разделе «Распределение гетероплазмии»' : 'Heteroplasmy Landscape values'}
          </li>
        ))}
      </ul>
      <p>{ru ? 'Каждая точка на графиках ведёт к источнику значения и к публикации (DOI).' : 'Every point leads back to its row in the supplementary workbook and to the publication (DOI).'}</p>

      <h2>{ru ? 'Ориентиры на графиках' : 'Reference lines on the charts'}</h2>
      <ul>
        {atlas.thresholds.map((th) => (
          <li key={th.id}>
            <strong>{th.value !== undefined ? `${fmt(th.value, lang)}%` : `${th.range?.[0]}–${th.range?.[1]}%`}</strong> · <em>{ROLE[th.role]?.[ru ? 0 : 1]}</em> — {th[lang]}
            {th.publication && <> (<PubRef id={th.publication} />)</>}
            <br />
            <span className="small muted" lang="ru">{th.locator ? `${th.locator}. ` : ''}{ru ? 'Проверено' : 'Checked'}: {th.checked}</span>
          </li>
        ))}
      </ul>
      <p className="callout">{ru ? 'Ни одно из этих чисел не задаёт безопасного порога для отдельного эмбриона. Три числа, которыми пользуются на практике (18, 15–30 и 30%), отвечают на разные вопросы и получены на разных тканях, методах и исходах.' : 'None of these numbers defines a safe threshold for an individual embryo. The three numbers used in practice (18, 15–30 and 30%) answer different questions and come from different tissues, methods and outcomes.'}</p>

      <h2>{ru ? 'Ограничения' : 'Limitations'}</h2>
      <ul>
        <li>{ru ? 'Набор описательный и не позволяет провести мета-анализ: исследования различаются по стадии биопсии, методам измерения и пределам обнаружения.' : 'The dataset is descriptive and does not allow a meta-analysis: studies differ in biopsy stage, measurement methods and detection limits.'}</li>
        <li>{ru ? 'Удачные циклы публикуются чаще неудачных; данных для коррекции этого смещения нет.' : 'Successful cycles are published more often than unsuccessful ones; there are no data to correct for this bias.'}</li>
        <li>{ru ? 'Эмбрионы не являются независимыми наблюдениями: многие получены от одной пациентки в одном цикле; варианты представлены неравномерно. Объединённая доля не является индивидуальным риском.' : 'Embryos are not independent observations: many come from one patient in one cycle; variants are unevenly represented. A pooled share is not an individual risk.'}</li>
        <li>{ru ? 'В сопоставлениях «эмбрион — ребёнок» часть измерений относится к одному ребёнку (разные ткани, сроки, методы, лаборатории).' : 'In embryo–child comparisons several measurements belong to the same child (different tissues, ages, methods, laboratories).'}</li>
        <li>{ru ? 'Совместная модель ПГТ-мт и ПГТ-А — сценарный расчёт: она не учитывает внутрисемейную корреляцию и не даёт индивидуального прогноза.' : 'The PGT-mt × PGT-A Model is a scenario calculation: it ignores within-family correlation and gives no individual prediction.'}</li>
      </ul>

      <h2>{ru ? 'Классификация вариантов' : 'Variant classification'}</h2>
      <p>
        {ru
          ? 'Класс варианта указан по первичной публикации; Атлас не вводит собственный классификатор, в том числе по уровню гетероплазмии. Для каждого варианта указано, на каком утверждении первичной публикации основан класс, и дата проверки. Сверка с базами MITOMAP и ClinVar при этой проверке не выполнялась.'
          : 'The variant class is taken from the supplementary workbook; Atlas introduces no classifier of its own, including one based on heteroplasmy level. For every variant the statement of the primary publication on which the class rests and the date of the check are given. The variants were not checked against MITOMAP or ClinVar in this review.'}
      </p>
      <div className="table-wrap">
        <table className="data" data-testid="variant-classes">
          <thead><tr><th>{ru ? 'Вариант' : 'Variant'}</th><th>{ru ? 'Класс' : 'Class'}</th><th>{ru ? 'Основание' : 'Basis'}</th></tr></thead>
          <tbody>
            {Object.entries(atlas.variant_classes).map(([v, x]) => (
              <tr key={v}>
                <td>{v}</td>
                <td>{label('variant_class', x.class, lang)}</td>
                <td className="small">{t(`common.classBasis.${x.status}`, { source: pubById[x.publication]?.short ?? x.publication, locator: x.locator ?? '', date: x.checked })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>{ru ? 'Что публиковать о цикле ПГТ-мт' : 'What to report about a PGT-mt cycle'}</h2>
      <ol>
        <li>{ru ? 'Пациентка и цикл: возраст; семейный анамнез; гетероплазмия в тканях носительницы; число ооцитов; оплодотворение и развитие эмбрионов.' : 'Patient and cycle: age; family history; carrier tissue heteroplasmy; number of oocytes; fertilisation and embryo development.'}</li>
        <li>{ru ? 'Эмбрион: день биопсии; морфология; результат ПГТ-А; гетероплазмия в каждом образце — по каждому эмбриону, включая не перенесённые.' : 'Embryo: biopsy day; morphology; PGT-A result; heteroplasmy in every sample — for every embryo, including those not transferred.'}</li>
        <li>{ru ? 'Метод: полногеномная амплификация; анализируемый участок; линейность; предел обнаружения; контроли.' : 'Method: whole-genome amplification; target region; linearity; detection limit; controls.'}</li>
        <li>{ru ? 'Исход: пренатальная диагностика и постнатальное наблюдение с указанием ткани, возраста и метода.' : 'Outcome: prenatal diagnosis and postnatal follow-up with tissue, age and method.'}</li>
      </ol>

    </article>
  )
}
