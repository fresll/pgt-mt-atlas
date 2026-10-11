import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const base = process.env.ATLAS_BASE ?? '/pgt-mt-atlas/'

/** vite preview как GitHub Pages: каталог без завершающего слеша → 301 на адрес со слешем
 *  (без этого preview отдаёт корневой index.html чужой страницы). */
function pagesLikePreview(): Plugin {
  return {
    name: 'atlas-pages-like-preview',
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const [path, query] = (req.url ?? '').split('?')
        if (path.startsWith(base) && !path.endsWith('/')) {
          const dir = join(server.config.build.outDir, decodeURIComponent(path.slice(base.length)))
          if (existsSync(dir) && statSync(dir).isDirectory()) {
            res.statusCode = 301
            res.setHeader('Location', `${path}/${query ? `?${query}` : ''}`)
            return res.end()
          }
        }
        next()
      })
    },
  }
}

// base: путь проекта на GitHub Pages (https://<owner>.github.io/pgt-mt-atlas/).
// Публикация отключена до явного решения авторов (docs/implementation_plan.md, раздел 7).
export default defineConfig({
  base,
  plugins: [react(), pagesLikePreview()],
  // Ссылки из JS (предзагрузка чанков Plotly) и CSS (шрифты) строятся относительно самого файла,
  // а не от зашитого base: собранный сайт не ломается, если открыт по другому пути.
  // В HTML base заменяется на относительный путь в scripts/postbuild.mjs.
  experimental: {
    renderBuiltUrl: (_file: string, { hostType }: { hostType: 'js' | 'css' | 'html' }) => (hostType === 'html' ? undefined : { relative: true }),
  },
  ssgOptions: {
    dirStyle: 'nested',
    // Plotly загружается только в браузере (см. components/PlotlyChart.tsx)
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
} as never)
