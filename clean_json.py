#!/usr/bin/env python3
"""
cleanjson.py

Reads objects-with-notes.json and:
  1) Normalizes note text (removes DXF formatting, splits multi-lines)
  2) Flattens into records of (object_id, raw_note, clean_note)
  3) Builds a BOM summary of unique clean notes with quantities
Produces:
  cleaned.json  (records + bom)
  bom.csv       (description,quantity)
"""

import json
import re
import csv
from collections import Counter


def normalize_note(note):
    # split on DXF newline
    parts = re.split(r"\\P|\n", note)
    cleaned_parts = []
    for p in parts:
        p = re.sub(r"\\f[^;]+;", "", p)
        p = re.sub(r"\\[A-Za-z]+", "", p)
        text = p.strip()

        if text:
            cleaned_parts.append(text)
    return " | ".join(cleaned_parts)


def main():
    data = json.load(open("objects-with-notes.json"))
    records = []
    for entry in data:
        obj = entry.get("object")
        obj_id = obj.get("id") if obj else None
        for note in entry.get("notes", []):
            clean = normalize_note(note)
            if clean:
                records.append(
                    {"object_id": obj_id, "note_raw": note, "note_clean": clean}
                )

    counter = Counter(r["note_clean"] for r in records)
    bom = [
        {"description": desc, "quantity": qty} for desc, qty in counter.most_common()
    ]

    out = {"records": records, "bom": bom}
    with open("cleaned.json", "w") as f:
        json.dump(out, f, indent=2)
    # write CSV
    with open("bom.csv", "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["description", "quantity"])
        writer.writeheader()
        for item in bom:
            writer.writerow(item)


if __name__ == "__main__":
    main()
