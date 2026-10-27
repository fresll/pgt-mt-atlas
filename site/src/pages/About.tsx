import { arabicText } from '../i18n/arabic-text'
import { chineseText } from '../i18n/chinese-text'
import { spanishText } from '../i18n/spanish-text'
import { Link } from 'react-router-dom'
import { Photo } from '../components/Photo'
import { useLang, useT } from '../i18n'
import { PageTitle } from '../components/Layout'
import { HandRule } from '../components/Sketch'

export default function About() {
  const t = useT()
  const lang = useLang()
  const ru = lang === 'ru'
  const text = (value: string) => lang === 'ar' ? arabicText(value) : lang === 'zh-Hans' ? chineseText(value) : lang === 'es' ? spanishText(value) : value
  return (
    <article className="pt-page">
      <PageTitle title={t('about.title')} />
      <header className="fd-head">
      <h1>{t('about.title')}</h1>
      <HandRule className="sk-title-rule" />
      <p className="fd-lead">
        {ru
          ? 'Атлас ПГТ-мт — постоянно обновляемая научная база данных о гетероплазмии митохондриальной ДНК при преимплантационном генетическом тестировании (ПГТ-мт).'
          : text('PGT-mt Atlas is an international scientific database of mitochondrial DNA (mtDNA) heteroplasmy in preimplantation genetic testing for mtDNA variants (PGT-mt). It is updated as new evidence becomes available.')}
      </p>
      </header>
      <div className="fd-text">
      <p>
        {ru
          ? 'Атлас собирает опубликованные индивидуальные значения гетероплазмии для каждого описанного эмбриона и сопоставления «эмбрион — потомство», хранит происхождение каждого значения и открыто показывает ограничения данных. Атлас не является приложением к какой-либо отдельной публикации и развивается по мере выхода новых исследований.'
          : text('The Atlas compiles published individual embryo heteroplasmy values and embryo–offspring comparisons. Every value retains its provenance, and the limitations of the evidence are stated explicitly. This is an independent resource, rather than a supplement to a single publication.')}
      </p>

      <h2>{ru ? 'Создатель и куратор' : text('Creator and curator')}</h2>
      <div className="curator-card card">
        <Photo path="img/ilya-mazunin.jpg" alt="" width={72} height={96} />
        <div>
          <p style={{ margin: 0 }}>
            <strong>{ru ? 'Илья Мазунин' : text('Ilya Mazunin')}</strong>
          </p>
          <p className="small muted" style={{ margin: text('2px 0 6px') }}>
            {ru
              ? 'Доктор биологических наук; Сколковский институт науки и технологий; заведующий кафедрой биологии и генетики, Медицинский университет Петровского'
              : text('DSc; Skolkovo Institute of Science and Technology; Head of the Department of Biology and Genetics, Petrovsky Medical University')}
          </p>
          <Link to={`/${lang}/ilya-mazunin/`}>{ru ? 'Научная биография →' : text('Scientific biography →')}</Link>
        </div>
      </div>
      <p>{t('site.curated')}. {ru ? 'Других создателей или кураторов у платформы нет.' : text('The platform has no other creators or curators.')}</p>

      <h2>{ru ? 'Принципы' : text('Principles')}</h2>
      <ul>
        <li>{ru ? 'Источники и научные исследования: у каждого значения указаны публикация, её авторы и DOI.' : text('Attribution of primary research: every value is linked to its publication, its authors and DOI.')}</li>
        <li>{ru ? 'Значения проверяются по опубликованным научным источникам перед включением в Атлас.' : text('Values are checked against published scientific sources before inclusion in the Atlas. Discrepancies are documented rather than corrected silently.')}</li>
        <li>{ru ? 'Наблюдаемые данные и модельные расчёты разделены в данных и в интерфейсе.' : text('Observed data and model calculations are distinguished both in the dataset and in the interface.')}</li>
        <li>{ru ? 'Только опубликованные источники: медицинские сведения и неопубликованные материалы автоматически не публикуются.' : text('The current public dataset contains published observations. Unpublished submissions require separate review before inclusion; medical information and unpublished material are never published automatically.')}</li>
      </ul>

      {ru && (
        <>
          <h2>Конфиденциальность и защита данных</h2>
          <p>Куратор Атласа ПГТ-мт уделяет особое внимание защите персональных и генетических данных. Перед включением сведений в публичный набор проводится проверка отсутствия прямых идентификаторов пациентов и оценка возможности их косвенной идентификации по совокупности опубликованных характеристик.</p>
          <p>Неопубликованные исследовательские материалы рассматриваются к включению только после проверки правомерности их использования и публичного представления. Первичная медицинская документация и сведения, позволяющие идентифицировать пациентов, не предназначены для открытого размещения в Атласе.</p>
          <p>При подготовке и публикации данных учитываются применимые требования законодательства Российской Федерации, включая Федеральный закон от 27.07.2006 № 152-ФЗ «О персональных данных», Федеральный закон от 21.11.2011 № 323-ФЗ «Об основах охраны здоровья граждан в Российской Федерации» и Федеральный закон от 05.07.1996 № 86-ФЗ «О государственном регулировании в области генно-инженерной деятельности».</p>
        </>
      )}

      <h2>{ru ? 'Важно' : text('Important')}</h2>
      <p>{t('home.caveat')}</p>
      </div>
    </article>
  )
}
