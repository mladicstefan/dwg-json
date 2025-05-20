# parser/exporter.py
import logging
from pathlib import Path
from collections import Counter
from typing import List, Dict
from utils.file_io import write_json, write_csv
from .normalizer import normalize_note

logger = logging.getLogger(__name__)


class CleanerService:
    def __init__(self, source: Path):
        self.source = source

    def run(self) -> None:
        logger.info("Loading objects-with-notes from %s", self.source)
        entries = [e for e in self._load() if isinstance(e, dict)]
        logger.info("Loaded %d entries", len(entries))

        records = [
            {
                "object_id": (e.get("object") or {}).get("id"),
                "note_raw": n,
                "note_clean": normalize_note(n),
            }
            for e in entries
            for n in e.get("notes", [])
        ]
        logger.info("Normalized %d notes", len(records))

        bom = [
            {"description": d, "quantity": q}
            for d, q in Counter(r["note_clean"] for r in records).items()
        ]
        logger.info("Built BOM of %d items", len(bom))

        write_json(Path("cleaned.json"), {"records": records, "bom": bom})
        write_csv(Path("bom.csv"), bom, ["description", "quantity"])
        logger.info("Export complete: cleaned.json, bom.csv")

    def _load(self) -> List[Dict]:
        from utils.file_io import read_json

        return read_json(self.source)
