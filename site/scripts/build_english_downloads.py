"""Create English presentation copies. Never write to public/ or change source data."""
from __future__ import annotations

import csv
import json
from copy import copy
from pathlib import Path
import re

import openpyxl
from openpyxl.comments import Comment
from openpyxl.utils import get_column_letter

ROOT = Path(__file__).resolve().parents[1]
CYRILLIC = re.compile('[А-Яа-яЁё]')
TEXTS = json.loads((ROOT / 'src/i18n/english-text.json').read_text())
LOOKUP = TEXTS['source'] | TEXTS['cases'] | TEXTS['metadata']
ALIASES = sorted(((k, v) for k, v in TEXTS['metadata'].items() if k.startswith(('Рисунок', 'Таблица', 'Hu 2026', 'Сопроводительная'))), key=lambda p: -len(p[0]))


def english_text(value: str) -> str:
    text = LOOKUP.get(value, value)
    for source, target in ALIASES:
        text = text.replace(source, target)
    return text


def build_csv(source: Path, destination: Path) -> int:
    destination.mkdir(parents=True, exist_ok=True)
    count = 0
    for path in sorted(source.glob('*.csv')):
        with path.open(encoding='utf-8-sig', newline='') as stream:
            rows = list(csv.reader(stream))
        translated = [[english_text(cell) for cell in row] for row in rows]
        for row in translated:
            for value in row:
                if CYRILLIC.search(value):
                    raise ValueError(f'Untranslated CSV text in {path.name}: {value}')
        with (destination / path.name).open('w', encoding='utf-8-sig', newline='') as stream:
            csv.writer(stream).writerows(translated)
        count += 1
    return count


def build_template(source: Path, destination: Path) -> None:
    workbook = openpyxl.load_workbook(source)
    dictionary = workbook['Data_Dictionary']
    fields = {(row[0], row[1]): {'label': row[2], 'requirement': row[4], 'definition': row[8]} for row in list(dictionary.values)[1:]}
    instructions = workbook['Instructions']
    # The existing left column already contains the complete English instructions.
    for row in instructions:
        for cell in row[2:]:
            if cell.value is not None and CYRILLIC.search(str(cell.value)):
                cell.value = None
    for sheet in workbook:
        for cell in sheet[1]:
            field = fields.get((sheet.title, cell.value))
            if field:
                sheet.cell(2, cell.column).value = f"{field['label']} — {field['requirement']}"
                if cell.comment:
                    cell.comment = Comment(f"{field['label']}\n\n{field['definition']}", cell.comment.author)
    # Remove only the duplicate Russian descriptions; input fields and Lists are unchanged.
    widths = [copy(dictionary.column_dimensions[get_column_letter(i)]) for i in [1, 2, 3, 5, 6, 7, 8, 9, 11]]
    dictionary.delete_cols(10)
    dictionary.delete_cols(4)
    for i, dimension in enumerate(widths, 1):
        dimension.index = get_column_letter(i)
        dictionary.column_dimensions[dimension.index] = dimension
    dictionary.auto_filter.ref = dictionary.dimensions
    for sheet in workbook:
        for row in sheet:
            for cell in row:
                if isinstance(cell.value, str) and CYRILLIC.search(cell.value):
                    cell.value = english_text(cell.value)
                for name, text in [('value', cell.value), ('comment', cell.comment.text if cell.comment else None)]:
                    if text is not None and CYRILLIC.search(str(text)):
                        raise ValueError(f'Untranslated template {sheet.title}!{cell.coordinate} {name}: {text}')
        for validation in sheet.data_validations.dataValidation:
            for name in ['promptTitle', 'prompt', 'errorTitle', 'error']:
                text = getattr(validation, name)
                if text and CYRILLIC.search(text):
                    translated = english_text(text)
                    # Validation prompts already contain complete EN / RU counterparts.
                    english, separator, russian = translated.partition(' / ')
                    if separator and not CYRILLIC.search(english) and CYRILLIC.search(russian):
                        translated = english
                    if CYRILLIC.search(translated):
                        raise ValueError(f'Untranslated validation: {text}')
                    setattr(validation, name, translated)
    destination.parent.mkdir(parents=True, exist_ok=True)
    workbook.save(destination)


def main() -> None:
    count = build_csv(ROOT / 'public/data/csv', ROOT / 'dist/data/csv/en')
    (ROOT / 'dist/data/csv/en/README.txt').write_text(
        'English presentation copies of the Atlas database tables.\n'
        'Record IDs, column names, qualifiers, numerical values and row/cell coordinates are unchanged.\n'
        'Text values, including source worksheet names, are translated into English.\n'
        'Original schema names such as *_raw and comment_ru are retained for compatibility; their text values are English in these copies.\n'
        'Original source files and the Russian-version downloads are unchanged.\n', encoding='utf-8')
    source = ROOT / 'public/templates/PGT-mt_Research_Data_Submission_v1.0.xlsx'
    build_template(source, ROOT / 'dist/templates/en' / source.name)
    print(f'English downloads: {count} CSV files and the submission workbook')


if __name__ == '__main__':
    main()
