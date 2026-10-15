import { BackToTop, PageContents } from '../../components/PageContents'
import { useMemo, useEffect, useState } from 'react'
import { PlotlyChart } from '../../components/PlotlyChart'
import { ModelBadge, PubRef, Seg } from '../../components/ui'
import { atlas, obsByVariant } from '../../data/atlas'
import { useLang, useT } from '../../i18n'
import { fmt, fmtFixed } from '../../lib/format'
import { publicationCarriers } from '../../model/carriers'
import { jointEvidence } from '../../model/evidence'
import { summarizeInput, type Boundary } from '../../model/observations'
import { jointBounds, scenarioProbability } from '../../model/scenario'
import { axis, baseLayout, useChartTheme } from '../../lib/theme'
import { PageTitle } from '../../components/Layout'
import modelVersion from '../../../public/model-version.json'

type Cut = 'both' | '18' | '30'

// Plotly's trace opacity does not make a hex fill transparent.
function bandColor(color: string): string {
  const hex = /^#([0-9a-f]{6})$/i.exec(color)?.[1]
  if (!hex) return 'rgba(31,63,180,0.14)'
  return `rgba(${[0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(',')},0.14)`
}

export default function Model() {
  const t = useT()
  const lang = useLang()
  const th = useChartTheme()
  const [cut, setCut] = useState<Cut>('both')
  const [boundary, setBoundary] = useState<Boundary>('inclusive')
  const [rho, setRho] = useState(0)
  const [showRange, setShowRange] = useState(true)
  // телефон: один график сценария за раз; при переключении Plotly пересчитывает ширину
  const [panelIdx, setPanelIdx] = useState(0)
  useEffect(() => { window.dispatchEvent(new Event('resize')) }, [panelIdx])
  const [teOnly, setTeOnly] = useState(false)
  const [nTable, setNTable] = useState(3)
  const m = atlas.model
  const byVar = useMemo(() => new Map([...obsByVariant()].map(([v, obs]) => [v, teOnly ? obs.filter((o) => o.stage === 'blastocyst' && o.sample === 'te_biopsy') : obs])), [teOnly])
  const symbol = boundary === 'inclusive' ? '≤' : '<'
  const cuts = cut === 'both' ? [18, 30] : [Number(cut)]
  const variants = useMemo(() => {
    const colors = [th.model, th.model, th.model, th.model]
    return m.fig6_variants.map((v, i) => {
      const obs = byVar.get(v)!
      return { v, dash: ['solid', 'dash', 'dot', 'dashdot'][i], f18: summarizeInput(obs, 18, boundary), f30: summarizeInput(obs, 30, boundary), color: colors[i], carriers: new Set(obs.map(o => o.carrier_id).filter(Boolean)).size, unknownCarriers: obs.some(o => !o.carrier_id) }
    })
  }, [byVar, boundary, m, th])

  const panels = useMemo(() => m.p_eupl.map(({ age, value: pe }) => {
    const data: Record<string, unknown>[] = []
    const annotations: Record<string, unknown>[] = []
    const ns = Array.from({ length: m.n_max }, (_, i) => i + 1)
    for (const x of variants) {
      for (const threshold of cut === 'both' ? [18, 30] : [Number(cut)]) {
        const f = threshold === 18 ? x.f18 : x.f30
        if (f.fraction === null) continue
        if (cut === 'both' && threshold === 30 && x.f18.k === x.f30.k) continue
        const probabilities = ns.map((n) => scenarioProbability(f.fraction!, pe, n, rho))
        if (showRange && f.wilson) {
          data.push({ type: 'scatter', mode: 'lines', x: ns, y: ns.map((n) => scenarioProbability(f.wilson!.low, pe, n, rho)), line: { width: 0 }, showlegend: false, hoverinfo: 'skip' })
          data.push({ type: 'scatter', mode: 'lines', x: ns, y: ns.map((n) => scenarioProbability(f.wilson!.high, pe, n, rho)), line: { width: 0 }, fill: 'tonexty', fillcolor: bandColor(x.color), showlegend: false, hoverinfo: 'skip' })
        }
        data.push({
          type: 'scatter', mode: 'lines', x: ns, y: probabilities,
          name: `${x.v}, ${symbol}${threshold}% — ${t('model.carriers', { n: x.unknownCarriers ? t('model.unknown') : x.carriers, records: f.n })}`,
          line: { color: x.color, width: threshold === 18 ? 2 : 1.4, dash: threshold === 30 ? 'longdash' : (['solid', 'dash', 'dot', 'dashdot'] as const)[variants.indexOf(x)] },
          hovertemplate: `${x.v}, ${symbol}${threshold}%<br>H = ${f.k}/${f.n}, E = ${fmt(pe, lang)}, ρ = ${fmt(rho, lang)}<br>N = %{x}: P = %{y:.3f}<extra></extra>`,
        })
        if (threshold === 18 || cut === '30') annotations.push({ x: m.n_max + 0.1, y: probabilities.at(-1), xanchor: 'left', text: x.v, showarrow: false, font: { size: 12, color: th.ink2 } })
      }
    }
    return { age, pe, data, layout: {
      ...baseLayout(th), separators: lang === 'ru' ? ', ' : '.,', margin: { l: 56, r: 78, t: 16, b: 52 }, annotations,
      xaxis: axis(th, { range: [0.7, m.n_max + 0.3], dtick: 1, title: { text: t('model.xAxis') }, fixedrange: true }),
      yaxis: axis(th, { range: [0, 1.03], title: { text: t('model.yAxis') }, fixedrange: true, tickformat: '.1f' }),
    } }
  }), [cut, m, rho, showRange, symbol, t, th, variants, lang])

  const example = summarizeInput(obsByVariant().get('m.3243A>G')!, 18)
  const without3PN = summarizeInput(atlas.landscape.filter(o => o.variant === 'm.14487T>C' && o.non_candidate !== '3PN'), 18, boundary)
  const overall = summarizeInput([...byVar.values()].flat(), 18, boundary)
  const allVariants = [...byVar.keys()]
  const inputCell = (f: ReturnType<typeof summarizeInput>) => <>
    {f.fraction === null ? '—' : `${fmtFixed(f.fraction, lang)} (${f.k}/${f.n})`}
    {f.wilson && <div className="small muted">{t('model.iid95')}: {fmtFixed(f.wilson.low, lang)}–{fmtFixed(f.wilson.high, lang)}</div>}
    {f.crossingIntervals > 0 && <div className="small">{t('model.crossing', { n: f.crossingIntervals })}</div>}
  </>

  return <article className="model-page">
    <p><ModelBadge /></p>
    <PageTitle title={t('model.title')} />
    <h1>{t('model.title')}</h1>
    <p className="subtitle">{t('model.subtitle')}</p>
    <p className="small muted" data-testid="model-version" data-model-version={modelVersion.model_version}>{t('model.versionLabel', { v: modelVersion.model_version })}</p>
    <div className="callout model" role="note"><strong>◆ </strong>{t('model.banner')}</div>
    <PageContents items={[{ id: 'model-1', text: t('model.meaningTitle') }, { id: 'model-2', text: t('model.tableTitle') }, { id: 'model-3', text: t('model.formula') }, { id: 'model-4', text: t('model.boundsTitle') }, { id: 'model-5', text: t('model.evidenceTitle') }]} />
    <h2 id="model-1">{t('model.meaningTitle')}</h2>
    <p data-testid="model-meaning">{t('model.meaning')}</p>
    <p data-testid="model-input-summary">{t('model.inputSummary', { n: overall.n, sources: overall.sources, blastocysts: overall.blastocysts, unspecified: overall.unspecifiedStage, nd: overall.ndWithoutLod })}</p>

    <p data-testid="model-without-3pn">{t('model.without3pn', { k: without3PN.k, n: without3PN.n, sign: symbol })}</p>
    <p>{t('model.symbols')}</p>
    <p>{t('model.carrierCaveat')}</p>
    <details><summary>{t('model.publicationCarriers')}</summary><ul>{publicationCarriers.map(p => <li key={p.publication}><PubRef id={p.publication} />: {p.n}; {p.locator}</li>)}</ul></details>
    <div className="controls">
      <label><input type="checkbox" checked={teOnly} onChange={e => setTeOnly(e.target.checked)} data-testid="model-te-only" /> {t('model.teOnly')}</label>
      <span>{t('common.threshold')}: <Seg label={t('common.threshold')} value={cut} onChange={setCut} options={[
        { v: 'both', label: '18% + 30%' }, { v: '18', label: `${symbol}18%` }, { v: '30', label: `${symbol}30%` },
      ]} /></span>
      <span>{t('model.boundary')}: <Seg label={t('model.boundary')} value={boundary} onChange={setBoundary} options={[
        { v: 'inclusive', label: '≤' }, { v: 'strict', label: '<' },
      ]} /></span>
      <label>{t('model.rhoLabel')} <select value={rho} onChange={(e) => setRho(Number(e.target.value))} aria-describedby="rho-help" data-testid="model-rho">
        {[0, 0.05, 0.1, 0.2, 0.4].map((value) => <option key={value} value={value}>{fmt(value, lang, 2)}{value === 0 ? ` — ${t('model.independent')}` : ''}</option>)}
      </select></label>
      <label><input type="checkbox" checked={showRange} onChange={(e) => setShowRange(e.target.checked)} /> {t('model.showRange')}</label>
    </div>
    <p className="small" id="rho-help" data-testid="rho-note">{t('model.rhoNote')}</p>
    {showRange && <div className="callout small" data-testid="interval-note">{t('model.intervalNote')}</div>}
    <p data-testid="model-correlation-example">{t('model.correlationExample', { h: `${example.k}/${example.n}`, e: fmt(0.5, lang), p0: fmt(scenarioProbability(example.fraction!, 0.5, 6, 0), lang, 2), p2: fmt(scenarioProbability(example.fraction!, 0.5, 6, 0.2), lang, 2) })}</p>
    <div className="legend-row">
      <span>◆ {t('badge.model')}</span>
      {variants.map((x) => <span key={x.v}><svg width="32" height="10" aria-hidden="true"><line x1="0" x2="32" y1="5" y2="5" stroke={x.color} strokeWidth="2" strokeDasharray={({ solid: '', dash: '8 4', dot: '2 3', dashdot: '8 3 2 3' } as Record<string, string>)[x.dash]} /></svg>{x.v} — {t('model.carriers', { n: x.unknownCarriers ? t('model.unknown') : x.carriers, records: x.f18.n })}: {cuts.map((threshold) => {
        const f = threshold === 18 ? x.f18 : x.f30
        return `${symbol}${threshold}%: ${f.k}/${f.n}`
      }).join(' / ')}</span>)}
      {cut === 'both' && <span>{t('model.dashed')}</span>}
    </div>
    <div className="panel-tabs" role="group" aria-label={t('model.panelTabs')}>
      {panels.map((p, i) => <button key={p.age} type="button" aria-pressed={i === panelIdx} onClick={() => setPanelIdx(i)}>
        {t('model.panel', { age: p.age, p: fmt(p.pe, lang) })}
      </button>)}
    </div>
    <div className="grid-3 model-panels">
      {panels.map((p, i) => <div key={p.age} className={i === panelIdx ? 'is-active' : 'is-inactive'}>
        <h3>{t('model.panel', { age: p.age, p: fmt(p.pe, lang) })}</h3>
        <PlotlyChart ariaLabel={t('model.panel', { age: p.age, p: fmt(p.pe, lang) })} height={360} data={p.data as never} layout={p.layout as never} />
      </div>)}
    </div>
    <ul className="small">
      <li>{t('model.pHet')}</li>
      <li data-testid="p-eupl">{t('model.pEupl')}. {t('model.scenarioNote')} {t('model.pEuplSource')}: <PubRef id={m.p_eupl_publication} />{m.p_eupl_locator && <span className="muted"> — {m.p_eupl_locator}</span>}</li>
    </ul>

    <h2 id="model-2">{t('model.tableTitle')}</h2>
    <div className="controls"><label>{t('model.tableN')} <input type="number" min={0} max={m.n_max} value={nTable} data-testid="model-n" onChange={(e) => {
      const value = Number(e.target.value)
      if (Number.isFinite(value)) setNTable(Math.min(m.n_max, Math.max(0, Math.round(value))))
    }} /></label></div>
    <p className="small" data-testid="input-interval-note">{t('model.inputIntervalNote')}</p>
    <div className="table-wrap"><table className="data" data-testid="model-table">
      <thead><tr><th>{t('common.variant')}</th><th>H {symbol}18%</th><th>H {symbol}30%</th><th>{t('model.sampleComposition')}</th>{m.p_eupl.map((a) => <th key={a.age}>{t('model.panel', { p: fmt(a.value, lang) })}</th>)}</tr></thead>
      <tbody>{allVariants.map((v) => {
        const obs = byVar.get(v)!
        const f18 = summarizeInput(obs, 18, boundary)
        const f30 = summarizeInput(obs, 30, boundary)
        return <tr key={v} data-variant={v}>
          <td>{v}{atlas.variant_classes[v]?.class === 'uncertain_significance' && <div className="badge warn">{t('model.vus')}</div>}{obs.length < 10 && <div className="muted small">{t('model.smallN')}</div>}</td>
          <td className="num">{inputCell(f18)}</td><td className="num">{inputCell(f30)}</td>
          <td className="small">{t('model.sourceCount', { n: f18.sources })}<br />{t('model.stageCount', { b: f18.blastocysts, u: f18.unspecifiedStage })}{f18.ndWithoutLod > 0 && <><br />{t('model.ndCount', { n: f18.ndWithoutLod })}</>}</td>
          {m.p_eupl.map((a) => <td key={a.age} className="num">{cuts.map((threshold) => <div key={threshold} data-cut={threshold}>{symbol}{threshold}%: <span data-probability>{(threshold === 18 ? f18 : f30).fraction === null ? '—' : fmtFixed(scenarioProbability((threshold === 18 ? f18 : f30).fraction!, a.value, nTable, rho), lang)}</span></div>)}</td>)}
        </tr>
      })}</tbody>
    </table></div>

    <h2 id="model-3">{t('model.formula')}</h2>
    <p><span className="formula">q = H × E</span> · <span className="formula">P(≥1) = 1 − (1 − q)^N</span></p>
    <p>{t('model.dependentFormula')}</p>
    <p className="formula">Q ~ Beta(α, β); α = q(1/ρ − 1), β = (1 − q)(1/ρ − 1)<br />P(≥1) = 1 − B(α, β + N) / B(α, β)</p>
    <h3>{t('model.assumptions')}</h3>
    <ul className="prose">{['a1', 'a2', 'a3', 'a4'].map((key) => <li key={key}>{t(`model.${key}`)}</li>)}</ul>
    <p className="small muted">{t('model.improvement')}</p>

    <h2 id="model-4">{t('model.boundsTitle')}</h2>
    <p>{t('model.boundsNote')}</p>
    <p className="formula">max(0, H + E − 1) ≤ q ≤ min(H, E)</p>
    <div className="table-wrap"><table className="data" data-testid="joint-bounds">
      <thead><tr><th>{t('common.variant')}</th><th>{t('common.threshold')}</th>{m.p_eupl.map((a) => <th key={a.age}>E = {fmt(a.value, lang)}</th>)}</tr></thead>
      <tbody>{variants.flatMap((v) => cuts.map((threshold) => {
        const h = (threshold === 18 ? v.f18 : v.f30).fraction!
        return <tr key={`${v.v}-${threshold}`}><td>{v.v}</td><td>{symbol}{threshold}%</td>{m.p_eupl.map((a) => {
          const b = h === null ? null : jointBounds(h, a.value)
          return <td className="num" key={a.age}>{b ? `${fmtFixed(b.low, lang)}–${fmtFixed(b.high, lang)}` : '—'}</td>
        })}</tr>
      }))}</tbody>
    </table></div>

    <h2 id="model-5">{t('model.evidenceTitle')}</h2>
    <p>{t('model.evidenceNote')}</p>
    <div className="table-wrap"><table className="data" data-testid="joint-evidence">
      <thead><tr><th>{t('common.source')}</th><th>{t('common.variant')}</th><th>H≤18%</th><th>{t('model.confirmedEuploid')}</th><th>{t('model.jointPass')}</th></tr></thead>
      <tbody>{jointEvidence.map((r) => <tr key={r.key}><td><PubRef id={r.publication} /><div className="small">{r.locator}</div><div className="small">{t(`model.evidence.${r.key}`)}</div></td><td>{r.variant}</td><td className="num">{r.h}/{r.n}</td><td className="num">{r.confirmedEuploid}/{r.n}</td><td className="num">{r.joint}/{r.n}</td></tr>)}</tbody>
    </table></div>
    <p className="small" data-testid="sallevelt-note">{t('model.salleveltNote')} <PubRef id="sallevelt2017" /> — pp. 700–701; Supplementary Table SI.</p>
  <BackToTop />
    </article>
}
