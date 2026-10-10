import { Link } from 'react-router-dom'
import { useLang, useT } from '../i18n'

export default function About() {
  const t = useT()
  const lang = useLang()
  const ru = lang === 'ru'
  return (
    <article className="prose">
      <h1>{t('about.title')}</h1>
      <p className="lead">
        {ru
          ? 'PGT-mt Atlas — самостоятельная, постоянно обновляемая международная база научных данных о гетероплазмии митохондриальной ДНК при преимплантационном генетическом тестировании (ПГТ-мт).'
          : 'PGT-mt Atlas is an independent, continuously updated international scientific database of mitochondrial DNA heteroplasmy in preimplantation genetic testing (PGT-mt).'}
      </p>
      <p>
        {ru
          ? 'Атлас собирает опубликованные индивидуальные значения гетероплазмии для каждого описанного эмбриона и сопоставления «эмбрион — потомство», хранит происхождение каждого значения и открыто показывает ограничения данных. Атлас не является приложением к какой-либо отдельной публикации и развивается по мере выхода новых исследований.'
          : 'The Atlas brings together published individual heteroplasmy values for every reported embryo and embryo-to-offspring comparisons, keeps the provenance of every value and states the limitations of the data openly. The Atlas is not a supplement to any single publication and grows as new studies appear.'}
      </p>

      <h2>{ru ? 'Создатель и куратор' : 'Creator and curator'}</h2>
      <div className="curator-card card">
        <img src={`${import.meta.env.BASE_URL}img/ilya-mazunin.jpg`} alt="" width={72} height={96} />
        <div>
          <p style={{ margin: 0 }}>
            <strong>{ru ? 'Илья Мазунин' : 'Ilya Mazunin'}</strong>
          </p>
          <p className="small muted" style={{ margin: '2px 0 6px' }}>
            {ru
              ? 'Доктор биологических наук; заведующий кафедрой биологии и генетики, Медицинский университет Петровского; Сколковский институт науки и технологий'
              : 'DSc; Head of the Department of Biology and Genetics, Petrovsky Medical University; Skolkovo Institute of Science and Technology'}
          </p>
          <Link to={`/${lang}/ilya-mazunin/`}>{ru ? 'Научная биография →' : 'Scientific biography →'}</Link>
        </div>
      </div>
      <p>{t('site.curated')}. {ru ? 'Других создателей или кураторов у платформы нет.' : 'The platform has no other creators or curators.'}</p>

      <h2>{ru ? 'Принципы' : 'Principles'}</h2>
      <ul>
        <li>{ru ? 'Атрибуция первичных исследований: у каждого значения указаны публикация, её авторы и DOI.' : 'Attribution of primary research: every value is linked to its publication, its authors and DOI.'}</li>
        <li>{ru ? 'Исходные значения не изменяются без проверки; расхождения с опубликованными материалами отмечаются, а не исправляются молча.' : 'Source values are not changed without verification; discrepancies with published material are flagged, not silently corrected.'}</li>
        <li>{ru ? 'Наблюдаемые данные и модельные расчёты разделены в данных и в интерфейсе.' : 'Observed data and model calculations are kept apart in the data and in the interface.'}</li>
        <li>{ru ? 'Только опубликованные источники: медицинские сведения и неопубликованные материалы автоматически не публикуются.' : 'Published sources only: medical information and unpublished material are never published automatically.'}</li>
      </ul>

      <h2>{ru ? 'Раскрытие интересов' : 'Disclosure of interests'}</h2>
      <p>
        {ru
          ? 'И. О. Мазунин — основатель и генеральный директор ООО «МОДИКУМ», сооснователь ООО «Флоренс Лабс» и CellKinetica SARL. Подробности — на странице куратора.'
          : 'I. O. Mazunin is the founder and CEO of MODICUM LLC and a co-founder of Florence Labs LLC and CellKinetica SARL. Details are on the curator’s page.'}
      </p>
      <h2>{ru ? 'Как цитировать и лицензия' : 'How to cite and licence'}</h2>
      <p className="callout warn">
        {ru ? 'Формат цитирования и лицензия набора данных будут объявлены куратором. При использовании значений ссылайтесь также на первичные публикации.' : 'The citation format and dataset licence will be announced by the curator. When using the values, please also cite the primary publications.'}
      </p>
      <h2>{ru ? 'Важно' : 'Important'}</h2>
      <p>{t('home.caveat')}</p>
    </article>
  )
}
