# parser/duplicate.py
import logging
from typing import Any, Dict, List, Tuple
from utils.geometry import distance

logger = logging.getLogger(__name__)


def remove_duplicates(
    relations: List[Dict[str, Any]],
    texts: List[Dict[str, Any]],
    objects: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    """
    Removes duplicate note-object pairs by keeping the closest match for each (objectId, note text) combo.
    """
    logger.info("Removing duplicate notes for same object/text")

    text_map = {t["id"]: t for t in texts}
    obj_map = {o["id"]: o for o in objects if o["id"] is not None}
    best: Dict[Tuple[Any, str], Dict[str, Any]] = {}

    for r in relations:
        oid, note = r["objectId"], r["note"]
        key = (oid, note)

        if oid is None or oid not in obj_map:
            best.setdefault(key, r)
            continue

        pos_t = text_map.get(r["textId"], {}).get("position")
        pos_o = obj_map[oid]["position"]
        d = distance(pos_t, pos_o) if pos_t else float("inf")
        existing = best.get(key)

        if existing is None or d < existing.get("_dist", float("inf")):
            r2 = r.copy()
            r2["_dist"] = d
            best[key] = r2

    result = []
    for r in best.values():
        r.pop("_dist", None)
        result.append(r)

    logger.info("Duplicates removed: %d → %d", len(relations), len(result))
    return result
