"""Рисунок 6 — сценарный расчёт совместного учёта ПГТ-мт и ПГТ-А.
P(≥1) = 1 − (1 − p_гет·p_эупл)^N. Значения p_гет — доли эмбрионов ≤18% / ≤30% из набора рис. 3
(лист «Рисунок 3» сопроводительной таблицы), p_эупл — по возрасту (лист «Рисунок 6»).
Запуск: python3 Рисунок_6.py [выход.tif]
"""
import sys
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D

OUT = sys.argv[1] if len(sys.argv) > 1 else 'Рисунок_6.tif'
VARIANTS = [  # (название, p_гет при 18%, p_гет при 30% или None, цвет)
    ('m.8993T>G', 24 / 26, None, '#1f77b4'),
    ('m.3243A>G', 41 / 87, 52 / 87, '#ff7f0e'),
    ('m.14487T>C', 6 / 28, 8 / 28, '#2ca02c'),
    ('m.3697G>A', 1 / 21, 3 / 21, '#4b2a9b'),
]
PANELS = [('А', 30, 0.7), ('Б', 35, 0.5), ('В', 40, 0.3)]
N = list(range(1, 9))

plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 9, 'mathtext.default': 'it'})
fig, axes = plt.subplots(1, 3, figsize=(9.2, 4.35), sharey=True)
fig.subplots_adjust(left=0.07, right=0.995, top=0.92, bottom=0.25, wspace=0.12)
for ax, (letter, age, pe) in zip(axes, PANELS):
    ax.axhline(0.8, color='#aaaaaa', ls=':', lw=0.9, zorder=0)
    for y in (0.2, 0.4, 0.6, 1.0):
        ax.axhline(y, color='#e6e6e6', lw=0.8, zorder=0)
    for name, p18, p30, col in VARIANTS:
        ax.plot(N, [1 - (1 - p18 * pe) ** n for n in N], '-o', color=col, lw=1.8, ms=3.6, zorder=3)
        if p30 is not None:
            ax.plot(N, [1 - (1 - p30 * pe) ** n for n in N], '--', color=col, lw=1.2, zorder=2)
    ax.set_title(f'{letter}   {age} лет,  $p_{{эупл}}$ = {pe}', loc='left', fontweight='bold', fontsize=10.5)
    ax.set_xticks(N); ax.set_xlim(0.7, 8.3); ax.set_ylim(0, 1.03)
    ax.set_xlabel('Число бластоцист, N', fontsize=10)
    for s in ('top', 'right'):
        ax.spines[s].set_visible(False)
axes[0].set_ylabel('P(≥1 подходящего эмбриона)', fontsize=10)

handles = []
for name, p18, p30, col in VARIANTS:
    lab = f'{name}: $p_{{гет}}$ = {p18:.2f}' + (f' / {p30:.2f}' if p30 is not None else '')
    handles.append(Line2D([], [], color=col, marker='o', ms=4, lw=1.8, label=lab))
handles.append(Line2D([], [], color='#555555', ls='--', lw=1.2, label='граница 30% (где отличается от 18%)'))
order = [0, 1, 2, 3, 4]
fig.legend(handles=handles, loc='lower center', ncol=3, frameon=False, fontsize=9.5,
           bbox_to_anchor=(0.5, 0.0), columnspacing=2.5, handlelength=2.2)
fig.savefig(OUT, dpi=600, bbox_inches='tight', pad_inches=0.05,
            **({'pil_kwargs': {'compression': 'tiff_lzw'}} if OUT.endswith('.tif') else {}))
print('saved', OUT)
