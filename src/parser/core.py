from pathlib import Path
from typing import List, Dict
from .entities import DXFParser
from .relations import RelationBuilder
from utils.file_io import write_json


class ParserService:
    def __init__(self, path: str, line_tol: float, chain_tol: float, max_tol: float):
        self.parser = DXFParser(path)
        self.tols = (line_tol, chain_tol, max_tol)

    def run(self) -> None:
        entities = self.parser.gather_entities()
        texts = self.parser.extract_texts(entities)
        objects = self.parser.extract_inserts(entities)
        lines = self.parser.extract_lines(entities)
        write_json(Path("texts.json"), texts)
        write_json(Path("objects.json"), objects)
        write_json(Path("lines.json"), lines)
        relations = RelationBuilder(texts, objects, lines, *self.tols).build()
        write_json(Path("relations.json"), relations)
        notes = self._group(notes=relations, objects=objects)
        write_json(Path("objects-with-notes.json"), notes)

    def _group(self, notes: List[Dict], objects: List[Dict]) -> List[Dict]:
        by_obj = {}
        for r in notes:
            key = r["objectId"]
            obj = next((o for o in objects if o["id"] == key), None)
            by_obj.setdefault(key, {"object": obj, "notes": []})["notes"].append(
                r["note"]
            )
        return list(by_obj.values())
