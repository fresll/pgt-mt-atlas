import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Head } from 'vite-react-ssg'

/** Английская версия временно закрыта; адрес раздела, query и hash сохраняются. */
export function russianPath(pathname: string, search = '', hash = ''): string {
  const path = pathname.replace(/^\/en(?=\/|$)/, '/ru')
  const target = path === '/' ? '/ru/' : path
  return `${target.endsWith('/') ? target : `${target}/`}${search}${hash}`
}

export default function RootRedirect() {
  const navigate = useNavigate()
  const { pathname, search, hash } = useLocation()
  const target = russianPath(pathname, search, hash)
  useEffect(() => {
    navigate(target, { replace: true })
  }, [navigate, target])
  return (
    <main style={{ padding: 24, fontFamily: 'system-ui' }} lang="ru">
      <Head><title>Атлас ПГТ-мт</title></Head>
      <h1>Атлас ПГТ-мт</h1>
      <p><Link to={russianPath(pathname)}>Перейти к русской версии</Link></p>
    </main>
  )
}
