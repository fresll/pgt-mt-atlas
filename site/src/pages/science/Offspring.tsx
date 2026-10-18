import { sourceText } from '../../i18n/source-text-en'
import { useMemo, useState } from 'react'
import { DataTable } from '../../components/DataTable'
import { PlotlyChart } from '../../components/PlotlyChart'
import { Detail, ObservedBadge, PubRef } from '../../components/ui'
import { atlas, label, pubById, type OffspringPair } from '../../data/atlas'
import { useCountWord, useLang, useT } from '../../i18n'
import { fmt, plural } from '../../lib/format'
import { pairValueText } from '../../lib/obs'
import { axis, baseLayout, useChartTheme, type ChartTheme } from '../../lib/theme'
import { PageTitle } from '../../components/Layout'

// Форма маркера — категория материала (правило Рисунок_5.py::shape)
export function materialCat(p: OffspringPair): 0 | 1 | 2 {
  if (p.phase === 'prenatal') return 0
  if (p.tissue === 'blood' || p.tissue === 'cord_blood') return 1
  return 2
}
const SYMBOL = ['circle', 'square', 'triangle-up'] as const

// Случаи вне количественного набора (правила включения — лист «Рисунок 5»!A29:A35 исходной таблицы)
const NOT_INCLUDED = [
  { pub: 'sallevelt2017', ru: 'm.14487T>C — перенесены два эмбриона с разными значениями; ребёнка нельзя однозначно связать ни с одним из них.', en: 'm.14487T>C — two embryos with different heteroplasmy levels were transferred; it is not possible to establish which embryo resulted in the child.' },
  { pub: 'steffann2014', ru: 'm.8344A>G — ткань, в которой измерена гетероплазмия при рождении, не указана.', en: 'm.8344A>G — the tissue measured at birth is not specified.' },
  { pub: 'monnot2011', ru: 'Перенесены два эмбриона; ребёнка нельзя однозначно связать ни с одним из них.', en: 'Two embryos were transferred; it is not possible to establish which embryo resulted in the child.' },
  { pub: 'hyslop2025', ru: 'Table 1 содержит значения в тестовом бластомере и крови для 10 детей. Восемь пар одиночных переносов включены; двойной перенос не сопоставляется с отдельным ребёнком.', en: 'Table 1 reports test-blastomere and blood values for 10 children. Eight single-transfer pairs are included; double transfers cannot be linked to individual children.' },
]

// Цвет — вариант (не более 3 категориальных цветов на точечном графике; m.3697G>A — нейтральный тон, пространственно отделён)
function variantColor(v: string, th: ChartTheme) {
  return ({ 'm.8993T>G': th.s1, 'm.3243A>G': th.s2, 'm.3250T>C': th.s3 } as Record<string, string>)[v] ?? th.ink2
}

// Раскладка точек у нуля и перекрывающихся точек C5 — как в Рисунок_5.py
const C5_POS: Record<string, [number, number]> = { C5b: [11, 0], C5c: [13, 0], C5e: [11, 47], C5f: [13, 46], C5d: [12, 10] }

function position(p: OffspringPair): [number, number] {
  const k = atlas.offspring.filter(p => p.in_figure && p.emb_q === 'not_detected').findIndex(q => q.id === p.id)
  if (p.emb_q === 'not_detected') return [0.04 + Math.max(0, k) * 0.04, p.value as number]
  return C5_POS[p.id] ?? [p.emb as number, p.value as number]
}

/** Ребёнок с наибольшим числом сопоставлений на графике (сопоставления одного ребёнка не независимы). */
function largestChildGroup(): { top: string; k: number } {
  const n = new Map<string, number>()
  for (const p of atlas.offspring) if (p.in_figure) n.set(p.child, (n.get(p.child) ?? 0) + 1)
  const [top, k] = [...n.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0] ?? ['—', 0]
  return { top, k }
}

export default function Offspring() {
  const topChild = largestChildGroup()
  const t = useT()
  const word = useCountWord()
  const lang = useLang()
  const th = useChartTheme()
  const [showExcluded, setShowExcluded] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const plotted = atlas.offspring.filter((p) => p.in_figure)
  const excluded = atlas.offspring.filter((p) => !p.in_figure)
  const catName = [t('offspring.prenatal'), t('offspring.blood'), t('offspring.otherPost')]
  const hover = (p: OffspringPair) =>
    `<b>${p.id}</b> · ${t('common.child')} ${p.child}<br>${p.variant} · ${pubById[p.pub].short}<br>` +
    `${t('common.embryo')}: ${pairValueText(p.emb, p.emb_q, p.emb_raw, lang, t)}<br>` +
    `${label('tissue', p.tissue, lang)}: ${pairValueText(p.value, p.q, p.value_raw, lang, t)}` +
    (p.age ? `<br>${t('common.age')}: ${sourceText(p.age, lang)}` : '')
  const pick = (e: { points?: { customdata?: unknown }[] }) => {
    const id = e.points?.[0]?.customdata
    if (typeof id === 'string') setSelected(id)
  }

  const panelA = useMemo(() => {
    const pts = [...plotted, ...(showExcluded ? excluded.filter((p) => p.id === 'C5d') : [])]
    const data = pts.map((p) => {
      const [x, y] = position(p)
      const censored = p.q === 'less_than'
      return {
        type: 'scatter', mode: 'markers', x: [x], xaxis: p.emb_q === 'not_detected' ? 'x2' : 'x', y: [y], customdata: [p.id], text: [hover(p) + (censored ? `<br><i>${t('badge.outsideArticle')}</i>` : '')],
        hovertemplate: '%{text}<extra></extra>',
        marker: {
          symbol: censored ? 'triangle-down-open' : p.q === 'not_detected' ? `${SYMBOL[materialCat(p)]}-open` : SYMBOL[materialCat(p)],
          size: p.id === selected ? 14 : 10,
          color: variantColor(p.variant, th),
          line: { width: p.id === selected ? 2.5 : 1, color: p.id === selected ? th.accent : th.surface },
        },
      }
    })
    const lab = (x: number, y: number, text: string, xanchor = 'left') => ({ x, y, text, xanchor, showarrow: false, font: { size: 12, color: th.ink2 } })
    return {
      data,
      layout: {
        ...baseLayout(th),
        shapes: [
          { type: 'rect', x0: 0, x1: 66, y0: -3, y1: 5, fillcolor: th.grid, opacity: 0.45, line: { width: 0 }, layer: 'below' },
          { type: 'line', x0: 0, y0: 0, x1: 66, y1: 66, line: { color: th.muted, dash: 'dash', width: 1 }, layer: 'below' },
          { type: 'line', x0: 12, x1: 12, y0: 0, y1: 52, line: { color: variantColor('m.3243A>G', th), width: 1.4 }, opacity: 0.7, layer: 'below' },
        ],
        annotations: [
          lab(13.6, 52, 'C5g'), lab(9.4, 47, 'C5e', 'right'), lab(14.4, 45.2, 'C5f'), lab(13.6, 42, 'C5h'),
          lab(10.3, 15, 'C5a', 'right'), lab(2.5, 7.4, 'C2', 'center'), lab(14.2, -1.6, 'C5b, C5c'),
          lab(55.5, 50.3, 'C12a'), lab(55.5, 46.6, 'C12b'), { x: 0.08, xref: 'paper', y: -0.10, yref: 'paper', text: t('offspring.ndBand'), showarrow: false, font: { size: 13 } },
          ...(showExcluded ? [lab(13.6, 10, 'C5d (<10%)')] : []),
        ],
        xaxis: axis(th, { domain: [0.22, 1], range: [0, 66], tickvals: [0, 10, 20, 30, 40, 50, 60], title: { text: t('offspring.xA') }, zeroline: false }),
        xaxis2: { domain: [0, 0.17], range: [0, 1], showticklabels: false, showgrid: false, zeroline: false, fixedrange: true },
        yaxis: axis(th, { range: [-9, 66], title: { text: t('offspring.yA') }, zeroline: false }),
      },
    }
  }, [plotted, excluded, showExcluded, selected, th, lang])

  const panelB = useMemo(() => {
    const data: Record<string, unknown>[] = []
    const ann: Record<string, unknown>[] = []
    const rank = ['C12', 'C1', 'C14', 'C2', 'C3', 'C6', 'C9', 'C5']
    ;[0, 1, 2].forEach((g) => {
      const rows = plotted.filter((p) => materialCat(p) === g).sort((a, b) => rank.indexOf(a.child) - rank.indexOf(b.child) || a.id.localeCompare(b.id))
      const placed: { x: number; y: number }[] = []
      const bothND = rows.filter(p => p.q === 'not_detected' && p.emb_q === 'not_detected').length
      for (const p of rows) {
        if (p.q === 'not_detected' && p.emb_q === 'not_detected') continue
        const d = (p.value as number) - (p.emb as number)
        let x = g
        for (let j = 0; j < 30; j++) {
          x = g + (j === 0 ? 0 : (j % 2 ? 1 : -1) * Math.ceil(j / 2) * 0.1)
          if (!placed.some((q) => Math.abs(q.x - x) < 0.095 && Math.abs(q.y - d) < 1.6)) break
        }
        placed.push({ x, y: d })
        if (p.q === 'not_detected' || p.emb_q === 'not_detected') {
          const lower = p.q === 'not_detected'
          ann.push({ x, y: d + (lower ? 3 : -3), ax: x, ay: d, xref: 'x', yref: 'y', axref: 'x', ayref: 'y', showarrow: true, arrowhead: 2, arrowcolor: variantColor(p.variant, th), text: '' })
        }
        data.push({
          type: 'scatter', mode: 'markers', x: [x], y: [d], customdata: [p.id], text: [`${hover(p)}<br>Δ = ${fmt(d, lang, 2)} ${t('common.pp')}`],
          hovertemplate: '%{text}<extra></extra>',
          marker: { symbol: p.q === 'not_detected' || p.emb_q === 'not_detected' ? `${SYMBOL[g]}-open` : SYMBOL[g], size: p.id === selected ? 14 : 10, color: variantColor(p.variant, th), line: { width: p.id === selected ? 2.5 : 1, color: p.id === selected ? th.accent : th.surface } },
        })
      }
      ann.push({ x: g, y: -15, text: `n = ${rows.length}${bothND ? `<br>${t('offspring.bothND', { n: bothND })}` : ''}`, showarrow: false, font: { size: 12, color: th.muted } })
    })
    return {
      data,
      layout: {
        ...baseLayout(th),
        shapes: [
          { type: 'rect', x0: -0.6, x1: 2.6, y0: -5, y1: 5, fillcolor: th.grid, opacity: 0.45, line: { width: 0 }, layer: 'below' },
          { type: 'line', x0: -0.6, x1: 2.6, y0: 0, y1: 0, line: { color: th.muted, dash: 'dash', width: 1 }, layer: 'below' },
        ],
        annotations: ann,
        xaxis: axis(th, { range: [-0.6, 2.6], tickvals: [0, 1, 2], ticktext: catName.map((c) => c.replace(' / ', ' /<br>').replace(/ (материал|ткани|tissues|material)$/, '<br>$1')), tickangle: 0, showgrid: false, fixedrange: true }),
        margin: { l: 64, r: 16, t: 24, b: 70 },
        yaxis: axis(th, { range: [-20, 44], title: { text: t('offspring.yB') }, zeroline: false }),
      },
    }
  }, [plotted, selected, th, lang])

  const sel = selected ? atlas.offspring.find((p) => p.id === selected) : null
  const s = atlas.stats.fig5
  const variants = [...new Set(plotted.map(p => p.variant))]
  const swatch: Record<string, string> = { 'm.8993T>G': 'var(--s1)', 'm.3243A>G': 'var(--s2)', 'm.3250T>C': 'var(--s3)', 'm.3697G>A': 'var(--ink-2)' }

  return (
    <article>
      <p><ObservedBadge /></p>
      <PageTitle title={t('offspring.title')} />
      <h1>{t('offspring.title')}</h1>
      <p className="subtitle">{t('offspring.subtitle')}</p>
      <p className="lead">{t('offspring.lead')}</p>
      <p className="key-finding" data-testid="key-finding">
        <strong>{t('common.main')}.</strong>{' '}
        {t('offspring.main', {
          pairs: `${s.n_pairs} ${plural(s.n_pairs, lang, t('offspring.pairForms', { returnObjects: true }) as unknown as [string, string, string])}`,
          children: s.n_children,
          disc: t(new Set(s.discordant_ids.map((id) => id.replace(/[a-z]+$/, ''))).size === 1 ? 'offspring.discOne' : 'offspring.discMany', { ids: s.discordant_ids.join(', ') }),
        })}
      </p>
      <p className="small">{t('offspring.bothNDChildren', { children: atlas.stats.fig5.n_both_nd_children, pairs: atlas.stats.fig5.n_both_nd_pairs })}</p>
      <div className="controls">
        <label>
          <input type="checkbox" checked={showExcluded} onChange={(e) => setShowExcluded(e.target.checked)} /> {t('offspring.showExcluded')}
        </label>
        {showExcluded && <span className="badge warn">{t('badge.outsideArticle')}</span>}
      </div>
      <div className="legend-row">
        <span>{t('offspring.colorByVariant')}</span>
        {variants.map((v) => (
          <span key={v}><span className="sw" style={{ background: swatch[v] ?? 'var(--ink-2)' }} />{v}</span>
        ))}
        <span>● {t('offspring.prenatal')}</span>
        <span>■ {t('offspring.blood')}</span>
        <span>▲ {t('offspring.otherPost')}</span>
        <span>- - {t('offspring.identity')}</span>
      </div>
      <div className="grid-2">
        <div><h3>{t('interfaceCopy.Offspring.panelA')}</h3><PlotlyChart ariaLabel={t('offspring.subtitle')} height={460} data={panelA.data as never} layout={panelA.layout as never} onClick={pick} /></div>
        <div><h3>{t('interfaceCopy.Offspring.panelB')}</h3><PlotlyChart ariaLabel={t('offspring.yB')} height={460} data={panelB.data as never} layout={panelB.layout as never} onClick={pick} /></div>
      </div>
      <p className="small muted">{t('common.clickHint')} {t('offspring.lowSpread')} {t('offspring.deltaBound')}</p>
      <p className="small"><strong>{t('offspring.dependency', { pairs: s.n_pairs, children: s.n_children, ...topChild })}</strong>{' '}
        {t('interfaceCopy.Offspring.comparisonSummary', { v0: s.n_low_embryo, v1: s.n_concordant_low, v2: s.discordant_ids.join(', '), comparisons: word(s.n_low_embryo, 'comparison') })}{' '}{t('offspring.childSummary', { low: s.n_low_children, all: s.n_children, concordant: s.n_concordant_children })}
      </p>
      {sel && (
        <Detail
          title={`${sel.id} · ${t('common.child')} ${sel.child}`}
          onClose={() => setSelected(null)}
          rows={[
            [t('common.variant'), sel.variant],
            [t('common.source'), <PubRef id={sel.pub} showStatus />],
            [t('common.embryo'), pairValueText(sel.emb, sel.emb_q, sel.emb_raw, lang, t)],
            [t('common.phase'), label('phase', sel.phase, lang)],
            [t('common.tissue'), `${label('tissue', sel.tissue, lang)} — «${sourceText(sel.tissue_raw, lang)}»`],
            [t('common.value'), pairValueText(sel.value, sel.q, sel.value_raw, lang, t)],
            [t('common.age'), sourceText(sel.age ?? '', lang)],
            [t('common.method'), sourceText(sel.method ?? '', lang)],
            [t('data.locator'), sourceText(sel.source_locator ?? '', lang)],
            [t('data.embryoSample'), sel.emb_sample === 'single_blastomere' ? t('data.day3Blastomere') : '—'],
            [t('interfaceCopy.Offspring.referenceView'), sel.in_figure ? (t('interfaceCopy.Offspring.yes')) : `${t('interfaceCopy.Offspring.no')} — «${sourceText(sel.on_plot_raw, lang)}»`],
            [t('common.provenance'), t('common.sheetRow', { sheet: sourceText(sel.src.sheet, lang), row: sel.src.row })],
          ]}
        />
      )}

      <h2>{t('offspring.excludedTitle')}</h2>
      <ul className="small prose">
        {excluded.map((p) => (
          <li key={p.id}>
            <button className="ghost" type="button" onClick={() => setSelected(p.id)}>{p.id}</button> {p.variant}, {pubById[p.pub].short}: {sourceText(p.on_plot_raw, lang)}
          </li>
        ))}
        {NOT_INCLUDED.map((c) => (
          <li key={c.pub}>
            <PubRef id={c.pub} />: {c[lang]}
          </li>
        ))}
      </ul>

      <details className="table-details">
        <summary>{t('common.showTable')} ({t('offspring.recordSummary', { records: atlas.offspring.length, pairs: s.n_pairs, children: s.n_children })})</summary>
        <DataTable
          rows={atlas.offspring}
          rowKey={(p) => p.id}
          selected={selected}
          onSelect={(p) => setSelected(p.id)}
          csvName="pgt-mt-atlas_embryo-to-offspring.csv"
          csvRow={(p) => ({ id: p.id, child: p.child, variant: p.variant, publication: p.pub, pmid: pubById[p.pub]?.pmid, source_locator: p.source_locator, carrier_id: p.carrier_id, doi: pubById[p.pub]?.doi, embryo_pct: p.emb, embryo_raw: p.emb_raw, phase: p.phase, tissue: p.tissue, tissue_raw: p.tissue_raw, value_pct: p.value, qualifier: p.q, age: p.age, method: p.method, in_figure: p.in_figure })}
          columns={[
            { key: 'id', header: 'ID', render: (p) => p.id, sort: (p) => p.id },
            { key: 'v', header: t('common.variant'), render: (p) => p.variant, sort: (p) => p.variant },
            { key: 'e', header: t('common.embryo'), render: (p) => pairValueText(p.emb, p.emb_q, p.emb_raw, lang, t), sort: (p) => p.emb, num: true },
            { key: 'ti', header: t('common.tissue'), render: (p) => label('tissue', p.tissue, lang), sort: (p) => p.tissue },
            { key: 'val', header: t('common.value'), render: (p) => pairValueText(p.value, p.q, p.value_raw, lang, t), sort: (p) => p.value, num: true },
            { key: 'd', header: t('common.delta'), render: (p) => (p.in_figure ? (p.q === 'not_detected' && p.emb_q === 'not_detected' ? t('offspring.bothNDPair') : `${p.q === 'not_detected' ? '≥ ' : p.emb_q === 'not_detected' ? '≤ ' : ''}${fmt((p.value as number) - (p.emb as number), lang, 2)}`) : '—'), sort: (p) => (p.in_figure ? (p.value as number) - (p.emb as number) : null), num: true },
            { key: 'cluster', header: t('data.maternalCluster'), render: (p) => p.carrier_id ?? '—' },
            { key: 'locator', header: t('data.locator'), render: (p) => sourceText(p.source_locator ?? '—', lang) },
            { key: 'p', header: t('common.source'), render: (p) => pubById[p.pub].short, sort: (p) => p.pub },
          ]}
        />
      </details>
    </article>
  )
}
