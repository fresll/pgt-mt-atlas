import type { Bilingual, Lang } from '../data/atlas'
import atlasEs from './atlas-es.json'
import observationEs from './observation-es.json'

/** Translates editorial descriptions only. Source observations and exports remain verbatim. */
export function scientificText(text: Bilingual, lang: Lang): string {
  if (lang !== 'es') return text[lang]
  return (atlasEs as Record<string, string>)[text.en] ?? text.en
}

/** Display-only translations of source labels; identifiers and CSV values stay verbatim. */
export function observationText(value: string, lang: Lang): string
export function observationText(value: string | null, lang: Lang): string | null
export function observationText(value: string | null, lang: Lang): string | null {
  if (lang !== 'es' || value === null) return value
  return (observationEs as Record<string, string>)[value] ?? value
}
