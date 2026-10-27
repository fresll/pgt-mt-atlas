import type { ReactNode } from 'react'
import type { PlotParams } from 'react-plotly.js'
import { useLang } from '../i18n'
import { PublicPlotlyChart } from './PublicPlotlyChart'
import { ArabicPlotlyChart } from './ArabicPlotlyChart'
export function PlotlyChart({ minWidth = 0, arMinWidth = 0, ...props }: Omit<PlotParams, 'style'> & { ariaLabel: string; height?: number; minWidth?: number; arMinWidth?: number; children?: ReactNode }) {
  const lang = useLang()
  return lang === 'ar' ? <ArabicPlotlyChart {...props} arMinWidth={arMinWidth || minWidth} /> : <PublicPlotlyChart {...props} minWidth={minWidth} />
}
