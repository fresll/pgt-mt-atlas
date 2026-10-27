import display from './display-ar.json'
import { englishText } from './english-text'
/** Display only. Scientific records, identifiers and exports are never mutated. */
export function arabicText(value: string): string {
  const table = display as Record<string, string>
  return table[value] ?? table[englishText(value)] ?? englishText(value)
}

/** Translate short citations only in Arabic; keep source records intact. */
export function publicationText(value: string, lang: string): string {
  return lang === 'ar' ? arabicText(value) : value
}
