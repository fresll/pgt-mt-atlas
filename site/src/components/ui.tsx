import type { ReactNode } from 'react'
import { doiUrl, pubById, type Publication, type Verification } from '../data/atlas'
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
      {p.short} [{p.review_ref_no}]{' '}
      {p.doi ? (
        <Doi doi={p.doi} />
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
            {v.dataset_value !== null && ` · ${lang === 'ru' ? 'набор' : 'dataset'} ${String(v.dataset_value)}%`}
            {(lang === 'ru' ? v.comment_ru : v.comment_en) && <> — {lang === 'ru' ? v.comment_ru : v.comment_en}</>}
          </li>
        ))}
      </ul>
      {items.some((v) => v.status === 'value_mismatch' || v.status === 'fraction_label_mismatch') && (
        <p style={{ margin: '6px 0 0' }}>{t('verification.datasetKept')}</p>
      )}
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

/** Фотография из public/img: WebP с JPEG-запасным вариантом. */
export function Photo({ src, w, h, alt, className, eager = false }: { src: string; w: number; h: number; alt: string; className?: string; eager?: boolean }) {
  const base = import.meta.env.BASE_URL
  return (
    <picture className={className}>
      <source srcSet={`${base}${src}.webp`} type="image/webp" />
      <img src={`${base}${src}.jpg`} width={w} height={h} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
    </picture>
  )
}

/** DOI как ссылка в едином стиле. */
export function Doi({ doi }: { doi: string }) {
  return (
    <a className="doi" href={doiUrl(doi)} target="_blank" rel="noreferrer">
      doi:{doi}
    </a>
  )
}
