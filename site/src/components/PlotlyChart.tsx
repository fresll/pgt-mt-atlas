import { useEffect, useMemo, useRef, useState, type ComponentType, type ReactNode } from 'react'
import type { Layout } from 'plotly.js'
import type { PlotParams } from 'react-plotly.js'
import { useLang, useT } from '../i18n'
import { plotlyEs } from '../i18n/plotly-es'

let cached: ComponentType<PlotParams> | null = null
let plotlyApi: typeof import('plotly.js') | null = null

/** Plotly только в браузере: при статической генерации показывается заглушка, а данные доступны в таблице. */
export function PlotlyChart({ ariaLabel, height = 420, ...props }: Omit<PlotParams, 'style'> & { ariaLabel: string; height?: number; children?: ReactNode }) {
  const t = useT()
  const lang = useLang()
  const [Plot, setPlot] = useState<ComponentType<PlotParams> | null>(cached)
  const [failed, setFailed] = useState(false)
  const [reset, setReset] = useState(0)
  // Plotly mutates layouts; a fresh copy also restores defaults on explicit reset.
  const layout = useMemo(() => ({
    uirevision: 'atlas-view',
    ...structuredClone(props.layout ?? {}),
    separators: lang === 'ru' ? ', ' : lang === 'es' ? ',\u00a0' : '.,',
  }), [props.layout, lang, reset])
  const paintedLang = useRef(lang)
  const view = useRef<Record<string, unknown>>({})
  useEffect(() => {
    if (cached) return
    let alive = true
    Promise.all([import('react-plotly.js/factory'), import('plotly.js-basic-dist-min')]).then(([factory, plotly]) => {
      plotlyApi = plotly.default as typeof import('plotly.js')
      cached = factory.default(plotly.default)
      if (alive) setPlot(() => cached)
    }).catch((e: unknown) => {
      // модуль Plotly не загрузился (сеть, неверный путь размещения): сообщить, а не крутить «загрузку» бесконечно
      console.error('PGT-mt Atlas: chart module failed to load', e)
      if (alive) setFailed(true)
    })
    return () => {
      alive = false
    }
  }, [])
  return (
    <div className="chart-frame" role="figure" aria-label={ariaLabel}>
      <div className="chart-actions">
        <button type="button" className="ghost" disabled={!Plot} onClick={() => {
          view.current = {}
          paintedLang.current = lang
          setReset(v => v + 1)
        }}>
          {t('common.resetChartView')}
        </button>
      </div>
      {Plot ? (
        <Plot
          key={reset}
          {...props}
          // Plotly mutates nested axis ranges. Keep the caller's initial ranges intact
          // so uirevision can preserve zoom/pan when only the translated labels change.
          layout={layout}
          onRelayout={(event) => {
            // Store only the view, never data or language-dependent labels.
            for (const [key, value] of Object.entries(event)) {
              if (/^[xy]axis\d*\.range$/.test(key) && Array.isArray(value)) {
                // Reset emits whole ranges; zoom/pan emit endpoints. Use one
                // representation so a later language switch cannot replay both.
                view.current[`${key}[0]`] = value[0]
                view.current[`${key}[1]`] = value[1]
              } else if (key === 'dragmode' || /^[xy]axis\d*\.(range\[[01]\]|autorange)$/.test(key)) view.current[key] = structuredClone(value)
            }
            props.onRelayout?.(event)
          }}
          onUpdate={(figure, graph) => {
            if (paintedLang.current !== lang) {
              paintedLang.current = lang
              // Plotly 4 recreates the plot when config.locale changes, bypassing
              // uirevision. Restore the view after creation so Reset axes still
              // uses the original scientific ranges, not the zoomed ones.
              if (plotlyApi && Object.keys(view.current).length) {
                void plotlyApi.relayout(graph, view.current as Partial<Layout>).then(() => props.onUpdate?.(figure, graph)).catch((error: Error) => {
                  console.error('PGT-mt Atlas: restoring chart view failed', error)
                  props.onError?.(error)
                })
                return
              }
            }
            props.onUpdate?.(figure, graph)
          }}
          style={{ width: '100%', height }}
          useResizeHandler
          config={{
            displaylogo: false,
            locale: lang === 'es' ? 'es' : 'en-US',
            locales: { es: plotlyEs },
            responsive: true,
            modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d'],
            toImageButtonOptions: { format: 'png', scale: 3 },
            ...(props.config ?? {}),
          }}
        />
      ) : (
        <div className="chart-placeholder" style={{ minHeight: height }} data-state={failed ? 'error' : 'loading'}>
          <span role={failed ? 'alert' : undefined}>
            {failed ? t('common.chartError') : t('common.loadingChart')}
            <noscript>
              <br />
              {t('common.noJs')}
            </noscript>
          </span>
        </div>
      )}
    </div>
  )
}
