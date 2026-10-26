import translations from './display-zh.json'
import { englishText } from './english-text'
/** Presentation only: never rewrite scientific records or identifiers. */
export function chineseText(value: string): string {
  const table = translations as Record<string, string>
  const en = englishText(value)
  if (table[value] !== undefined) return table[value]
  if (table[en] !== undefined) return table[en]
  let text = en
  for (const key of ['Figure 3', 'Figure 4', 'Figure 5', 'Figure 6', 'Table 1', 'Hu 2026 (16 embryo samples)', 'Supplementary information.xlsx']) text = text.replaceAll(key, table[key] ?? key)
  return text
}
