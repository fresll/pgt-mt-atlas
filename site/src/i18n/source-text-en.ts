// Presentation-only translations; source records and the Russian display are unchanged.
import { arabicText } from './arabic-text'
import { chineseText } from './chinese-text'
import type { Lang } from '../data/atlas'
import texts from './english-text.json'
import { englishText } from './english-text'
import { spanishText } from './spanish-text'

export const sourceTextEn: Record<string, string> = texts.source

export function sourceText(text: string, lang: Lang): string {
  if (lang === 'ar') return arabicText(text)
  if (lang === 'zh-Hans') return chineseText(text)
  return lang === 'en' ? englishText(text) : lang === 'es' ? spanishText(text) : text
}
