import { useEffect, useState } from 'react'

export interface ChartTheme {
  ink: string
  ink2: string
  muted: string
  grid: string
  surface: string
  s1: string
  s2: string
  s3: string
  s4: string
  bandGreen: string
  bandBlue: string
  bandRed: string
  accent: string
  critical: string
  warn: string
}

const LIGHT: ChartTheme = {
  ink: '#0b0b0b', ink2: '#52514e', muted: '#6f6d68', grid: '#e1e0d9', surface: '#fcfcfb',
  s1: '#2a78d6', s2: '#eb6834', s3: '#1baf7a', s4: '#eda100',
  bandGreen: '#e9f0e9', bandBlue: '#e6eef8', bandRed: '#f9eded', accent: '#1c5cab', critical: '#d03b3b', warn: '#fab219',
}

function read(): ChartTheme {
  if (typeof window === 'undefined') return LIGHT
  const cs = getComputedStyle(document.documentElement)
  const v = (name: string, fb: string) => cs.getPropertyValue(name).trim() || fb
  return {
    ink: v('--ink', LIGHT.ink), ink2: v('--ink-2', LIGHT.ink2), muted: v('--muted', LIGHT.muted),
    grid: v('--grid', LIGHT.grid), surface: v('--surface', LIGHT.surface),
    s1: v('--s1', LIGHT.s1), s2: v('--s2', LIGHT.s2), s3: v('--s3', LIGHT.s3), s4: v('--s4', LIGHT.s4),
    bandGreen: v('--band-green', LIGHT.bandGreen), bandBlue: v('--band-blue', LIGHT.bandBlue),
    bandRed: v('--band-red', LIGHT.bandRed), accent: v('--accent', LIGHT.accent),
    critical: v('--critical', LIGHT.critical), warn: LIGHT.warn,
  }
}

/** Цвета графиков из CSS-токенов; пересчитываются при смене темы. */
export function useChartTheme(): ChartTheme {
  const [theme, setTheme] = useState<ChartTheme>(LIGHT)
  useEffect(() => {
    const update = () => setTheme(read())
    update()
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', update)
    const obs = new MutationObserver(update)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => {
      mq.removeEventListener('change', update)
      obs.disconnect()
    }
  }, [])
  return theme
}

export function baseLayout(th: ChartTheme) {
  return {
    paper_bgcolor: th.surface,
    plot_bgcolor: th.surface,
    font: { family: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', color: th.ink2, size: 13 },
    hoverlabel: { bgcolor: th.surface, bordercolor: th.grid, font: { color: th.ink, size: 13 } },
    margin: { l: 64, r: 16, t: 24, b: 56 },
    showlegend: false,
  }
}

export function axis(th: ChartTheme, extra: Record<string, unknown> = {}) {
  return {
    gridcolor: th.grid,
    zerolinecolor: th.grid,
    linecolor: th.muted,
    tickcolor: th.muted,
    tickfont: { color: th.ink2 },
    title: { font: { color: th.ink2, size: 13 } },
    ...extra,
  }
}
