"""Рисунок 1 — гетероплазмия мтДНК и пороговый эффект (схема; значения условные).
Верх: шкала гетероплазмии 0–25–50–75–100% и схематичные клетки; низ: сигмоидные кривые
«функция ОКСФОС» и «клинические проявления» с порогом 70%.
Запуск: python3 Рисунок_1.py [выход.tif]
"""
import sys
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Ellipse, Rectangle, FancyArrowPatch
from matplotlib.colors import LinearSegmentedColormap, to_rgb

OUT = sys.argv[1] if len(sys.argv) > 1 else 'Рисунок_1.tif'
NAVY, RED, DRED, GREY = '#232f6b', '#d62828', '#a4161a', '#555555'
W, H = 8.59, 7.21
plt.rcParams.update({'font.family': 'DejaVu Sans'})
fig = plt.figure(figsize=(W, H))

# ---------------- верхняя схема (координаты в «пикселях» 1400 × 540) ----------------
top = fig.add_axes([0, 0.54, 1, 0.46]); top.set_xlim(0, 1400); top.set_ylim(540, 0); top.axis('off')
top.text(57, 52, 'Нет болезни', color=NAVY, fontsize=13, fontweight='bold', va='center', ha='left')
top.text(1340, 52, 'Проявление болезни', color=RED, fontsize=13, fontweight='bold', va='center', ha='right')
top.add_patch(FancyArrowPatch((62, 96), (1338, 96), arrowstyle='-|>', mutation_scale=14, color=GREY, lw=1.8))
centers = [157, 425, 692, 960, 1228]
fracs = [0, 0.25, 0.5, 0.75, 1.0]
labels = ['Гомоплазмия,\nмтДНК дикого типа', 'Гетероплазмия\n25%', 'Гетероплазмия\n50%', 'Гетероплазмия\n75%',
          'Гомоплазмия,\nпатогенный вариант']
BW = 152
for cx, f, lab in zip(centers, fracs, labels):
    x0 = cx - BW / 2
    top.add_patch(Rectangle((x0, 84), BW * (1 - f), 24, color=NAVY, zorder=3))
    top.add_patch(Rectangle((x0 + BW * (1 - f), 84), BW * f, 24, color=RED, zorder=3))
    top.text(cx, 150, lab, ha='center', va='center', fontsize=9.7, linespacing=1.15)
top.plot([826, 826], [115, 497], ls=(0, (4, 3)), color=DRED, lw=1.8)

rng = np.random.default_rng(7)
EW, EH, EY = 217, 147, 364
for cx, f in zip(centers, fracs):
    col = NAVY if f <= 0.5 else RED
    el = Ellipse((cx, EY), EW, EH, fill=False, ec=col, lw=1.5, zorder=4)
    top.add_patch(el)
    clip = Ellipse((cx, EY), EW - 4, EH - 4, transform=top.transData)
    xs = np.linspace(cx - EW / 2, cx + EW / 2, 200)
    for k, yy in enumerate([EY - 42, EY - 14, EY + 14, EY + 42]):
        ln, = top.plot(xs, yy + 6 * np.sin((xs - cx) / 13 + k * 1.3), color=col, lw=0.9, zorder=3)
        ln.set_clip_path(clip)
    n = 17
    pts = []
    while len(pts) < n:
        x = rng.uniform(-0.8, 0.8); y = rng.uniform(-0.8, 0.8)
        if x * x + y * y < 0.62 and all((x - a) ** 2 + (y - b) ** 2 > 0.045 for a, b in pts):
            pts.append((x, y))
    nred = int(round(f * n))
    order = rng.permutation(n)
    for i, (x, y) in enumerate(pts):
        c = RED if order[i] < nred else NAVY
        top.plot(cx + x * EW / 2, EY + y * EH / 2, 'o', ms=3.9, color=c, zorder=5)
top.plot(63, 468, 'o', ms=3.9, color=NAVY); top.text(88, 468, 'мтДНК дикого типа', va='center', fontsize=9.7)
top.plot(63, 515, 'o', ms=3.9, color=RED); top.text(88, 515, 'мтДНК с патогенным вариантом', va='center', fontsize=9.7)

# ---------------- нижний график ----------------
ax = fig.add_axes([0.016, 0.134, 0.956, 0.383])
x = np.linspace(0, 100, 1000)
s = 1 / (1 + np.exp((x - 70) / 2.0))
ox = 0.05 + 0.9 * s
cl = 1 - ox
bg = LinearSegmentedColormap.from_list('bg', ['#d9dbe5', '#f6d9da'])
grad = 1 / (1 + np.exp(-(np.linspace(0, 100, 400) - 71) / 3.5))
ax.imshow(grad[None, :], extent=(0, 100, 0, 1), aspect='auto', cmap=bg, zorder=0, alpha=1)
ax.plot(x, ox, color=NAVY, lw=4.2, label='Функция окислительного фосфорилирования', zorder=3)
ax.plot(x, cl, color=RED, lw=4.2, label='Клинические проявления', zorder=3)
ax.axvline(70, ls=(0, (4, 3)), color=DRED, lw=1.8, zorder=2)
ax.set_xlim(0, 100); ax.set_ylim(0, 1)
ax.set_xticks(range(0, 101, 10)); ax.set_yticks([])
ax.tick_params(labelsize=10.5)
for sp in ('top', 'right', 'left'):
    ax.spines[sp].set_visible(False)
ax.set_xlabel('Гетероплазмия, %', fontsize=11.5)
ax.legend(loc='upper left', bbox_to_anchor=(0.02, 0.70), frameon=False, fontsize=9.7, handlelength=2.6)
ax.text(70, 1.035, 'ПОРОГОВЫЙ ЭФФЕКТ', color=DRED, fontsize=11.5, fontweight='bold', ha='center', va='bottom')
ax.annotate('до порога клинических\nпроявлений практически нет', xy=(30, 0.1), xytext=(6, 0.38), color=NAVY,
            fontsize=9.7, arrowprops=dict(arrowstyle='-|>', color=NAVY, lw=1.4), va='center')
ax.annotate('резкое нарастание\nв узком интервале', xy=(73.8, 0.6), xytext=(80, 0.29), color=RED,
            fontsize=9.7, arrowprops=dict(arrowstyle='-|>', color=RED, lw=1.4), va='center')
fig.text(0.5, 0.02, 'Положение порога различается для разных вариантов мтДНК и разных тканей; значения приведены условно',
         ha='center', va='center', fontsize=9, style='italic', color='#555555')
fig.savefig(OUT, dpi=600, **({'pil_kwargs': {'compression': 'tiff_lzw'}} if OUT.endswith('.tif') else {}))
print('saved', OUT)
