import { useMemo, useState } from 'react'
import { PlotlyChart } from '../../components/PlotlyChart'
import { ModelBadge, PubRef, Seg } from '../../components/ui'
import { atlas, fractionAtOrBelow, obsByVariant } from '../../data/atlas'
import { useLang, useT } from '../../i18n'
import { fmt, fmtFixed } from '../../lib/format'
import { curve, pAtLeastOne } from '../../model/scenario'
import { axis, baseLayout, useChartTheme } from '../../lib/theme'

type Cut = 'both' | '18' | '30'

export default function Fig6() {
  const t = useT()
  const lang = useLang()
  const th = useChartTheme()
  const [cut, setCut] = useState<Cut>('both')
  const [nTable, setNTable] = useState(3)
  const m = atlas.model
  const byVar = obsByVariant()
  const colors = [th.s1, th.s2, th.s3, th.s4]
  const variants = m.fig6_variants.map((v, i) => {
    const obs = byVar.get(v)!
    const f18 = fractionAtOrBelow(obs, 18)
    const f30 = fractionAtOrBelow(obs, 30)
    return { v, f18, f30, color: colors[i] }
  })

  const panels = useMemo(
    () =>
      m.p_eupl.map(({ age, value: pe }) => {
        const data: Record<string, unknown>[] = []
        const ann: Record<string, unknown>[] = []
        for (const x of variants) {
          const p18 = x.f18.k / x.f18.n
          const p30 = x.f30.k / x.f30.n
          if (cut !== '30') {
            const c = curve(p18, pe, m.n_max)
            data.push({
              type: 'scatter', mode: 'lines+markers', x: c.map((q) => q.n), y: c.map((q) => q.p), line: { color: x.color, width: 2 }, marker: { size: 6, color: x.color },
              hovertemplate: `${x.v}, ≤18%<br>p_het = ${x.f18.k}/${x.f18.n}, p_eupl = ${pe}<br>N = %{x}: P = %{y:.2f}<extra></extra>`,
            })
            ann.push({ x: m.n_max + 0.1, y: c[c.length - 1].p, xanchor: 'left', text: x.v, showarrow: false, font: { size: 10, color: th.ink2 } })
          }
          if (cut !== '18' && (cut === '30' || p30 !== p18)) {
            const c = curve(p30, pe, m.n_max)
            data.push({
              type: 'scatter', mode: 'lines', x: c.map((q) => q.n), y: c.map((q) => q.p), line: { color: x.color, width: 1.4, dash: cut === '30' ? 'solid' : 'dash' },
              hovertemplate: `${x.v}, ≤30%<br>p_het = ${x.f30.k}/${x.f30.n}, p_eupl = ${pe}<br>N = %{x}: P = %{y:.2f}<extra></extra>`,
            })
            if (cut === '30') ann.push({ x: m.n_max + 0.1, y: c[c.length - 1].p, xanchor: 'left', text: x.v, showarrow: false, font: { size: 10, color: th.ink2 } })
          }
        }
        return {
          age,
          pe,
          data,
          layout: {
            ...baseLayout(th),
            margin: { l: 56, r: 78, t: 16, b: 52 },
            annotations: ann,
            shapes: [{ type: 'line', x0: 0.7, x1: m.n_max + 0.3, y0: 0.8, y1: 0.8, line: { color: th.muted, dash: 'dot', width: 1 }, layer: 'below' }],
            xaxis: axis(th, { range: [0.7, m.n_max + 0.3], dtick: 1, title: { text: t('fig6.xAxis') }, fixedrange: true }),
            yaxis: axis(th, { range: [0, 1.03], title: { text: t('fig6.yAxis') }, fixedrange: true, tickformat: '.1f' }),
          },
        }
      }),
    [cut, th, lang],
  )

  const allVariants = [...byVar.keys()]
  return (
    <article>
      <p><ModelBadge /></p>
      <h1>{t('fig6.title')}</h1>
      <p className="subtitle">{t('fig6.subtitle')}</p>
      <div className="callout model" role="note"><strong>◆ </strong>{t('fig6.banner')}</div>
      <div className="controls">
        <span>
          {t('common.threshold')}:{' '}
          <Seg label={t('common.threshold')} value={cut} onChange={setCut} options={[
            { v: 'both', label: `18% + 30%` },
            { v: '18', label: '≤18%' },
            { v: '30', label: '≤30%' },
          ]} />
        </span>
      </div>
      <div className="legend-row">
        {variants.map((x) => (
          <span key={x.v}>
            <span className="sw" style={{ background: x.color }} />
            {x.v}: p_het = {fmtFixed(x.f18.k / x.f18.n, lang)}
            {x.f30.k !== x.f18.k && ` / ${fmtFixed(x.f30.k / x.f30.n, lang)}`}
          </span>
        ))}
        {cut === 'both' && <span>{t('fig6.dashed')}</span>}
      </div>
      <div className="grid-3">
        {panels.map((p, i) => (
          <div key={p.age}>
            <h3>{['A', 'B', 'C'][i] && (lang === 'ru' ? ['А', 'Б', 'В'][i] : ['A', 'B', 'C'][i])}. {t('fig6.panel', { age: p.age, p: fmt(p.pe, lang) })}</h3>
            <PlotlyChart ariaLabel={t('fig6.panel', { age: p.age, p: p.pe })} height={360} data={p.data as never} layout={p.layout as never} />
          </div>
        ))}
      </div>
      <ul className="small">
        <li>{t('fig6.pHet')}</li>
        <li>{t('fig6.pEupl')}: <PubRef id={m.p_eupl_publication} /></li>
      </ul>

      <h2>{t('fig6.formula')}</h2>
      <p><span className="formula">p_both = p_het × p_eupl</span>  ·  <span className="formula">P(≥1) = 1 − (1 − p_both)^N</span></p>
      <h3>{t('fig6.assumptions')}</h3>
      <ul className="prose">
        <li>{t('fig6.a1')}</li>
        <li>{t('fig6.a2')}</li>
        <li>{t('fig6.a3')}</li>
      </ul>

      <h2>{t('fig6.tableTitle')}</h2>
      <div className="controls">
        <label>
          N =
          <input type="number" min={1} max={m.n_max} value={nTable} onChange={(e) => setNTable(Math.min(m.n_max, Math.max(1, Math.round(Number(e.target.value)))))} />
        </label>
      </div>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>{t('common.variant')}</th>
              <th>p_het ≤18%</th>
              <th>p_het ≤30%</th>
              {m.p_eupl.map((a) => <th key={a.age}>{lang === 'ru' ? `${a.age} лет` : `age ${a.age}`} (≤18%)</th>)}
            </tr>
          </thead>
          <tbody>
            {allVariants.map((v) => {
              const obs = byVar.get(v)!
              const f18 = fractionAtOrBelow(obs, 18)
              const f30 = fractionAtOrBelow(obs, 30)
              return (
                <tr key={v}>
                  <td>{v}{!m.fig6_variants.includes(v) && <> <span className="badge warn">{t('badge.outsideArticle')}</span></>}{obs.length < 10 && <span className="muted small"> · {t('fig6.smallN')}</span>}</td>
                  <td className="num">{fmtFixed(f18.k / f18.n, lang)} ({f18.k}/{f18.n})</td>
                  <td className="num">{fmtFixed(f30.k / f30.n, lang)} ({f30.k}/{f30.n})</td>
                  {m.p_eupl.map((a) => <td key={a.age} className="num">{fmtFixed(pAtLeastOne(f18.k / f18.n, a.value, nTable), lang)}</td>)}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </article>
  )
}
