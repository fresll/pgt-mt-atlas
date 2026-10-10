"""Извлечь список литературы из рукописи обзора в etl/atlas_etl/curation/review_references.yaml.

Рукопись только читается. Результат — машинно сгенерированный файл; вручную его не правят,
а перегенерируют после изменения рукописи:
    python3 etl/tools/extract_references.py
"""
import re
import sys
from pathlib import Path

import docx
import yaml

ROOT = Path(__file__).resolve().parents[2]
MANUSCRIPT = ROOT / 'docs' / 'Тофило_Мазунин_ПГТ-мт_ActaNaturae_ru.docx'
OUT = ROOT / 'etl' / 'atlas_etl' / 'curation' / 'review_references.yaml'

REF_RE = re.compile(r'^(\d+)\.\s+(.*)$')
DOI_RE = re.compile(r'doi:\s*(10\.\S+?)\.?$', re.I)


def main() -> int:
    d = docx.Document(str(MANUSCRIPT))
    paras = [p.text.strip() for p in d.paragraphs]
    start = paras.index('СПИСОК ЛИТЕРАТУРЫ') + 1
    refs = []
    for text in paras[start:]:
        m = REF_RE.match(text)
        if not m:
            continue
        no, body = int(m.group(1)), m.group(2)
        doi = DOI_RE.search(body)
        refs.append({'no': no, 'citation': body, 'doi': doi.group(1) if doi else None})
    assert [r['no'] for r in refs] == list(range(1, len(refs) + 1)), 'нумерация ссылок не сплошная'
    header = ('# СГЕНЕРИРОВАНО etl/tools/extract_references.py из списка литературы рукописи.\n'
              '# Не редактировать вручную. Источник: docs/' + MANUSCRIPT.name + '\n')
    OUT.write_text(header + yaml.safe_dump({'references': refs}, allow_unicode=True, sort_keys=False, width=1000),
                   encoding='utf-8')
    print(f'{len(refs)} ссылок → {OUT.relative_to(ROOT)}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
