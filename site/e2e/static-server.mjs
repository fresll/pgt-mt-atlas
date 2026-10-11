// Статический сервер для e2e, ведущий себя как GitHub Pages: сайт смонтирован под префиксом,
// каталог без завершающего слеша → 301, нет файла → 404.html со статусом 404, без SPA-подстановки.
//   node e2e/static-server.mjs <port> <prefix>     prefix: /pgt-mt-atlas или '' (корень)
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../dist/', import.meta.url))
const port = Number(process.argv[2] ?? 4174)
const prefix = (process.argv[3] ?? '/pgt-mt-atlas').replace(/\/$/, '')
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg', '.json': 'application/json', '.csv': 'text/csv; charset=utf-8', '.woff2': 'font/woff2',
  '.woff': 'font/woff', '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

const notFound = (res) => {
  res.writeHead(404, { 'content-type': TYPES['.html'] })
  res.end(readFileSync(join(root, '404.html')))
}

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost')
  const path = decodeURIComponent(url.pathname)
  if (prefix && path !== prefix && !path.startsWith(`${prefix}/`)) return notFound(res)
  const rel = normalize(path.slice(prefix.length) || '/')
  if (rel.includes('..')) return notFound(res)
  let file = join(root, rel)
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!path.endsWith('/')) {
      res.writeHead(301, { Location: `${path}/${url.search}` })
      return res.end()
    }
    file = join(file, 'index.html')
  }
  if (!existsSync(file) || statSync(file).isDirectory()) return notFound(res)
  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' })
  createReadStream(file).pipe(res)
}).listen(port, () => console.log(`static ${prefix || '/'} on :${port}`))
