"""Пересобрать все рисунки статьи.
По умолчанию данные берутся из ../update/Сопроводительная информация.xlsx, результат — в ./out:
Рисунок_N.png (для просмотра) и Рисунок_N.tif (RGB, 600 dpi, LZW — для подачи в журнал).
Запуск: python3 make_all.py [путь к xlsx] [папка вывода] [номера рисунков, например 3 5]
"""
import os, sys, subprocess
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
XLSX = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '..', 'update', 'Сопроводительная информация.xlsx')
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, 'out')
NUMS = [int(x) for x in sys.argv[3:]] or [1, 2, 3, 4, 5, 6]
NEEDS_XLSX = {3, 4, 5}
os.makedirs(OUT, exist_ok=True)
for n in NUMS:
    png = os.path.join(OUT, f'Рисунок_{n}.png')
    cmd = [sys.executable, os.path.join(HERE, f'Рисунок_{n}.py')] + ([XLSX] if n in NEEDS_XLSX else []) + [png]
    subprocess.run(cmd, check=True)
    Image.open(png).convert('RGB').save(png[:-4] + '.tif', compression='tiff_lzw', dpi=(600, 600))
    print('готово:', png[:-4] + '.tif')
