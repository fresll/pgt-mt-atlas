// Presentation-only translations; source records and the Russian display are unchanged.
import type { Lang } from '../data/atlas'
import texts from './english-text.json'
import { englishText } from './english-text'
import { spanishText } from './spanish-text'

export const sourceTextEn: Record<string, string> = texts.source

export function sourceText(text: string, lang: Lang): string {
  return lang === 'en' ? englishText(text) : lang === 'es' ? spanishText(text) : text
}
