import { useLang, useT } from '../i18n'

export default function About() {
  const t = useT()
  const ru = useLang() === 'ru'
  return (
    <article className="prose">
      <h1>{t('about.title')}</h1>
      <p>
        {ru
          ? 'PGT-mt Atlas основан на наборе данных обзора «Преимплантационное генетическое тестирование патогенных вариантов митохондриальной ДНК» (М. А. Тофило, И. О. Мазунин; рукопись для журнала Acta Naturae).'
          : 'PGT-mt Atlas is based on the dataset of the review “Preimplantation genetic testing for pathogenic mitochondrial DNA variants” (M. A. Tofilo, I. O. Mazunin; manuscript for Acta Naturae).'}
      </p>
      <h2>{ru ? 'Авторы' : 'Authors'}</h2>
      <ul>
        <li>{ru ? 'М. А. Тофило — Медикал Геномикс, Тверь; извлечение данных из первичных публикаций, подготовка набора данных и рисунков.' : 'M. A. Tofilo — Medical Genomics, Tver; data extraction from primary publications, dataset and figure preparation.'}</li>
        <li>{ru ? 'И. О. Мазунин — Сколковский институт науки и технологий; Медицинский университет Петровского, кафедра биологии и генетики; концепция обзора, анализ, текст.' : 'I. O. Mazunin — Skolkovo Institute of Science and Technology; Petrovsky Medical University, Department of Biology and Genetics; review concept, analysis, writing.'}</li>
      </ul>
      <h2>{ru ? 'Конфликт интересов' : 'Conflict of interest'}</h2>
      <p>
        {ru
          ? 'М. А. Тофило — сотрудник «Медикал Геномикс», лаборатории, выполняющей преимплантационное генетическое тестирование. И. О. Мазунин — основатель и генеральный директор ООО «МОДИКУМ» и соучредитель ООО «Флоренс Лабс» (подробнее — в тексте обзора).'
          : 'M. A. Tofilo is an employee of Medical Genomics, a laboratory performing preimplantation genetic testing. I. O. Mazunin is the founder and CEO of MODICUM LLC and a co-founder of Florence Labs LLC (details in the review).'}
      </p>
      <h2>{ru ? 'Как цитировать и лицензия' : 'How to cite and licence'}</h2>
      <p className="callout warn">
        {ru ? 'Будет указано после выхода обзора и выбора лицензии набора данных авторами.' : 'To be added after the review is published and the authors choose a dataset licence.'}
      </p>
      <h2>{ru ? 'Важно' : 'Important'}</h2>
      <p>{t('home.caveat')}</p>
    </article>
  )
}
