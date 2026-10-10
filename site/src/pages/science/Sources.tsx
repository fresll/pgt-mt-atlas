import { PubStatus } from '../../components/ui'
import { atlas, doiUrl } from '../../data/atlas'
import { useLang, useT } from '../../i18n'

export default function Sources() {
  const t = useT()
  const lang = useLang()
  const count = (id: string) =>
    atlas.fig3.filter((o) => o.pub === id).length + atlas.fig4.filter((o) => o.pub === id).length +
    atlas.cleavage.filter((o) => o.pub === id).length * 2 + atlas.fig5.filter((o) => o.pub === id).length
  const pubs = [...atlas.publications].sort((a, b) => a.review_ref_no - b.review_ref_no)
  const ver = atlas.verification
  return (
    <article>
      <h1>{t('sources.title')}</h1>
      <p className="lead">{t('sources.lead')}</p>
      <ol className="prose" style={{ listStyle: 'none', paddingLeft: 0 }}>
        {pubs.map((p) => (
          <li key={p.id} id={p.id} className="card" style={{ marginBottom: 12 }}>
            <p style={{ margin: 0 }}>
              <strong>[{p.review_ref_no}]</strong> {p.citation.replace(/\s*doi:.*$/i, '')} <PubStatus p={p} />
            </p>
            <p className="small" style={{ margin: '4px 0 0' }}>
              {p.doi ? <a href={doiUrl(p.doi)} target="_blank" rel="noreferrer">doi:{p.doi}</a> : <span className="muted">{t('common.noDoi')}</span>}
              {p.pmid && <> · PMID <a href={`https://pubmed.ncbi.nlm.nih.gov/${p.pmid}/`} target="_blank" rel="noreferrer">{p.pmid}</a></>}
              {p.published_date && <> · {new Date(p.published_date).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</>}
              {count(p.id) > 0 && <> · {count(p.id)} {t('sources.records')}</>}
            </p>
            {p.data_access_note && <p className="small muted" style={{ margin: '4px 0 0' }}>{p.data_access_note[lang]}</p>}
            {p.verified && <p className="small muted" style={{ margin: '4px 0 0' }} lang="ru">{t('sources.verified')} {p.verified.date}: {p.verified.by}</p>}
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
                    <thead><tr><th>{t('common.embryo')}</th><th>ESM 2</th><th>ESM, %</th><th>{lang === 'ru' ? 'Набор, %' : 'Dataset, %'}</th><th>{t('common.status')}</th></tr></thead>
                    <tbody>
                      {ver.filter((v) => v.embryo).map((v, i) => (
                        <tr key={i}>
                          <td>{v.embryo}</td><td>{v.esm_label}</td><td className="num">{String(v.esm_value)}</td>
                          <td className="num">{v.dataset_value === null ? '—' : String(v.dataset_value)}</td>
                          <td>{v.status === 'match' ? '✓ ' : v.status === 'not_in_dataset' ? '' : '⚠ '}{t(`verification.${v.status}`)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p style={{ marginTop: 6 }}>{t('verification.datasetKept')}</p>
              </details>
            )}
          </li>
        ))}
      </ol>
    </article>
  )
}
