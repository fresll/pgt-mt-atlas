"""Рисунок 2 — три уровня интерпретации гетероплазмии при ПГТ-мт (схема; значения условные).
А — ткани носительницы; Б — эмбрионы одного цикла; В — фракции одного эмбриона.
Запуск: python3 Рисунок_2.py [выход.tif]
"""
import sys, math
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Circle, Wedge, FancyArrowPatch

OUT = sys.argv[1] if len(sys.argv) > 1 else 'Рисунок_2.tif'
W_PX, H_PX = 1267, 1400
plt.rcParams.update({'font.family': 'DejaVu Sans'})
fig = plt.figure(figsize=(8.27, 8.27 * H_PX / W_PX))
ax = fig.add_axes([0, 0, 1, 1]); ax.set_xlim(0, W_PX); ax.set_ylim(H_PX, 0); ax.axis('off'); ax.set_aspect('equal')
GREEN, GREY, DRED = '#2f6f2f', '#444444', '#b5121b'


def panel(y0, y1, title):
    ax.add_patch(FancyBboxPatch((24, y0), 1219, y1 - y0, boxstyle='round,pad=0,rounding_size=14',
                                fill=False, ec='black', lw=1.6))
    ax.text(57, y0 + 36, title, fontsize=12.5, fontweight='bold', va='center')
    ax.text(1210, y0 + 36, 'схема; значения условные', fontsize=9.5, style='italic', color='#555555',
            ha='right', va='center')


def cell(x, y, r, fc='white', lw=1.0):
    ax.add_patch(Circle((x, y), r, fc=fc, ec='black', lw=lw, zorder=4))


def blastocyst(cx, cy, R, r, n, fill, icm):
    ax.add_patch(Circle((cx, cy), R, fc=fill, ec='none', zorder=2))
    for k in range(n):
        a = 2 * math.pi * k / n + math.pi / 2
        cell(cx + R * math.cos(a), cy + R * math.sin(a), r)
    for dx, dy in icm:
        cell(cx + dx * r, cy + dy * r, r)


def bracket(x0, x1, y, color, label):
    ax.plot([x0, x0, x1, x1], [y - 20, y, y, y - 20], color=color, lw=1.8)
    ax.text((x0 + x1) / 2, y + 27, label, color=color, ha='center', va='center', fontsize=10.5)


# ---------- А ----------
panel(22, 378, 'А.  Носительница: гетероплазмия по тканям')
for x, lab, v in [(263, 'Кровь', 18), (522, 'Мочевой эпителий', 42), (781, 'Буккальный эпителий', 60), (1052, 'Мышца', 86)]:
    ax.text(x, 128, lab, ha='center', va='center', fontsize=10.5)
    ax.add_patch(Wedge((x, 243), 76, 0, 360, width=25, fc='#e0e0e0', ec='none'))
    # в осях с перевёрнутой Y углы идут по часовой стрелке: старт сверху (−90°)
    ax.add_patch(Wedge((x, 243), 76, -90, -90 + 3.6 * v, width=25, fc='black', ec='none'))
    ax.text(x, 243, f'{v}%', ha='center', va='center', fontsize=12.5, fontweight='bold')

# ---------- Б ----------
panel(435, 872, 'Б.  Между эмбрионами одного цикла')
# ВКМ: клетки на гексагональной сетке (шаг 2.05 r), разные наборы для разных эмбрионов
HEX = [(0, 0), (2.05, 0), (-2.05, 0), (1.02, 1.78), (-1.02, 1.78), (1.02, -1.78), (-1.02, -1.78),
       (3.07, 1.78), (-3.07, 1.78), (0, 3.55)]
ICM_SETS = [[HEX[i] for i in idx] for idx in ([0, 1, 3, 4, 6, 8, 9], [0, 2, 3, 5, 6, 7, 9], [0, 1, 2, 4, 5, 9],
                                             [0, 1, 3, 6, 7, 8], [0, 2, 3, 4, 5, 7], [0, 3, 4, 9])]
fills = ['#e8f3e5', '#e8f3e5', '#eeeeee', '#eeeeee', '#fbe6e6', '#fbe6e6']
for x, v, f, icm in zip([145, 340, 534, 734, 928, 1122], [0, 12, 27, 54, 81, 98], fills, ICM_SETS):
    blastocyst(x, 625, 66, 12.5, 20, f, [(dx, dy + 0.3) for dx, dy in icm])
    ax.text(x, 742, f'{v}%', ha='center', va='center', fontsize=13)
bracket(83, 405, 802, GREEN, 'Низкая мутационная нагрузка')
bracket(467, 801, 802, GREY, 'Промежуточная зона')
bracket(862, 1184, 802, DRED, 'Высокая мутационная нагрузка')

# ---------- В ----------
panel(929, 1378, 'В.  Внутри одного эмбриона')
blastocyst(208, 1172, 97, 16, 24, 'white', [(dx, dy + 0.8) for dx, dy in [HEX[i] for i in (0, 1, 2, 3, 4, 5, 9)]])
ax.add_patch(FancyArrowPatch((333, 1172), (414, 1172), arrowstyle='-|>', mutation_scale=16, color='black', lw=2))
ax.text(374, 1141, 'биопсия', ha='center', va='center', fontsize=10, color='#555555')
groups = [(566, 'Клинический\nбиоптат ТЭ', 12, [(-91, 1), (-30, -28), (40, -14), (81, -44), (-30, 18), (88, 15), (-60, 53), (42, 43)]),
          (825, 'Внутренняя\nклеточная масса', 14, [(-65, -30), (-6, -40), (38, -42), (81, -42), (8, 0), (81, 6), (-34, 22), (-68, 45), (-7, 54), (34, 56), (73, 54)]),
          (1084, 'Оставшаяся\nтрофэктодерма', 11, [(-82, -44), (-41, -24), (19, -35), (59, -59), (-87, 20), (-46, 15), (87, 4), (50, 29), (10, 49)])]
for x, lab, v, pts in groups:
    ax.text(x, 1050, lab, ha='center', va='center', fontsize=10.5, linespacing=1.15)
    for dx, dy in pts:
        cell(x + dx, 1185 + dy, 19, lw=1.2)
    ax.text(x, 1273, f'{v}%', ha='center', va='center', fontsize=13)
ax.plot([455, 455, 1195, 1195], [1288, 1308, 1308, 1288], color='#555555', lw=1.6)
ax.text(825, 1335, 'различия в пределах методической ошибки', ha='center', va='center', fontsize=10.5, color='#555555')
fig.savefig(OUT, dpi=600, **({'pil_kwargs': {'compression': 'tiff_lzw'}} if OUT.endswith('.tif') else {}))
print('saved', OUT)
