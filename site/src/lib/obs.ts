import type { TFunction } from 'i18next'
import type { EmbryoObservation, Lang, OffspringPair } from '../data/atlas'
import { fmt, pct } from './format'

export function obsValueText(o: Pick<EmbryoObservation, 'q' | 'value' | 'low' | 'high' | 'lod'>, lang: Lang, t: TFunction): string {
  if (o.q === 'interval') return t('common.interval', { low: fmt(o.low, lang), high: fmt(o.high, lang) })
  if (o.q === 'not_detected')
    return `${pct(0, lang)} — ${t('common.notDetected')}${o.lod !== null ? ` (${t('common.lod', { lod: fmt(o.lod, lang) })})` : ''}`
  return pct(o.value, lang, 2)
}

export function pairValueText(v: number | null, q: OffspringPair['q'], raw: string | null, lang: Lang, t: TFunction): string {
  if (q === 'not_detected') return `${pct(0, lang)} — ${t('common.notDetected')}`
  if (q === 'less_than') return t('common.lessThan', { v: fmt(v, lang) })
  if (q === 'qualitative') return raw ?? '—'
  return pct(v, lang, 2)
}
