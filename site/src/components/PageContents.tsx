import { useT } from '../i18n'

/** Explicit stable anchors are present in the SSG HTML, before hydration. */
export function PageContents({ items }: { items: { id: string; text: string }[] }) {
  const t = useT()
  return <nav className="page-contents" aria-label={t('pageContents.label')}>
    <strong>{t('pageContents.label')}</strong>
    <ul>{items.map(item => <li key={item.id}><a href={`#${item.id}`}>{item.text}</a></li>)}</ul>
  </nav>
}
export function BackToTop() {
  const t = useT()
  return <p className="back-to-top"><a href="#content">{t('pageContents.top')}</a></p>
}
