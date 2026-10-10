import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/** Корень сайта: выбор языка по браузеру (и ссылки для работы без JavaScript). */
export default function RootRedirect() {
  const navigate = useNavigate()
  useEffect(() => {
    let lang = 'en'
    try {
      lang = localStorage.getItem('atlas-lang') ?? (navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en')
    } catch {
      lang = navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en'
    }
    navigate(`/${lang === 'ru' ? 'ru' : 'en'}/`, { replace: true })
  }, [navigate])
  return (
    <main style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>PGT-mt Atlas</h1>
      <p>
        <a href="en/">English</a> · <a href="ru/">Русский</a>
      </p>
    </main>
  )
}
