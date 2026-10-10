import { Link } from 'react-router-dom'
import { formatDate, summary } from '../data/atlas'
import { useLang, useT } from '../i18n'

export default function About() {
  const t = useT()
  const lang = useLang()
  const ru = lang === 'ru'
  return (
    <article className="prose">
      <h1>{t('about.title')}</h1>
      <p className="hero-sub">
        <strong>{t('site.title')}</strong> — {t('site.tagline')}.
      </p>
      <p>
        <Link to={`/${lang}/creator/`}>{t('site.credit')}</Link>
      </p>

      <h2>{ru ? 'Назначение' : 'Purpose'}</h2>
      <p>
        {ru
          ? 'Атлас ПГТ-мт — самостоятельный, долгосрочный научный ресурс по преимплантационному генетическому тестированию митохондриальной ДНК. Он объединяет опубликованные исследования, индивидуальные значения гетероплазмии с указанием их происхождения, интерактивные визуализации и образовательные материалы для специалистов и пациентов. База пополняется по мере выхода новых публикаций.'
          : 'PGT-mt Atlas is an independent, long-term scientific resource on preimplantation genetic testing for mitochondrial DNA. It brings together published studies, individual heteroplasmy values with their provenance, interactive visualisations and educational material for specialists and patients. The database is extended as new publications appear.'}
      </p>

      <h2>{ru ? 'Источники данных' : 'Data sources'}</h2>
      <p>
        {ru
          ? `Все значения взяты из опубликованных первоисточников (сейчас ${summary.publications} публикаций, из них ${summary.pubsWithData} дают индивидуальные значения); для каждой записи указаны публикация, DOI и место в исходной таблице. Исходный набор и логика рисунков 3–6 подготовлены для обзора М. А. Тофило и И. О. Мазунина «Преимплантационное генетическое тестирование патогенных вариантов митохондриальной ДНК» (рукопись на рецензии в журнале Acta Naturae); этот обзор — один из научных источников атласа.`
          : `All values come from published primary sources (currently ${summary.publications} publications, ${summary.pubsWithData} of which supply individual values); every record carries its publication, DOI and location in the source workbook. The initial dataset and the logic of Figures 3–6 were prepared for the review by M. A. Tofilo and I. O. Mazunin, “Preimplantation genetic testing for pathogenic mitochondrial DNA variants” (manuscript under review at Acta Naturae); the review is one of the Atlas’s scientific sources.`}{' '}
        <Link to={`/${lang}/science/sources/`}>{t('nav.sources')} →</Link>
      </p>
      <p className="muted small">
        {t('home.updated')}: {formatDate(summary.updated, lang)}.
      </p>

      <h2>{ru ? 'Кураторство' : 'Curation'}</h2>
      <p>
        {ru
          ? 'Отбор публикаций, правила включения наблюдений, проверка значений и тексты сайта выполняются создателем и научным куратором атласа. Расхождения с опубликованными дополнительными материалами отмечаются в карточках записей; исходные значения без согласования куратора не изменяются.'
          : 'Selection of publications, inclusion rules, value checks and site texts are the responsibility of the Atlas’s creator and curator. Differences from published supplementary material are flagged on record cards; source values are not changed without the curator’s decision.'}{' '}
        <Link to={`/${lang}/science/methods/`}>{t('nav.methods')} →</Link>
      </p>

      <h2>{ru ? 'Раскрытие интересов' : 'Disclosure of interests'}</h2>
      <p>
        {ru
          ? 'И. О. Мазунин — основатель и генеральный директор ООО «МОДИКУМ», сооснователь ООО «Флоренс Лабс» и CellKinetica SARL — компаний, разрабатывающих решения на основе геномных данных для ранжирования и скрининга эмбрионов в циклах ВРТ.'
          : 'I. O. Mazunin is the founder and CEO of MODICUM LLC and a co-founder of Florence Labs LLC and CellKinetica SARL — companies developing genomic-data-based solutions for ranking and screening embryos in ART cycles.'}
      </p>

      <h2>{ru ? 'Как цитировать и лицензия' : 'How to cite and licence'}</h2>
      <p className="callout warn">
        {ru ? 'Будет указано после выбора лицензии набора данных.' : 'To be added once the dataset licence is chosen.'}
      </p>

      <h2>{ru ? 'Важно' : 'Important'}</h2>
      <p>{t('home.caveat')}</p>
    </article>
  )
}
