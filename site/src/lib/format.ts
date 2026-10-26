import type { Lang } from '../data/atlas'

export function fmt(x: number | null | undefined, lang: Lang, digits = 1): string {
  if (x === null || x === undefined || Number.isNaN(x)) return '—'
  return new Intl.NumberFormat({ ru: 'ru-RU', en: 'en-GB', es: 'es-ES', 'zh-Hans': 'zh-CN' }[lang], {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(x)
}

export function fmtFixed(x: number, lang: Lang, digits = 2): string {
  return new Intl.NumberFormat({ ru: 'ru-RU', en: 'en-GB', es: 'es-ES', 'zh-Hans': 'zh-CN' }[lang], {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(x)
}

export function pct(x: number | null | undefined, lang: Lang, digits = 1): string {
  return x === null || x === undefined ? '—' : `${fmt(x, lang, digits)}${lang === 'es' ? '\u00a0' : ''}%`
}

export function frac(k: number, n: number, lang: Lang): string {
  return `${fmtFixed(n ? k / n : 0, lang, 2)} (${k}/${n})`
}

/** Форма слова для числа: RU — [1, 2–4, 5+] (Intl.PluralRules), EN — [1, остальные]. */
export function plural(n: number, lang: Lang, forms: [string, string, string]): string {
  if (lang !== 'ru') return n === 1 ? forms[0] : forms[2]
  const c = new Intl.PluralRules('ru-RU').select(n)
  return c === 'one' ? forms[0] : c === 'few' ? forms[1] : forms[2]
}
