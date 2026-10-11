import { useEffect, useState, type ComponentType, type ReactNode } from 'react'
import type { PlotParams } from 'react-plotly.js'
import { useT } from '../i18n'

let cached: ComponentType<PlotParams> | null = null

/** Plotly только в браузере: при статической генерации показывается заглушка, а данные доступны в таблице. */
export function PlotlyChart({ ariaLabel, height = 420, ...props }: Omit<PlotParams, 'style'> & { ariaLabel: string; height?: number; children?: ReactNode }) {
  const t = useT()
  const [Plot, setPlot] = useState<ComponentType<PlotParams> | null>(cached)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    if (cached) return
    let alive = true
    Promise.all([import('react-plotly.js/factory'), import('plotly.js-basic-dist-min')]).then(([factory, plotly]) => {
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
      {Plot ? (
        <Plot
          {...props}
          style={{ width: '100%', height }}
          useResizeHandler
          config={{
            displaylogo: false,
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
