import { PubRef } from '../../components/ui'
import { atlas, label, pubById } from '../../data/atlas'
import { useLang, useT } from '../../i18n'
import { fmt } from '../../lib/format'

export default function Methods() {
  const t = useT()
  const lang = useLang()
  const ru = lang === 'ru'
  const c = atlas.meta.current_counts
  const base = atlas.meta.baseline
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
      <h1>{t('methods.title')}</h1>

      <h2>{ru ? 'Что собрано' : lang === 'es' ? "Qu\u00E9 se ha recopilado" : 'What was collected'}</h2>
      <p>
        {ru
          ? `Значения гетероплазмии извлечены из первичных публикаций для эмбрионов, по которым опубликованы индивидуальные значения. В текущей версии: ${c.landscape_values} значений для ${c.landscape_variants} исследуемых вариантов мтДНК; ${c.concordance_blastocysts} бластоцист с измерениями нескольких фракций (биоптат ТЭ, ВКМ, оставшаяся ТЭ или объединённая фракция ВКМ+ТЭ); постимплантационные данные ${c.offspring_children_exact_pair} детей, для которых известен уровень в перенесённом эмбрионе. Значения берутся из первичных публикаций; обзоры использованы только там, где оригинал недоступен, и это отмечено.`
          : lang === 'es' ? `Los valores de heteroplasmia se extrajeron de publicaciones primarias para los embriones con valores individuales publicados. Versi\u00F3n actual: ${c.landscape_values} valores para las ${c.landscape_variants} variantes de ADNmt incluidas en el conjunto de datos; ${c.concordance_blastocysts} blastocistos con varias fracciones medidas (biopsia TE, ICM, TE restante o fracci\u00F3n combinada ICM+TE); datos posteriores a la implantaci\u00F3n de ${c.offspring_children_exact_pair} ni\u00F1os de los que se conoce el nivel del embri\u00F3n transferido. Los valores proceden de publicaciones primarias; solo se utilizaron revisiones cuando el original no estaba disponible, y se indica expresamente.` : `Heteroplasmy values were extracted from primary publications for the embryos whose individual values were published. Current version: ${c.landscape_values} values for the ${c.landscape_variants} mtDNA variants included in the dataset; ${c.concordance_blastocysts} blastocysts with several fractions measured (TE biopsy, ICM, remaining TE or a combined ICM+TE fraction); post-implantation data for ${c.offspring_children_exact_pair} children whose transferred-embryo level is known. Values come from primary publications; reviews were used only where the original is unavailable, and this is flagged.`}
      </p>
      <p>
        {ru
          ? 'Публикации не всегда приводят значения для всех эмбрионов цикла, поэтому набор не равен полному числу эмбрионов в циклах. По объединённым случаям из разных публикаций нельзя рассчитать частоту клинического успеха ПГТ-мт.'
          : lang === 'es' ? "Las publicaciones no siempre comunican los valores de todos los embriones de un ciclo, por lo que el conjunto de datos no equivale al n\u00FAmero total de embriones de los ciclos. No puede calcularse una tasa de \u00E9xito cl\u00EDnico del PGT-mt a partir de casos agrupados de distintas publicaciones." : 'Publications do not always report values for every embryo of a cycle, so the dataset does not equal the full number of embryos in the cycles. A clinical success rate of PGT-mt cannot be calculated from cases pooled across publications.'}
      </p>

      <h2>{ru ? 'Версии набора' : lang === 'es' ? "Versiones del conjunto de datos" : 'Dataset versions'}</h2>
      <p>
        {ru
          ? `Atlas обновляется: число наблюдений меняется по мере добавления публикаций и корректировок. Исходная зафиксированная версия — ${base.version} (${base.label.ru}); её счётчики воспроизводятся эталонными тестами по исходной таблице. Каждая запись имеет стабильный идентификатор (HL-…, EC-…, CL-…), не зависящий от номера строки исходной таблицы; прежние идентификаторы (f3-…, f4-…, cl-…) сохранены как алиасы и находятся поиском на странице «Данные».`
          : lang === 'es' ? `El Atlas se actualiza: el n\u00FAmero de observaciones cambia al a\u00F1adir publicaciones y correcciones. La versi\u00F3n inicial congelada es ${base.version} (${base.label.en}); sus recuentos se reproducen mediante pruebas de referencia a partir del libro de datos original. Cada registro tiene un identificador estable (HL-\u2026, EC-\u2026, CL-\u2026) que no depende de la fila del libro de origen; los identificadores anteriores (f3-\u2026, f4-\u2026, cl-\u2026) se conservan como alias y se pueden buscar en la p\u00E1gina Datos.` : `Atlas is updated: the number of observations changes as publications and corrections are added. The initial frozen version is ${base.version} (${base.label.en}); its counts are reproduced by golden tests from the original workbook. Every record has a stable identifier (HL-…, EC-…, CL-…) that does not depend on the row number of the source workbook; former identifiers (f3-…, f4-…, cl-…) are kept as aliases and can be found with the search on the Data page.`}
      </p>
      <div className="table-wrap">
        <table className="data" data-testid="release-counts">
          <thead><tr><th></th><th>{ru ? 'Исходная версия' : lang === 'es' ? "Versi\u00F3n inicial" : 'Initial version'} {base.version}</th><th>{ru ? 'Текущая версия' : lang === 'es' ? "Versi\u00F3n actual" : 'Current version'}</th></tr></thead>
          <tbody>
            {Object.keys(base.counts).map((k) => (
              <tr key={k}><td>{COUNT_LABEL[k]?.[ru ? 0 : 1] ?? k}</td><td className="num">{base.counts[k]}</td><td className="num">{c[k]}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul>
        {atlas.meta.changes.map((ch, i) => <li key={i}>{ch.date}: {ch[lang]}</li>)}
      </ul>

      <h2>{ru ? 'Как представлены значения' : lang === 'es' ? "C\u00F3mo se representan los valores" : 'How values are represented'}</h2>
      <ul>
        <li>{ru ? '«0» означает, что вариант не выявлен использованным методом, а не доказанный молекулярный ноль. Предел обнаружения показывается, только если он указан в источнике.' : lang === 'es' ? "\u00AB0\u00BB significa que el m\u00E9todo utilizado no detect\u00F3 la variante, no que se haya demostrado un cero molecular. El l\u00EDmite de detecci\u00F3n solo se muestra si la fuente lo indica." : '“0” means the variant was not detected by the method used, not a proven molecular zero. The detection limit is shown only when the source states it.'}</li>
        <li>{ru ? 'Если опубликован только интервал, хранятся его границы; середина не подставляется.' : lang === 'es' ? "Si solo se public\u00F3 un intervalo, se conservan sus l\u00EDmites; no se imputa un punto medio." : 'If only an interval was published, its bounds are stored; no midpoint is imputed.'}</li>
        <li>{ru ? 'Каждое значение помечено способом получения. Пометка ставится, только если правило записано в сопроводительной таблице:' : lang === 'es' ? "Cada valor indica c\u00F3mo se obtuvo. Solo se asigna una etiqueta si la regla est\u00E1 registrada en el libro de datos complementarios:" : 'Every value carries how it was obtained. A label is set only if the rule is recorded in the supplementary workbook:'}</li>
      </ul>
      <ul>
        {Object.keys(atlas.labels.derivation).map((d) => (
          <li key={d}>
            <strong>{label('derivation', d, lang)}</strong> — {atlas.fig3.filter((o) => o.derivation === d).length} {ru ? 'значений в разделе «Распределение гетероплазмии»' : lang === 'es' ? "valores de Distribuci\u00F3n de la heteroplasmia" : 'Heteroplasmy Landscape values'}
          </li>
        ))}
      </ul>
      <p>{ru ? 'Каждая точка на графиках ведёт к строке сопроводительной таблицы и к публикации (DOI).' : lang === 'es' ? "Cada punto remite a su fila del libro de datos complementarios y a la publicaci\u00F3n (DOI)." : 'Every point leads back to its row in the supplementary workbook and to the publication (DOI).'}</p>

      <h2>{ru ? 'Ориентиры на графиках' : lang === 'es' ? "L\u00EDneas de referencia de los gr\u00E1ficos" : 'Reference lines on the charts'}</h2>
      <ul>
        {atlas.thresholds.map((th) => (
          <li key={th.id}>
            <strong>{th.value !== undefined ? `${fmt(th.value, lang)}%` : `${th.range?.[0]}–${th.range?.[1]}%`}</strong> · <em>{ROLE[th.role]?.[ru ? 0 : 1]}</em> — {th[lang]}
            {th.publication && <> (<PubRef id={th.publication} />)</>}
            <br />
            <span className="small muted" lang="ru">{th.locator ? `${th.locator}. ` : ''}{ru ? 'Проверено' : lang === 'es' ? "Comprobado" : 'Checked'}: {th.checked}</span>
          </li>
        ))}
      </ul>
      <p className="callout">{ru ? 'Ни одно из этих чисел не задаёт безопасного порога для отдельного эмбриона. Три числа, которыми пользуются на практике (18, 15–30 и 30%), отвечают на разные вопросы и получены на разных тканях, методах и исходах.' : lang === 'es' ? "Ninguna de estas cifras define un umbral seguro para un embri\u00F3n individual. Las tres cifras utilizadas en la pr\u00E1ctica (18, 15\u201330 y 30\u00A0%) responden a preguntas distintas y proceden de tejidos, m\u00E9todos y desenlaces diferentes." : 'None of these numbers defines a safe threshold for an individual embryo. The three numbers used in practice (18, 15–30 and 30%) answer different questions and come from different tissues, methods and outcomes.'}</p>

      <h2>{ru ? 'Ограничения' : lang === 'es' ? "Limitaciones" : 'Limitations'}</h2>
      <ul>
        <li>{ru ? 'Набор описательный и не позволяет провести мета-анализ: исследования различаются по стадии биопсии, методам измерения и пределам обнаружения.' : lang === 'es' ? "El conjunto de datos es descriptivo y no permite realizar un metaan\u00E1lisis: los estudios difieren en el estadio de biopsia, los m\u00E9todos de medida y los l\u00EDmites de detecci\u00F3n." : 'The dataset is descriptive and does not allow a meta-analysis: studies differ in biopsy stage, measurement methods and detection limits.'}</li>
        <li>{ru ? 'Удачные циклы публикуются чаще неудачных; данных для коррекции этого смещения нет.' : lang === 'es' ? "Los ciclos con \u00E9xito se publican con m\u00E1s frecuencia que los que no lo tienen; no hay datos para corregir este sesgo." : 'Successful cycles are published more often than unsuccessful ones; there are no data to correct for this bias.'}</li>
        <li>{ru ? 'Эмбрионы не являются независимыми наблюдениями: многие получены от одной пациентки в одном цикле; варианты представлены неравномерно. Объединённая доля не является индивидуальным риском.' : lang === 'es' ? "Los embriones no son observaciones independientes: muchos proceden de una misma paciente y un mismo ciclo; las variantes est\u00E1n representadas de forma desigual. Una proporci\u00F3n agrupada no es un riesgo individual." : 'Embryos are not independent observations: many come from one patient in one cycle; variants are unevenly represented. A pooled share is not an individual risk.'}</li>
        <li>{ru ? 'В сопоставлениях «эмбрион — ребёнок» часть измерений относится к одному ребёнку (разные ткани, сроки, методы, лаборатории).' : lang === 'es' ? "En las comparaciones embri\u00F3n\u2013ni\u00F1o, varias mediciones pertenecen al mismo ni\u00F1o (distintos tejidos, edades, m\u00E9todos y laboratorios)." : 'In embryo–child comparisons several measurements belong to the same child (different tissues, ages, methods, laboratories).'}</li>
        <li>{ru ? 'Совместная модель ПГТ-мт и ПГТ-А — сценарный расчёт: она не учитывает внутрисемейную корреляцию и не даёт индивидуального прогноза.' : lang === 'es' ? "El Modelo conjunto de PGT-mt y PGT-A es un c\u00E1lculo por escenarios: no tiene en cuenta la correlaci\u00F3n intrafamiliar ni ofrece un pron\u00F3stico individual." : 'The PGT-mt × PGT-A Model is a scenario calculation: it ignores within-family correlation and gives no individual prediction.'}</li>
      </ul>

      <h2>{ru ? 'Сверка с опубликованными материалами и корректировки' : lang === 'es' ? "Comprobaciones con el material publicado y correcciones" : 'Checks against published material and corrections'}</h2>
      <p>
        {ru
          ? 'Значения Tofilo et al., 2026 при каждой сборке сверяются с опубликованным ESM 2; без этого файла сборка останавливается. Сверка выявила два расхождения значения (эмбрион 6) и два расхождения категории фракции (эмбрионы 3 и 4: в ESM 2 — объединённая фракция ВКМ+ТЭ). Они исправлены прозрачным слоем корректировок: исходная таблица не изменяется, исходное значение хранится рядом с исправленным, у каждой корректировки указан источник и точное место в нём. Зависимые статистики пересчитаны из исправленного набора.'
          : lang === 'es' ? "Los valores de Tofilo et al., 2026 se comprueban con el ESM 2 publicado en cada compilaci\u00F3n; sin este archivo se detiene la compilaci\u00F3n. La comprobaci\u00F3n encontr\u00F3 dos diferencias de valor (embri\u00F3n 6) y dos de categor\u00EDa de fracci\u00F3n (embriones 3 y 4: el ESM 2 indica una fracci\u00F3n combinada ICM+TE). Se corrigen mediante una capa de correcciones transparente: el libro de origen no se modifica, el valor original se conserva junto al corregido y cada correcci\u00F3n indica su fuente y localizaci\u00F3n exacta. Las estad\u00EDsticas dependientes se recalculan a partir del conjunto corregido." : 'Values from Tofilo et al., 2026 are checked against the published ESM 2 on every build; without this file the build stops. The check found two value differences (embryo 6) and two fraction-category differences (embryos 3 and 4: ESM 2 reports a combined ICM+TE fraction). They are corrected by a transparent correction layer: the source workbook is not changed, the original value is stored next to the corrected one, and every correction names its source and exact location. Dependent statistics are recalculated from the corrected dataset.'}
      </p>
      <div className="table-wrap">
        <table className="data" data-testid="corrections">
          <thead><tr><th>{ru ? 'Запись' : lang === 'es' ? "Registro" : 'Record'}</th><th>{ru ? 'Было (исходная таблица)' : lang === 'es' ? "Anterior (libro de origen)" : 'Was (source workbook)'}</th><th>{ru ? 'Стало' : lang === 'es' ? "Actual" : 'Now'}</th><th>{ru ? 'Источник и место' : lang === 'es' ? "Fuente y localizaci\u00F3n" : 'Source and location'}</th></tr></thead>
          <tbody>
            {atlas.corrections.map((x) => {
              const show = (v: number | string) => (x.field === 'fraction' ? label('fraction', String(v), lang) : `${fmt(Number(v), lang)}%`)
              return (
                <tr key={x.id}>
                  <td>{x.target.embryo} · {label('fraction', x.target.fraction, lang)}</td>
                  <td className="num">{show(x.from)}</td>
                  <td className="num"><strong>{show(x.to)}</strong></td>
                  <td className="small" lang="ru">{x.source.document}; {x.source.locator}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="small">
        {ru
          ? `Медиана размаха внутри эмбриона для патогенных бластоцист: ${fmt(atlas.stats.fig4.median_range_pathogenic, lang)} п.п. после корректировок (по исходной таблице — ${fmt(atlas.stats.fig4_source_xlsx.median_range_pathogenic, lang)} п.п.).`
          : lang === 'es' ? `Mediana de la amplitud intraembrionaria de los blastocistos con variantes patog\u00E9nicas: ${fmt(atlas.stats.fig4.median_range_pathogenic, lang)} p. p. tras las correcciones (${fmt(atlas.stats.fig4_source_xlsx.median_range_pathogenic, lang)} p. p. seg\u00FAn el libro de origen).` : `Median within-embryo range for pathogenic blastocysts: ${fmt(atlas.stats.fig4.median_range_pathogenic, lang)} pp after corrections (${fmt(atlas.stats.fig4_source_xlsx.median_range_pathogenic, lang)} pp from the source workbook).`}
      </p>

      <h2>{ru ? 'Классификация вариантов' : lang === 'es' ? "Clasificaci\u00F3n de las variantes" : 'Variant classification'}</h2>
      <p>
        {ru
          ? 'Класс варианта взят из сопроводительной таблицы; Atlas не вводит собственный классификатор, в том числе по уровню гетероплазмии. Для каждого варианта указано, на каком утверждении первичной публикации основан класс, и дата проверки. Сверка с базами MITOMAP и ClinVar при этой проверке не выполнялась.'
          : lang === 'es' ? "La clase de la variante procede del libro de datos complementarios; el Atlas no introduce un clasificador propio, tampoco basado en el nivel de heteroplasmia. Para cada variante se indica la declaraci\u00F3n de la publicaci\u00F3n primaria que fundamenta la clase y la fecha de comprobaci\u00F3n. En esta revisi\u00F3n no se cotejaron las variantes con MITOMAP ni ClinVar." : 'The variant class is taken from the supplementary workbook; Atlas introduces no classifier of its own, including one based on heteroplasmy level. For every variant the statement of the primary publication on which the class rests and the date of the check are given. The variants were not checked against MITOMAP or ClinVar in this review.'}
      </p>
      <div className="table-wrap">
        <table className="data" data-testid="variant-classes">
          <thead><tr><th>{ru ? 'Вариант' : lang === 'es' ? "Variante" : 'Variant'}</th><th>{ru ? 'Класс' : lang === 'es' ? "Clase" : 'Class'}</th><th>{ru ? 'Основание' : lang === 'es' ? "Fundamento" : 'Basis'}</th></tr></thead>
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

      <h2>{ru ? 'Что публиковать о цикле ПГТ-мт' : lang === 'es' ? "Qu\u00E9 comunicar sobre un ciclo de PGT-mt" : 'What to report about a PGT-mt cycle'}</h2>
      <ol>
        <li>{ru ? 'Пациентка и цикл: возраст; семейный анамнез; гетероплазмия в тканях носительницы; число ооцитов; оплодотворение и развитие эмбрионов.' : lang === 'es' ? "Paciente y ciclo: edad, antecedentes familiares, heteroplasmia en tejidos de la portadora, n\u00FAmero de ovocitos, fecundaci\u00F3n y desarrollo embrionario." : 'Patient and cycle: age; family history; carrier tissue heteroplasmy; number of oocytes; fertilisation and embryo development.'}</li>
        <li>{ru ? 'Эмбрион: день биопсии; морфология; результат ПГТ-А; гетероплазмия в каждом образце — по каждому эмбриону, включая не перенесённые.' : lang === 'es' ? "Embri\u00F3n: d\u00EDa de biopsia, morfolog\u00EDa, resultado de PGT-A y heteroplasmia en cada muestra de cada embri\u00F3n, incluidos los no transferidos." : 'Embryo: biopsy day; morphology; PGT-A result; heteroplasmy in every sample — for every embryo, including those not transferred.'}</li>
        <li>{ru ? 'Метод: полногеномная амплификация; анализируемый участок; линейность; предел обнаружения; контроли.' : lang === 'es' ? "M\u00E9todo: amplificaci\u00F3n del genoma completo, regi\u00F3n analizada, linealidad, l\u00EDmite de detecci\u00F3n y controles." : 'Method: whole-genome amplification; target region; linearity; detection limit; controls.'}</li>
        <li>{ru ? 'Исход: пренатальная диагностика и постнатальное наблюдение с указанием ткани, возраста и метода.' : lang === 'es' ? "Desenlace: diagn\u00F3stico prenatal y seguimiento posnatal con indicaci\u00F3n del tejido, la edad y el m\u00E9todo." : 'Outcome: prenatal diagnosis and postnatal follow-up with tissue, age and method.'}</li>
      </ol>

      <h2>{ru ? 'Воспроизводимость' : lang === 'es' ? "Reproducibilidad" : 'Reproducibility'}</h2>
      <p className="small">
        {ru ? 'Набор генерируется скриптом' : lang === 'es' ? "El conjunto de datos se genera mediante" : 'The dataset is generated by'} <code>{atlas.meta.generator}</code> {ru ? 'из' : lang === 'es' ? "a partir de" : 'from'} <code>{atlas.meta.source_file}</code> (SHA-256 <code>{atlas.meta.source_sha256}</code>).{' '}
        {ru ? 'Эталонные тесты проверяют, что все контрольные числа набора воспроизводятся при каждой сборке.' : lang === 'es' ? "Las pruebas de referencia comprueban que todas las cifras de control del conjunto de datos se reproducen en cada compilaci\u00F3n." : 'Golden tests check that every reference number of the dataset is reproduced on each build.'}
      </p>
    </article>
  )
}
