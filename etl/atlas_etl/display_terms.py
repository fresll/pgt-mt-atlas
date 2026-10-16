"""Editorial labels for embryo parts; workbook values and stable field names are unchanged."""
from __future__ import annotations

import re

_PARTS = {
    'фракционирования': 'разделения на части',
    'фракционировании': 'разделении на части',
    'фракционирование': 'разделение на части',
    'фракциями': 'частями', 'фракциям': 'частям', 'фракциях': 'частях',
    'фракцией': 'частью', 'фракций': 'частей', 'фракцию': 'часть',
    'фракция': 'часть', 'фракции': 'части',
}
_PATTERN = re.compile(r'\b(' + '|'.join(_PARTS) + r')\b', re.IGNORECASE)


def embryo_part_terms(value):
    """Apply the curator's wording to display strings, leaving keys and numeric data intact."""
    if isinstance(value, str):
        return _PATTERN.sub(lambda m: _PARTS[m[0].lower()].capitalize()
                            if m[0][0].isupper() else _PARTS[m[0].lower()], value)
    if isinstance(value, list):
        return [embryo_part_terms(v) for v in value]
    if isinstance(value, dict):
        return {key: embryo_part_terms(v) for key, v in value.items()}
    return value
