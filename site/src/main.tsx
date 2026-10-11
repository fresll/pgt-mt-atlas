import { ViteReactSSG } from 'vite-react-ssg'
import { SITE_BASE } from './lib/base'
import { routes } from './routes'
// Шрифтовая система Scientific Sketchbook (локальные файлы, без внешних CDN; латиница и кириллица)
import '@fontsource-variable/cormorant-garamond/wght.css'
import '@fontsource-variable/cormorant-garamond/wght-italic.css'
import '@fontsource-variable/source-serif-4/wght.css'
import '@fontsource-variable/source-serif-4/wght-italic.css'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource-variable/caveat/wght.css'
import './styles.css'

// Ссылки <head> в статическом HTML относительны к своей странице (scripts/postbuild.mjs). Иконка запрашивается
// заново после клиентских переходов, поэтому сразу переводится в абсолютный адрес.
if (typeof document !== 'undefined') {
  document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]').forEach((l) => (l.href = l.href))
}

export const createRoot = ViteReactSSG({ routes, basename: SITE_BASE })
