import { Link } from 'react-router-dom'
import { useLang, useT } from '../i18n'
import { PageTitle } from '../components/Layout'

export default function NotFound() {
  const t = useT()
  const lang = useLang()
  return (
    <article>
      <PageTitle title={t('notFound')} />
      <h1>{t('notFound')}</h1>
      <p><Link to={`/${lang}/`}>{t('nav.home')}</Link></p>
    </article>
  )
}
