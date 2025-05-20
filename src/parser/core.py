import logging
from pathlib import Path
from typing import Any, Dict, List
import statistics

from .entities import DXFParser
from .relations import RelationBuilder

from utils.duplicate import remove_duplicates
from utils.file_io import write_json
from utils.optimizer import find_best_max_tol
from utils.geometry import distance

logger = logging.getLogger(__name__)


class ParserService:
    def __init__(self, path: str):
        logger.info("Initializing parser for %s", path)
        self.parser = DXFParser(path)

    def _cluster_texts(self, raw_texts: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        if not raw_texts:
            return []

        # sort descending Y
        texts = sorted(raw_texts, key=lambda t: -t["position"]["y"])
        ys = [t["position"]["y"] for t in texts]
        # y‐tolerance = median of the smallest half of adjacent Y‐gaps
        gaps = sorted(abs(y2 - y1) for y1, y2 in zip(ys, ys[1:]))
        half = max(1, len(gaps) // 2)
        y_tol = statistics.median(gaps[:half])
        logger.info("Clustering %d texts with y_tol=%.3f", len(texts), y_tol)

        # group into lines
        lines: List[List[Dict[str, Any]]] = []
        for t in texts:
            if (
                not lines
                or abs(lines[-1][0]["position"]["y"] - t["position"]["y"]) > y_tol
            ):
                lines.append([t])
            else:
                lines[-1].append(t)

        # within each line, compute x_tol and merge
        merged: List[Dict[str, Any]] = []
        for line in lines:
            xs = [t["position"]["x"] for t in line]
            if len(xs) < 2:
                x_tol = 0.0
            else:
                x_gaps = sorted(xs[i + 1] - xs[i] for i in range(len(xs) - 1))
                halfx = max(1, len(x_gaps) // 2)
                x_tol = statistics.median(x_gaps[:halfx])
            logger.debug(
                " Line at y=%.3f → x_tol=%.3f (%d fragments)",
                line[0]["position"]["y"],
                x_tol,
                len(line),
            )

            cluster: List[Dict[str, Any]] = [line[0]]
            last_x = line[0]["position"]["x"]
            for t in line[1:]:
                x = t["position"]["x"]
                if x - last_x <= x_tol:
                    cluster.append(t)
                else:
                    merged.append(self._merge(cluster))
                    cluster = [t]
                last_x = x
            merged.append(self._merge(cluster))

        logger.info("Produced %d merged text blocks", len(merged))
        return merged

    def _merge(self, cluster: List[Dict[str, Any]]) -> Dict[str, Any]:
        xs = [c["position"]["x"] for c in cluster]
        ys = [c["position"]["y"] for c in cluster]
        return {
            "id": cluster[0]["id"],
            "position": {"x": statistics.mean(xs), "y": statistics.mean(ys)},
            "text": " ".join(c["text"] for c in cluster),
        }

    def run(self) -> None:
        # 1) load and extract
        ents = self.parser.gather_entities()
        raw_txt = self.parser.extract_texts(ents)
        objects = self.parser.extract_inserts(ents)
        lines = self.parser.extract_lines(ents)
        logger.info(
            "Extracted %d texts, %d objects, %d lines",
            len(raw_txt),
            len(objects),
            len(lines),
        )

        write_json(Path("texts.json"), raw_txt)
        write_json(Path("objects.json"), objects)
        write_json(Path("lines.json"), lines)

        # 2) auto‐compute line_tol and chain_tol from actual line‐lengths
        dists = [distance(l["start"], l["end"]) for l in lines]
        if dists:
            line_tol = min(dists)
            chain_tol = max(dists)
        else:
            line_tol = chain_tol = 0.0
        logger.info(
            "Auto‐tolerances: line_tol=%.3f chain_tol=%.3f", line_tol, chain_tol
        )

        # 3) find best max_tol
        max_tol = find_best_max_tol(raw_txt, objects, max_tol_bound=chain_tol or 100.0)
        logger.info("Optimized max_tol=%.3f", max_tol)
        write_json(
            Path("tols.json"),
            {"line_tol": line_tol, "chain_tol": chain_tol, "max_tol": max_tol},
        )

        # 4) cluster the texts *before* matching
        clustered = self._cluster_texts(raw_txt)
        write_json(Path("clustered-texts.json"), clustered)

        # 5) build relations & dedupe
        relations = RelationBuilder(
            clustered, objects, lines, line_tol, chain_tol, max_tol
        ).build()
        logger.info("Built %d raw relations", len(relations))

        relations = remove_duplicates(relations, clustered, objects)
        logger.info("After dedupe: %d relations", len(relations))
        write_json(Path("relations.json"), relations)

        # 6) group into objects-with-notes
        by_obj: Dict[Any, Dict[str, Any]] = {}
        for r in relations:
            oid = r["objectId"]
            by_obj.setdefault(
                oid,
                {
                    "object": next((o for o in objects if o["id"] == oid), None),
                    "notes": [],
                },
            )["notes"].append(r["note"])
        notes = list(by_obj.values())

        write_json(Path("objects-with-notes.json"), notes)
        logger.info("Wrote %d objects‐with‐notes", len(notes))
