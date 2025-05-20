# src/parser/hybrid_bom.py
import json
import logging
import math
import os
from pathlib import Path
from typing import Any, Dict, List, Tuple
from openai import OpenAI
import certifi

os.environ["SSL_CERT_FILE"] = certifi.where()

logger = logging.getLogger(__name__)

verify_match_schema: Dict[str, Any] = {
    "name": "verify_match",
    "description": "Verify or correct which object a single note belongs to",
    "parameters": {
        "type": "object",
        "properties": {
            "objectId": {"type": ["string", "null"]},
            "note": {"type": "string"},
            "verified": {"type": "boolean"},
            "correction": {"type": ["string", "null"]},
        },
        "required": ["note", "verified"],
    },
}

match_note_schema: Dict[str, Any] = {
    "name": "match_note",
    "description": "Choose the correct object for a given note from candidates",
    "parameters": {
        "type": "object",
        "properties": {
            "objectId": {"type": ["string", "null"]},
            "verified": {"type": "boolean"},
            "correction": {"type": ["string", "null"]},
        },
        "required": ["verified"],
    },
}

parse_part_schema: Dict[str, Any] = {
    "name": "parse_part",
    "description": "Extract structured fields from a part description",
    "parameters": {
        "type": "object",
        "properties": {
            "part": {"type": "string"},
            "width_mm": {"type": "number"},
            "height_mm": {"type": "number"},
            "thickness_mm": {"type": "number"},
            "u_value": {"type": "number"},
            "color": {"type": "string"},
            "notes": {"type": "string"},
        },
        "required": ["part"],
    },
}


class HybridBomBuilder:
    def __init__(
        self,
        notes_json: Path = Path("objects-with-notes.json"),
        output_json: Path = Path("bom_ai.json"),
        batch_size: int = 20,
        top_n: int = 3,
    ):

        api_key = os.getenv("OPENAI_API_KEY", "")
        self.client = OpenAI(api_key=api_key)
        self.notes_json = notes_json
        self.output_json = output_json
        self.batch_size = batch_size
        self.top_n = top_n
        self.object_embeddings_path = Path("object_embeddings.json")
        self.objects_with_notes: List[Dict[str, Any]] = []
        self.object_embeddings: List[Tuple[str, List[float]]] = []

    def run(self) -> None:

        verified = self.first_pass_verify()
        unverified = [v for v in verified if not v["verified"]]
        if unverified:
            self.load_or_compute_embeddings()
            matched = self.second_pass_match(unverified)
        else:
            matched = []
        final = [v for v in verified if v["verified"]] + matched
        self.write_final(final)
        logger.info("Hybrid BOM complete: %d items", len(final))

    def first_pass_verify(self) -> List[Dict[str, Any]]:

        full_context = self.notes_json.read_text()
        notes = json.loads(full_context)

        total_notes = sum(len(e.get("notes", [])) for e in notes if isinstance(e, dict))
        logger.info("About to verify %d notes", total_notes)

        verified: List[Dict[str, Any]] = []
        for entry in notes:
            oid = (entry.get("object") or {}).get("id")
            for note in entry.get("notes", []):
                # call the function for this single note
                resp = self.client.chat.completions.create(
                    model="gpt-4.1-mini",
                    temperature=0.0,
                    messages=[
                        {
                            "role": "system",
                            "content": (
                                "You have the full objects-with-notes JSON loaded. "
                                "Now: for the note below, confirm whether it belongs to objectId "
                                f"{oid!r}. Return exactly one verify_match function call."
                            ),
                        },
                        {"role": "user", "content": note},
                    ],
                    functions=[verify_match_schema],  # type: ignore[arg-type]
                    function_call="auto",
                )
                fc = resp.choices[0].message.function_call
                if fc is None or not hasattr(fc, "arguments"):
                    raise RuntimeError("No function_call returned in first pass")
                args = json.loads(fc.arguments)

                args["objectId"] = args.get("objectId", oid)
                verified.append(args)

        logger.info(
            "Stage1: verified %d/%d notes",
            sum(1 for v in verified if v["verified"]),
            len(verified),
        )
        return verified

    def load_or_compute_embeddings(self) -> None:
        if self.object_embeddings_path.exists():
            cache = json.loads(self.object_embeddings_path.read_text())
            self.object_embeddings = [(o["id"], o["embedding"]) for o in cache]
            self.objects_with_notes = json.loads(self.notes_json.read_text())
            return

        data = json.loads(self.notes_json.read_text())
        contexts: List[str] = []
        ids: List[str] = []
        for entry in data:
            obj = entry.get("object")
            if obj and obj.get("id"):
                obj_id = obj["id"]
                ids.append(obj_id)
                ctx = (
                    f"ID: {obj_id}, attrs: {obj.get('attrs','')}, "
                    f"notes: {'; '.join(entry.get('notes', []))}"
                )
                contexts.append(ctx)

        emb_resp = self.client.embeddings.create(  # type: ignore[arg-type]
            model="text-embedding-3-small",
            input=contexts,
        )
        embeds = [d.embedding for d in emb_resp.data]  # type: ignore[attr-defined]
        self.object_embeddings = list(zip(ids, embeds))
        cache = [{"id": oid, "embedding": emb} for oid, emb in self.object_embeddings]
        self.object_embeddings_path.write_text(json.dumps(cache))
        self.objects_with_notes = data

    def second_pass_match(self, items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        results: List[Dict[str, Any]] = []
        for item in items:
            note = item["note"]
            emb_resp = self.client.embeddings.create(  # type: ignore[arg-type]
                model="text-embedding-3-small",
                input=[note],
            )
            note_emb = emb_resp.data[0].embedding  # type: ignore[attr-defined]
            sims = [
                (oid, self.cosine_similarity(note_emb, emb))
                for oid, emb in self.object_embeddings
            ]
            top = sorted(sims, key=lambda t: t[1], reverse=True)[: self.top_n]
            candidates = []
            for oid, _ in top:
                entry = next(
                    e
                    for e in self.objects_with_notes
                    if e.get("object", {}).get("id") == oid
                )
                candidates.append(
                    {
                        "objectId": oid,
                        "attrs": entry["object"].get("attrs", {}),
                        "notes": entry.get("notes", []),
                    }
                )
            content = json.dumps({"note": note, "candidates": candidates})
            resp = self.client.chat.completions.create(  # type: ignore[arg-type]
                model="gpt-4-turbo",
                temperature=0.0,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "Given these candidates and the note, return one "
                            "match_note function call with the correct objectId or none."
                        ),
                    },
                    {"role": "user", "content": content},
                ],
                functions=[match_note_schema],  # type: ignore[arg-type]
                function_call="auto",
            )
            fc = resp.choices[0].message.function_call
            if fc is None or not hasattr(fc, "arguments"):
                raise RuntimeError("No function_call returned in second pass")
            args = json.loads(fc.arguments)  # type: ignore[attr-defined]
            results.append({"note": note, **args})
        logger.info("Stage2: matched %d/%d notes", len(results), len(items))
        return results

    @staticmethod
    def cosine_similarity(a: List[float], b: List[float]) -> float:
        dot = sum(x * y for x, y in zip(a, b))
        norm_a = math.sqrt(sum(x * x for x in a))
        norm_b = math.sqrt(sum(y * y for y in b))
        return dot / (norm_a * norm_b) if norm_a and norm_b else 0.0

    def write_final(self, items: List[Dict[str, Any]]) -> None:
        self.output_json.write_text(json.dumps({"bom": items}, indent=2))
