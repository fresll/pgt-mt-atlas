"""Рисунок 3 — распределение гетероплазмии между эмбрионами (по вариантам и источникам).
Данные: лист «Рисунок 3» сопроводительной таблицы (каждая строка — один эмбрион; интервалы — столбцы G:H).
Порядок блоков и источников задан в BLOCKS; новый источник = строка в xlsx + запись в SRC_LABEL и BLOCKS.
Точки раскладываются детерминированно (центры не ближе 1.25 диаметра); ≥6 совпадающих значений — одна точка «×n».
Запуск: python3 Рисунок_3.py <Сопроводительная информация.xlsx> <выход.png|.tif> [nohu]
"""
import sys, math
import openpyxl
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
import numpy as np

XLSX = sys.argv[1]
OUT = sys.argv[2]
WITH_HU = len(sys.argv) < 4 or sys.argv[3] != 'nohu'

wb = openpyxl.load_workbook(XLSX, data_only=True)
ws = wb['Рисунок 3']
rows = []
for r in ws.iter_rows(min_row=4, values_only=True):
    if r[0] is None:
        continue
    rows.append(r)

SRC_LABEL = {
    'Monnot 2011 Hum Mutat': ('Monnot', '2011'), 'Spath 2021 Fertil Steril': ('Spath', '2021'),
    'Treff 2012 Fertil Steril': ('Treff', '2012'), 'Heindryckx 2014 Mitochondrion': ('Heindryckx', '2014'),
    'Hyslop 2025 NEJM': ('Hyslop', '2025'), 'Sallevelt 2017 Hum Reprod': ('Sallevelt', '2017'),
    'Tofilo et al., 2026, Journal of Assisted Reproduction and Genetics, in press': ('Tofilo', '2026'),
    'Steffann 2006 JMG': ('Steffann', '2006'), 'Thorburn/Stock-Myer 2009': ('Thorburn', '2009'),
    'Ji 2021 JARG': ('Ji', '2021'), 'Mizuguchi 2025 HGV': ('Mizuguchi', '2025'),
    'Hu 2026 JARG': ('Hu', '2026'),
}
BLOCKS = [
    ('m.3243A>G', ['Monnot 2011 Hum Mutat', 'Spath 2021 Fertil Steril', 'Treff 2012 Fertil Steril',
                   'Heindryckx 2014 Mitochondrion', 'Hyslop 2025 NEJM']),
    ('m.14487T>C', ['Sallevelt 2017 Hum Reprod',
                    'Tofilo et al., 2026, Journal of Assisted Reproduction and Genetics, in press']),
    ('m.8993T>G', ['Spath 2021 Fertil Steril', 'Steffann 2006 JMG', 'Hyslop 2025 NEJM', 'Thorburn/Stock-Myer 2009']),
    ('m.3697G>A', ['Ji 2021 JARG']),
    ('m.10197G>A', ['Mizuguchi 2025 HGV']),
    ('m.10191T>C', ['Spath 2021 Fertil Steril']),
]
if WITH_HU:
    BLOCKS.append(('m.3250T>C', ['Hu 2026 JARG']))

data = {}
for r in rows:
    var, val, src, lo, hi = r[0], r[1], r[4], r[6], r[7]
    data.setdefault((var, src), []).append((val, lo, hi))

# ---- geometry ----
UNIT_IN = 0.488          # inches per column unit (matches original ≈ 102 px/2000 at 9.58 in)
cols = []                # (x, var, src)
dividers = []
x = 0.0
block_spans = []
for var, srcs in BLOCKS:
    width = max(2.0, float(len(srcs)))
    x0 = x
    if len(srcs) == 1:
        cols.append((x0 + width / 2, var, srcs[0]))
    else:
        for k, s in enumerate(srcs):
            cols.append((x0 + 0.5 + k, var, s))
    x += width
    dividers.append(x)
    block_spans.append((var, x0, x))
XMAX = x + 1.15
LEFT_IN, RIGHT_IN = 0.63, 0.10
FIG_W = LEFT_IN + XMAX * UNIT_IN + RIGHT_IN
FIG_H = 3.95
AX_B, AX_H = 0.12, 0.694

plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 8})
fig = plt.figure(figsize=(FIG_W, FIG_H), dpi=600)
ax = fig.add_axes([LEFT_IN / FIG_W, AX_B, XMAX * UNIT_IN / FIG_W, AX_H])
ax.set_xlim(0, XMAX)
ax.set_ylim(-4, 100)
# bands
ax.add_patch(Rectangle((0, -4 + 4), XMAX, 18, color='#e9f0e9', zorder=0, lw=0))
ax.add_patch(Rectangle((0, 18), XMAX, 12, color='#e6eef8', zorder=0, lw=0))
ax.add_patch(Rectangle((0, 70), XMAX, 30, color='#f9eded', zorder=0, lw=0))
ax.axhline(18, color='#9e9e9e', ls='--', lw=1.0, zorder=1)
ax.axhline(70, color='#9e9e9e', ls='--', lw=1.0, zorder=1)
ax.axhline(30, color='#1565c0', ls='--', lw=1.1, zorder=1)
ax.axhline(1, color='#d32f2f', ls=':', lw=1.1, zorder=1)
for s in ['top', 'right']:
    ax.spines[s].set_visible(False)
ax.spines['left'].set_bounds(0, 100)
ax.set_yticks(range(0, 101, 10))
ax.tick_params(axis='y', labelsize=9)
ax.set_xticks([])
ax.set_ylabel('Гетероплазмия в эмбрионе, %', fontsize=10)
# right labels
xl = x + 0.58
ax.text(xl, 85, '≥70%', color='#c62828', ha='center', va='center', fontsize=8.5)
ax.text(xl, 24, '18–\n30%', color='#1565c0', ha='center', va='center', fontsize=8.5, linespacing=0.95)
ax.text(xl, 9, '≤18%', color='#2e7d32', ha='center', va='center', fontsize=8.5)

# dividers spanning the axes and title area
for dv in dividers:
    ax.plot([dv, dv], [-4, 100], color='#bdbdbd', lw=1.0, zorder=1, clip_on=False)
    ax.plot([dv, dv], [100, 125.5], color='#bdbdbd', lw=1.0, zorder=1, clip_on=False)

# conversion: data units -> inches
x_in = UNIT_IN
y_in = AX_H * FIG_H / 104.0
DOT_PT = 3.6
dot_in = DOT_PT / 72
min_d = 1.25 * dot_in

def place(values, xc):
    placed = []
    out = []
    for v in sorted(values):
        k = 0
        cands = [0]
        for j in range(1, 40):
            cands += [j, -j]
        for c in cands:
            dx = c * 0.5 * min_d
            ok = True
            for (px, py) in placed:
                if math.hypot(dx - px, (v - py) * y_in) < min_d - 1e-9:
                    ok = False; break
            if ok:
                placed.append((dx, v)); out.append((xc + dx / x_in, v)); break
    return out

for xc, var, src in cols:
    vals = data[(var, src)]
    pts = [v for v, lo, hi in vals if v is not None]
    ints = [(lo, hi) for v, lo, hi in vals if v is None]
    # aggregate >=6 identical values
    agg = {}
    for v in pts:
        agg[v] = agg.get(v, 0) + 1
    big = {v: c for v, c in agg.items() if c >= 6}
    plot_vals = []
    for v in pts:
        if v in big:
            continue
        plot_vals.append(v)
    for v in big:
        plot_vals.append(v)
    xy = place(plot_vals, xc)
    ax.scatter([p[0] for p in xy], [p[1] for p in xy], s=DOT_PT ** 2 * 1.35, c='black', edgecolors='white',
               linewidths=0.45, zorder=4, clip_on=False)
    for v, c in big.items():
        ax.text(xc + 0.13, v, f'×{c}', fontsize=7, color='#333333', va='center', ha='left', zorder=5,
                bbox=dict(boxstyle='square,pad=0.12', fc='#e3ede3', ec='none'))
    for lo, hi in ints:
        ax.errorbar([xc], [(lo + hi) / 2], yerr=[[(hi - lo) / 2], [(hi - lo) / 2]], fmt='none', ecolor='black',
                    elinewidth=1.2, capsize=4, capthick=1.2, zorder=4)
    name, year = SRC_LABEL[src]
    n = len(vals)
    ax.text(xc, -6.8, f'{name}\n{year}\nn = {n}', ha='center', va='top', fontsize=7, linespacing=1.12,
            clip_on=False)

# block titles and fractions
for var, x0, x1 in block_spans:
    srcs = dict(BLOCKS)[var]
    allv = []
    for s in srcs:
        allv += data[(var, s)]
    n = len(allv)
    def frac(th):
        k = 0
        for v, lo, hi in allv:
            if v is not None:
                k += v <= th
            else:
                k += hi <= th
        return k
    k18, k30 = frac(18), frac(30)
    xc = (x0 + x1) / 2
    ax.text(xc, 124, var, ha='center', va='center', fontsize=8.5, fontweight='bold', clip_on=False)
    line = f'≤18%: {k18 / n:.2f} ({k18}/{n})'
    if k30 != k18:
        line += f'\n≤30%: {k30 / n:.2f} ({k30}/{n})'
    ax.text(xc, 118.5, line, ha='center', va='top', fontsize=6.6, linespacing=1.25, clip_on=False)
    print(var, n, k18, k30)

fig.savefig(OUT, dpi=600, pil_kwargs={'compression': 'tiff_lzw'} if OUT.endswith('.tif') else None)
print('size in', FIG_W, FIG_H)
