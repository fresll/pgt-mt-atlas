import { DataTable } from '../../components/DataTable'
import { ObservedBadge, PubRef } from '../../components/ui'
import { atlas } from '../../data/atlas'
import { useLang, useT } from '../../i18n'

export default function Cases() {
  const t = useT()
  const lang = useLang()
  return (
    <article>
      <p><ObservedBadge /></p>
      <h1>{t('cases.title')}</h1>
      <p className="lead">{t('cases.lead')}</p>
      <p className="callout warn small">
        {lang === 'ru'
          ? 'Номера в квадратных скобках внутри ячеек взяты из исходной таблицы как есть и не соответствуют списку источников атласа. Источник каждой строки указан в столбце «Источник».'
          : lang === 'es' ? 'Los números entre corchetes dentro de las celdas se reproducen literalmente del libro de origen y no corresponden a la lista de fuentes del Atlas. La fuente de cada fila se indica en la columna «Fuente».' : 'Numbers in square brackets inside cells are quoted from the source workbook as is and do not correspond to the Atlas source list. The source of each row is given in the “Source” column.'}
      </p>
      <DataTable
        maxHeight={900}
        rows={atlas.table1}
        rowKey={(r) => String(r.row)}
        csvName="pgt-mt-atlas_table1.csv"
        csvRow={(r) => ({ variant: r.variant, phenotype: r.phenotype, pool_range: r.pool_range, transferred: r.transferred, offspring: r.offspring, publications: r.pubs.join('; '), data_type: r.data_type, value_origin: r.value_origin, sheet_row: r.row })}
        columns={[
          { key: 'v', header: t('common.variant'), render: (r) => <strong>{r.variant}</strong>, sort: (r) => r.variant },
          { key: 'ph', header: lang === 'es' ? 'Fenotipo' : 'Phenotype / фенотип', render: (r) => <span lang="ru">{r.phenotype}</span> },
          { key: 'pool', header: t('cases.range'), render: (r) => <span lang="ru">{r.pool_range}</span> },
          { key: 'tr', header: t('cases.transferred'), render: (r) => <span lang="ru">{r.transferred}</span> },
          { key: 'off', header: t('cases.offspring'), render: (r) => <span lang="ru">{r.offspring}</span> },
          { key: 'src', header: t('common.source'), render: (r) => r.pubs.map((p) => <div key={p}><PubRef id={p} showStatus /></div>), sort: (r) => r.pubs[0] },
          { key: 'dt', header: t('cases.dataType'), render: (r) => <span lang="ru">{r.data_type}</span> },
          { key: 'or', header: t('cases.origin'), render: (r) => <span lang="ru" className="small">{r.value_origin}</span> },
        ]}
      />
    </article>
  )
}
