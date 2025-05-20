import re
from typing import List


def normalize_note(note: str) -> str:
    parts = re.split(r"\\P|\n", note)
    cleaned = [re.sub(r"\\f[^;]+;|\\[A-Za-z]+", "", p).strip() for p in parts]
    return " | ".join(filter(None, cleaned))
