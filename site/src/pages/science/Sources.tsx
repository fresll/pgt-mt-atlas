import { PubStatus } from '../../components/ui'
import { atlas, doiUrl, type Publication } from '../../data/atlas'
import { fmt } from '../../lib/format'
import { useLang, useT } from '../../i18n'

export default function Sources() {
  const t = useT()
  const lang = useLang()
  const count = (id: string) =>
    atlas.fig3.filter((o) => o.pub === id).length + atlas.fig4.filter((o) => o.pub === id).length +
    atlas.cleavage.filter((o) => o.pub === id).length * 2 + atlas.fig5.filter((o) => o.pub === id).length
  const year = (s: string) => Number(s.match(/\d{4}/)?.[0] ?? 0)
  const pubs = [...atlas.publications].sort((a, b) => year(a.short) - year(b.short) || a.short.localeCompare(b.short))
  // роль публикации на сайте: вычисляется ETL по фактическому использованию (одна запись на публикацию)
  const roleText = (r: Publication['roles'][number]) => {
    if (r.role === 'observations') return t('sources.roles.observations', { section: t(`sources.sections.${r.section}`) })
    if (r.role === 'threshold') {
      const th = atlas.thresholds.find((x) => x.id === r.section)
      return t('sources.roles.threshold', { section: th ? (th.value !== undefined ? `${fmt(th.value, lang)}%` : `${th.range?.[0]}–${th.range?.[1]}%`) : r.section })
    }
    return t(`sources.roles.${r.role}`, { section: r.section })
  }
  return (
    <article>
      <h1>{t('sources.title')}</h1>
      <p className="lead">{t('sources.lead')}</p>
      <ol className="prose" style={{ listStyle: 'none', paddingLeft: 0 }}>
        {pubs.map((p) => (
          <li key={p.id} id={p.id} className="card" style={{ marginBottom: 12 }}>
            <p style={{ margin: 0 }}>
              <strong>{p.short}.</strong> {p.citation.replace(/\s*doi:.*$/i, '')} <PubStatus p={p} />
            </p>
            <p className="small" style={{ margin: '4px 0 0' }}>
              {p.doi ? <a href={doiUrl(p.doi)} target="_blank" rel="noreferrer">doi:{p.doi}</a> : <span className="muted">{t('common.noDoi')}</span>}
              {p.pmid && <> · PMID <a href={`https://pubmed.ncbi.nlm.nih.gov/${p.pmid}/`} target="_blank" rel="noreferrer">{p.pmid}</a></>}
              {p.published_date && <> · {new Date(p.published_date).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</>}
              {count(p.id) > 0 && <> · {count(p.id)} {t('sources.records')}</>}
            </p>
            {p.roles.length > 0 && (
              <p className="small" style={{ margin: '4px 0 0' }} data-roles={p.roles.map((r) => r.role).join(' ')}>
                <strong>{t('sources.rolesTitle')}:</strong> {p.roles.map(roleText).join('; ')}
              </p>
            )}
            {p.id !== 'tofilo2026' && p.data_access_note && <p className="small muted" style={{ margin: '4px 0 0' }}>{p.data_access_note[lang]}</p>}
            {p.id !== 'tofilo2026' && p.doi_exception && <p className="small muted" style={{ margin: '4px 0 0' }} lang="ru">{t('sources.doiException')}: {p.doi_exception}</p>}
            {p.id !== 'tofilo2026' && p.verified && <p className="small muted" style={{ margin: '4px 0 0' }} lang="ru">{t('sources.verified')} {p.verified.date}: {p.verified.by}{p.verified.note ? ` ${p.verified.note}` : ''}</p>}
            {p.id !== 'tofilo2026' && p.supplementary && (
              <p className="small" style={{ margin: '4px 0 0' }}>
                {t('sources.supplementary')}: {p.supplementary.map((s) => s.label).join(', ')}
              </p>
            )}
          </li>
        ))}
      </ol>
    </article>
  )
}
