import { arabicText } from './arabic-text'
import { chineseText } from './chinese-text'
import type { Bilingual, Lang } from '../data/atlas'
import { spanishText } from './spanish-text'
import observationEs from './observation-es.json'

/** Translates editorial descriptions only. Source observations and exports remain verbatim. */
export function scientificText(text: Pick<Bilingual, 'en' | 'ru'>, lang: Lang): string {
  if (lang === 'ar') return arabicText(text.en)
  if (lang === 'zh-Hans') return chineseText(text.en)
  if (lang !== 'es') return text[lang]
  return spanishText(text.en)
}

/** Display-only translations of source labels; identifiers and CSV values stay verbatim. */
export function observationText(value: string, lang: Lang): string
export function observationText(value: string | null, lang: Lang): string | null
export function observationText(value: string | null, lang: Lang): string | null {
  if (lang === 'ar' && value !== null) return arabicText(value)
  if (lang === 'zh-Hans' && value !== null) return chineseText(value)
  if (lang !== 'es' || value === null) return value
  return (observationEs as Record<string, string>)[value] ?? spanishText(value)
}
