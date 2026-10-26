import { chineseText } from './chinese-text'
import display from './display-es.json'
import atlas from './atlas-es.json'
import observations from './observation-es.json'
import { englishText } from './english-text'

const translations: Record<string, string> = { ...atlas, ...observations, ...display }

/** Presentation only: scientific records, identifiers and exports are never mutated. */
export function spanishText(value: string): string {
  const direct = translations[value] ?? translations[englishText(value)]
  if (direct !== undefined) return direct
  let text = englishText(value)
  for (const word of ['Figure 3', 'Figure 4', 'Figure 5', 'Figure 6', 'Table 1', 'Hu 2026 (16 embryo samples)', 'Supplementary information.xlsx']) text = text.replaceAll(word, translations[word])
  return text
}

type Localized<T> = T extends { en: infer E; ru: unknown } ? T & { es: E; 'zh-Hans': E }
  : T extends (infer I)[] ? Localized<I>[]
  : T extends object ? { [K in keyof T]: Localized<T[K]> } : T

/** Adds a display language to editorial pairs while preserving the input object. */
export function withSpanish<T>(value: T): Localized<T> {
  function visit(v: unknown): unknown {
    if (Array.isArray(v)) return v.map(visit)
    if (!v || typeof v !== 'object') return v
    const source = v as Record<string, unknown>
    const out = Object.fromEntries(Object.entries(source).map(([key, item]) => [key, visit(item)]))
    if (typeof source.en === 'string' && typeof source.ru === 'string') { out.es = spanishText(source.en); out['zh-Hans'] = chineseText(source.en) }
    else if (Array.isArray(source.en) && Array.isArray(source.ru)) { out.es = source.en.map((s) => typeof s === 'string' ? spanishText(s) : visit(s)); out['zh-Hans'] = source.en.map((s) => typeof s === 'string' ? chineseText(s) : visit(s)) }
    return out
  }
  return visit(value) as Localized<T>
}
