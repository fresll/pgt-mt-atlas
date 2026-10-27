import { useEffect, useMemo, useRef, useState, type ComponentType, type ReactNode } from 'react'
import type { Layout } from 'plotly.js'
import type { PlotParams } from 'react-plotly.js'
import { useLang, useT } from '../i18n'
import { plotlyAr } from '../i18n/plotly-ar'
import { plotlyZh } from '../i18n/plotly-zh'
import { plotlyEs } from '../i18n/plotly-es'

function ArabicViewport({ enabled, scrollable, label, children }: { enabled: boolean; scrollable: boolean; label: string; children: ReactNode }) {
  if (!enabled) return <>{children}</>
  return <div className="ar-chart-viewport" dir="ltr" tabIndex={scrollable ? 0 : undefined} aria-label={label} role="region">{children}</div>
}

let cached: ComponentType<PlotParams> | null = null
let plotlyApi: typeof import('plotly.js') | null = null

/** Plotly только в браузере: при статической генерации показывается заглушка, а данные доступны в таблице. */
export function ArabicPlotlyChart({ ariaLabel, height = 420, arMinWidth = 0, ...props }: Omit<PlotParams, 'style'> & { ariaLabel: string; height?: number; arMinWidth?: number; children?: ReactNode }) {
  const t = useT()
  const lang = useLang()
  const [Plot, setPlot] = useState<ComponentType<PlotParams> | null>(cached)
  const [failed, setFailed] = useState(false)
  const [frameWidth, setFrameWidth] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const expandButton = useRef<HTMLButtonElement>(null)
  const [reset, setReset] = useState(0)
  const frame = useRef<HTMLDivElement>(null)
  // Plotly mutates layouts; a fresh copy also restores defaults on explicit reset.
  const layout = useMemo(() => {
    const value: Partial<Layout> = {
      uirevision: 'atlas-view',
      ...structuredClone(props.layout ?? {}),
      separators: lang === 'ru' ? ', ' : lang === 'es' ? ',\u00a0' : '.,',
    }
    if (lang === 'ar') {
      value.font = { ...value.font, family: 'DejaVu Sans, Tahoma, sans-serif' }
      const compact = frameWidth > 0 && frameWidth < 600 && !expanded
      const sideLabels = value.annotations?.some(a => a.xanchor === 'left')
      value.margin = { ...value.margin, l: Math.max(value.margin?.l ?? 0, compact ? 80 : 140), b: Math.max(value.margin?.b ?? 0, 125), r: Math.max(value.margin?.r ?? 0, sideLabels ? compact ? 110 : 150 : 40) }
      for (const [key, axis] of Object.entries(value)) {
        if (/^[xy]axis\d*$/.test(key) && axis && typeof axis === 'object') Object.assign(axis, { automargin: true })
      }
    }
    return value
  }, [props.layout, lang, reset, frameWidth, expanded])
  useEffect(() => {
    if (!expanded) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    expandButton.current?.focus()
    return () => { document.body.style.overflow = previous }
  }, [expanded])
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
  useEffect(() => {
    const container = frame.current
    if (!Plot || !container || typeof ResizeObserver === 'undefined') return
    let width = 0
    // A plot initialized in a hidden mobile tab has no measurable width.
    // Resize it when the tab becomes visible, without waiting for window resize.
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width <= 0) { width = 0; return }
      if (entry.contentRect.width === width) return
      width = entry.contentRect.width
      setFrameWidth(width)
      const graph = container.querySelector<HTMLElement & { _fullLayout?: unknown }>('.js-plotly-plot')
      if (plotlyApi && graph?._fullLayout && graph.getBoundingClientRect().width > 0) {
        void Promise.resolve(plotlyApi.Plots.resize(graph)).catch(error => {
          console.error('PGT-mt Atlas: resizing visible chart failed', error)
        })
      }
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [Plot])
  return (
    <div ref={frame} className={`chart-frame${expanded ? ' chart-expanded' : ''}`} role={expanded ? 'dialog' : 'figure'} aria-modal={expanded || undefined} aria-label={ariaLabel} onKeyDown={event => {
      if (!expanded) return
      if (event.key === 'Escape') { setExpanded(false); expandButton.current?.focus() }
      if (event.key === 'Tab') {
        const items = frame.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [tabindex="0"]')
        if (!items?.length) return
        const first = items[0], last = items[items.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }}>
      <div className="chart-actions">
        <button ref={expandButton} type="button" className="ghost" disabled={!Plot} aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>
          {t(expanded ? 'common.collapseChart' : 'common.expandChart')}
        </button>
        <button type="button" className="ghost" disabled={!Plot} onClick={() => {
          view.current = {}
          paintedLang.current = lang
          setReset(v => v + 1)
        }}>
          {t('common.resetChartView')}
        </button>
      </div>
      {lang === 'ar' && arMinWidth > frameWidth && <p className="ar-chart-scroll-hint">{t('common.scrollHint')}</p>}
      <ArabicViewport enabled={lang === 'ar'} scrollable={arMinWidth > frameWidth} label={ariaLabel}>
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
          style={{ width: '100%', minWidth: lang === 'ar' && arMinWidth ? arMinWidth : undefined, height: expanded ? lang === 'ar' ? 'max(420px, calc(94dvh - 90px))' : 'calc(94dvh - 90px)' : lang === 'ar' ? Math.max(height, 500) : height }}
          useResizeHandler
          config={{
            displaylogo: false,
            locale: lang === 'ar' ? 'ar' : lang === 'zh-Hans' ? 'zh-Hans' : lang === 'es' ? 'es' : 'en-US',
            locales: { ar: plotlyAr, es: plotlyEs, 'zh-Hans': plotlyZh },
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
      </ArabicViewport>
    </div>
  )
}
