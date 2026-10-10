import { useMemo, useState, type ReactNode } from 'react'
import { downloadCsv } from '../lib/csv'
import { useT } from '../i18n'

export interface Column<R> {
  key: string
  header: ReactNode
  render: (r: R) => ReactNode
  sort?: (r: R) => number | string | null
  num?: boolean
}

export function DataTable<R>({ rows, columns, rowKey, selected, onSelect, csvName, csvRow, maxHeight = 420 }: {
  rows: R[]
  columns: Column<R>[]
  rowKey: (r: R) => string
  selected?: string | null
  onSelect?: (r: R) => void
  csvName?: string
  csvRow?: (r: R) => Record<string, unknown>
  maxHeight?: number
}) {
  const t = useT()
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [asc, setAsc] = useState(true)
  const sorted = useMemo(() => {
    const col = columns.find((c) => c.key === sortKey)
    if (!col?.sort) return rows
    const s = col.sort
    return [...rows].sort((a, b) => {
      const x = s(a), y = s(b)
      if (x === y) return 0
      if (x === null) return 1
      if (y === null) return -1
      return (x < y ? -1 : 1) * (asc ? 1 : -1)
    })
  }, [rows, columns, sortKey, asc])
  return (
    <div>
      {csvName && csvRow && (
        <p style={{ margin: '0 0 8px' }}>
          <button className="ghost" type="button" onClick={() => downloadCsv(csvName, sorted.map(csvRow))}>
            {t('common.downloadVisibleCsv')}
          </button>{' '}
          <span className="muted small">n = {rows.length}</span>
        </p>
      )}
      <div className="table-wrap" style={{ maxHeight }}>
        <table className="data">
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={sortKey === c.key ? (asc ? 'ascending' : 'descending') : 'none'}
                  onClick={() => {
                    if (!c.sort) return
                    if (sortKey === c.key) setAsc(!asc)
                    else {
                      setSortKey(c.key)
                      setAsc(true)
                    }
                  }}
                >
                  {c.header}
                  {sortKey === c.key ? (asc ? ' ▲' : ' ▼') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => {
              const k = rowKey(r)
              return (
                <tr
                  key={k}
                  className={selected === k ? 'sel' : undefined}
                  onClick={() => onSelect?.(r)}
                  tabIndex={onSelect ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault()
                      onSelect(r)
                    }
                  }}
                >
                  {columns.map((c) => (
                    <td key={c.key} className={c.num ? 'num' : undefined}>
                      {c.render(r)}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
