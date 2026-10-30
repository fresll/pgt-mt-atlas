import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const base = process.env.ATLAS_BASE ?? '/'
const indexing = process.env.ATLAS_PUBLIC_LAUNCH === '1' && process.env.ATLAS_SOFT_LAUNCH !== '1' && process.env.VITE_ATLAS_PRIVATE_PREVIEW !== '1'
const canonicalBase = indexing ? new URL(process.env.ATLAS_CANONICAL_BASE || '') : undefined
if (canonicalBase) {
  if (canonicalBase.protocol !== 'https:' || canonicalBase.search || canonicalBase.hash) throw new Error('ATLAS_CANONICAL_BASE must be an https URL with the deployment base path')
  if (!canonicalBase.pathname.endsWith('/')) canonicalBase.pathname += '/'
}

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

// По умолчанию сборка для корня собственного домена; ATLAS_BASE задаёт другой путь.
// Публичная индексация включается явно; закрытые и промежуточные сборки сохраняют noindex.
export default defineConfig({
  base,
  define: {
    'import.meta.env.ATLAS_INDEXING_ENABLED': JSON.stringify(indexing),
    'import.meta.env.ATLAS_CANONICAL_BASE': JSON.stringify(canonicalBase?.href || ''),
  },
  plugins: [react(), pagesLikePreview(), {
    name: 'private-preview-without-analytics',
    transformIndexHtml(html: string) {
      // Indexed routes manage robots so the root redirect cannot leave a stale noindex after SPA navigation.
      if (indexing) html = html.replace(/<meta name="robots" content="noindex, nofollow"\s*\/?>/g, '')
      return process.env.VITE_ATLAS_PRIVATE_PREVIEW === '1'
        ? html.replace(/<script[^>]*data-goatcounter[\s\S]*?<\/script>/g, '') : html
    },
  }],
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
