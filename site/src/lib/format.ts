import type { Lang } from '../data/atlas'

export function fmt(x: number | null | undefined, lang: Lang, digits = 1): string {
  if (x === null || x === undefined || Number.isNaN(x)) return '—'
  return new Intl.NumberFormat(lang === 'ru' ? 'ru-RU' : 'en-GB', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(x)
}

export function fmtFixed(x: number, lang: Lang, digits = 2): string {
  return new Intl.NumberFormat(lang === 'ru' ? 'ru-RU' : 'en-GB', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(x)
}

export function pct(x: number | null | undefined, lang: Lang, digits = 1): string {
  return x === null || x === undefined ? '—' : `${fmt(x, lang, digits)}%`
}

export function frac(k: number, n: number, lang: Lang): string {
  return `${fmtFixed(n ? k / n : 0, lang, 2)} (${k}/${n})`
}
