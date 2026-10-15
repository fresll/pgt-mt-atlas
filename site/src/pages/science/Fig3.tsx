import { useEffect, useMemo, useState } from 'react'
import { DataTable } from '../../components/DataTable'
import { PlotlyChart } from '../../components/PlotlyChart'
import { Detail, ObservedBadge, PubRef, Seg } from '../../components/ui'
import { atlas, fractionAtOrBelow, label, pubById, type EmbryoObservation } from '../../data/atlas'
import { isDerived, layoutBlocks, placeColumn } from '../../figures/fig3Layout'
import { useLang, useT } from '../../i18n'
import { fmt, frac } from '../../lib/format'
import { obsValueText } from '../../lib/obs'
import { axis, baseLayout, useChartTheme } from '../../lib/theme'
import { PageTitle } from '../../components/Layout'

const STAGES = ['cleavage', 'morula', 'blastocyst', 'arrested', 'unspecified']

export function ObservationDetail({ o, onClose }: { o: EmbryoObservation; onClose?: () => void }) {
  const t = useT()
  const lang = useLang()
  const p = pubById[o.pub]
  return (
    <Detail
      title={`${t('common.selected')}: ${o.id}`}
      onClose={onClose}
      rows={[
        [t('common.value'), obsValueText(o, lang, t)],
        [t('common.variant'), o.variant],
        [t('common.source'), <PubRef id={o.pub} showStatus />],
        [t('common.pmid'), p?.pmid ? <a href={`https://pubmed.ncbi.nlm.nih.gov/${p.pmid}/`} target="_blank" rel="noreferrer">{p.pmid}</a> : null],
        [t('common.stage'), `${label('stage', o.stage, lang)} — «${o.stage_raw}»`],
        [t('common.sample'), `${label('sample_type', o.sample, lang)} — «${o.material_raw}»`],
        [t('common.derivation'), <>{label('derivation', o.derivation, lang)}{o.derivation_evidence && <span className="muted"> · {o.derivation_evidence}</span>}</>],
        [t('common.note'), o.note],
        [t('common.variantClass'), <VariantClassText variant={o.variant} />],
        [t('common.provenance'), t('common.sheetRow', { sheet: o.src.sheet, row: o.src.row })],
        [t('common.legacyId'), o.legacy_id],
      ]}
    />
  )
}

/** Класс варианта и его основание (etl/atlas_etl/curation/variant_classification.yaml). */
export function VariantClassText({ variant }: { variant: string }) {
  const t = useT()
  const lang = useLang()
  const c = atlas.variant_classes[variant]
  if (!c) return null
  return (
    <>
      {label('variant_class', c.class, lang)}
      <span className="muted small">
        {' '}· {t(`common.classBasis.${c.status}`, { source: pubById[c.publication]?.short ?? c.publication, locator: c.locator ?? '', date: c.checked })}
      </span>
    </>
  )
}

export default function Fig3() {
  const t = useT()
  const lang = useLang()
  const th = useChartTheme()
  const [mode, setMode] = useState<'article' | 'explore'>('article')
  const [threshold, setThreshold] = useState(18)
  const [aggregate, setAggregate] = useState(true)
  const [highlightDerived, setHighlightDerived] = useState(true)
  const [stages, setStages] = useState<string[]>(STAGES)
  const [selected, setSelected] = useState<string | null>(null)
  // B3: точка ×n — группа совпадающих значений; открываются все её наблюдения
  const [group, setGroup] = useState<string[] | null>(null)

  const explore = mode === 'explore'
  const obs = useMemo(() => (explore ? atlas.fig3.filter((o) => stages.includes(o.stage)) : atlas.fig3), [explore, stages])
  const { blocks, xmax } = useMemo(() => layoutBlocks(atlas.fig3_blocks, obs), [obs])
  const thresholds = explore ? [threshold] : [18, 30]
  // выбор согласован с фильтрами: скрытое фильтром наблюдение не показывается, группа пересобирается при смене фильтра
  const sel = selected ? obs.find((o) => o.id === selected) ?? null : null
  useEffect(() => setGroup(null), [explore, stages, aggregate])
  const groupObs = useMemo(() => (group ? obs.filter((o) => group.includes(o.id)) : null), [group, obs])

  const plot = useMemo(() => {
    const filled: { x: number[]; y: number[]; text: string[]; ids: string[] } = { x: [], y: [], text: [], ids: [] }
    const hollow: typeof filled = { x: [], y: [], text: [], ids: [] }
    const annotations: Record<string, unknown>[] = []
    const shapes: Record<string, unknown>[] = []
    const hoverIv: typeof filled = { x: [], y: [], text: [], ids: [] }
    const ticks: { v: number; t: string }[] = []
    for (const b of blocks) {
      for (const c of b.columns) {
        const p = pubById[c.pub]
        const [name, year] = p.short.replace(' et al.', '').split(', ')
        ticks.push({ v: c.x, t: `${name}<br>${year}<br>n = ${c.obs.length}` })
        for (const pt of placeColumn(c, { aggregate })) {
          const target = highlightDerived && pt.derived ? hollow : filled
          const o = pt.obs
          const head = pt.count > 1 ? `${pt.count} × ${obsValueText(o, lang, t)}` : obsValueText(o, lang, t)
          target.x.push(pt.x)
          target.y.push(pt.y)
          target.ids.push(pt.ids.join(' '))
          target.text.push(
            `<b>${head}</b><br>${o.variant} · ${p.short}<br>${label('stage', o.stage, lang)} · ${label('sample_type', o.sample, lang)}` +
              (isDerived(o) ? `<br><i>${label('derivation', o.derivation, lang)}</i>` : '') +
              (pt.count > 1 ? `<br><i>${t('fig3.groupClick')}</i>` : `<br><span style="font-size:11px">${o.id}</span>`),
          )
          if (pt.count > 1)
            annotations.push({ x: pt.x + 0.12, y: pt.y, text: `×${pt.count}`, showarrow: false, xanchor: 'left', font: { size: 12, color: th.ink2 } })
        }
        for (const o of c.obs.filter((o) => o.q === 'interval')) {
          const xx = c.x + 0.28
          shapes.push({ type: 'line', x0: xx, x1: xx, y0: o.low, y1: o.high, line: { color: th.ink, width: 2 } })
          for (const yy of [o.low, o.high]) shapes.push({ type: 'line', x0: xx - 0.07, x1: xx + 0.07, y0: yy, y1: yy, line: { color: th.ink, width: 2 } })
          hoverIv.x.push(xx)
          hoverIv.y.push(((o.low as number) + (o.high as number)) / 2)
          hoverIv.ids.push(o.id)
          hoverIv.text.push(`<b>${obsValueText(o, lang, t)}</b><br>${o.variant} · ${p.short}<br>${o.id}`)
        }
      }
      shapes.push({ type: 'line', x0: b.x1, x1: b.x1, y0: -4, y1: 140, yref: 'y', line: { color: th.grid, width: 1 } })
      const all = b.columns.flatMap((c) => c.obs)
      const lines = thresholds.map((th0) => `≤${fmt(th0, lang)}%: ${frac(fractionAtOrBelow(all, th0).k, all.length, lang).replace(' (', '<br>(')}`)
      if (!explore && fractionAtOrBelow(all, 18).k === fractionAtOrBelow(all, 30).k) lines.pop()
      annotations.push({ x: (b.x0 + b.x1) / 2, y: 136, text: `<b>${b.variant}</b>`, showarrow: false, font: { size: 13, color: th.ink } })
      annotations.push({ x: (b.x0 + b.x1) / 2, y: 131, yanchor: 'top', text: lines.join('<br>'), showarrow: false, font: { size: 12, color: th.ink2 } })
    }
    const band = (y0: number, y1: number, color: string) => ({ type: 'rect', x0: 0, x1: xmax, y0, y1, fillcolor: color, line: { width: 0 }, layer: 'below' })
    const hline = (y: number, color: string, dash: string, width = 1.2) => ({ type: 'line', x0: 0, x1: xmax, y0: y, y1: y, line: { color, dash, width }, layer: 'below' })
    const bg = explore
      ? [hline(threshold, th.accent, 'solid', 1.6)]
      : [band(0, 18, th.bandGreen), band(18, 30, th.bandBlue), band(70, 100, th.bandRed), hline(18, th.muted, 'dash'), hline(70, th.muted, 'dash'), hline(30, th.s1, 'dash'), hline(1, th.critical, 'dot')]
    const marker = { size: 8, line: { width: 1, color: th.surface } }
    const data = [
      { type: 'scatter', mode: 'markers', x: filled.x, y: filled.y, customdata: filled.ids, text: filled.text, hovertemplate: '%{text}<extra></extra>', marker: { ...marker, color: th.ink } },
      { type: 'scatter', mode: 'markers', x: hollow.x, y: hollow.y, customdata: hollow.ids, text: hollow.text, hovertemplate: '%{text}<extra></extra>', marker: { size: 8, color: th.surface, line: { width: 1.6, color: th.ink } } },
      { type: 'scatter', mode: 'markers', x: hoverIv.x, y: hoverIv.y, customdata: hoverIv.ids, text: hoverIv.text, hovertemplate: '%{text}<extra></extra>', marker: { size: 14, opacity: 0 } },
    ]
    return {
      data,
      layout: {
        ...baseLayout(th),
        margin: { l: 64, r: 12, t: 12, b: 84 },
        xaxis: axis(th, { range: [0, xmax], tickvals: ticks.map((x) => x.v), ticktext: ticks.map((x) => x.t), tickangle: 0, showgrid: false, zeroline: false, tickfont: { size: 12, color: th.ink2 }, fixedrange: true }),
        yaxis: axis(th, { range: [-4, 140], tickvals: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], title: { text: t('fig3.yAxis'), font: { color: th.ink2 } }, showgrid: false, zeroline: false }),
        shapes: [...bg, ...shapes],
        annotations,
        hovermode: 'closest',
      },
    }
  }, [blocks, xmax, aggregate, highlightDerived, thresholds.join(','), explore, threshold, th, lang, t])

  const tableRows = groupObs ?? obs
  return (
    <article>
      <p>
        <ObservedBadge /> {explore && <span className="badge warn">{t('badge.outsideArticle')}</span>}
      </p>
      <PageTitle title={t('fig3.title')} />
      <h1>{t('fig3.title')}</h1>
      <p className="subtitle">{t('fig3.subtitle')}</p>
      <p className="lead">{t('fig3.lead')}</p>

      <div className="controls">
        <span>
          {t('common.mode')}:{' '}
          <Seg label={t('common.mode')} value={mode} onChange={setMode} options={[{ v: 'article', label: t('common.figureInArticle') }, { v: 'explore', label: t('common.explore') }]} />
        </span>
        {explore && (
          <>
            <label>
              {t('fig3.customThreshold')}
              <input type="number" min={0} max={100} step={1} value={threshold} onChange={(e) => setThreshold(Math.min(100, Math.max(0, Number(e.target.value))))} />
            </label>
            <fieldset style={{ border: 0, margin: 0, padding: 0, display: 'inline-flex', gap: 10, flexWrap: 'wrap' }}>
              <legend className="muted" style={{ float: 'left', marginRight: 6 }}>
                {t('fig3.stageFilter')}:
              </legend>
              {STAGES.map((s) => (
                <label key={s}>
                  <input type="checkbox" checked={stages.includes(s)} onChange={(e) => setStages(e.target.checked ? [...stages, s] : stages.filter((x) => x !== s))} />
                  {label('stage', s, lang)}
                </label>
              ))}
            </fieldset>
          </>
        )}
        <label>
          <input type="checkbox" checked={aggregate} onChange={(e) => setAggregate(e.target.checked)} /> {t('fig3.aggregate')}
        </label>
        <label>
          <input type="checkbox" checked={highlightDerived} onChange={(e) => setHighlightDerived(e.target.checked)} /> {t('fig3.highlightDerived')}
        </label>
      </div>

      <p className="scroll-hint">{t('common.scrollHint')}</p>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: 960 }}>
          <PlotlyChart
            ariaLabel={t('fig3.title')}
            height={600}
            data={plot.data as never}
            layout={plot.layout as never}
            onClick={(e) => {
              const raw = e.points?.[0]?.customdata
              if (typeof raw !== 'string') return
              const ids = raw.split(' ')
              if (ids.length > 1) {
                setGroup(ids)
                setSelected(null)
              } else {
                setGroup(null)
                setSelected(ids[0])
              }
            }}
          />
        </div>
      </div>
      <p className="small muted">{t('common.clickHint')} {highlightDerived && t('fig3.derivedLegend')}.</p>
      {groupObs && groupObs.length > 1 && (
        <div className="detail obs-group" role="region" aria-label={t('fig3.groupTitle', { n: groupObs.length })} data-group-size={groupObs.length}>
          <h3>{t('fig3.groupTitle', { n: groupObs.length })}</h3>
          <p className="small">
            {t('fig3.groupHint', { n: groupObs.length })} {obsValueText(groupObs[0], lang, t)} · {groupObs[0].variant} · {pubById[groupObs[0].pub].short}
          </p>
          <ul className="obs-group-list">
            {groupObs.map((o) => (
              <li key={o.id}>
                <button type="button" className="ghost" aria-pressed={o.id === selected} onClick={() => setSelected(o.id)}>
                  {o.id}
                </button>{' '}
                <span className="small muted">
                  {label('stage', o.stage, lang)} · {o.material_raw}
                  {o.note ? ` · ${o.note}` : ''}
                </span>
              </li>
            ))}
          </ul>
          <p className="small">
            {t('fig3.groupInTable')}{' '}
            <button type="button" className="ghost" onClick={() => { setGroup(null); setSelected(null) }}>
              {t('fig3.showAll')}
            </button>
          </p>
        </div>
      )}
      {sel && <ObservationDetail o={sel} onClose={() => setSelected(null)} />}
      <p className="small">{t('fig3.bands')}</p>
      <p className="small">{t('fig3.intervalNote')}</p>

      <details className="table-details" open={groupObs ? true : undefined}>
        <summary>
          {t('common.showTable')} (n = {tableRows.length})
        </summary>
        <DataTable
          rows={tableRows}
          rowKey={(o) => o.id}
          selected={selected}
          onSelect={(o) => setSelected(o.id)}
          csvName="pgt-mt-atlas_heteroplasmy-landscape.csv"
          csvRow={(o) => ({ id: o.id, variant: o.variant, value_pct: o.value, qualifier: o.q, low: o.low, high: o.high, publication: o.pub, doi: pubById[o.pub]?.doi, stage: o.stage, stage_raw: o.stage_raw, sample_type: o.sample, material_raw: o.material_raw, derivation: o.derivation, sheet: o.src.sheet, row: o.src.row })}
          columns={[
            { key: 'id', header: 'ID', render: (o) => o.id, sort: (o) => o.id },
            { key: 'variant', header: t('common.variant'), render: (o) => o.variant, sort: (o) => o.variant },
            { key: 'value', header: t('common.value'), render: (o) => obsValueText(o, lang, t), sort: (o) => (o.q === 'interval' ? o.high : o.value), num: true },
            { key: 'pub', header: t('common.source'), render: (o) => pubById[o.pub].short, sort: (o) => pubById[o.pub].short },
            { key: 'stage', header: t('common.stage'), render: (o) => label('stage', o.stage, lang), sort: (o) => o.stage },
            { key: 'mat', header: t('common.material'), render: (o) => o.material_raw, sort: (o) => o.material_raw },
            { key: 'der', header: t('common.derivation'), render: (o) => label('derivation', o.derivation, lang), sort: (o) => o.derivation },
          ]}
        />
      </details>
    </article>
  )
}
