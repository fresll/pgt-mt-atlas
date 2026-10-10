import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Lang } from '../../data/atlas'
import { refById } from './references'
import type { Block, Chapter } from './types'

const TOKEN = /(\[@[^\]]+\]|\[\[[^\]]+\]\]|\*\*[^*]+\*\*|\*[^*]+\*)/g

/** id источников в строке разметки: [@a; @b] → ['a', 'b'] */
export function citeIds(s: string): string[] {
  return [...s.matchAll(/\[@([^\]]+)\]/g)].flatMap((m) => m[1].split(';').map((x) => x.trim().replace(/^@/, '')))
}

/** внутренние ссылки в строке разметки: [[текст|путь]] → ['путь'] */
export function linkPaths(s: string): string[] {
  return [...s.matchAll(/\[\[[^|\]]+\|([^\]]+)\]\]/g)].map((m) => m[1])
}

export function blockStrings(b: Block): string[] {
  switch (b.t) {
    case 'ul':
      return b.items
    case 'steps':
    case 'def':
      return b.items.flat()
    default:
      return [b.x]
  }
}

export function chapterStrings(c: Chapter): string[] {
  return [c.lead, ...c.essentials.flatMap(blockStrings), ...c.advanced.flatMap(blockStrings), ...c.data.map((d) => d.text)]
}

/** источники главы в порядке первого упоминания */
export function chapterRefs(c: Chapter): string[] {
  return [...new Set(chapterStrings(c).flatMap(citeIds))]
}

export function Inline({ s, lang }: { s: string; lang: Lang }) {
  const parts = s.split(TOKEN)
  return (
    <>
      {parts.map((p, i) => {
        if (!p) return null
        if (p.startsWith('[@')) {
          const ids = citeIds(p)
          return (
            <span className="fd-cite" key={i}>
              (
              {ids.map((id, k) => (
                <Fragment key={id}>
                  {k > 0 && '; '}
                  <a href={`#ref-${id}`}>{refById[id]?.cite ?? id}</a>
                </Fragment>
              ))}
              )
            </span>
          )
        }
        if (p.startsWith('[[')) {
          const [label, path] = p.slice(2, -2).split('|')
          return (
            <Link key={i} to={`/${lang}/${path}`}>
              {label}
            </Link>
          )
        }
        if (p.startsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>
        if (p.startsWith('*') && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>
        return <Fragment key={i}>{p}</Fragment>
      })}
    </>
  )
}

export function Blocks({ blocks, lang }: { blocks: Block[]; lang: Lang }): ReactNode {
  return blocks.map((b, i) => {
    switch (b.t) {
      case 'h':
        return <h3 key={i}>{b.x}</h3>
      case 'p':
        return (
          <p key={i}>
            <Inline s={b.x} lang={lang} />
          </p>
        )
      case 'ul':
        return (
          <ul key={i} className="fd-list">
            {b.items.map((x, k) => (
              <li key={k}>
                <Inline s={x} lang={lang} />
              </li>
            ))}
          </ul>
        )
      case 'steps':
        return (
          <ol key={i} className="fd-steps">
            {b.items.map(([title, text], k) => (
              <li key={k}>
                <span className="fd-step-no" aria-hidden="true">{String(k + 1).padStart(2, '0')}</span>
                <div>
                  <strong>
                    <Inline s={title} lang={lang} />
                  </strong>
                  <p>
                    <Inline s={text} lang={lang} />
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )
      case 'def':
        return (
          <dl key={i} className="fd-def">
            {b.items.map(([term, def], k) => (
              <div key={k}>
                <dt>
                  <Inline s={term} lang={lang} />
                </dt>
                <dd>
                  <Inline s={def} lang={lang} />
                </dd>
              </div>
            ))}
          </dl>
        )
      case 'key':
        return (
          <p key={i} className="fd-key">
            <Inline s={b.x} lang={lang} />
          </p>
        )
      case 'caution':
        return (
          <p key={i} className="fd-caution">
            <Inline s={b.x} lang={lang} />
          </p>
        )
    }
  })
}
