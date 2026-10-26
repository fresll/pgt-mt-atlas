import { chineseText } from '../i18n/chinese-text'
import { spanishText } from '../i18n/spanish-text'
import { sourceText } from '../i18n/source-text-en'
import type { ReactNode } from 'react'
import { correctionsFor, doiUrl, label, pubById, type Publication, type Verification } from '../data/atlas'
import { useLang, useT } from '../i18n'

export function Badge({ kind, children }: { kind: 'observed' | 'model' | 'warn' | 'neutral'; children: ReactNode }) {
  return <span className={`badge ${kind}`}>{children}</span>
}

export function ObservedBadge() {
  const t = useT()
  return (
    <Badge kind="observed">
      <span aria-hidden>●</span> {t('badge.observed')}
    </Badge>
  )
}

export function ModelBadge() {
  const t = useT()
  return (
    <Badge kind="model">
      <span aria-hidden>◆</span> {t('badge.model')}
    </Badge>
  )
}

export function PubStatus({ p }: { p: Publication }) {
  const t = useT()
  return <Badge kind={p.pub_status === 'published' ? 'neutral' : 'warn'}>{t(`pubStatus.${p.pub_status}`)}</Badge>
}

/** Ссылка на публикацию: краткое имя + DOI (если подтверждён) + статус. */
export function PubRef({ id, showStatus = false }: { id: string; showStatus?: boolean }) {
  const t = useT()
  const p = pubById[id]
  if (!p) return <span>{id}</span>
  return (
    <span>
      {p.short}{' '}
      {p.doi ? (
        <a href={doiUrl(p.doi)} target="_blank" rel="noreferrer">
          doi:{p.doi}
        </a>
      ) : (
        <span className="muted">({t('common.noDoi')})</span>
      )}
      {showStatus && (
        <>
          {' '}
          <PubStatus p={p} />
        </>
      )}
    </span>
  )
}

export function Detail({ title, rows, onClose, children }: { title: ReactNode; rows: [ReactNode, ReactNode][]; onClose?: () => void; children?: ReactNode }) {
  const t = useT()
  return (
    <section className="detail" aria-live="polite">
      <div className="head">
        <strong>{title}</strong>
        {onClose && (
          <button className="ghost" type="button" onClick={onClose}>
            {t('common.close')}
          </button>
        )}
      </div>
      <dl>
        {rows
          .filter(([, v]) => v !== null && v !== undefined && v !== '')
          .map(([k, v], i) => (
            <div key={i} style={{ display: 'contents' }}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
      </dl>
      {children}
    </section>
  )
}

/** Корректировки записей эмбриона по опубликованному источнику: было → стало, источник и локатор. */
export function CorrectionList({ embryo }: { embryo: string }) {
  const t = useT()
  const lang = useLang()
  const items = correctionsFor(embryo)
  if (!items.length) return null
  const show = (field: string, v: number | string) => (field === 'fraction' ? label('fraction', String(v), lang) : `${String(v).replace('.', lang === 'ru' || lang === 'es' ? ',' : '.')}%`)
  return (
    <div className="callout small" style={{ marginBottom: 8 }} data-corrections={items.length}>
      <strong>{t('verification.correctedTitle')}</strong>
      <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
        {items.map((c) => (
          <li key={c.id}>
            {label('fraction', c.target.fraction, lang)}: {show(c.field, c.from)} ({t('verification.sourceValue')}, «{sourceText(c.target.sheet, lang)}», {lang === 'zh-Hans' ? '行' : lang === 'ru' ? 'строка' : lang === 'es' ? 'fila' : 'row'} {c.target.row}) → <strong>{show(c.field, c.to)}</strong>
            <br />
            <span className="muted">{c.source.document}; {c.source.locator}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function VerificationList({ items }: { items: Verification[] }) {
  const t = useT()
  const lang = useLang()
  if (!items.length) return null
  return (
    <div className="callout warn small" style={{ marginBottom: 0 }}>
      <strong>{t('verification.title')}</strong> ({items[0].source})
      <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
        {items.map((v, i) => (
          <li key={i}>
            {v.esm_label}: ESM {String(v.esm_value)}% · {t(`verification.${v.status}`)}
            {v.resolution === 'corrected' && <> · <strong>{t('verification.corrected')}</strong></>}
            {v.dataset_value !== null && ` · ${lang === 'zh-Hans' ? '数据集' : lang === 'ru' ? 'набор' : lang === 'es' ? 'conjunto de datos' : 'dataset'} ${String(v.dataset_value)}%`}
            {(lang === 'zh-Hans' ? chineseText(v.comment_en ?? '') : lang === 'ru' ? v.comment_ru : lang === 'es' ? spanishText(v.comment_en ?? '') : v.comment_en) && <> — {lang === 'zh-Hans' ? chineseText(v.comment_en ?? '') : lang === 'ru' ? v.comment_ru : lang === 'es' ? spanishText(v.comment_en ?? '') : v.comment_en}</>}
          </li>
        ))}
      </ul>
      {items.some((v) => (v.status === 'value_mismatch' || v.status === 'fraction_label_mismatch') && v.resolution !== 'corrected') && (
        <p style={{ margin: '6px 0 0' }}>{t('verification.datasetKept')}</p>
      )}
      {items.some((v) => v.resolution === 'corrected') && <p style={{ margin: '6px 0 0' }}>{t('verification.correctedNote')}</p>}
    </div>
  )
}

export function Seg<T extends string | number>({ value, options, onChange, label }: { value: T; options: { v: T; label: ReactNode }[]; onChange: (v: T) => void; label: string }) {
  return (
    <span className="seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={String(o.v)} type="button" aria-pressed={o.v === value} onClick={() => onChange(o.v)}>
          {o.label}
        </button>
      ))}
    </span>
  )
}
