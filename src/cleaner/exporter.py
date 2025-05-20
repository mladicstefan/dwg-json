from pathlib import Path
from collections import Counter
from typing import List, Dict
from utils.file_io import write_json, write_csv
from .normalizer import normalize_note


class CleanerService:
    def __init__(self, source: Path):
        self.data = write_json
        self.source = source

    def run(self) -> None:
        entries = self._load()
        records = [
            {
                "object_id": e.get("object", {}).get("id"),
                "note_raw": n,
                "note_clean": normalize_note(n),
            }
            for e in entries
            for n in e.get("notes", [])
        ]
        bom = [
            {"description": d, "quantity": q}
            for d, q in Counter(r["note_clean"] for r in records).items()
        ]
        write_json(Path("cleaned.json"), {"records": records, "bom": bom})
        write_csv(Path("bom.csv"), bom, ["description", "quantity"])

    def _load(self) -> List[Dict]:
        from utils.file_io import read_json

        return read_json(self.source)
