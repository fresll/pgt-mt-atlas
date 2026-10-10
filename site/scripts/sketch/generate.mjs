// Генератор иллюстраций Scientific Sketchbook: node scripts/sketch/generate.mjs
// Рисует «пером» — сплайны с детерминированной нерегулярностью (seeded RNG), двойной проход линии
// и лёгкая штриховка. Результат — масштабируемые SVG в src/illustrations/ (перезаписываются).
// Цвета берутся из CSS-переменных сайта с запасными значениями, поэтому файлы работают и отдельно.
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '../../src/illustrations')
mkdirSync(OUT, { recursive: true })

// ——— случайность и геометрия ———
function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
let R = rng(1)
const J = (a) => (R() * 2 - 1) * a
const n1 = (v) => Math.round(v * 10) / 10
const TAU = Math.PI * 2
const sgnpow = (v, p) => Math.sign(v) * Math.abs(v) ** p

/** Catmull-Rom → кубические Безье (относительные команды — компактнее). */
function spline(pts, closed = false) {
  const P = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]]
  let cx = n1(P[1][0]), cy = n1(P[1][1])
  let d = `M${cx} ${cy}c`
  const rel = (v, o) => n1(n1(v) - o)
  const parts = []
  for (let i = 1; i < P.length - 2; i++) {
    const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    parts.push([rel(c1[0], cx), rel(c1[1], cy), rel(c2[0], cx), rel(c2[1], cy), rel(p2[0], cx), rel(p2[1], cy)])
    cx = n1(p2[0])
    cy = n1(p2[1])
  }
  const num = (v) => String(v).replace(/^(-?)0\./, '$1.')
  d += parts.map((q) => q.map((v, k) => (k && v >= 0 ? ' ' : '') + num(v)).join('')).join(' ')
  return closed ? d + 'z' : d
}
const jitter = (pts, a) => pts.map(([x, y]) => [x + J(a), y + J(a)])

/** Линия пером: основной штрих + тонкий второй проход со смещением. */
function ink(pts, { closed = false, w = 2.2, tone = 'i', jit = 0.7, second = true, fill = false, extra = '' } = {}) {
  const cls = `sk-${tone}${fill ? ' sk-fill' : ''}`
  let s = `<path class="${cls}" stroke-width="${w}" d="${spline(jitter(pts, jit), closed)}"${extra}/>`
  if (second) s += `<path class="sk-${tone} sk-2" stroke-width="${n1(w * 0.42)}" d="${spline(jitter(pts, jit * 1.6 + 0.5), closed)}"/>`
  return s
}

/** Овал с низкочастотной неровностью; open=true — штрих с нахлёстом, как от руки. */
function blob(cx, cy, rx, ry, { rot = 0, n = 36, wob = 0.03, open = false, start = R() * TAU } = {}) {
  const f1 = R() * TAU, f2 = R() * TAU
  const pts = []
  const sweep = open ? TAU + 0.35 : TAU
  const cnt = open ? Math.round(n * 1.06) : n
  for (let i = 0; i < cnt; i++) {
    const t = start + (sweep * i) / (open ? cnt - 1 : cnt)
    const k = 1 + wob * Math.sin(2 * t + f1) + wob * 0.6 * Math.sin(3 * t + f2) + (open ? 0.012 * (i / cnt) : 0)
    const x = rx * k * Math.cos(t), y = ry * k * Math.sin(t)
    pts.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)])
  }
  return pts
}
function circleInk(cx, cy, r, o = {}) {
  return ink(blob(cx, cy, r, r, { n: Math.max(10, Math.round(r * 1.2)), wob: 0.025, open: !o.fill, ...o }), { closed: !!o.fill, ...o })
}

/** Штриховка внутри контура (clipPath), как лёгкая тень карандашом. */
let clipN = 0
function hatch(prefix, outline, box, { step = 7, angle = -0.9, op = 0.22, tone = 'i' } = {}) {
  const id = `${prefix}-h${clipN++}`
  const [x0, y0, x1, y1] = box
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, half = Math.hypot(x1 - x0, y1 - y0) / 2
  const ca = Math.cos(angle), sa = Math.sin(angle)
  let lines = ''
  for (let o = -half; o <= half; o += step + J(step * 0.25)) {
    const a = [cx + -half * ca - o * sa, cy + -half * sa + o * ca]
    const b = [cx + half * ca - o * sa, cy + half * sa + o * ca]
    lines += `M${n1(a[0] + J(1))} ${n1(a[1] + J(1))}L${n1(b[0] + J(1))} ${n1(b[1] + J(1))}`
  }
  return `<clipPath id="${id}"><path d="${spline(outline, true)}"/></clipPath><path class="sk-${tone}" clip-path="url(#${id})" stroke-width="0.7" opacity="${op}" d="${lines}"/>`
}

// ——— мтДНК: кольцевая молекула (двойное кольцо) ———
function mtDNA(x, y, r, tone) {
  return circleInk(x, y, r, { tone, w: 1.9, jit: 0.35 }) + circleInk(x, y, r * 0.62, { tone, w: 0.9, jit: 0.3, second: false })
}

// ——— митохондрия ———
/**
 * Митохондрия: наружная мембрана, внутренняя мембрана с кристами (чередуются сверху и снизу),
 * матрикс со штриховкой и кольца мтДНК. tones — цвета колец по порядку слотов ('i' дикий тип, 'r' патогенный вариант).
 */
function mitochondrion(prefix, o) {
  const { cx, cy, L, H, rot = 0, bend = -0.12, tones = [], scale = 1, rings = 8, p = 2.3, hatching = true } = o
  const top = (o.top ?? [-0.62, -0.2, 0.22, 0.64]), bot = (o.bot ?? [-0.41, 0.01, 0.43])
  const rx = L / 2, ry = H / 2
  const xf = ([x, y]) => {
    const yb = y + bend * H * ((x / rx) ** 2 - 0.35) // бобовидный изгиб
    const xr = x * Math.cos(rot) - yb * Math.sin(rot)
    const yr = x * Math.sin(rot) + yb * Math.cos(rot)
    return [cx + xr * scale, cy + yr * scale]
  }
  const sup = (a, b, t) => [a * sgnpow(Math.cos(t), 2 / p), b * sgnpow(Math.sin(t), 2 / p)]
  const outer = []
  for (let i = 0; i < 64; i++) outer.push(sup(rx, ry, (TAU * i) / 64))

  // внутренняя мембрана: обход по суперэллипсу с вставкой крист (пальцевидные складки с округлым концом)
  const gapM = o.gap ?? Math.max(10, H * 0.085)
  const ix = rx - gapM, iy = ry - gapM
  const cw = o.cw ?? Math.max(9, H * 0.085) // ширина кристы
  const TOP = top.map((k) => k * ix), BOT = bot.map((k) => k * ix)
  const base = []
  const N = 180
  for (let i = 0; i < N; i++) base.push(sup(ix, iy, (TAU * i) / N))
  const inner = []
  for (let i = 0; i < N; i++) {
    const a = base[i], b = base[(i + 1) % N]
    const onTop = a[1] < 0 && b[1] < 0, onBot = a[1] > 0 && b[1] > 0
    const list = onTop ? TOP : onBot ? BOT : []
    if (!list.some((x) => Math.abs(a[0] - x) < cw / 2 + 6)) inner.push(a)
    list.forEach((xc) => {
      if ((a[0] - xc) * (b[0] - xc) > 0 || a[0] === b[0]) return
      const s = Math.sign(b[0] - a[0])
      const yE = a[1] + ((b[1] - a[1]) * (xc - a[0])) / (b[0] - a[0])
      const dir = onTop ? 1 : -1
      const d = Math.abs(yE) * (0.8 + R() * 0.32)
      const r = cw / 2, sw = J(cw * 0.55), sw2 = J(cw * 0.3) // U-образный конец, изогнутый стебель
      const tipC = yE + dir * (d - r)
      const at = (t, side) => [xc + side * s * (cw / 2) + sw * Math.sin(Math.PI * t * 0.9) + sw2 * Math.sin(TAU * t), yE + dir * d * t]
      inner.push([xc - s * (cw / 2 + 4), yE + dir * 0.5], at(0.08, -1), at(0.35, -1), at(0.62, -1))
      const tc = at((d - r) / d, 0)
      for (const u of [0, 0.25, 0.5, 0.75, 1]) inner.push([tc[0] - s * r * Math.cos(Math.PI * u), tipC + dir * r * Math.sin(Math.PI * u)])
      inner.push(at(0.62, 1), at(0.35, 1), at(0.08, 1), [xc + s * (cw / 2 + 4), yE + dir * 0.5])
    })
  }
  const O = outer.map(xf), I = inner.map(xf)
  const bx = [Math.min(...O.map((q) => q[0])), Math.min(...O.map((q) => q[1])), Math.max(...O.map((q) => q[0])), Math.max(...O.map((q) => q[1]))]
  const k = Math.min(1.2, scale) * (o.weight ?? 1)
  let s = `<g class="mito">`
  s += `<path class="sk-fill" d="${spline(O, true)}"/>`
  if (hatching) s += hatch(prefix, I, bx, { step: 6.5, op: 0.15 })
  s += ink(O, { closed: true, w: 2.6 * k, jit: 0.8 * Math.min(1, scale * 1.5), second: o.second ?? true })
  s += ink(I, { closed: true, w: 1.9 * k, jit: 0.5 * Math.min(1, scale * 1.5), second: o.second ?? true })
  // кольца мтДНК — в просветах матрикса между кристами
  const slots = [[-0.86, 0.1], [-0.41, -0.55], [-0.2, 0.56], [0.01, -0.55], [0.22, 0.56], [0.43, -0.55], [0.64, 0.5], [0.88, 0.02]].slice(0, rings)
  const ringR = o.ringR ?? H * 0.048
  const ringPts = []
  slots.forEach(([kx, ky], j) => {
    const [x, y] = xf([kx * ix + J(2), ky * iy + J(2)])
    ringPts.push([x, y, tones[j] ?? 'i'])
    s += mtDNA(x, y, ringR * scale, tones[j] ?? 'i')
  })
  s += `</g>`
  return { svg: s, rings: ringPts, xf, ix, iy, top: TOP, bot: BOT }
}

// ——— бластоциста ———
function teCell(cx, cy, R0, th, half, thick) {
  // клетка трофэктодермы: уплощённый «кирпичик» вдоль окружности
  const pts = []
  const n = 22
  for (let i = 0; i < n; i++) {
    const t = (TAU * i) / n
    const u = half * sgnpow(Math.cos(t), 2 / 3.2), v = thick * sgnpow(Math.sin(t), 2 / 3.2)
    const a = th + u / R0, r = R0 + v
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
  }
  return pts
}
function blastocyst(prefix, { cx, cy, Rb, n = 24, icmAngle = (3 * Math.PI) / 4, zona = true, skip = [], extraCells = '', sp: o_sp, groups = false }) {
  // groups: обернуть бластоцель, ВКМ и ТЭ в <g class="bx-…"> для интерактивной подсветки (по умолчанию выключено — прежние файлы не меняются)
  const open = (k) => (groups ? `<g class="bx-${k}">` : ''), close = groups ? '</g>' : ''
  let s = '<g class="blastocyst">'
  if (zona) {
    s += ink(blob(cx, cy, Rb + 25, Rb + 25, { n: 70, wob: 0.008, open: true }), { w: 1.1, jit: 0.4, second: false, extra: ' opacity="0.75"' })
    s += ink(blob(cx, cy, Rb + 17, Rb + 17, { n: 70, wob: 0.008, open: true }), { w: 0.8, jit: 0.4, second: false, extra: ' opacity="0.55"' })
  }
  // бластоцель — лёгкая штриховка
  const cav = blob(cx, cy, Rb - 12, Rb - 12, { n: 40, wob: 0.01 })
  s += open('cav') + hatch(prefix, cav, [cx - Rb, cy - Rb, cx + Rb, cy + Rb], { step: 9, op: 0.09, angle: -0.7 }) + close
  // ВКМ
  const icm = []
  const ca = Math.cos(icmAngle), sa = Math.sin(icmAngle)
  const C = [cx + (Rb - 52) * ca, cy + (Rb - 52) * sa]
  const sp = Rb * (o_sp ?? 0.17)
  for (let gy = -5; gy <= 5; gy++) {
    for (let gx = -5; gx <= 5; gx++) {
      const x = C[0] + (gx + (gy % 2 ? 0.5 : 0)) * sp, y = C[1] + gy * sp * 0.86
      const dIn = Math.hypot(x - cx, y - cy)
      const dC = Math.hypot(x - (cx + (Rb + 10) * ca), y - (cy + (Rb + 10) * sa))
      if (dIn < Rb - 18 - sp * 0.2 && dC < Rb * 0.78) icm.push([x + J(sp * 0.12), y + J(sp * 0.12)])
    }
  }
  icm.sort((a, b) => Math.hypot(b[0] - cx, b[1] - cy) - Math.hypot(a[0] - cx, a[1] - cy))
  s += open('icm')
  for (const [x, y] of icm) {
    const r = sp * (0.56 + R() * 0.1)
    s += ink(blob(x, y, r, r * (0.86 + R() * 0.12), { rot: R() * 3, n: 16, wob: 0.05 }), { closed: true, fill: true, w: 1.5, jit: 0.4 })
    s += ink(blob(x + J(2), y + J(2), r * 0.38, r * 0.3, { rot: R() * 3, n: 10, wob: 0.06 }), { closed: true, w: 0.9, jit: 0.25, second: false })
    s += `<circle class="sk-dot" cx="${n1(x + J(1.5))}" cy="${n1(y + J(1.5))}" r="${n1(r * 0.09)}"/>`
  }
  s += close
  // трофэктодерма
  s += open('te')
  const half = (Math.PI * Rb) / n - 1.2
  for (let i = 0; i < n; i++) {
    if (skip.includes(i)) continue
    const th = (TAU * i) / n + J(0.02)
    const cell = teCell(cx, cy, Rb + J(1.2), th, half * (0.96 + R() * 0.08), Rb * 0.072)
    s += ink(cell, { closed: true, fill: true, w: 1.7, jit: 0.45 })
    const nx = cx + Rb * Math.cos(th), ny = cy + Rb * Math.sin(th)
    s += ink(blob(nx, ny, half * 0.34, Rb * 0.026, { rot: th + Math.PI / 2, n: 12, wob: 0.05 }), { closed: true, w: 0.9, jit: 0.25, second: false })
    s += `<circle class="sk-dot" cx="${n1(nx)}" cy="${n1(ny)}" r="1.1"/>`
  }
  s += close + extraCells + '</g>'
  return s
}

// ——— сборка файлов ———
const STYLE = `<style>.sk-i,.sk-r{fill:none;stroke-linecap:round;stroke-linejoin:round}.sk-i{stroke:var(--sk-ink,#1f3fb4)}.sk-r{stroke:var(--sk-red,#d42a2f)}.sk-2{opacity:.5}.sk-fill{fill:var(--sk-paper,#fff)}.sk-dot{fill:var(--sk-ink,#1f3fb4)}.sk-dot.r{fill:var(--sk-red,#d42a2f)}.sk-dash{stroke-dasharray:2 7}</style>`
function file(name, w, h, body, title) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}"><title>${title}</title>${STYLE}${body}</svg>\n`
  writeFileSync(join(OUT, name), svg)
  console.log(name, (svg.length / 1024).toFixed(1) + ' KB')
}
const tangent = (c1, r1, c2, r2, side) => {
  // внешняя касательная двух окружностей
  const dx = c2[0] - c1[0], dy = c2[1] - c1[1], d = Math.hypot(dx, dy)
  const a = Math.atan2(dy, dx) + side * Math.acos((r1 - r2) / d)
  return [[c1[0] + r1 * Math.cos(a), c1[1] + r1 * Math.sin(a)], [c2[0] + r2 * Math.cos(a), c2[1] + r2 * Math.sin(a)]]
}
const labels = {}
function leader(from, to, tone = 'i') {
  // выносная линия с лёгким изгибом
  const m = [(from[0] + to[0]) / 2 + J(6), (from[1] + to[1]) / 2 + J(6)]
  return ink([from, m, to], { w: 1.1, tone, jit: 0.3, second: false })
}

// 1. Митохондрия
R = rng(11)
{
  const m = mitochondrion('mt', { cx: 300, cy: 178, L: 500, H: 230, rot: -0.12, tones: ['i', 'i', 'r', 'i', 'i', 'r', 'i', 'i'] })
  file('mitochondrion.svg', 600, 360, m.svg, 'Mitochondrion with cristae and mtDNA molecules')
}

// 2. Бластоциста
R = rng(23)
file('blastocyst.svg', 440, 440, blastocyst('bl', { cx: 220, cy: 220, Rb: 172, sp: 0.15 }), 'Blastocyst: trophectoderm and inner cell mass')

// 3. Биопсия трофэктодермы — горизонтальная схема микроманипуляции:
//    удерживающая пипетка слева, биопсийная справа, несколько клеток ТЭ выходят через отверстие в блестящей оболочке.
R = rng(37)
{
  const cx = 250, cy = 240, Rb = 150, n = 24
  let body = blastocyst('bp', { cx, cy, Rb, n, icmAngle: Math.PI * 0.62, zona: false, skip: [0] })
  // блестящая оболочка с отверстием справа
  for (const [rr, w, op] of [[Rb + 25, 1.1, 0.75], [Rb + 17, 0.8, 0.55]]) {
    const pts = []
    for (let i = 0; i <= 64; i++) {
      const t = 0.17 + ((TAU - 0.34) * i) / 64
      pts.push([cx + rr * Math.cos(t), cy + rr * Math.sin(t)])
    }
    body += ink(pts, { w, jit: 0.4, second: false, extra: ` opacity="${op}"` })
  }
  // клетки ТЭ в отверстии и в устье пипетки; в них — точки мтДНК (синие и одна красная)
  const cell = (x, y, a, b, rot, dots) => {
    let c = ink(blob(x, y, a, b, { rot, n: 16, wob: 0.05 }), { closed: true, fill: true, w: 1.6, jit: 0.35 })
    c += ink(blob(x + J(1.5), y + J(1.5), a * 0.38, b * 0.28, { rot, n: 10 }), { closed: true, w: 0.9, jit: 0.2, second: false })
    dots.forEach(([dx, dy, t]) => (c += `<circle class="sk-dot${t === 'r' ? ' r' : ''}" cx="${n1(x + dx)}" cy="${n1(y + dy)}" r="1.9"/>`))
    return c
  }
  const tip = cx + Rb + 42
  body += cell(cx + Rb + 4, cy, 12, 20, 0, [[0, -8, 'i']])
  body += cell(cx + Rb + 27, cy - 10, 16, 12, 0.35, [[-7, 4, 'i'], [8, -2, 'r']])
  body += cell(cx + Rb + 29, cy + 11, 15, 11, -0.35, [[6, 3, 'i'], [-6, -3, 'i']])
  body += cell(tip + 30, cy + 1, 17, 13, 0.1, [[-6, -5, 'r'], [7, 4, 'i']])
  // биопсийная пипетка: стекло с толщиной стенки и лёгкой штриховкой
  const rIn = 22, wall = 6, end = tip + 190
  for (const sg of [-1, 1]) {
    body += ink([[tip, cy + sg * rIn], [tip + 80, cy + sg * rIn], [end, cy + sg * rIn]], { w: 1.7, jit: 0.3 })
    body += ink([[tip + 3, cy + sg * (rIn + wall)], [tip + 80, cy + sg * (rIn + wall)], [end, cy + sg * (rIn + wall)]], { w: 1.4, jit: 0.3 })
    body += ink([[tip, cy + sg * rIn], [tip + 3, cy + sg * (rIn + wall)]], { w: 1.3, jit: 0.15, second: false })
  }
  body += hatch('bp', [[tip + 70, cy - rIn - wall], [end, cy - rIn - wall], [end, cy - rIn], [tip + 70, cy - rIn]], [tip, cy - 40, end, cy], { step: 6, op: 0.3, angle: 1.0 })
  body += hatch('bp', [[tip + 70, cy + rIn], [end, cy + rIn], [end, cy + rIn + wall], [tip + 70, cy + rIn + wall]], [tip, cy, end, cy + 40], { step: 6, op: 0.3, angle: 1.0 })
  // удерживающая пипетка: широкая, с оплавленным тупым концом и узким просветом
  const hx = cx - Rb - 27
  for (const sg of [-1, 1]) {
    body += ink([[hx - 1, cy + sg * 5], [hx - 3, cy + sg * 18], [hx - 10, cy + sg * 29], [hx - 24, cy + sg * 33], [hx - 60, cy + sg * 33], [hx - 98, cy + sg * 33]], { w: 1.7 })
    body += ink([[hx - 6, cy + sg * 4.5], [hx - 50, cy + sg * 4.5], [hx - 98, cy + sg * 4.5]], { w: 0.9, jit: 0.2, second: false })
  }
  body += ink([[hx - 1, cy - 5], [hx - 6, cy - 4.5]], { w: 1.2, second: false }) + ink([[hx - 1, cy + 5], [hx - 6, cy + 4.5]], { w: 1.2, second: false })
  file('te-biopsy.svg', 690, 480, `<g transform="translate(30 0)">${body}</g>`, 'Trophectoderm biopsy: holding pipette, blastocyst and biopsy pipette')
}

// 4. Композиция для главной: бластоциста → увеличенная клетка ТЭ → митохондрия с мтДНК
R = rng(5)
{
  const W = 1000, H = 640
  const B = [250, 372], Rb = 150
  const za = -0.62 // клетка ТЭ под «лупой»
  const zc = [B[0] + Rb * Math.cos(za), B[1] + Rb * Math.sin(za)], zr = 32
  const M = [705, 292], MR = 222
  let body = ''
  for (const side of [-1, 1]) {
    const [a, b] = tangent(zc, zr, M, MR, side)
    body += `<path class="sk-i sk-dash" stroke-width="1.1" d="M${n1(a[0])} ${n1(a[1])}L${n1(b[0])} ${n1(b[1])}"/>`
  }
  body += `<circle class="sk-fill" cx="${M[0]}" cy="${M[1]}" r="${MR}"/>`
  body += blastocyst('hb', { cx: B[0], cy: B[1], Rb })
  body += ink(blob(zc[0], zc[1], zr, zr, { n: 30, wob: 0.02, open: true }), { w: 1.6, jit: 0.4 })
  body += ink(blob(M[0], M[1], MR, MR, { n: 90, wob: 0.006, open: true }), { w: 1.6, jit: 0.6 })
  const m = mitochondrion('hm', { cx: M[0] - 2, cy: M[1] + 6, L: 340, H: 168, rot: -0.2, scale: 1.1, tones: ['i', 'i', 'i', 'r', 'r', 'i', 'i', 'r'] })
  body += m.svg
  // подписи: текст — в HTML (двуязычный), здесь выносные линии; координаты подписей — в labels.json
  const lab = []
  const add = (key, anchor, at, align, tone = 'i') => {
    // линия подходит к подписи сверху или снизу, не пересекая текст
    const below = anchor[1] < at[1]
    const lines = below ? (key === 'te' || key === 'cristae' ? 1 : 2) : 1
    const end = [at[0] + (align === 'end' ? -40 : 40), at[1] + (below ? -1 : 1) * (lines === 2 ? 34 : 18)]
    body += leader(end, anchor, tone) + `<circle class="sk-dot${tone === 'r' ? ' r' : ''}" cx="${n1(anchor[0])}" cy="${n1(anchor[1])}" r="2.2"/>`
    lab.push({ key, x: n1((at[0] / W) * 100), y: n1((at[1] / H) * 100), align, tone })
  }
  const te = [B[0] + (Rb + 8) * Math.cos(-2.5), B[1] + (Rb + 8) * Math.sin(-2.5)]
  add('te', te, [20, 168], 'start')
  const icmP = [B[0] + (Rb - 70) * Math.cos(2.3), B[1] + (Rb - 70) * Math.sin(2.3)]
  add('icm', icmP, [20, 606], 'start')
  const crista = m.xf([m.top[2], -m.iy * 0.85])
  add('cristae', crista, [770, 42], 'start')
  const w = m.rings[2], v = m.rings[4]
  add('wt', [w[0] - 3, w[1] + 9], [548, 572], 'end')
  add('variant', [v[0] + 3, v[1] + 9], [972, 572], 'end', 'r')
  file('hero.svg', W, H, body, 'Blastocyst, a magnified trophectoderm cell and a mitochondrion with wild-type and pathogenic mtDNA')
  labels.hero = lab
}

// 5. Знак атласа: митохондрия с одной красной мтДНК
R = rng(3)
{
  const m = mitochondrion('mk', { cx: 32, cy: 33, L: 300, H: 160, rot: -0.38, scale: 0.18, rings: 0, hatching: false, second: false, weight: 2.4, top: [-0.3, 0.38], bot: [0.04], gap: 22, cw: 22 })
  const [x, y] = m.xf([-96, 22])
  const s = m.svg + `<circle class="sk-r" stroke-width="2.6" cx="${n1(x + 3)}" cy="${n1(y - 2)}" r="4.6"/>`
  file('mark.svg', 64, 64, s, 'PGT-mt Atlas')
  writeFileSync(join(OUT, '../../public/favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${STYLE}${s}</svg>\n`)
}

// 6. Путь данных: исследователь → передача → проверка → Atlas (страница Contribute Data).
//    Красное — отрицательные исходы в таблице и ветка «отклонено»; подписи — в HTML (labels.json → pathway).
R = rng(61)
{
  const W = 1000, H = 420
  const lab = []
  const put = (key, x, y, align = 'middle', tone = 'i') => lab.push({ key, x: n1((x / W) * 100), y: n1((y / H) * 100), align, tone })
  const rot = (pts, c, a) => pts.map(([x, y]) => [c[0] + (x - c[0]) * Math.cos(a) - (y - c[1]) * Math.sin(a), c[1] + (x - c[0]) * Math.sin(a) + (y - c[1]) * Math.cos(a)])
  const rect = (x, y, w, h, k = 4) => {
    const pts = []
    for (let i = 0; i < k; i++) pts.push([x + (w * i) / k, y])
    for (let i = 0; i < k; i++) pts.push([x + w, y + (h * i) / k])
    for (let i = 0; i < k; i++) pts.push([x + w - (w * i) / k, y + h])
    for (let i = 0; i < k; i++) pts.push([x, y + h - (h * i) / k])
    return pts
  }
  const line = (a, b, o = {}) => ink([a, [(a[0] + b[0]) / 2 + J(1.2), (a[1] + b[1]) / 2 + J(1.2)], b], { w: 1, jit: 0.4, second: false, ...o })
  /** Лист-таблица: шапка со штриховкой, строки, столбцы; red — ячейки с отрицательными исходами. */
  const sheet = (id, x, y, w, h, a, { rows = 7, cols = 4, red = [], fill = true } = {}) => {
    const c = [x + w / 2, y + h / 2]
    const R0 = (pts) => rot(pts, c, a)
    let g = ''
    const outline = R0(rect(x, y, w, h))
    g += ink(outline, { closed: true, fill, w: 1.8, jit: 0.5 })
    const rh = h / (rows + 1)
    g += hatch(id, R0(rect(x, y, w, rh, 2)), [x - 10, y - 10, x + w + 10, y + rh + 10], { step: 5, op: 0.3, angle: -0.8 })
    for (let i = 1; i <= rows; i++) {
      const [p, q] = R0([[x + 2, y + rh * i], [x + w - 2, y + rh * i]])
      g += line(p, q, { w: i === 1 ? 1.3 : 0.7 })
    }
    for (let j = 1; j < cols; j++) {
      const [p, q] = R0([[x + (w * j) / cols, y + 2], [x + (w * j) / cols, y + h - 2]])
      g += line(p, q, { w: 0.6 })
    }
    for (const [ri, cj] of red) {
      const [p] = R0([[x + (w * (cj + 0.5)) / cols, y + rh * (ri + 1.5)]])
      g += `<circle class="sk-dot r" cx="${n1(p[0])}" cy="${n1(p[1])}" r="2.6"/>`
    }
    return g
  }
  /** Стрелка пером: изогнутый штрих и два коротких «усика». */
  const arrow = (pts, tone = 'i', dash = false) => {
    let g = ink(pts, { w: 1.5, tone, jit: 0.5, second: false, extra: dash ? ' stroke-dasharray="5 6"' : '' })
    const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]]
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0])
    for (const s of [-1, 1]) {
      const t = [b[0] - 14 * Math.cos(ang + s * 0.42), b[1] - 14 * Math.sin(ang + s * 0.42)]
      g += ink([t, [(t[0] + b[0]) / 2 + J(0.6), (t[1] + b[1]) / 2 + J(0.6)], b], { w: 1.5, tone, jit: 0.2, second: false })
    }
    return g
  }
  let body = ''
  const mid = 168

  // 1. Таблица исследовательской группы: все циклы, в т. ч. отрицательные исходы (красные точки)
  body += sheet('pw1b', 30, 84, 124, 160, -0.12, { rows: 0, cols: 1 }) // лист под таблицей — стопка
  body += sheet('pw1', 46, 70, 124, 160, -0.05, { rows: 8, cols: 4, red: [[1, 3], [3, 2], [4, 3], [6, 1]] })
  put('researcher', 96, 292)

  // 2. Передача: конверт с вложенным листом
  body += arrow([[188, mid], [228, mid - 14], [266, mid - 4]])
  {
    const x = 284, y = 112, w = 150, h = 102
    body += sheet('pw2', x + 22, y - 40, 104, 92, 0.03, { rows: 4, cols: 3 })
    const env = rect(x, y, w, h)
    body += ink(env, { closed: true, fill: true, w: 1.9, jit: 0.5 })
    body += ink([[x + 2, y + 3], [x + w * 0.3, y + h * 0.36], [x + w / 2, y + h * 0.56], [x + w * 0.7, y + h * 0.36], [x + w - 2, y + 3]], { w: 1.4, jit: 0.4 })
    body += ink([[x + 3, y + h - 3], [x + w * 0.38, y + h * 0.48]], { w: 0.9, jit: 0.3, second: false })
    body += ink([[x + w - 3, y + h - 3], [x + w * 0.62, y + h * 0.48]], { w: 0.9, jit: 0.3, second: false })
  }
  put('submitted', 359, 272)

  // 3. Научная проверка: лупа над листом
  body += arrow([[450, mid], [488, mid + 12], [524, mid + 2]])
  {
    const x = 548, y = 76
    body += sheet('pw3', x, y, 118, 150, 0.06, { rows: 7, cols: 3, red: [[2, 2], [5, 0]] })
    const M = [x + 86, y + 92], r = 40
    body += `<circle class="sk-fill" cx="${M[0]}" cy="${M[1]}" r="${r}" opacity="0.72"/>`
    body += ink(blob(M[0], M[1], r, r, { n: 34, wob: 0.01, open: true }), { w: 2.4, jit: 0.4 })
    body += ink(blob(M[0], M[1], r - 6, r - 6, { n: 30, wob: 0.01, open: true }), { w: 0.8, jit: 0.3, second: false })
    // отражение на стекле
    body += ink([[M[0] - 22, M[1] - 10], [M[0] - 18, M[1] - 20], [M[0] - 9, M[1] - 26]], { w: 1.1, jit: 0.2, second: false })
    // ручка
    const a = 0.75, h0 = [M[0] + r * Math.cos(a), M[1] + r * Math.sin(a)], h1 = [M[0] + (r + 64) * Math.cos(a), M[1] + (r + 64) * Math.sin(a)]
    const nx = -Math.sin(a) * 7, ny = Math.cos(a) * 7
    const handle = [[h0[0] + nx, h0[1] + ny], [h1[0] + nx, h1[1] + ny], [h1[0] - nx, h1[1] - ny], [h0[0] - nx, h0[1] - ny]]
    body += ink(handle, { closed: true, fill: true, w: 1.9, jit: 0.4 })
    body += hatch('pw3', handle, [h0[0] - 20, h0[1] - 20, h1[0] + 20, h1[1] + 20], { step: 4, op: 0.45, angle: 0.75 + Math.PI / 2 })
  }
  put('review', 610, 272)

  // 3a. Отклонено: красная пунктирная ветка вниз
  body += arrow([[614, 296], [604, 330], [566, 356]], 'r', true)
  {
    const x = 470, y = 336, w = 76, h = 56
    body += sheet('pw4', x, y, w, h, -0.08, { rows: 3, cols: 2 })
    body += ink([[x + 8, y + 6], [x + w / 2, y + h / 2], [x + w - 6, y + h - 4]], { w: 2, tone: 'r', jit: 0.5, second: false })
    body += ink([[x + w - 8, y + 6], [x + w / 2, y + h / 2 + 1], [x + 8, y + h - 2]], { w: 2, tone: 'r', jit: 0.5, second: false })
  }
  put('rejected', 458, 368, 'end', 'r')

  // 4. Atlas: раскрытая книга с митохондрией и рядами значений
  body += arrow([[712, mid], [740, mid - 12], [766, mid - 4]])
  // «проверено» — галочка над стрелкой
  body += ink([[724, mid - 46], [732, mid - 36], [750, mid - 62]], { w: 2.1, jit: 0.3 })
  put('validated', 722, mid - 82)
  {
    const cx = 876, top = 104, bot = 236, wd = 96
    const page = (s) => [[cx, top + 8], [cx + s * wd * 0.35, top - 4], [cx + s * wd * 0.8, top - 2], [cx + s * wd, top + 4], [cx + s * wd, bot], [cx + s * wd * 0.6, bot - 8], [cx + s * wd * 0.25, bot - 6], [cx, bot + 6]]
    for (const s of [-1, 1]) body += ink(page(s), { closed: true, fill: true, w: 1.9, jit: 0.5 })
    body += ink([[cx, top + 8], [cx + J(1), (top + bot) / 2], [cx, bot + 6]], { w: 1.4, jit: 0.3 })
    // нижние листы — толщина книги
    for (const s of [-1, 1]) body += ink([[cx + s * (wd - 2), bot + 4], [cx + s * wd * 0.6, bot - 2], [cx + s * wd * 0.25, bot], [cx, bot + 11]], { w: 0.9, jit: 0.4, second: false })
    // левая страница: строки текста и точки значений
    for (let i = 0; i < 7; i++) {
      const y = top + 22 + i * 15
      body += line([cx - wd + 14, y + 2], [cx - 14 - (i % 3) * 10, y], { w: 0.8 })
    }
    // правая страница: точечный график
    const ox = cx + 16, oy = bot - 26
    body += line([ox, oy], [ox + wd - 30, oy], { w: 1 }) + line([ox, oy], [ox, top + 24], { w: 1 })
    const pts = [[0.1, 0.12], [0.2, 0.08], [0.28, 0.3], [0.4, 0.18], [0.5, 0.55], [0.6, 0.22], [0.7, 0.72], [0.82, 0.4], [0.9, 0.86]]
    pts.forEach(([u, v], k) => {
      const tone = k === 4 || k === 6 ? ' r' : ''
      body += `<circle class="sk-dot${tone}" cx="${n1(ox + u * (wd - 30))}" cy="${n1(oy - v * (oy - top - 30))}" r="2.6"/>`
    })
    // маленькая митохондрия-знак над книгой
    const m = mitochondrion('pwm', { cx: cx + 2, cy: top - 40, L: 300, H: 160, rot: -0.2, scale: 0.17, rings: 0, hatching: false, second: false, weight: 2.2, top: [-0.3, 0.38], bot: [0.04], gap: 22, cw: 22 })
    body += m.svg
    const [rx, ry] = m.xf([-96, 22])
    body += `<circle class="sk-r" stroke-width="2.2" cx="${n1(rx + 3)}" cy="${n1(ry - 2)}" r="4.2"/>`
  }
  put('atlas', 876, 284)

  file('data-pathway.svg', W, H, body, 'Path of research data: research group, submission, scientific review, PGT-mt Atlas')
  labels.pathway = lab
}

// ——— Раздел Fundamentals / Основы ПГТ-мт ———
// Геометрия интерактивных схем (позиции молекул мтДНК, области бластоцисты) — в fundamentals.json;
// интерактивные элементы рисует React поверх SVG в тех же координатах viewBox.
const fund = {}

// 7. Клетка с митохондриями для модели «Гетероплазмия в клетке».
//    Кольца мтДНК не рисуются — их положения (100 слотов) выводятся в fundamentals.json.
R = rng(71)
{
  const W = 640, H = 420
  let body = ''
  const cellOutline = blob(322, 212, 290, 182, { n: 60, wob: 0.035, rot: -0.04 })
  body += ink(cellOutline, { closed: true, fill: true, w: 2.4, jit: 0.8 })
  body += hatch('cl', cellOutline, [20, 20, 620, 400], { step: 11, op: 0.07, angle: -0.6 })
  // ядро с ядрышком
  const nuc = blob(150, 214, 70, 62, { n: 34, wob: 0.03 })
  body += ink(nuc, { closed: true, fill: true, w: 2, jit: 0.5 })
  body += ink(blob(150, 214, 76, 68, { n: 34, wob: 0.02, open: true }), { w: 0.9, jit: 0.4, second: false, extra: ' opacity="0.6"' })
  body += hatch('cl', nuc, [70, 140, 230, 290], { step: 6, op: 0.18, angle: 0.9 })
  body += ink(blob(166, 200, 15, 13, { n: 14, wob: 0.06 }), { closed: true, w: 1.4, jit: 0.3, second: false })
  const mitos = [
    { cx: 330, cy: 112, L: 200, H: 92, rot: -0.12 },
    { cx: 486, cy: 150, L: 176, H: 84, rot: 0.42 },
    { cx: 362, cy: 236, L: 196, H: 90, rot: 0.08 },
    { cx: 512, cy: 290, L: 168, H: 82, rot: -0.36 },
    { cx: 306, cy: 336, L: 190, H: 86, rot: -0.04 },
  ]
  const slots = []
  mitos.forEach((o, mi) => {
    const m = mitochondrion(`clm${mi}`, { ...o, rings: 0, hatching: false, top: [-0.5, 0.42], bot: [-0.04], weight: 0.8 })
    body += m.svg
    // 20 позиций в матриксе: сетка внутри суперэллипса, с лёгкой нерегулярностью
    const pts = []
    for (let gy = -1; gy <= 1; gy++) for (let gx = -4; gx <= 4; gx++) {
      const u = (gx + (gy % 2 ? 0.5 : 0)) / 4.6, v = gy * 0.52
      if (Math.abs(u) ** 2.3 + Math.abs(v) ** 2.3 < 0.82) pts.push([u * m.ix + J(3), v * m.iy + J(3)])
    }
    pts.slice(0, 20).forEach((q) => {
      const [x, y] = m.xf(q)
      slots.push([n1(x), n1(y), mi])
    })
  })
  file('cell.svg', W, H, body, 'A cell with a nucleus and five mitochondria')
  fund.cell = { w: W, h: H, r: 4.6, slots }
}

// 8. Бластоциста и биопсия трофэктодермы для «Blastocyst & Biopsy Explorer»:
//    ВКМ слева, отверстие в блестящей оболочке справа, биопсийная пипетка с несколькими клетками ТЭ.
R = rng(83)
{
  const W = 760, H = 480
  const cx = 260, cy = 240, Rb = 168, n = 26
  let body = blastocyst('bx', { cx, cy, Rb, n, icmAngle: Math.PI, zona: false, skip: [0, 1, n - 1], groups: true })
  body += '<g class="bx-zona">'
  for (const [rr, w, op] of [[Rb + 25, 1.1, 0.75], [Rb + 17, 0.8, 0.55]]) {
    const pts = []
    for (let i = 0; i <= 70; i++) {
      const t = 0.16 + ((TAU - 0.32) * i) / 70
      pts.push([cx + rr * Math.cos(t), cy + rr * Math.sin(t)])
    }
    body += ink(pts, { w, jit: 0.4, second: false, extra: ` opacity="${op}"` })
  }
  body += '</g>'
  // биоптат: несколько клеток ТЭ, выходящих в пипетку
  const cell = (x, y, a, b, rot) => ink(blob(x, y, a, b, { rot, n: 16, wob: 0.05 }), { closed: true, fill: true, w: 1.6, jit: 0.35 }) + ink(blob(x + J(1.5), y + J(1.5), a * 0.38, b * 0.28, { rot, n: 10 }), { closed: true, w: 0.9, jit: 0.2, second: false })
  const tip = cx + Rb + 44
  let bx = '<g class="bx-bx">'
  bx += cell(cx + Rb + 2, cy - 14, 12, 18, 0.1) + cell(cx + Rb + 4, cy + 16, 12, 17, -0.1)
  bx += cell(cx + Rb + 30, cy - 9, 16, 12, 0.35) + cell(cx + Rb + 31, cy + 12, 15, 11, -0.35)
  bx += cell(tip + 28, cy + 1, 17, 13, 0.1)
  bx += '</g>'
  body += bx
  // биопсийная пипетка
  const rIn = 24, wall = 6, end = tip + 200
  body += '<g class="bx-pipette">'
  for (const sg of [-1, 1]) {
    body += ink([[tip, cy + sg * rIn], [tip + 80, cy + sg * rIn], [end, cy + sg * rIn]], { w: 1.7, jit: 0.3 })
    body += ink([[tip + 3, cy + sg * (rIn + wall)], [tip + 80, cy + sg * (rIn + wall)], [end, cy + sg * (rIn + wall)]], { w: 1.4, jit: 0.3 })
    body += ink([[tip, cy + sg * rIn], [tip + 3, cy + sg * (rIn + wall)]], { w: 1.3, jit: 0.15, second: false })
  }
  body += hatch('bx', [[tip + 70, cy - rIn - wall], [end, cy - rIn - wall], [end, cy - rIn], [tip + 70, cy - rIn]], [tip, cy - 40, end, cy], { step: 6, op: 0.3, angle: 1.0 })
  body += hatch('bx', [[tip + 70, cy + rIn], [end, cy + rIn], [end, cy + rIn + wall], [tip + 70, cy + rIn + wall]], [tip, cy, end, cy + 40], { step: 6, op: 0.3, angle: 1.0 })
  body += '</g>'
  // выносные линии от подписей (текст — в HTML) к структурам
  const teP = [cx + (Rb + 4) * Math.cos(-1.2), cy + (Rb + 4) * Math.sin(-1.2)]
  body += leader([cx + 36, 52], teP) + `<circle class="sk-dot" cx="${n1(teP[0])}" cy="${n1(teP[1])}" r="2.2"/>`
  body += leader([58, 408], [128, 318]) + `<circle class="sk-dot" cx="128" cy="318" r="2.2"/>`
  body += leader([tip + 56, cy + 58], [tip + 30, cy + 14], 'r') + `<circle class="sk-dot r" cx="${tip + 30}" cy="${cy + 14}" r="2.2"/>`
  file('blastocyst-biopsy.svg', W, H, body, 'Blastocyst with trophectoderm, inner cell mass and a trophectoderm biopsy')
  const ca = Math.cos(Math.PI), sa = Math.sin(Math.PI)
  fund.blastocyst = {
    w: W, h: H,
    te: { cx, cy, r: Rb, width: Rb * 0.16 },
    icm: { cx: n1(cx + (Rb - 70) * ca), cy: n1(cy + (Rb - 70) * sa), rx: n1(Rb * 0.38), ry: n1(Rb * 0.57) },
    bx: { cx: cx + Rb + 30, cy, rx: 46, ry: 34 },
    labels: [
      { key: 'te', x: n1(((cx + 40) / W) * 100), y: n1((44 / H) * 100), align: 'start', tone: 'i' },
      { key: 'icm', x: n1((24 / W) * 100), y: n1((430 / H) * 100), align: 'start', tone: 'i' },
      { key: 'cav', x: n1(((cx + 30) / W) * 100), y: n1((cy / H) * 100), align: 'start', tone: 'i' },
      { key: 'bx', x: n1(((tip + 60) / W) * 100), y: n1(((cy + 70) / H) * 100), align: 'start', tone: 'r' },
    ],
  }
}

// 9. Стадии до имплантации: зигота → 4 клетки → 8 клеток (биопсия бластомера) → морула → бластоциста (биопсия ТЭ).
R = rng(97)
{
  const W = 1000, H = 260
  let body = ''
  const cy = 118, Rz = 66
  const xs = [90, 278, 466, 654, 842]
  const zona = (x) => ink(blob(x, cy, Rz + 12, Rz + 12, { n: 40, wob: 0.01, open: true }), { w: 1, jit: 0.4, second: false, extra: ' opacity="0.7"' }) + ink(blob(x, cy, Rz + 6, Rz + 6, { n: 40, wob: 0.01, open: true }), { w: 0.7, jit: 0.3, second: false, extra: ' opacity="0.5"' })
  const cellC = (x, y, r, tone = 'i') => ink(blob(x, y, r, r * (0.9 + R() * 0.1), { rot: R() * 3, n: 18, wob: 0.04 }), { closed: true, fill: true, w: 1.6, jit: 0.35, tone }) + `<circle class="sk-dot${tone === 'r' ? ' r' : ''}" cx="${n1(x + J(2))}" cy="${n1(y + J(2))}" r="1.6"/>`
  // зигота с двумя пронуклеусами
  body += zona(xs[0]) + ink(blob(xs[0], cy, Rz - 4, Rz - 6, { n: 34, wob: 0.02 }), { closed: true, fill: true, w: 1.8, jit: 0.4 })
  body += ink(blob(xs[0] - 15, cy - 2, 14, 13, { n: 14, wob: 0.05 }), { closed: true, w: 1.3, jit: 0.3 }) + ink(blob(xs[0] + 15, cy + 2, 14, 13, { n: 14, wob: 0.05 }), { closed: true, w: 1.3, jit: 0.3 })
  // 4 клетки
  body += zona(xs[1])
  for (const [dx, dy] of [[-24, -22], [24, -24], [-22, 24], [25, 22]]) body += cellC(xs[1] + dx, cy + dy, 31)
  // 8 клеток; один бластомер извлекается (красный)
  body += zona(xs[2])
  for (const [dx, dy] of [[-30, -30], [2, -40], [33, -22], [-40, 2], [-26, 34], [6, 38], [34, 20], [0, 0]]) body += cellC(xs[2] + dx, cy + dy, 21)
  body += cellC(xs[2] + 96, cy - 4, 20, 'r')
  body += ink([[xs[2] + 50, cy - 2], [xs[2] + 62, cy - 6], [xs[2] + 72, cy - 5]], { w: 1.2, tone: 'r', jit: 0.3, second: false, extra: ' stroke-dasharray="3 4"' })
  // морула: компактная масса мелких клеток
  body += zona(xs[3])
  const mor = blob(xs[3], cy, Rz - 6, Rz - 8, { n: 36, wob: 0.02 })
  body += ink(mor, { closed: true, fill: true, w: 1.8, jit: 0.4 })
  for (const [dx, dy] of [[-30, -28], [-4, -40], [24, -32], [40, -6], [-42, -2], [-30, 26], [-4, 40], [24, 32], [42, 18], [-14, -12], [12, -10], [-12, 14], [14, 12]]) body += ink(blob(xs[3] + dx, cy + dy, 13, 12, { rot: R() * 3, n: 12, wob: 0.06 }), { closed: true, w: 1, jit: 0.3, second: false })
  // бластоциста: кольцо ТЭ, ВКМ слева, полость; справа — биопсия нескольких клеток ТЭ (красные)
  const bxX = xs[4]
  body += zona(bxX)
  const cav = blob(bxX, cy, Rz - 14, Rz - 14, { n: 30, wob: 0.01 })
  body += hatch('dv', cav, [bxX - Rz, cy - Rz, bxX + Rz, cy + Rz], { step: 7, op: 0.12, angle: -0.7 })
  const nT = 14, halfT = (Math.PI * (Rz - 4)) / nT - 1.4
  for (let i = 0; i < nT; i++) {
    const th = (TAU * i) / nT
    const tone = i === 0 ? 'r' : 'i'
    body += ink(teCell(bxX, cy, Rz - 4, th, halfT, 6.5), { closed: true, fill: true, w: 1.4, jit: 0.3, tone })
  }
  for (const [dx, dy] of [[-34, -12], [-36, 10], [-22, -2], [-24, 20], [-22, -24]]) body += ink(blob(bxX + dx, cy + dy, 10, 9, { rot: R() * 3, n: 12, wob: 0.06 }), { closed: true, fill: true, w: 1.3, jit: 0.3 })
  body += cellC(bxX + Rz + 30, cy + 2, 11, 'r') + cellC(bxX + Rz + 40, cy - 14, 9, 'r')
  // ось времени
  body += ink([[40, 222], [300, 220], [600, 223], [960, 221]], { w: 1.2, jit: 0.5, second: false })
  xs.forEach((x) => (body += ink([[x, 214], [x + J(1), 230]], { w: 1.2, jit: 0.2, second: false })))
  file('development.svg', W, H, body, 'Human preimplantation development from zygote to blastocyst with biopsy stages')
  labels.development = [
    ...['d1', 'd2', 'd3', 'd4', 'd5'].map((key, i) => ({ key, x: n1((xs[i] / W) * 100), y: 96, align: 'middle', tone: 'i' })),
    { key: 'bxBlastomere', x: n1(((xs[2] + 96) / W) * 100), y: 13, align: 'middle', tone: 'r' },
    { key: 'bxTe', x: n1(((xs[4] + Rz + 34) / W) * 100), y: 13, align: 'middle', tone: 'r' },
  ]
}

writeFileSync(join(OUT, 'fundamentals.json'), JSON.stringify(fund) + '\n')
writeFileSync(join(OUT, 'labels.json'), JSON.stringify(labels, null, 2) + '\n')
