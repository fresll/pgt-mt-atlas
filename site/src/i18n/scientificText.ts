import type { Bilingual, Lang } from '../data/atlas'
import atlasEs from './atlas-es.json'

/** Translates editorial descriptions only. Source observations and exports remain verbatim. */
export function scientificText(text: Bilingual, lang: Lang): string {
  if (lang !== 'es') return text[lang]
  return (atlasEs as Record<string, string>)[text.en] ?? text.en
}
