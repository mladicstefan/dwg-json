# utils/optimizer.py
import logging
import numpy as np
from numba import njit
from typing import List, Tuple, Dict

logger = logging.getLogger(__name__)


@njit
def _count_nulls_overlaps(
    text_pos: np.ndarray, obj_bbox: np.ndarray, tol: float
) -> Tuple[np.int64, np.int64]:
    nulls = np.int64(0)
    overlaps = np.int64(0)
    nt, no = text_pos.shape[0], obj_bbox.shape[0]
    for i in range(nt):
        x, y = text_pos[i, 0], text_pos[i, 1]
        hits = 0
        for j in range(no):
            minx, miny, maxx, maxy = obj_bbox[j]
            if minx - tol <= x <= maxx + tol and miny - tol <= y <= maxy + tol:
                hits += 1
        if hits == 0:
            nulls += 1
        elif hits > 1:
            overlaps += 1
    return nulls, overlaps


def find_best_max_tol(
    texts: List[Dict], objects: List[Dict], max_tol_bound: float, steps: int = 50
) -> float:
    logger.info("Optimizing max_tol up to %.3f over %d steps", max_tol_bound, steps)
    text_pos = np.array(
        [[t["position"]["x"], t["position"]["y"]] for t in texts], dtype=np.float64
    )
    obj_bbox = np.array(
        [
            [o["bbox"]["minx"], o["bbox"]["miny"], o["bbox"]["maxx"], o["bbox"]["maxy"]]
            for o in objects
        ],
        dtype=np.float64,
    )

    best_tol = 0.0
    best_nulls = len(texts) + 1
    best_overlaps = len(texts) + 1

    for k in range(steps + 1):
        tol = max_tol_bound * k / steps
        nulls, overlaps = _count_nulls_overlaps(text_pos, obj_bbox, tol)
        logger.debug("tol=%.3f → nulls=%d overlaps=%d", tol, nulls, overlaps)
        if nulls < best_nulls or (nulls == best_nulls and overlaps < best_overlaps):
            best_nulls, best_overlaps, best_tol = nulls, overlaps, tol
            if best_nulls == 0 and best_overlaps == 0:
                break

    logger.info(
        "Best max_tol=%.3f (nulls=%d, overlaps=%d)", best_tol, best_nulls, best_overlaps
    )
    return best_tol
