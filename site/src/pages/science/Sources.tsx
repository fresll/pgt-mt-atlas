import { useState } from 'react'
import { PubStatus, Seg } from '../../components/ui'
import { atlas, doiUrl, pubById, type Publication } from '../../data/atlas'
import { fmt } from '../../lib/format'
import { useLang, useT } from '../../i18n'
import { PageTitle } from '../../components/Layout'

export default function Sources() {
  const t = useT()
  const lang = useLang()
  const count = (id: string) =>
    atlas.fig3.filter((o) => o.pub === id).length + atlas.fig4.filter((o) => o.pub === id).length +
    atlas.cleavage.filter((o) => o.pub === id).length * 2 + atlas.fig5.filter((o) => o.pub === id).length
  const year = (s: string) => Number(s.match(/\d{4}/)?.[0] ?? 0)
  const pubs = atlas.publications.map((p) => pubById[p.id]).sort((a, b) => year(a.short) - year(b.short) || a.short.localeCompare(b.short))
  // роль публикации на сайте: вычисляется ETL по фактическому использованию (одна запись на публикацию)
  const roleText = (r: Publication['roles'][number]) => {
    if (r.role === 'observations') return t('sources.roles.observations', { section: t(`sources.sections.${r.section}`) })
    if (r.role === 'threshold') {
      const th = atlas.thresholds.find((x) => x.id === r.section)
      return t('sources.roles.threshold', { section: th ? (th.value !== undefined ? `${fmt(th.value, lang)}%` : `${th.range?.[0]}–${th.range?.[1]}%`) : r.section })
    }
    return t(`sources.roles.${r.role}`, { section: r.section })
  }
  const [filter, setFilter] = useState<'all' | 'data' | 'other'>('all')
  const shown = pubs.filter((p) => filter === 'all' || (filter === 'data' ? count(p.id) > 0 : count(p.id) === 0))
  const roleShort = (r: Publication['roles'][number]) =>
    r.role === 'observations' ? t(`sources.sections.${r.section}`) : t(`sources.roleShort.${r.role}`)
  return (
    <article>
      <PageTitle title={t('sources.title')} />
      <h1>{t('sources.title')}</h1>
      <p className="lead">{t('sources.lead')}</p>
      <div className="controls">
        <Seg
          label={t('sources.filter')}
          value={filter}
          onChange={setFilter}
          options={[
            { v: 'all', label: `${t('common.all')} (${pubs.length})` },
            { v: 'data', label: t('sources.filterData') },
            { v: 'other', label: t('sources.filterOther') },
          ]}
        />
      </div>
      <div className="table-wrap">
        <table className="data sources-table">
          <thead>
            <tr>
              <th scope="col">{t('sources.colPublication')}</th>
              <th scope="col">{t('sources.colType')}</th>
              <th scope="col" className="num">{t('sources.colRecords')}</th>
              <th scope="col">{t('sources.colRoles')}</th>
              <th scope="col">DOI / PMID</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((p) => (
              <tr key={p.id} id={p.id}>
                <td>
                  <details>
                    <summary><strong>{p.short}</strong></summary>
                    <p className="small">{p.citation.replace(/\s*doi:.*$/i, '')}</p>
                    {p.published_date && <p className="small muted">{new Date(p.published_date).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
                    {p.roles.length > 0 && (
                      <p className="small" data-roles={p.roles.map((r) => r.role).join(' ')}>
                        <strong>{t('sources.rolesTitle')}:</strong> {p.roles.map(roleText).join('; ')}
                      </p>
                    )}
                    {p.id !== 'tofilo2026' && p.data_access_note && <p className="small muted">{p.data_access_note[lang]}</p>}
                    {p.id !== 'tofilo2026' && p.doi_exception && <p className="small muted" lang="ru">{t('sources.doiException')}: {p.doi_exception}</p>}
                    {p.id !== 'tofilo2026' && p.verified && <p className="small muted" lang="ru">{t('sources.verified')} {p.verified.date}: {p.verified.by}{p.verified.note ? ` ${p.verified.note}` : ''}</p>}
                    {p.id !== 'tofilo2026' && p.supplementary && <p className="small">{t('sources.supplementary')}: {p.supplementary.map((x) => x.label).join(', ')}</p>}
                  </details>
                </td>
                <td data-label={t('sources.colType')}><PubStatus p={p} /></td>
                <td className="num" data-label={t('sources.colRecords')}>{count(p.id) > 0 ? count(p.id) : '—'}</td>
                <td data-label={t('sources.colRoles')}>{[...new Set(p.roles.map(roleShort))].join(', ') || '—'}</td>
                <td className="sources-ids" data-label="DOI / PMID">
                  {p.doi ? <a href={doiUrl(p.doi)} target="_blank" rel="noreferrer">doi:{p.doi}</a> : <span className="muted">{t('common.noDoi')}</span>}
                  {p.pmid && <><br />PMID <a href={`https://pubmed.ncbi.nlm.nih.gov/${p.pmid}/`} target="_blank" rel="noreferrer">{p.pmid}</a></>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  )
}
