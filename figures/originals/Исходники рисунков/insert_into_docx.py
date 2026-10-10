"""Заменить картинку рисунка внутри рукописи .docx, не трогая текст.
Ищет абзац подписи «Рис. N.» и рисунок в ближайшем абзаце выше; подменяет изображение и пересчитывает
высоту рамки по пропорциям новой картинки (ширина рамки сохраняется).
Запуск: python3 insert_into_docx.py <рукопись.docx> <N> <Рисунок_N.png> [<N> <png> ...]
Файл .docx перезаписывается — сделайте копию заранее.
"""
import io, sys
import docx
from PIL import Image
from docx.oxml.ns import qn

A = '{http://schemas.openxmlformats.org/drawingml/2006/main}'
WP = '{http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing}'


def ptext(p):
    return ''.join(t.text or '' for t in p._p.iter(qn('w:t')))


def replace(d, n, png, width_px=2300):
    ps = d.paragraphs
    cap = next(i for i, p in enumerate(ps) if ptext(p).startswith(f'Рис. {n}.'))
    for j in range(cap - 1, max(cap - 6, -1), -1):
        blips = list(ps[j]._p.iter(A + 'blip'))
        if blips:
            break
    else:
        raise SystemExit(f'не найден рисунок над подписью «Рис. {n}.»')
    p = ps[j]._p
    part = d.part.related_parts[blips[0].get(qn('r:embed'))]
    im = Image.open(png).convert('RGB')
    im2 = im.resize((width_px, int(im.size[1] * width_px / im.size[0])), Image.LANCZOS)
    buf = io.BytesIO(); im2.save(buf, 'PNG', optimize=True); part._blob = buf.getvalue()
    ext = next(p.iter(WP + 'extent'))
    cy = int(round(int(ext.get('cx')) * im.size[1] / im.size[0]))
    ext.set('cy', str(cy))
    for e in p.iter(A + 'ext'):
        if e.get('cx'):
            e.set('cy', str(cy))
    print(f'Рис. {n}: заменён')


if __name__ == '__main__':
    path, rest = sys.argv[1], sys.argv[2:]
    d = docx.Document(path)
    for n, png in zip(rest[::2], rest[1::2]):
        replace(d, int(n), png)
    d.save(path)
