import logging
from collections import deque
from typing import Any, Dict, List, Optional, Tuple, TypedDict
from utils.geometry import distance

logger = logging.getLogger(__name__)


class _QueueEntry(TypedDict):
    pos: Dict[str, float]
    path: List[str]


class RelationBuilder:
    def __init__(
        self,
        texts: List[Dict[str, Any]],
        objects: List[Dict[str, Any]],
        lines: List[Dict[str, Any]],
        line_tol: float,
        chain_tol: float,
        max_tol: float,
    ):
        self.texts = texts
        self.objects = objects
        self.lines = lines
        self.line_tol = line_tol
        self.chain_tol = chain_tol
        self.max_tol = max_tol

    def build(self) -> List[Dict[str, Any]]:
        logger.info(
            "Building relations (%d texts → %d objects)",
            len(self.texts),
            len(self.objects),
        )
        results: List[Dict[str, Any]] = []
        for txt in self.texts:
            found, path = self._find_object(txt["position"])
            results.append(
                {
                    "textId": txt["id"],
                    "objectId": found["id"] if found else None,
                    "note": txt["text"],
                    "linePath": path,
                }
            )
        logger.info("Relations complete: %d items", len(results))
        return results

    def _find_object(
        self, pos: Dict[str, float]
    ) -> Tuple[Optional[Dict[str, Any]], List[str]]:
        tol = self.line_tol
        # try expanding bbox
        while tol <= self.max_tol:
            hits = [o for o in self.objects if self._in_bbox(pos, o["bbox"], tol)]
            if hits:
                # pick smallest bbox first
                hits.sort(
                    key=lambda o: (
                        (o["bbox"]["maxx"] - o["bbox"]["minx"])
                        * (o["bbox"]["maxy"] - o["bbox"]["miny"])
                    )
                )
                return hits[0], []
            found, path = self._bfs(pos, tol)
            if found:
                return found, path
            tol *= 2
        return None, []

    def _in_bbox(
        self, pos: Dict[str, float], bbox: Dict[str, float], tol: float
    ) -> bool:
        return (
            bbox["minx"] - tol <= pos["x"] <= bbox["maxx"] + tol
            and bbox["miny"] - tol <= pos["y"] <= bbox["maxy"] + tol
        )

    def _bfs(
        self, start: Dict[str, float], tol: float
    ) -> Tuple[Optional[Dict[str, Any]], List[str]]:
        visited = set()
        queue: deque[_QueueEntry] = deque([{"pos": start, "path": []}])
        while queue:
            cur = queue.popleft()
            # direct bbox hit?
            for o in self.objects:
                if self._in_bbox(cur["pos"], o["bbox"], tol):
                    return o, cur["path"]
            # follow line‐chains
            for ln in self.lines:
                lid = ln["id"]
                if lid in visited:
                    continue
                maxd = self.chain_tol if cur["path"] else self.line_tol
                for end in ("start", "end"):
                    if distance(cur["pos"], ln[end]) <= maxd:
                        visited.add(lid)
                        other = "end" if end == "start" else "start"
                        queue.append({"pos": ln[other], "path": cur["path"] + [lid]})
        return None, []
