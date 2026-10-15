import { useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Inline } from '../../content/fundamentals/markup'
import type { WidgetId } from '../../content/fundamentals/types'
import { fmtFixed } from '../../lib/format'
import { useLang, useT } from '../../i18n'
import geometry from '../../illustrations/fundamentals.json'
import labels from '../../illustrations/labels.json'
import { rng, simulateOocytes, stackDots, summarize, theoreticalSd } from '../../model/bottleneck'
import { ModelBadge } from '../ui'
import { Illustration } from '../Sketch'

// Образовательные схемы и модели раздела Fundamentals. Ни одна из них не использует экспериментальных
// результатов: иллюстрации понятий (гетероплазмия, порог, стадии, бластоциста) и одна модель (горлышко).

/** Префикс строк i18n для каждой схемы (fundamentals.<prefix>.*). */
export const WIDGET_KEYS: Record<WidgetId, string> = { heteroplasmy: 'het', threshold: 'thr', bottleneck: 'bn', development: 'dev', blastocyst: 'bx' }

function Frame({ id, kind, title, children, caption, badge }: { id: WidgetId; kind: string; title: string; children: ReactNode; caption?: ReactNode; badge?: ReactNode }) {
  return (
    <figure className={`fd-widget fd-w-${id}`} id={`model-${id}`}>
      <header className="fd-widget-head">
        <p className="fd-widget-kind">{kind}</p>
        <h3>{title}</h3>
        {badge}
      </header>
      {children}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

/** Подписи «от руки» поверх иллюстрации (координаты в процентах, как на главной). */
function PlateLabels({ items, prefix }: { items: { key: string; x: number; y: number; align: string; tone: string }[]; prefix: string }) {
  const t = useT()
  return (
    <>
      {items.map((l) => (
        <span key={l.key} className={`sk-label ${l.align} ${l.tone === 'r' ? 'red' : ''}`} style={{ '--x': `${l.x}%`, '--y': `${l.y}%` } as CSSProperties} aria-hidden="true">
          {t(`${prefix}.${l.key}`)}
        </span>
      ))}
    </>
  )
}

// ——— A. Heteroplasmy Explorer ———
const CELL = geometry.cell
// фиксированный случайный порядок: при росте доли мутантными становятся всё новые молекулы во всех митохондриях
const ORDER = (() => {
  const r = rng(2026)
  const idx = CELL.slots.map((_, i) => i)
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[idx[i], idx[j]] = [idx[j], idx[i]]
  }
  const rank = new Array<number>(idx.length)
  idx.forEach((slot, k) => (rank[slot] = k))
  return rank
})()

function HeteroplasmyExplorer() {
  const t = useT()
  const [pct, setPct] = useState(30)
  const n = CELL.slots.length
  const m = Math.round((pct / 100) * n)
  const state = m === 0 ? 'wt' : m === n ? 'mut' : 'het'
  return (
    <Frame id="heteroplasmy" kind={t('fundamentals.het.kind')} title={t('fundamentals.het.title')} caption={t('fundamentals.het.note')}>
      <div className="fd-het">
        <div className="fd-het-plate">
          <Illustration name="cell" />
          <svg className="fd-overlay" viewBox={`0 0 ${CELL.w} ${CELL.h}`} aria-hidden="true" focusable="false">
            {CELL.slots.map(([x, y], i) => {
              const mut = ORDER[i] < m
              return (
                <g key={i} className={mut ? 'fd-mt mut' : 'fd-mt'}>
                  <circle cx={x} cy={y} r={CELL.r} />
                  <circle cx={x} cy={y} r={CELL.r * 0.55} className="inner" />
                </g>
              )
            })}
          </svg>
        </div>
        <div className="fd-het-panel">
          <label className="fd-range">
            <span>{t('fundamentals.het.slider')}</span>
            <input type="range" min={0} max={100} step={1} value={pct} onChange={(e) => setPct(Number(e.target.value))} aria-valuetext={`${pct}%`} />
          </label>
          <p className="fd-big" aria-live="polite">
            {pct}
            <small>%</small>
          </p>
          <p className="fd-het-count">{t('fundamentals.het.count', { m, n })}</p>
          <p className={`fd-het-state ${state}`}>{t(`fundamentals.het.${state}`)}</p>
          <ul className="fd-legend">
            <li><span className="fd-sw" aria-hidden="true" /> {t('fundamentals.het.legendWt')}</li>
            <li><span className="fd-sw mut" aria-hidden="true" /> {t('fundamentals.het.legendMut')}</li>
          </ul>
          <p className="fd-small">{t('fundamentals.het.caption')}</p>
        </div>
      </div>
    </Frame>
  )
}

// ——— Схема порогового эффекта (без числовых значений) ———
function ThresholdSchematic() {
  const t = useT()
  const lang = useLang()
  const W = 560, H = 300, x0 = 64, x1 = 530, y0 = 250, y1 = 30
  const curve = (th: number, w: number, wob: number) => {
    const pts: string[] = []
    for (let i = 0; i <= 60; i++) {
      const h = i / 60
      const f = 1 / (1 + Math.exp((h - th) / w))
      const y = y0 - (y0 - y1) * (0.06 + 0.9 * f) + Math.sin(i * 1.7 + wob) * 0.8
      pts.push(`${i ? 'L' : 'M'}${(x0 + (x1 - x0) * h).toFixed(1)} ${y.toFixed(1)}`)
    }
    return pts.join('')
  }
  const tx = (h: number) => x0 + (x1 - x0) * h
  return (
    <Frame id="threshold" kind={t('fundamentals.thr.kind')} title={t('fundamentals.thr.title')} caption={<Inline s={t('fundamentals.thr.caption')} lang={lang} />}>
      <svg className="fd-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t('fundamentals.thr.title')}>
        <path className="fd-ax" d={`M${x0} ${y1 - 8}L${x0} ${y0}L${x1 + 6} ${y0}`} />
        <path className="fd-ax thin" d={`M${x0 - 5} ${y1 - 2}L${x0} ${y1 - 10}L${x0 + 5} ${y1 - 2}M${x1 - 2} ${y0 - 5}L${x1 + 7} ${y0}L${x1 - 2} ${y0 + 5}`} />
        <path className="fd-curve" d={curve(0.62, 0.05, 0)} />
        <path className="fd-curve b" d={curve(0.82, 0.035, 1)} />
        <path className="fd-th" d={`M${tx(0.62)} ${y0}L${tx(0.62)} 22`} />
        <path className="fd-th" d={`M${tx(0.82)} ${y0}L${tx(0.82)} 22`} />
        <text x={tx(0.62)} y={14} textAnchor="middle" className="fd-hand">{t('fundamentals.thr.zone')}</text>
        <text x={tx(0.82)} y={14} textAnchor="middle" className="fd-hand">{t('fundamentals.thr.zone')}</text>
        <path className="fd-curve" d={`M${tx(0.04)} ${y0 - 58}L${tx(0.1)} ${y0 - 58}`} />
        <text x={tx(0.12)} y={y0 - 52} className="fd-hand ink">{t('fundamentals.thr.a')}</text>
        <path className="fd-curve b" d={`M${tx(0.04)} ${y0 - 30}L${tx(0.1)} ${y0 - 30}`} />
        <text x={tx(0.12)} y={y0 - 24} className="fd-hand red">{t('fundamentals.thr.b')}</text>
        <text x={x0} y={y0 + 20} textAnchor="middle" className="fd-tick">0</text>
        <text x={x1} y={y0 + 20} textAnchor="middle" className="fd-tick">100</text>
        <text x={(x0 + x1) / 2} y={y0 + 38} textAnchor="middle" className="fd-axlabel">{t('fundamentals.thr.x')}</text>
        <text x={18} y={(y0 + y1) / 2} textAnchor="middle" className="fd-axlabel" transform={`rotate(-90 18 ${(y0 + y1) / 2})`}>{t('fundamentals.thr.y')}</text>
      </svg>
    </Frame>
  )
}

// ——— B. Genetic Bottleneck Simulator ———
const N_OPTIONS = [5, 10, 20, 50, 100, 200, 500]
const COUNT_OPTIONS = [10, 30, 100]

function BottleneckSimulator() {
  const t = useT()
  const lang = useLang()
  const [h0, setH0] = useState(30)
  const [nIdx, setNIdx] = useState(2)
  const [count, setCount] = useState(30)
  const [draw, setDraw] = useState(1)
  const N = N_OPTIONS[nIdx]
  const values = useMemo(() => simulateOocytes(h0 / 100, N, count, 7919 * draw), [h0, N, count, draw])
  const s = summarize(values)
  const pc = (v: number) => String(Math.round(v * 100))
  const sd = fmtFixed(theoreticalSd(h0 / 100, N) * 100, lang, 1)
  // точечный график: столбики по 2.5%
  const W = 640, x0 = 28, x1 = 616, base = 214, top = 18
  const dots = stackDots(values, 0.025)
  const maxStack = Math.max(1, ...dots.map(([, k]) => k + 1))
  const step = Math.min(13, (base - top) / maxStack)
  const r = Math.max(2.2, Math.min(5.6, step * 0.44))
  const X = (v: number) => x0 + (x1 - x0) * v
  const limits = t('fundamentals.bn.limits', { returnObjects: true }) as unknown as string[]
  return (
    <Frame id="bottleneck" kind={t('fundamentals.bn.kind')} title={t('fundamentals.bn.title')} badge={<ModelBadge />}>
      <p className="fd-banner">{t('fundamentals.bn.banner')}</p>
      <div className="fd-controls">
        <label className="fd-range">
          <span>
            {t('fundamentals.bn.h0')}: <strong>{h0}%</strong>
          </span>
          <input type="range" min={0} max={100} step={1} value={h0} onChange={(e) => setH0(Number(e.target.value))} aria-valuetext={`${h0}%`} />
        </label>
        <label className="fd-range">
          <span>
            {t('fundamentals.bn.n')}: <strong>{N}</strong>
          </span>
          <input type="range" min={0} max={N_OPTIONS.length - 1} step={1} value={nIdx} onChange={(e) => setNIdx(Number(e.target.value))} aria-valuetext={`N = ${N}`} />
        </label>
        <div className="fd-choice" role="group" aria-label={t('fundamentals.bn.count')}>
          <span>{t('fundamentals.bn.count')}</span>
          {COUNT_OPTIONS.map((c) => (
            <button key={c} type="button" aria-pressed={c === count} onClick={() => setCount(c)}>
              {c}
            </button>
          ))}
        </div>
        <button type="button" className="fd-redraw" onClick={() => setDraw((d) => d + 1)}>
          ↻ {t('fundamentals.bn.redraw')}
        </button>
      </div>
      <svg className="fd-chart fd-dots" viewBox={`0 0 ${W} 262`} role="img" aria-label={`${t('fundamentals.bn.title')}: ${t('fundamentals.bn.summary', { med: pc(s.median), q1: pc(s.q1), q3: pc(s.q3), min: pc(s.min), max: pc(s.max), sd })}`}>
        <path className="fd-ax" d={`M${x0} ${base + 6}L${x1} ${base + 6}`} />
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <g key={v}>
            <path className="fd-ax thin" d={`M${X(v)} ${base + 6}L${X(v)} ${base + 12}`} />
            <text x={X(v)} y={base + 26} textAnchor="middle" className="fd-tick">{v * 100}</text>
          </g>
        ))}
        <text x={(x0 + x1) / 2} y={base + 44} textAnchor="middle" className="fd-axlabel">{t('fundamentals.bn.axis')}</text>
        <path className="fd-start" d={`M${X(h0 / 100)} ${top - 6}L${X(h0 / 100)} ${base + 6}`} />
        <text x={X(h0 / 100) + (h0 > 80 ? -6 : 6)} y={top + 4} textAnchor={h0 > 80 ? 'end' : 'start'} className="fd-hand">{t('fundamentals.bn.start')}</text>
        {dots.map(([x, k], i) => (
          <circle key={i} className="fd-dot" cx={X(x)} cy={base - r - k * step} r={r} style={{ '--h': values[i] } as CSSProperties} />
        ))}
      </svg>
      <p className="fd-summary" aria-live="polite">
        {t('fundamentals.bn.summary', { med: pc(s.median), q1: pc(s.q1), q3: pc(s.q3), min: pc(s.min), max: pc(s.max), sd })} <span className="muted">({t('fundamentals.bn.seed', { n: draw })})</span>
      </p>
      <div className="fd-model-notes">
        <div>
          <h4>{t('fundamentals.bn.modelTitle')}</h4>
          <p>
            <Inline s={t('fundamentals.bn.model')} lang={lang} />
          </p>
          <p className="fd-formula">K ~ Bin(N, h₀) · h = K / N · E[h] = h₀ · SD(h) = √(h₀(1 − h₀) / N)</p>
        </div>
        <div>
          <h4>{t('fundamentals.bn.limitsTitle')}</h4>
          <ul className="fd-list compact">
            {limits.map((x) => (
              <li key={x}>
                <Inline s={x} lang={lang} />
              </li>
            ))}
          </ul>
          <p>
            <Link className="sk-link" to={`/${lang}/science/heteroplasmy-landscape/`}>{t('landscape.title')} →</Link>
          </p>
        </div>
      </div>
    </Frame>
  )
}

// ——— Стадии до имплантации ———
function DevelopmentFigure() {
  const t = useT()
  return (
    <Frame id="development" kind={t('fundamentals.dev.kind')} title={t('fundamentals.dev.title')} caption={t('fundamentals.dev.caption')}>
      <div className="sk-plate fd-dev">
        <Illustration name="development" />
        <PlateLabels items={labels.development} prefix="fundamentals.dev.labels" />
      </div>
    </Frame>
  )
}

// ——— C. Blastocyst & Biopsy Explorer ———
type Part = 'te' | 'icm' | 'bx'
const PARTS: Part[] = ['te', 'icm', 'bx']
const BX = geometry.blastocyst

function BlastocystExplorer() {
  const t = useT()
  const lang = useLang()
  const [sel, setSel] = useState<Part>('te')
  const k = `fundamentals.bx.parts.${sel}`
  const rows: [string, string][] = [
    ['origin', `${k}.origin`],
    ['fate', `${k}.fate`],
    ['diagnostic', `${k}.diagnostic`],
    ['caveat', `${k}.caveat`],
  ]
  return (
    <Frame id="blastocyst" kind={t('fundamentals.bx.kind')} title={t('fundamentals.bx.title')} caption={t('fundamentals.bx.caption')}>
      <div className="fd-choice fd-parts" role="group" aria-label={t('fundamentals.bx.choose')}>
        {PARTS.map((p) => (
          <button key={p} type="button" aria-pressed={p === sel} onClick={() => setSel(p)}>
            {t(`fundamentals.bx.parts.${p}.name`)}
          </button>
        ))}
      </div>
      <div className="fd-bx">
        <div className="sk-plate fd-bx-plate" data-sel={sel}>
          <Illustration name="blastocystBiopsy" />
          <svg className="fd-overlay fd-hit" viewBox={`0 0 ${BX.w} ${BX.h}`} aria-hidden="true" focusable="false">
            <circle className={sel === 'te' ? 'on' : ''} cx={BX.te.cx} cy={BX.te.cy} r={BX.te.r} strokeWidth={BX.te.width} fill="none" onClick={() => setSel('te')} />
            <ellipse className={sel === 'icm' ? 'on' : ''} cx={BX.icm.cx} cy={BX.icm.cy} rx={BX.icm.rx} ry={BX.icm.ry} onClick={() => setSel('icm')} />
            <ellipse className={sel === 'bx' ? 'on' : ''} cx={BX.bx.cx} cy={BX.bx.cy} rx={BX.bx.rx} ry={BX.bx.ry} onClick={() => setSel('bx')} />
          </svg>
          <PlateLabels items={BX.labels} prefix="fundamentals.bx.labels" />
        </div>
        <section className="fd-bx-detail" aria-live="polite">
          <h4>{t(`${k}.name`)}</h4>
          <dl>
            {rows.map(([label, key]) => (
              <div key={label}>
                <dt>{t(`fundamentals.bx.${label}`)}</dt>
                <dd>
                  <Inline s={t(key)} lang={lang} />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </Frame>
  )
}

export function Widget({ id }: { id: WidgetId }) {
  switch (id) {
    case 'heteroplasmy':
      return <HeteroplasmyExplorer />
    case 'threshold':
      return <ThresholdSchematic />
    case 'bottleneck':
      return <BottleneckSimulator />
    case 'development':
      return <DevelopmentFigure />
    case 'blastocyst':
      return <BlastocystExplorer />
  }
}
