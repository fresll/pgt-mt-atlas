import type { Locator } from '@playwright/test'

/** Compare the scientific and drawing contracts, allowing only localized text/number formatting. */
export async function drawing(element: Locator) {
  return element.evaluate((root) => {
    const clean = (value: any): any => Array.isArray(value) ? value.map(clean) : value && typeof value === 'object'
      ? Object.fromEntries(Object.entries(value).filter(([k]) => !['text', 'hovertemplate', 'name', 'ticktext', 'uid', 'separators', 'autosize'].includes(k)).map(([k, v]) => [k, clean(v)])) : value
    const size = (el: Element) => { const b = el.getBoundingClientRect(); return [b.width, b.height].map((x) => Math.round(x * 100) / 100) }
    const geometry = (el: Element) => [...el.querySelectorAll('path,circle,ellipse,line,polyline,polygon,rect')].filter((n) => !n.closest('defs') && getComputedStyle(n).opacity !== '0').map((n) => ({
      tag: n.tagName,
      attrs: Object.fromEntries([...n.attributes].filter((a) => !['id', 'clip-path', 'data-index', 'style'].includes(a.name)).map((a) => [a.name, a.value])),
      paint: ['fill', 'fill-opacity', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin', 'opacity', 'transform'].map((k) => getComputedStyle(n).getPropertyValue(k)),
    }))
    const chart = root as HTMLElement & { data?: any[]; layout?: any; _fullLayout?: any }
    if (chart._fullLayout) return {
      size: size(root), data: clean(chart.data), layout: clean(chart.layout), plotSize: chart._fullLayout._size,
      axes: ['xaxis', 'yaxis'].map((k) => { const a = chart._fullLayout[k]; return { range: a.range, length: a._length, offset: a._offset, fixedrange: a.fixedrange } }),
      scatter: geometry(root.querySelector('.scatterlayer')!),
      shapes: [...root.querySelectorAll('.shapelayer')].map(geometry),
      // Positions of numeric/category ticks must match even when their text uses a different language.
      ticks: [...root.querySelectorAll('.xtick text, .ytick text')].map((n) => n.getAttribute('transform')).sort(),
      controls: [...root.querySelectorAll('.modebar-btn')].map((n) => [n.getAttribute('data-attr'), n.getAttribute('data-val')]),
    }
    return { size: size(root), geometry: geometry(root), svgs: [...root.querySelectorAll('svg')].map((n) => [n.getAttribute('viewBox'), size(n)]) }
  })
}

