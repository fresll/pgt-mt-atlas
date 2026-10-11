import { PubStatus } from '../../components/ui'
import { atlas, doiUrl, label, type Publication } from '../../data/atlas'
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
  const ver = atlas.verification
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
            {p.data_access_note && <p className="small muted" style={{ margin: '4px 0 0' }}>{p.data_access_note[lang]}</p>}
            {p.doi_exception && <p className="small muted" style={{ margin: '4px 0 0' }} lang="ru">{t('sources.doiException')}: {p.doi_exception}</p>}
            {p.verified && <p className="small muted" style={{ margin: '4px 0 0' }} lang="ru">{t('sources.verified')} {p.verified.date}: {p.verified.by}{p.verified.note ? ` ${p.verified.note}` : ''}</p>}
            {p.supplementary && (
              <p className="small" style={{ margin: '4px 0 0' }}>
                {t('sources.supplementary')}: {p.supplementary.map((s) => s.label).join(', ')}
              </p>
            )}
            {p.id === 'tofilo2026' && ver.length > 0 && (
              <details className="small">
                <summary>{t('verification.title')}</summary>
                <div className="table-wrap" style={{ marginTop: 8 }}>
                  <table className="data">
                    <thead><tr><th>{t('common.embryo')}</th><th>ESM 2</th><th>ESM, %</th><th>{lang === 'ru' ? 'Исходная таблица, %' : 'Source workbook, %'}</th><th>{lang === 'ru' ? 'На сайте' : 'On the site'}</th><th>{t('common.status')}</th></tr></thead>
                    <tbody>
                      {ver.filter((v) => v.embryo).map((v, i) => (
                        <tr key={i}>
                          <td>{v.embryo}</td><td>{v.esm_label}</td><td className="num">{String(v.esm_value)}</td>
                          <td className="num">{v.dataset_value === null ? '—' : String(v.dataset_value)}</td>
                          <td className="num">{v.resolution === 'corrected' ? `${v.atlas_value ?? v.dataset_value} · ${label('fraction', v.atlas_fraction ?? '', lang)}` : ''}</td>
                          <td>{v.status === 'match' ? '✓ ' : v.status === 'not_in_dataset' || v.resolution === 'corrected' ? '' : '⚠ '}{t(`verification.${v.status}`)}{v.resolution === 'corrected' && <> · {t('verification.corrected')}</>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p style={{ marginTop: 6 }}>{ver.some((v) => v.resolution === 'corrected') ? t('verification.correctedNote') : t('verification.datasetKept')}</p>
              </details>
            )}
          </li>
        ))}
      </ol>
    </article>
  )
}
