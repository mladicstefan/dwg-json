# parser/core.py
import logging
from pathlib import Path
from typing import Any, Dict, List
from .entities import DXFParser
from .relations import RelationBuilder
from utils.duplicate import remove_duplicates
from utils.file_io import write_json
from utils.optimizer import find_best_max_tol
from utils.geometry import distance
import statistics

logger = logging.getLogger(__name__)


class ParserService:
    def __init__(self, path: str):
        self.parser = DXFParser(path)
        self.line_tol = 1.0
        self.chain_tol = 1.0
        self.max_tol = 1.0

    def _cluster_texts(
        self, texts: List[Dict[str, Any]], y_tol: float, x_gap: float
    ) -> List[Dict[str, Any]]:
        logger.info(
            "Clustering %d text fragments (y_tol=%.3f, x_gap=%.3f)",
            len(texts),
            y_tol,
            x_gap,
        )
        clusters: List[List[Dict[str, Any]]] = []
        for txt in texts:
            placed = False
            for cl in clusters:
                if abs(cl[0]["position"]["y"] - txt["position"]["y"]) < y_tol:
                    cl.append(txt)
                    placed = True
                    break
            if not placed:
                clusters.append([txt])
        merged: List[Dict[str, Any]] = []
        for cl in clusters:
            frags = sorted(cl, key=lambda t: t["position"]["x"])
            lines = [[frags[0]]]
            for curr in frags[1:]:
                prev = lines[-1][-1]
                if curr["position"]["x"] - prev["position"]["x"] > x_gap:
                    lines.append([curr])
                else:
                    lines[-1].append(curr)
            for line in lines:
                xs = [t["position"]["x"] for t in line]
                ys = [t["position"]["y"] for t in line]
                merged.append(
                    {
                        "id": line[0]["id"],
                        "position": {"x": sum(xs) / len(xs), "y": sum(ys) / len(ys)},
                        "text": " ".join(t["text"] for t in line),
                    }
                )
        logger.info("Produced %d clustered notes", len(merged))
        return merged

    def run(self) -> None:
        logger.info("Gathering entities from DXF")
        ents = self.parser.gather_entities()

        logger.info("Extracting texts, inserts, and lines")
        raw_texts = self.parser.extract_texts(ents)
        objects = self.parser.extract_inserts(ents)
        lines = self.parser.extract_lines(ents)
        logger.info(
            "Got %d texts, %d objects, %d lines",
            len(raw_texts),
            len(objects),
            len(lines),
        )

        write_json(Path("texts.json"), raw_texts)
        write_json(Path("objects.json"), objects)
        write_json(Path("lines.json"), lines)

        # recalc line/chain tolerances from geometry
        lengths = [distance(l["start"], l["end"]) for l in lines]
        if lengths:
            self.line_tol = min(lengths)
            self.chain_tol = max(lengths)
        logger.info("Auto line_tol=%.3f, chain_tol=%.3f", self.line_tol, self.chain_tol)

        # compute clustering tolerances from text distribution
        y_vals = [t["position"]["y"] for t in raw_texts]
        if len(y_vals) > 1:
            ys_sorted = sorted(y_vals)
            deltas = [
                ys_sorted[i + 1] - ys_sorted[i] for i in range(len(ys_sorted) - 1)
            ]
            med_delta = statistics.median(deltas)
            cluster_y_tol = med_delta * 0.6  # half a typical line‐spacing
            x_gap = med_delta * 2.0  # break at twice that spacing
        else:
            cluster_y_tol = self.line_tol
            x_gap = self.chain_tol
        logger.info("Computed cluster_y_tol=%.3f, x_gap=%.3f", cluster_y_tol, x_gap)

        texts = self._cluster_texts(raw_texts, y_tol=cluster_y_tol, x_gap=x_gap)
        write_json(Path("clustered-texts.json"), texts)

        # optimize max_tol (minimize nulls & overlaps)
        best_mt = find_best_max_tol(
            raw_texts, objects, max_tol_bound=max(lengths) if lengths else 500.0
        )
        self.max_tol = best_mt
        logger.info("Optimized max_tol=%.3f", self.max_tol)

        # build, dedupe, group
        relations = RelationBuilder(
            texts, objects, lines, self.line_tol, self.chain_tol, self.max_tol
        ).build()
        relations = remove_duplicates(relations, texts, objects)
        write_json(Path("relations.json"), relations)
        notes = self._group(relations, objects)
        logger.info("Grouped into %d objects with notes", len(notes))
        write_json(Path("objects-with-notes.json"), notes)

    def _group(
        self, notes: List[Dict[str, Any]], objects: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        by_obj: Dict[Any, Dict[str, Any]] = {}
        for r in notes:
            key = r["objectId"]
            obj = next((o for o in objects if o["id"] == key), None)
            by_obj.setdefault(key, {"object": obj, "notes": []})["notes"].append(
                r["note"]
            )
        return list(by_obj.values())
