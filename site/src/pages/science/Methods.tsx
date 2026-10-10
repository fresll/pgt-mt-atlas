import { PubRef } from '../../components/ui'
import { atlas, label } from '../../data/atlas'
import { useLang, useT } from '../../i18n'
import { fmt } from '../../lib/format'

export default function Methods() {
  const t = useT()
  const lang = useLang()
  const ru = lang === 'ru'
  return (
    <article className="prose">
      <h1>{t('methods.title')}</h1>

      <h2>{ru ? 'Что собрано' : 'What was collected'}</h2>
      <p>
        {ru
          ? 'Значения гетероплазмии извлечены из первичных публикаций для каждого описанного эмбриона: 187 значений для семи патогенных вариантов мтДНК; 40 бластоцист с парными измерениями в биоптате ТЭ, ВКМ и оставшейся ТЭ; постимплантационные данные 8 детей, для которых известен уровень в перенесённом эмбрионе. Значения берутся из первичных публикаций; обзоры использованы только там, где оригинал недоступен, и это отмечено.'
          : 'Heteroplasmy values were extracted from primary publications for every reported embryo: 187 values for seven pathogenic mtDNA variants; 40 blastocysts with paired measurements in the TE biopsy, ICM and remaining TE; post-implantation data for 8 children whose transferred-embryo level is known. Values come from primary publications; reviews were used only where the original is unavailable, and this is flagged.'}
      </p>

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
      <p>{ru ? 'Каждая точка на графиках ведёт к строке сопроводительной таблицы и к публикации (DOI).' : 'Every point leads back to its row in the supplementary workbook and to the publication (DOI).'}</p>

      <h2>{ru ? 'Ориентиры на графиках' : 'Reference lines on the charts'}</h2>
      <ul>
        {atlas.thresholds.map((th) => (
          <li key={th.id}>
            <strong>{th.value !== undefined ? `${fmt(th.value, lang)}%` : `${th.range?.[0]}–${th.range?.[1]}%`}</strong> — {th[lang]}
            {th.publication && <> (<PubRef id={th.publication} />)</>}
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

      <h2>{ru ? 'Сверка с опубликованными материалами' : 'Checks against published material'}</h2>
      <p>
        {ru
          ? 'Значения Tofilo et al., 2026 автоматически сверяются с опубликованным ESM 2. Найдены два расхождения значения (эмбрион 6: 0,1 и 0,2 п.п.) и два расхождения типа фракции (эмбрионы 3 и 4: в ESM 2 — объединённая фракция «ICM+ / TE+ICM»). Значения набора не изменены до проверки куратором; затронутые записи помечены.'
          : 'Values from Tofilo et al., 2026 are automatically checked against the published ESM 2. Two value differences (embryo 6: 0.1 and 0.2 pp) and two fraction-type differences (embryos 3 and 4: ESM 2 reports a combined “ICM+ / TE+ICM” fraction) were found. Dataset values are unchanged pending the curator’s review; affected records are flagged.'}
      </p>

      <h2>{ru ? 'Что публиковать о цикле ПГТ-мт' : 'What to report about a PGT-mt cycle'}</h2>
      <ol>
        <li>{ru ? 'Пациентка и цикл: возраст; семейный анамнез; гетероплазмия в тканях носительницы; число ооцитов; оплодотворение и развитие эмбрионов.' : 'Patient and cycle: age; family history; carrier tissue heteroplasmy; number of oocytes; fertilisation and embryo development.'}</li>
        <li>{ru ? 'Эмбрион: день биопсии; морфология; результат ПГТ-А; гетероплазмия в каждом образце — по каждому эмбриону, включая не перенесённые.' : 'Embryo: biopsy day; morphology; PGT-A result; heteroplasmy in every sample — for every embryo, including those not transferred.'}</li>
        <li>{ru ? 'Метод: полногеномная амплификация; анализируемый участок; линейность; предел обнаружения; контроли.' : 'Method: whole-genome amplification; target region; linearity; detection limit; controls.'}</li>
        <li>{ru ? 'Исход: пренатальная диагностика и постнатальное наблюдение с указанием ткани, возраста и метода.' : 'Outcome: prenatal diagnosis and postnatal follow-up with tissue, age and method.'}</li>
      </ol>

      <h2>{ru ? 'Воспроизводимость' : 'Reproducibility'}</h2>
      <p className="small">
        {ru ? 'Набор генерируется скриптом' : 'The dataset is generated by'} <code>{atlas.meta.generator}</code> {ru ? 'из' : 'from'} <code>{atlas.meta.source_file}</code> (SHA-256 <code>{atlas.meta.source_sha256}</code>).{' '}
        {ru ? 'Эталонные тесты проверяют, что все контрольные числа набора воспроизводятся при каждой сборке.' : 'Golden tests check that every reference number of the dataset is reproduced on each build.'}
      </p>
    </article>
  )
}
