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
        """
        Loads object-note relations, normalizes note text,
        and builds a cleaned dataset with raw and processed notes,
        plus a unique note frequency count.
        """
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

        cleaned = [
            {"description": d, "quantity": q}
            for d, q in Counter(r["note_clean"] for r in records).items()
        ]
        logger.info("Built cleaned of %d items", len(cleaned))

        write_json(Path("cleaned.json"), {"records": records, "cleaned": cleaned})
        logger.info("Export complete: cleaned.json")

    def _load(self) -> List[Dict]:
        from utils.file_io import read_json

        return read_json(self.source)
