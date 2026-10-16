import { Link } from 'react-router-dom'
import { Photo } from '../components/Photo'
import { useLang, useT } from '../i18n'
import { PageTitle } from '../components/Layout'
import { HandRule } from '../components/Sketch'

export default function About() {
  const t = useT()
  const lang = useLang()
  const ru = lang === 'ru'
  return (
    <article className="pt-page">
      <PageTitle title={t('about.title')} />
      <header className="fd-head">
      <h1>{t('about.title')}</h1>
      <HandRule className="sk-title-rule" />
      <p className="fd-lead">
        {ru
          ? 'Атлас ПГТ-мт — постоянно обновляемая международная база научных данных о гетероплазмии митохондриальной ДНК при преимплантационном генетическом тестировании (ПГТ-мт).'
          : 'PGT-mt Atlas is a continuously updated international scientific database of mitochondrial DNA heteroplasmy in preimplantation genetic testing (PGT-mt).'}
      </p>
      </header>
      <div className="fd-text">
      <p>
        {ru
          ? 'Атлас собирает опубликованные индивидуальные значения гетероплазмии для каждого описанного эмбриона и сопоставления «эмбрион — потомство», хранит происхождение каждого значения и открыто показывает ограничения данных. Атлас не является приложением к какой-либо отдельной публикации и развивается по мере выхода новых исследований.'
          : 'The Atlas brings together published individual heteroplasmy values for every reported embryo and embryo-to-offspring comparisons, keeps the provenance of every value and states the limitations of the data openly. The Atlas is not a supplement to any single publication and grows as new studies appear.'}
      </p>

      <h2>{ru ? 'Создатель и куратор' : 'Creator and curator'}</h2>
      <div className="curator-card card">
        <Photo path="img/ilya-mazunin.jpg" alt="" width={72} height={96} />
        <div>
          <p style={{ margin: 0 }}>
            <strong>{ru ? 'Илья Мазунин' : 'Ilya Mazunin'}</strong>
          </p>
          <p className="small muted" style={{ margin: '2px 0 6px' }}>
            {ru
              ? 'Доктор биологических наук; Сколковский институт науки и технологий; заведующий кафедрой биологии и генетики, Медицинский университет Петровского'
              : 'DSc; Skolkovo Institute of Science and Technology; Head of the Department of Biology and Genetics, Petrovsky Medical University'}
          </p>
          <Link to={`/${lang}/ilya-mazunin/`}>{ru ? 'Научная биография →' : 'Scientific biography →'}</Link>
        </div>
      </div>
      <p>{t('site.curated')}. {ru ? 'Других создателей или кураторов у платформы нет.' : 'The platform has no other creators or curators.'}</p>

      <h2>{ru ? 'Принципы' : 'Principles'}</h2>
      <ul>
        <li>{ru ? 'Источники и научные исследования: у каждого значения указаны публикация, её авторы и DOI.' : 'Attribution of primary research: every value is linked to its publication, its authors and DOI.'}</li>
        <li>{ru ? 'Значения проверяются по опубликованным научным источникам перед включением в Атлас.' : 'Source values are not changed without verification; discrepancies with published material are flagged, not silently corrected.'}</li>
        <li>{ru ? 'Наблюдаемые данные и модельные расчёты разделены в данных и в интерфейсе.' : 'Observed data and model calculations are kept apart in the data and in the interface.'}</li>
        <li>{ru ? 'Только опубликованные источники: медицинские сведения и неопубликованные материалы автоматически не публикуются.' : 'Published sources only: medical information and unpublished material are never published automatically.'}</li>
      </ul>

      <h2>{ru ? 'Важно' : 'Important'}</h2>
      <p>{t('home.caveat')}</p>
      </div>
    </article>
  )
}
