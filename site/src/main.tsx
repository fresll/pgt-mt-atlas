import { ViteReactSSG } from 'vite-react-ssg'
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

export const createRoot = ViteReactSSG({ routes, basename: import.meta.env.BASE_URL })
