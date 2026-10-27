import { publicationText } from '../../i18n/arabic-text'
import { scientificText } from '../../i18n/scientificText'
import { sourceText } from '../../i18n/source-text-en'
import { useEffect, useMemo, useState } from 'react'
import { DataTable } from '../../components/DataTable'
import { ObservedBadge } from '../../components/ui'
import { atlas, findObservation, label, pubById } from '../../data/atlas'
import { useLang, useT } from '../../i18n'
import { obsValueText } from '../../lib/obs'
import { asset } from '../../lib/base'
import { ObservationDetail } from './Landscape'
import { PageTitle } from '../../components/Layout'

const CSV = ['publication', 'variant', 'embryo', 'sample', 'measurement', 'offspring_measurement', 'analysis_membership', 'verification']

export default function Data() {
  const t = useT()
  const lang = useLang()
  const [variant, setVariant] = useState('')
  const [pub, setPub] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const variants = [...new Set(atlas.landscape.map((o) => o.variant))]
  const pubs = [...new Set(atlas.landscape.map((o) => o.pub))]
  // ?id=<стабильный или прежний ID>: ссылки на наблюдения переживают смену нумерации строк исходной таблицы
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id')
    const o = id ? findObservation(id) : undefined
    if (o) {
      setQuery(id!)
      setSelected(o.id)
    }
  }, [])
  const q = query.trim().toLowerCase()
  const rows = useMemo(
    () =>
      atlas.landscape.filter(
        (o) =>
          (!variant || o.variant === variant) &&
          (!pub || o.pub === pub) &&
          (!q || o.id.toLowerCase().includes(q) || o.legacy_id.toLowerCase() === q || o.variant.toLowerCase().includes(q) || pubById[o.pub].short.toLowerCase().includes(q)),
      ),
    [variant, pub, q],
  )
  const sel = selected ? rows.find((o) => o.id === selected) : null
  const c = atlas.meta.current_counts
  return (
    <article>
      <p><ObservedBadge /></p>
      <PageTitle title={t('data.title')} />
      <h1>{t('data.title')}</h1>
      <p className="lead">{t('data.lead')}</p>
      <p className="small" data-release="current">{t('data.release', {
        n: c.landscape_values,
        base: atlas.meta.baseline.version,
        nBase: atlas.meta.baseline.counts.landscape_values,
        changes: atlas.meta.changes.map((change) => scientificText(change, lang)).join(' '),
      })}</p>

      <h2>{t('data.embryos')}</h2>
      <div className="controls">
        <label>
          {t('data.filterVariant')}
          <select value={variant} onChange={(e) => setVariant(e.target.value)}>
            <option value="">{t('common.all')}</option>
            {variants.map((v) => <option key={v}>{v}</option>)}
          </select>
        </label>
        <label>
          {t('data.filterSource')}
          <select value={pub} onChange={(e) => setPub(e.target.value)}>
            <option value="">{t('common.all')}</option>
            {pubs.map((p) => <option key={p} value={p}>{publicationText(pubById[p].short, lang)}</option>)}
          </select>
        </label>
        <label>
          {t('data.search')}
          <input type="search" value={query} placeholder="HL-…, f3-…" onChange={(e) => setQuery(e.target.value)} />
        </label>
      </div>
      {sel && <ObservationDetail o={sel} onClose={() => setSelected(null)} />}
      <DataTable
        rows={rows}
        rowKey={(o) => o.id}
        selected={selected}
        onSelect={(o) => setSelected(o.id)}
        csvName="pgt-mt-atlas_embryos.csv"
        csvRow={(o) => ({ id: o.id, legacy_id: o.legacy_id, variant: o.variant, value_pct: o.value, qualifier: o.q, low: o.low, high: o.high, lod_pct: o.lod, publication: o.pub, pmid: pubById[o.pub]?.pmid, source_locator: o.source_locator, doi: pubById[o.pub]?.doi, pub_status: pubById[o.pub]?.pub_status, stage: o.stage, stage_raw: o.stage_raw, sample_type: o.sample, material_raw: o.material_raw, derivation: o.derivation, note: o.note, sheet: o.src.sheet, row: o.src.row })}
        columns={[
          { key: 'id', header: lang === 'ar' ? 'المعرّف' : 'ID', render: (o) => o.id, sort: (o) => o.id },
          { key: 'v', header: t('common.variant'), render: (o) => o.variant, sort: (o) => o.variant },
          { key: 'val', header: t('common.value'), render: (o) => obsValueText(o, lang, t), sort: (o) => (o.q === 'interval' ? o.high : o.value), num: true },
          { key: 'p', header: t('common.source'), render: (o) => publicationText(pubById[o.pub].short, lang), sort: (o) => o.pub },
          { key: 'doi', header: 'DOI', render: (o) => pubById[o.pub].doi ?? '—', sort: (o) => pubById[o.pub].doi },
          { key: 'pmid', header: 'PMID', render: (o) => pubById[o.pub].pmid ?? '—', sort: (o) => pubById[o.pub].pmid },
          { key: 'atlasrow', header: t('data.atlasRow', { row: '' }), render: (o) => o.src.row },
          { key: 'locator', header: t('data.locator'), render: (o) => sourceText(o.source_locator ?? '—', lang) },
          { key: 'st', header: t('common.stage'), render: (o) => label('stage', o.stage, lang), sort: (o) => o.stage },
          { key: 'sm', header: t('common.sample'), render: (o) => label('sample_type', o.sample, lang), sort: (o) => o.sample },
          { key: 'd', header: t('common.derivation'), render: (o) => label('derivation', o.derivation, lang), sort: (o) => o.derivation },
        ]}
      />

      <h2>{t('data.csvTitle')}</h2>
      <ul>
        {CSV.map((n) => (
          <li key={n}>
            <a href={asset(`data/csv/${lang !== 'ru' ? 'en/' : ''}${n}.csv`)} download>{n}.csv</a>
          </li>
        ))}
      </ul>
    </article>
  )
}
