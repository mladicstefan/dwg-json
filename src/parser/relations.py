import logging
from collections import deque
from typing import Any, Dict, List, Optional, Tuple
from utils.geometry import distance

logger = logging.getLogger(__name__)


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
        logger.info("Building relations for %d texts", len(self.texts))
        relations: List[Dict[str, Any]] = []
        for txt in self.texts:
            found, path = self._find_object(txt)
            relations.append(
                {
                    "textId": txt["id"],
                    "objectId": found["id"] if found else None,
                    "note": txt["text"],
                    "linePath": path,
                }
            )
        logger.info("Finished relations: %d total", len(relations))
        return relations

    def _find_object(
        self, txt: Dict[str, Any]
    ) -> Tuple[Optional[Dict[str, Any]], List[str]]:
        tol = self.line_tol
        while tol <= self.max_tol:
            hits = [
                o
                for o in self.objects
                if self._in_bbox(txt["position"], o["bbox"], tol)
            ]
            if hits:
                hits.sort(
                    key=lambda o: (o["bbox"]["maxx"] - o["bbox"]["minx"])
                    * (o["bbox"]["maxy"] - o["bbox"]["miny"])
                )
                return hits[0], []
            found, path = self._bfs(txt["position"], tol)
            if found:
                return found, path
            tol *= 2
        return None, []

    def _in_bbox(self, pos: Any, bbox: Dict[str, float], tol: float) -> bool:
        return (
            bbox["minx"] - tol <= pos["x"] <= bbox["maxx"] + tol
            and bbox["miny"] - tol <= pos["y"] <= bbox["maxy"] + tol
        )

    def _bfs(
        self, start: Any, tol: float
    ) -> Tuple[Optional[Dict[str, Any]], List[str]]:
        visited = set()
        queue = deque([{"pos": start, "path": []}])
        while queue:
            cur = queue.popleft()
            if any(self._in_bbox(cur["pos"], o["bbox"], tol) for o in self.objects):
                target = next(
                    o for o in self.objects if self._in_bbox(cur["pos"], o["bbox"], tol)
                )
                return target, cur["path"]
            for l in self.lines:
                lid = l["id"]
                if lid in visited:
                    continue
                maxd = self.chain_tol if cur["path"] else self.line_tol
                for end in ("start", "end"):
                    if distance(cur["pos"], l[end]) <= maxd:
                        visited.add(lid)
                        other = "end" if end == "start" else "start"
                        queue.append({"pos": l[other], "path": cur["path"] + [lid]})
        return None, []
