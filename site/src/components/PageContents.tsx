import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n'

export function PageContents() {
  const t = useT()
  const ref = useRef<HTMLElement>(null)
  const [items, setItems] = useState<{ id: string; text: string }[]>([])
  useEffect(() => {
    const article = ref.current?.closest('article')
    if (!article) return
    const headings = [...article.querySelectorAll('h2')]
    setItems(headings.map((heading, i) => {
      const parent = heading.closest('section[id]')
      const id = heading.id || parent?.id || `page-section-${i + 1}`
      if (!heading.id && !parent?.id) heading.id = id
      return { id, text: heading.textContent || '' }
    }))
  }, [t])
  return <nav ref={ref} className="page-contents" aria-label={t('pageContents.label')}>
    <strong>{t('pageContents.label')}</strong>
    <ul>{items.map(item => <li key={item.id}><a href={`#${item.id}`}>{item.text}</a></li>)}</ul>
    <a href="#content">{t('pageContents.top')}</a>
  </nav>
}
