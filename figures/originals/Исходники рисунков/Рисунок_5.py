"""Рисунок 5 — гетероплазмия перенесённого эмбриона и тканей плода/ребёнка.
Данные: лист «Рисунок 5» сопроводительной таблицы — строки с кодом C… и «да» в столбце «На графике».
Новый ребёнок = строки в xlsx + запись в CHILD (подпись и цвет) и LEG_ORDER; точки у нуля раскладываются
по горизонтали в порядке словаря order.
Запуск: python3 Рисунок_5.py <Сопроводительная информация.xlsx> <выход.png> [nohu]
"""
import sys, math
import openpyxl
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D

XLSX, OUT = sys.argv[1], sys.argv[2]
WITH_HU = len(sys.argv) < 4 or sys.argv[3] != 'nohu'
wb = openpyxl.load_workbook(XLSX, data_only=False)
ws = wb['Рисунок 5']
recs = []
for r in ws.iter_rows(min_row=4, values_only=True):
    if r[0] is None or not isinstance(r[0], str) or not r[0].startswith('C'):
        continue
    if r[11] != 'да':
        continue
    if not WITH_HU and r[0].startswith('C14'):
        continue
    recs.append(dict(id=r[0], src=r[1], var=r[2], emb=float(r[3]), stage=r[4], mat=r[5], tis=float(r[6]),
                     child=r[10]))
print(len(recs), 'records')

CHILD = {  # child -> (legend label, color)
    'C1': ('Steffann 2006, m.8993T>G', '#1b9e77'),
    'C2': ('Thorburn 2009, m.8993T>G', '#7570b3'),
    'C3': ('Sallevelt 2013, m.8993T>G', '#66a61e'),
    'C9': ('Spath 2021, m.8993T>G', '#1f78b4'),
    'C6': ('Heindryckx 2014, m.3243A>G', '#e6ab02'),
    'C5': ('Treff 2012 / Mitalipov 2014, m.3243A>G', '#d95f02'),
    'C12': ('Ji 2021, m.3697G>A', '#e7298a'),
    'C14': ('Hu 2026, m.3250T>C', '#a6761d'),
}
LEG_ORDER = ['C1', 'C2', 'C3', 'C9', 'C6', 'C5', 'C12', 'C14']


def shape(rec):
    if rec['stage'] == 'пренатальный':
        return 'o'
    m = rec['mat']
    if 'кровь' in m and 'менее' not in m:
        return 's'
    return '^'


def cat(rec):
    return {'o': 0, 's': 1, '^': 2}[shape(rec)]


plt.rcParams.update({'font.family': 'DejaVu Sans'})
FW, FH = 9.28, 5.97 + (0.0 if not WITH_HU else 0.0)
fig = plt.figure(figsize=(FW, FH), dpi=600)
axA = fig.add_axes([0.059, 0.338, 0.4235, 0.6135])
axB = fig.add_axes([0.609, 0.338, 0.3685, 0.6135])
MS = 7.0  # marker size pt

# ---------------- panel A ----------------
XMIN = -17 if WITH_HU else -10
axA.set_xlim(XMIN, 66); axA.set_ylim(-9, 66)
axA.axhspan(-3, 5, xmin=0, xmax=1, color='#eeeeee', zorder=0, lw=0)
axA.plot([-3, 66], [-3, 66], ls='--', color='#999999', lw=1.0, zorder=1)
# positions: low cluster (embryo<=2, tissue<=2) spread horizontally
low = [r for r in recs if r['emb'] <= 2 and r['tis'] <= 2]
order = {'C14a': -4, 'C14b': -3, 'C14c': -2, 'C14d': -1, 'C1a': 0, 'C1b': 1, 'C3': 2, 'C6a': 3, 'C6b': 4, 'C6c': 5, 'C9a': 6, 'C9b': 7}
low.sort(key=lambda r: order[r['id']])
start = -15.5 if WITH_HU else -6.6
step = 2.1 if WITH_HU else 1.9
pos = {}
for k, r in enumerate(low):
    pos[r['id']] = (start + k * step, r['tis'])
# C5 group: same embryo 12; separate overlapping
c5 = {'C5b': (11, 0), 'C5c': (13, 0), 'C5e': (11, 47), 'C5f': (13, 46)}
for r in recs:
    if r['id'] not in pos:
        pos[r['id']] = c5.get(r['id'], (r['emb'], r['tis']))
# lines connecting points of one child where embryo value is shared
axA.plot([12, 12], [0, 52], color=CHILD['C5'][1], lw=1.4, zorder=2, alpha=0.8)
for r in recs:
    x, y = pos[r['id']]
    axA.plot([x], [y], marker=shape(r), ms=MS if shape(r) != '^' else MS * 1.02, mfc=CHILD[r['child']][1],
             mec='black', mew=0.7, ls='none', zorder=4)
lab = dict(fontsize=7.5, color='#333333')
axA.text(13.6, 52, 'C5g', va='center', **lab)
axA.text(9.4, 47, 'C5e', va='center', ha='right', **lab)
axA.text(14.4, 45.2, 'C5f', va='center', **lab)
axA.text(13.6, 42, 'C5h', va='center', **lab)
axA.text(10.3, 15, 'C5a', va='center', ha='right', **lab)
axA.text(2.5, 7.2, 'C2', ha='center', **lab)
axA.text(14.2, -1.2, 'C5b, C5c', va='center', **lab)
axA.text(55.5, 50.3, 'C12a', va='center', **lab)
axA.text(55.5, 46.6, 'C12b', va='center', **lab)
low_lab = ('C14a–d, ' if WITH_HU else '') + 'C1a, C1b, C3, C6a–c, C9a, C9b'
axA.text(XMIN + 0.7, -6, low_lab, va='center', **lab)
for s in ['top', 'right']:
    axA.spines[s].set_visible(False)
axA.tick_params(labelsize=9)
axA.set_xlabel('Гетероплазмия в перенесённом эмбрионе, %', fontsize=10)
axA.set_ylabel('Гетероплазмия в ткани плода / ребёнка, %', fontsize=10)
axA.text(0.0, 1.02, 'А', transform=axA.transAxes, fontsize=11, fontweight='bold', va='bottom')
if WITH_HU:
    axA.set_xticks(range(-10, 61, 10))

# ---------------- panel B ----------------
axB.set_xlim(-0.6, 2.6); axB.set_ylim(-20, 44)
axB.axhspan(-5, 5, color='#eeeeee', zorder=0, lw=0)
axB.axhline(0, ls='--', color='#666666', lw=1.0, zorder=1)
# swarm within category
fig.canvas.draw()
def to_px(ax, x, y):
    return ax.transData.transform((x, y))
groups = {0: [], 1: [], 2: []}
for r in recs:
    groups[cat(r)].append(r)
child_rank = {c: i for i, c in enumerate(['C12', 'C1', 'C14', 'C2', 'C3', 'C6', 'C9', 'C5'])}
marker_px = MS / 72 * 600 * 1.05
for g, rs in groups.items():
    rs.sort(key=lambda r: (child_rank[r['child']], r['id']))
    placed = []
    for r in rs:
        d = r['tis'] - r['emb']
        for j in [0] + [s * k for k in range(1, 30) for s in (1, -1)]:
            x = g + j * 0.1
            px = to_px(axB, x, d)
            if all(math.hypot(px[0] - q[0], px[1] - q[1]) >= marker_px for q in placed):
                placed.append(px)
                break
        axB.plot([x], [d], marker=shape(r), ms=MS, mfc=CHILD[r['child']][1], mec='black', mew=0.7, ls='none',
                 zorder=4)
    axB.text(g, -18, f'n = {len(rs)}', ha='center', va='center', fontsize=8.5, color='#555555')
axB.set_xticks([0, 1, 2])
axB.set_xticklabels(['Пренатальный\nматериал', 'Кровь /\nпуповинная\nкровь', 'Другие\nпостнатальные\nткани'],
                    fontsize=9)
axB.tick_params(axis='y', labelsize=9)
axB.set_ylabel('Δ гетероплазмии (ткань − эмбрион), п.п.', fontsize=10)
for s in ['top', 'right']:
    axB.spines[s].set_visible(False)
axB.text(0.0, 1.02, 'Б', transform=axB.transAxes, fontsize=11, fontweight='bold', va='bottom')

# ---------------- legends ----------------
shape_handles = [Line2D([], [], marker='o', ls='none', mfc='white', mec='black', ms=MS, label='пренатальный материал'),
                 Line2D([], [], marker='s', ls='none', mfc='white', mec='black', ms=MS, label='кровь / пуповинная кровь'),
                 Line2D([], [], marker='^', ls='none', mfc='white', mec='black', ms=MS, label='другие постнатальные ткани'),
                 Line2D([], [], ls='--', color='#999999', label='y = x (полное совпадение)')]
l1 = fig.legend(handles=shape_handles, loc='upper center', bbox_to_anchor=(0.5, 0.205), ncol=4, frameon=False,
                fontsize=8.5, title='Форма — материал', title_fontsize=8.5, handletextpad=0.4, columnspacing=1.6)
fig.add_artist(l1)
kids = [c for c in LEG_ORDER if any(r['child'] == c for r in recs)]
n_ch = len(kids); n_cmp = len(recs)
word = 'детей'
cw = 'сопоставлений' if n_cmp % 10 in (0, 5, 6, 7, 8, 9) or 11 <= n_cmp % 100 <= 14 else ('сопоставления' if n_cmp % 10 in (2, 3, 4) else 'сопоставление')
col_handles = [Line2D([], [], marker='o', ls='none', mfc=CHILD[c][1], mec='black', ms=MS, label=CHILD[c][0])
               for c in kids]
# column-major order for 4 columns x 2 rows
fig.legend(handles=col_handles, loc='upper center', bbox_to_anchor=(0.5, 0.105), ncol=4, frameon=False,
           fontsize=8.5, title=f'Цвет — ребёнок ({n_ch} {word}, {n_cmp} {cw}; коды случаев — по сопроводительной таблице)',
           title_fontsize=8.5, handletextpad=0.4, columnspacing=1.6)
fig.savefig(OUT, dpi=600)
print(n_ch, n_cmp)
