import { DataTable } from '../../components/DataTable'
import { ObservedBadge, PubRef } from '../../components/ui'
import { atlas } from '../../data/atlas'
import { useLang, useT } from '../../i18n'
import { caseTextEn } from '../../content/cases/en'
import { PageTitle } from '../../components/Layout'

export default function Cases() {
  const t = useT()
  const lang = useLang()
  const text = (value: string) => lang === 'en' ? caseTextEn[value] ?? value : value
  return (
    <article>
      <p><ObservedBadge /></p>
      <PageTitle title={t('cases.title')} />
      <h1>{t('cases.title')}</h1>
      <p className="lead">{t('cases.lead')}</p>
      <p className="callout small">
        {t('interfaceCopy.Cases.primaryAttribution')}
      </p>
      <DataTable
        maxHeight={900}
        rows={atlas.table1}
        rowKey={(r) => String(r.row)}
        csvName="pgt-mt-atlas_table1.csv"
        csvRow={(r) => ({ variant: r.variant, pool_range: r.pool_range, transferred: r.transferred, offspring: r.offspring, publications: r.pubs.join('; '), data_type: r.data_type, value_origin: r.value_origin, sheet_row: r.row })}
        columns={[
          { key: 'v', header: t('common.variant'), render: (r) => <strong>{text(r.variant)}</strong>, sort: (r) => r.variant },
          { key: 'pool', header: t('cases.range'), render: (r) => <span lang={lang}>{text(r.pool_range)}</span> },
          { key: 'tr', header: t('cases.transferred'), render: (r) => <span lang={lang}>{text(r.transferred)}</span> },
          { key: 'off', header: t('cases.offspring'), render: (r) => <span lang={lang}>{text(r.offspring)}</span> },
          { key: 'src', header: t('common.source'), render: (r) => r.pubs.map((p) => <div key={p}><PubRef id={p} showStatus /></div>), sort: (r) => r.pubs[0] },
          { key: 'dt', header: t('cases.dataType'), render: (r) => <span lang={lang}>{text(r.data_type)}</span> },
          { key: 'or', header: t('cases.origin'), render: (r) => <span lang={lang} className="small">{text(r.value_origin)}</span> },
        ]}
      />
    </article>
  )
}
