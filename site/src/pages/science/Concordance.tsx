import { observationText } from '../../i18n/scientificText'
import { sourceText } from '../../i18n/source-text-en'
import { useMemo, useState } from 'react'
import { DataTable } from '../../components/DataTable'
import { PlotlyChart } from '../../components/PlotlyChart'
import { Detail, ObservedBadge, PubRef } from '../../components/ui'
import { atlas, fig4Embryos, hasVerificationIssue, label, median, pubById, rangeOf } from '../../data/atlas'
import { useCountWord, useLang, useT } from '../../i18n'
import { fmt, pct } from '../../lib/format'
import { axis, baseLayout, useChartTheme, type ChartTheme } from '../../lib/theme'
import { PageTitle } from '../../components/Layout'

// combined_te_icm — объединённая часть ВКМ+ТЭ, когда ВКМ и оставшуюся ТЭ не удалось разделить (Tofilo 2026, эмбрионы 3 и 4)
const FR = ['te_biopsy', 'icm', 'remaining_te', 'combined_te_icm'] as const

/** Простое детерминированное разнесение совпадающих значений по горизонтали. */
function spread(values: { y: number; key: string }[], x0: number, dx: number, dyMin: number) {
  const placed: { x: number; y: number; key: string }[] = []
  for (const v of [...values].sort((a, b) => a.y - b.y || a.key.localeCompare(b.key))) {
    let off = 0
    for (let j = 0; j < 40; j++) {
      off = j === 0 ? 0 : (j % 2 ? 1 : -1) * Math.ceil(j / 2) * dx
      if (!placed.some((p) => Math.abs(p.x - (x0 + off)) < dx * 0.95 && Math.abs(p.y - v.y) < dyMin)) break
    }
    placed.push({ x: x0 + off, y: v.y, key: v.key })
  }
  return placed
}

function markerFor(cls: string, flagged: boolean, selected: boolean, th: ChartTheme) {
  const hv2 = cls === 'neutral_polymorphism'
  return {
    size: selected ? 11 : 8,
    color: hv2 ? th.surface : th.ink,
    line: { width: flagged ? 2.5 : 1.2, color: flagged ? th.warn : hv2 ? th.muted : th.surface },
  }
}

export default function Concordance() {
  const t = useT()
  const word = useCountWord()
  const lang = useLang()
  const th = useChartTheme()
  const [showHv2, setShowHv2] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)
  const embryos = useMemo(() => fig4Embryos().filter((e) => showHv2 || e.cls !== 'neutral_polymorphism'), [showHv2])
  const frLabel = (f: string) => label('fraction', f, lang)
  const pick = (e: { points?: { customdata?: unknown }[] }) => {
    const id = e.points?.[0]?.customdata
    if (typeof id === 'string') setSelected(id)
  }

  const panelA = useMemo(() => {
    const data = embryos
      .slice()
      .sort((a, b) => (a.cls === 'neutral_polymorphism' ? -1 : 0) - (b.cls === 'neutral_polymorphism' ? -1 : 0))
      .map((e) => {
        const xs = FR.map((f, i) => (e.fr[f] !== undefined ? i : null)).filter((x): x is number => x !== null)
        const sel = e.embryo === selected
        const hv2 = e.cls === 'neutral_polymorphism'
        return {
          type: 'scatter', mode: 'lines+markers', x: xs, y: xs.map((i) => e.fr[FR[i]]),
          customdata: xs.map(() => e.embryo),
          text: xs.map((i) => `<b>${e.embryo}</b><br>${frLabel(FR[i])}: ${pct(e.fr[FR[i]] ?? null, lang, 2)}<br>${observationText(e.variant, lang)} · ${pubById[e.pub].short}`),
          hovertemplate: '%{text}<extra></extra>',
          line: { color: sel ? th.accent : hv2 ? th.muted : th.ink2, width: sel ? 3 : 1 },
          marker: markerFor(e.cls, hasVerificationIssue(e.embryo), sel, th),
        }
      })
    return {
      data,
      layout: {
        ...baseLayout(th),
        shapes: [{ type: 'rect', x0: -0.3, x1: 3.3, y0: 18, y1: 30, fillcolor: th.bandBlue, line: { width: 0 }, layer: 'below' }],
        xaxis: axis(th, { range: [-0.3, 3.3], tickvals: [0, 1, 2, 3], ticktext: FR.map((f) => (f === 'combined_te_icm' ? t('concordance.combShort') : frLabel(f).replace(' ', '<br>'))), tickangle: 0, showgrid: false, fixedrange: true, tickfont: { size: 12, color: th.ink2 } }),
        yaxis: axis(th, { range: [-3, 103], title: { text: t('concordance.yA') } }),
      },
    }
  }, [embryos, selected, th, lang])

  const panelB = useMemo(() => {
    const groups: { frac: 'remaining_te' | 'icm' | 'combined_te_icm'; hv2: boolean }[] = [
      { frac: 'remaining_te', hv2: false }, { frac: 'remaining_te', hv2: true }, { frac: 'icm', hv2: false }, { frac: 'icm', hv2: true },
      // объединённая часть есть только у патогенных бластоцист (Tofilo 2026)
      ...(embryos.some((e) => e.fr.combined_te_icm !== undefined) ? [{ frac: 'combined_te_icm' as const, hv2: false }] : []),
    ]
    const xMax = groups.length - 0.5
    const data: Record<string, unknown>[] = []
    const ann: Record<string, unknown>[] = []
    groups.forEach((g, gx) => {
      const rows = embryos.filter((e) => (e.cls === 'neutral_polymorphism') === g.hv2 && e.fr[g.frac] !== undefined && e.fr.te_biopsy !== undefined)
      const pts = spread(rows.map((e) => ({ y: (e.fr[g.frac] as number) - (e.fr.te_biopsy as number), key: e.embryo })), gx, 0.07, 0.45)
      for (const p of pts) {
        const e = rows.find((r) => r.embryo === p.key)!
        data.push({
          type: 'scatter', mode: 'markers', x: [p.x], y: [p.y], customdata: [e.embryo],
          text: [`<b>${e.embryo}</b><br>${frLabel(g.frac)} − ${frLabel('te_biopsy')}: ${fmt(p.y, lang, 2)} ${t('common.pp')}<br>${observationText(e.variant, lang)} · ${pubById[e.pub].short}`],
          hovertemplate: '%{text}<extra></extra>', marker: markerFor(e.cls, hasVerificationIssue(e.embryo), e.embryo === selected, th),
        })
      }
      ann.push({ x: gx, y: -11, text: `n = ${rows.length}`, showarrow: false, font: { size: 12, color: th.muted } })
    })
    return {
      data,
      layout: {
        ...baseLayout(th),
        shapes: [
          { type: 'rect', x0: -0.5, x1: xMax, y0: -5, y1: 5, fillcolor: th.grid, opacity: 0.45, line: { width: 0 }, layer: 'below' },
          { type: 'line', x0: -0.5, x1: xMax, y0: 0, y1: 0, line: { color: th.muted, dash: 'dash', width: 1 }, layer: 'below' },
        ],
        annotations: [
          ...ann,
          { x: 0.5, y: -0.2, xref: 'x', yref: 'paper', text: t('concordance.remMinusBx').replace(' − ', '<br>− '), showarrow: false, font: { size: 12, color: th.ink2 } },
          { x: 2.5, y: -0.2, xref: 'x', yref: 'paper', text: t('concordance.icmMinusBx').replace(' − ', '<br>− '), showarrow: false, font: { size: 12, color: th.ink2 } },
          ...(groups.length > 4 ? [{ x: 4, y: -0.2, xref: 'x', yref: 'paper', text: t('concordance.combMinusBx').replace(' − ', '<br>− '), showarrow: false, font: { size: 12, color: th.ink2 } }] : []),
        ],
        xaxis: axis(th, { range: [-0.5, xMax], tickvals: groups.map((_, i) => i), ticktext: groups.map((g) => (g.hv2 ? 'HV2' : t('interfaceCopy.Concordance.pathogenicShort'))), tickangle: 0, showgrid: false, fixedrange: true, tickfont: { size: 12, color: th.ink2 } }),
        yaxis: axis(th, { range: [-12.5, 12.5], title: { text: t('concordance.yB') }, zeroline: false }),
        margin: { l: 64, r: 12, t: 24, b: 78 },
      },
    }
  }, [embryos, selected, th, lang])

  const panelC = useMemo(() => {
    const cols = [
      { name: t('concordance.cleavage'), items: atlas.cleavage.map((c) => ({ key: c.embryo, y: c.range, cls: 'pathogenic', text: `<b>${c.embryo}</b><br>${fmt(c.b1, lang)}% / ${fmt(c.b2, lang)}% → ${fmt(c.range, lang)} ${t('common.pp')}<br>${c.variant} · ${pubById[c.pub].short}` })) },
      ...[false, true]
        .filter((hv2) => showHv2 || !hv2)
        .map((hv2) => ({
          name: hv2 ? t('concordance.blastHv2') : t('concordance.blastPat'),
          items: embryos.filter((e) => (e.cls === 'neutral_polymorphism') === hv2).map((e) => ({ key: e.embryo, y: rangeOf(e.fr), cls: e.cls, text: `<b>${e.embryo}</b><br>${fmt(rangeOf(e.fr), lang, 2)} ${t('common.pp')}<br>${observationText(e.variant, lang)} · ${pubById[e.pub].short}` })),
        })),
    ]
    const data: Record<string, unknown>[] = []
    const shapes: Record<string, unknown>[] = [{ type: 'rect', x0: -0.5, x1: cols.length - 0.5, y0: 0, y1: 5, fillcolor: th.grid, opacity: 0.45, line: { width: 0 }, layer: 'below' }]
    const ann: Record<string, unknown>[] = []
    cols.forEach((c, gx) => {
      for (const p of spread(c.items, gx, 0.06, 0.3)) {
        const it = c.items.find((i) => i.key === p.key)!
        data.push({ type: 'scatter', mode: 'markers', x: [p.x], y: [p.y], customdata: [it.key], text: [it.text], hovertemplate: '%{text}<extra></extra>', marker: markerFor(it.cls, hasVerificationIssue(it.key), it.key === selected, th) })
      }
      const m = median(c.items.map((i) => i.y))
      shapes.push({ type: 'line', x0: gx - 0.25, x1: gx + 0.25, y0: m, y1: m, line: { color: th.critical, width: 3 } })
      ann.push({ x: gx + 0.27, y: m, xanchor: 'left', text: fmt(m, lang, 1), showarrow: false, font: { color: th.critical, size: 12 } })
      ann.push({ x: gx, y: 10.3, text: `n = ${c.items.length}`, showarrow: false, font: { size: 12, color: th.muted } })
    })
    return {
      data,
      layout: {
        ...baseLayout(th), shapes, annotations: ann,
        xaxis: axis(th, { range: [-0.5, cols.length - 0.5], tickvals: cols.map((_, i) => i), ticktext: cols.map((c) => c.name.replace(', ', ',<br>')), tickangle: 0, showgrid: false, fixedrange: true, tickfont: { size: 12, color: th.ink2 } }),
        yaxis: axis(th, { range: [0, 11], title: { text: t('concordance.yC') }, zeroline: false }),
        margin: { l: 56, r: 12, t: 24, b: 70 },
      },
    }
  }, [embryos, selected, showHv2, th, lang])

  const selEmb = selected ? fig4Embryos().find((e) => e.embryo === selected) : null
  const selCleav = selected ? atlas.cleavage.find((c) => c.embryo === selected) : null
  const s = atlas.stats.fig4
  const hu = atlas.hu2026_within_embryo

  return (
    <article>
      <p><ObservedBadge /></p>
      <PageTitle title={t('concordance.title')} />
      <h1>{t('concordance.title')}</h1>
      <p className="subtitle">{t('concordance.subtitle')}</p>
      <p className="lead">{t('concordance.lead', { n: s.n_embryos, c: s.n_cleavage })}</p>
      <p className="key-finding" data-testid="key-finding">
        <strong>{t('common.main')}.</strong>{' '}
        {t('concordance.main', { all: fmt(s.median_range_all, lang), pat: fmt(s.median_range_pathogenic, lang), max: fmt(s.max_range_pathogenic, lang), share: Math.round(s.share_le5_pathogenic * 100) })}
      </p>
      <div className="controls">
        <label>
          <input type="checkbox" checked={showHv2} onChange={(e) => setShowHv2(e.target.checked)} /> {t('concordance.showHv2')}
        </label>
        <span className="legend-row" style={{ margin: 0 }}>
          <span><span className="sw" style={{ background: 'var(--ink)' }} />{t('concordance.pathogenic')}</span>
          <span><span className="sw" style={{ background: 'var(--surface)', border: '1.5px solid var(--muted)' }} />{t('concordance.hv2')}</span>
          {atlas.concordance.some((f) => hasVerificationIssue(f.embryo)) && <span><span className="sw" style={{ background: 'var(--ink)', border: '2.5px solid var(--flag)' }} />ESM ⚠</span>}
        </span>
      </div>
      <div className="grid-3">
        <div><h3>{t('concordance.a')}</h3><PlotlyChart ariaLabel={t('concordance.a')} height={400} data={panelA.data as never} layout={panelA.layout as never} onClick={pick} /></div>
        <div><h3>{t('concordance.b')}</h3><PlotlyChart ariaLabel={t('concordance.b')} height={400} data={panelB.data as never} layout={panelB.layout as never} onClick={pick} /></div>
        <div><h3>{t('concordance.c')}</h3><PlotlyChart ariaLabel={t('concordance.c')} height={400} data={panelC.data as never} layout={panelC.layout as never} onClick={pick} /></div>
      </div>
      <p className="small muted">{t('common.clickHint')} {t('concordance.band5')}. {t('concordance.fractionCounts')}; {t('concordance.median')} — {t('interfaceCopy.Concordance.medianBar')}.</p>
      <p className="small">
        {t('interfaceCopy.Concordance.rangeSummary', { v0: fmt(s.median_range_pathogenic, lang), v1: s.n_pathogenic, v2: fmt(s.median_range_hv2, lang), v3: fmt(s.median_range_all, lang), v4: s.n_embryos, v5: fmt(s.median_range_cleavage, lang), v6: s.n_cleavage, pathogenic: word(s.n_pathogenic, 'pathogenic') })}
      </p>

      {selEmb && (
        <Detail
          title={`${t('common.embryo')}: ${selEmb.embryo}`}
          onClose={() => setSelected(null)}
          rows={[
            [t('common.variant'), `${observationText(selEmb.variant, lang)} (${label('variant_class', selEmb.cls, lang)})`],
            [t('common.source'), <PubRef id={selEmb.pub} showStatus />],
            ...FR.filter((f) => selEmb.fr[f] !== undefined).map((f): [string, string] => [frLabel(f), pct(selEmb.fr[f] ?? null, lang, 2)]),
            [t('interfaceCopy.Concordance.range'), `${fmt(rangeOf(selEmb.fr), lang, 2)} ${t('common.pp')}`],
            [t('common.provenance'), atlas.concordance.filter((f) => f.embryo === selEmb.embryo).map((f) => t('common.sheetRow', { sheet: sourceText(f.src.sheet, lang), row: f.src.row })).join('; ')],
          ]}
        >
        </Detail>
      )}
      {selCleav && (
        <Detail
          title={`${t('common.embryo')}: ${selCleav.embryo}`}
          onClose={() => setSelected(null)}
          rows={[
            [t('common.variant'), selCleav.variant],
            [t('common.source'), <PubRef id={selCleav.pub} showStatus />],
            [t('interfaceCopy.Concordance.blastomeres'), `${pct(selCleav.b1, lang)} / ${pct(selCleav.b2, lang)} (${t('common.lod', { lod: fmt(selCleav.lod, lang) })})`],
            [t('common.provenance'), t('common.sheetRow', { sheet: sourceText(selCleav.src.sheet, lang), row: selCleav.src.row })],
          ]}
        />
      )}

      <details className="table-details">
        <summary>{t('common.showTable')} (n = {embryos.length})</summary>
        <DataTable
          rows={embryos}
          rowKey={(e) => e.embryo}
          selected={selected}
          onSelect={(e) => setSelected(e.embryo)}
          csvName="pgt-mt-atlas_embryo-concordance.csv"
          csvRow={(e) => ({ embryo: e.embryo, variant: e.variant, publication: e.pub, doi: pubById[e.pub]?.doi, te_biopsy: e.fr.te_biopsy, icm: e.fr.icm, remaining_te: e.fr.remaining_te, combined_te_icm: e.fr.combined_te_icm, range_pp: rangeOf(e.fr) })}
          columns={[
            { key: 'e', header: t('common.embryo'), render: (e) => <>{e.embryo}{hasVerificationIssue(e.embryo) && ' ⚠'}</>, sort: (e) => e.embryo },
            { key: 'v', header: t('common.variant'), render: (e) => observationText(e.variant, lang), sort: (e) => e.variant },
            { key: 'p', header: t('common.source'), render: (e) => pubById[e.pub].short, sort: (e) => e.pub },
            ...FR.map((f) => ({ key: f, header: frLabel(f), render: (e: (typeof embryos)[number]) => pct(e.fr[f] ?? null, lang, 2), sort: (e: (typeof embryos)[number]) => e.fr[f] ?? null, num: true })),
            { key: 'r', header: t('interfaceCopy.Concordance.rangePp'), render: (e) => fmt(rangeOf(e.fr), lang, 2), sort: (e) => rangeOf(e.fr), num: true },
          ]}
        />
      </details>

      <details className="table-details">
        <summary>{t('concordance.hu')} <span className="badge warn">{t('badge.outsideArticle')}</span></summary>
        <p className="small">{t('concordance.huText')}</p>
        <DataTable
          rows={hu.samples}
          rowKey={(r) => String(r.sample)}
          columns={[
            { key: 's', header: '#', render: (r) => r.sample, sort: (r) => r.sample, num: true },
            { key: 'c', header: t('interfaceCopy.Concordance.cells'), render: (r) => `${sourceText(r.cells_raw, lang)} (${r.n_cells_raw})` },
            { key: 'd', header: t('interfaceCopy.Concordance.coverage'), render: (r) => fmt(r.depth, lang, 0), sort: (r) => r.depth, num: true },
            { key: 'v', header: `${hu.variant}, %`, render: (r) => fmt(r.value, lang, 1), sort: (r) => r.value, num: true },
            { key: 'dv', header: `Δ vs ${fmt(hu.biopsy_value, lang)}%`, render: (r) => fmt(r.value - hu.biopsy_value, lang, 1), sort: (r) => r.value - hu.biopsy_value, num: true },
          ]}
        />
      </details>
    </article>
  )
}
