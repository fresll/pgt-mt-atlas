import texts from './english-text.json'

const translations: Record<string, string> = { ...texts.source, ...texts.cases, ...texts.metadata }
const sheetNames = Object.entries(texts.metadata).filter(([key]) => /^(Рисунок|Таблица|Hu 2026|Сопроводительная)/.test(key)).sort(([a], [b]) => b.length - a.length)

/** English aliases preserve the source row/cell coordinates and the original record IDs. */
export function englishText(value: string): string {
  let text = translations[value] ?? value
  for (const [source, target] of sheetNames) text = text.replaceAll(source, target)
  return text
}

export function englishValue(value: unknown): unknown {
  if (typeof value === 'string') return englishText(value)
  if (Array.isArray(value)) return value.map(englishValue)
  if (value !== null && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, englishValue(item)]))
  return value
}

export function englishRows(rows: Record<string, unknown>[]): Record<string, unknown>[] {
  return rows.map(row => Object.fromEntries(Object.entries(row).map(([key, value]) => [key, englishValue(value)])))
}
