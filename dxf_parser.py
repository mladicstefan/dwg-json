#!/usr/bin/env python3
"""

Usage:
    python dxf_parser <file.dxf> [lineTol] [chainTol] [maxTol]

Produces:
    texts.json
    objects.json
    lines.json
    relations.json
    objects-with-notes.json
"""

import sys
import math
import json
import argparse
from collections import deque
import ezdxf


def dist(a, b):
    return math.hypot(a["x"] - b["x"], a["y"] - b["y"])


def main():
    parser = argparse.ArgumentParser(
        description="Extract text–object relations from a DXF file"
    )
    parser.add_argument("dxf_file", help="Input DXF filename")
    parser.add_argument(
        "lineTol",
        nargs="?",
        type=float,
        default=1.0,
        help="tolerance for direct bbox hits",
    )
    parser.add_argument(
        "chainTol",
        nargs="?",
        type=float,
        default=1.0,
        help="tolerance for following line segments",
    )
    parser.add_argument(
        "maxTol",
        nargs="?",
        type=float,
        default=500.0,
        help="maximum tolerance for direct hits",
    )
    args = parser.parse_args()

    try:
        doc = ezdxf.readfile(args.dxf_file)
    except IOError as e:
        print(f'Failed to read "{args.dxf_file}": {e}', file=sys.stderr)
        sys.exit(1)
    except ezdxf.DXFStructureError as e:
        print(f"DXF parse error: {e}", file=sys.stderr)
        sys.exit(1)

    # Gather all entities
    layouts = [doc.modelspace()]
    try:
        layouts = list(doc.layouts)
    except AttributeError:
        for name in doc.paperspace_names():
            layouts.append(doc.paperspace(name))

    entities = []
    for layout in layouts:
        entities.extend(layout)

    # TEXT + MTEXT → texts.json
    texts = []
    for e in entities:
        if e.dxftype() in ("TEXT", "MTEXT"):
            x, y, *_ = e.dxf.insert
            raw = getattr(e, "text", "")
            txt = raw.replace("\n", " ").strip()
            texts.append(
                {
                    "id": e.dxf.handle,
                    "position": {"x": x, "y": y},
                    "text": " ".join(txt.split()),
                }
            )

    # INSERT → objects.json
    inserts = []
    for e in entities:
        if e.dxftype() != "INSERT":
            continue
        ix, iy, *_ = e.dxf.insert
        attrs = {}
        for attrib in e.attribs:
            tag = attrib.dxf.tag
            val = attrib.dxf.text.replace("\n", " ")
            attrs[tag] = " ".join(val.split())
        blk = doc.blocks.get(e.dxf.name)
        minx = miny = math.inf
        maxx = maxy = -math.inf
        if blk is not None:
            for be in blk:
                btype = be.dxftype()
                if btype == "LINE":
                    sx, sy, *_ = be.dxf.start
                    ex, ey, *_ = be.dxf.end
                    for x, y in ((sx, sy), (ex, ey)):
                        minx = min(minx, x)
                        miny = min(miny, y)
                        maxx = max(maxx, x)
                        maxy = max(maxy, y)
                elif btype == "LWPOLYLINE":
                    for x, y in be.get_points("xy"):
                        minx = min(minx, x)
                        miny = min(miny, y)
                        maxx = max(maxx, x)
                        maxy = max(maxy, y)
                elif btype == "CIRCLE":
                    cx, cy, *_ = be.dxf.center
                    r = be.dxf.radius
                    minx = min(minx, cx - r)
                    miny = min(miny, cy - r)
                    maxx = max(maxx, cx + r)
                    maxy = max(maxy, cy + r)
        if not math.isfinite(minx):
            bbox = {"minx": ix, "miny": iy, "maxx": ix, "maxy": iy}
        else:
            bbox = {
                "minx": minx + ix,
                "miny": miny + iy,
                "maxx": maxx + ix,
                "maxy": maxy + iy,
            }
        inserts.append(
            {
                "id": e.dxf.handle,
                "block": e.dxf.name,
                "position": {"x": ix, "y": iy},
                "attrs": attrs,
                "bbox": bbox,
            }
        )

    # LINE + LWPOLYLINE → lines.json
    lines = []
    for e in entities:
        et = e.dxftype()
        if et == "LINE":
            sx, sy, *_ = e.dxf.start
            ex, ey, *_ = e.dxf.end
            lines.append(
                {
                    "id": e.dxf.handle or f"L_{len(lines)}",
                    "start": {"x": sx, "y": sy},
                    "end": {"x": ex, "y": ey},
                }
            )
        elif et == "LWPOLYLINE":
            pts = list(e.get_points("xy"))
            for i in range(len(pts) - 1):
                x1, y1 = pts[i]
                x2, y2 = pts[i + 1]
                lines.append(
                    {
                        "id": f"{e.dxf.handle or 'PL'}_{i}",
                        "start": {"x": x1, "y": y1},
                        "end": {"x": x2, "y": y2},
                    }
                )

    print(
        f"⚙️  Found {len(texts)} texts, {len(inserts)} objects, {len(lines)} line-segments"
    )

    with open("texts.json", "w") as f:
        json.dump(texts, f, indent=2)
    with open("objects.json", "w") as f:
        json.dump(inserts, f, indent=2)
    with open("lines.json", "w") as f:
        json.dump(lines, f, indent=2)

    # Build relations.json using lineTol and chainTol
    relations = []
    for txt in texts:
        tol = args.lineTol
        found = None
        path = []
        while not found and tol <= args.maxTol:
            # direct bbox hit
            hits = [
                o
                for o in inserts
                if (
                    txt["position"]["x"] >= o["bbox"]["minx"] - tol
                    and txt["position"]["x"] <= o["bbox"]["maxx"] + tol
                    and txt["position"]["y"] >= o["bbox"]["miny"] - tol
                    and txt["position"]["y"] <= o["bbox"]["maxy"] + tol
                )
            ]
            if hits:
                hits.sort(
                    key=lambda o: (o["bbox"]["maxx"] - o["bbox"]["minx"])
                    * (o["bbox"]["maxy"] - o["bbox"]["miny"])
                )
                found = hits[0]
                break
            # BFS along lines
            visited = set()
            queue = deque([{"pos": txt["position"], "path": []}])
            while queue and not found:
                cur = queue.popleft()
                px, py = cur["pos"]["x"], cur["pos"]["y"]
                # check bbox hit at this node
                for o in inserts:
                    if (
                        px >= o["bbox"]["minx"] - tol
                        and px <= o["bbox"]["maxx"] + tol
                        and py >= o["bbox"]["miny"] - tol
                        and py <= o["bbox"]["maxy"] + tol
                    ):
                        found = o
                        path = cur["path"]
                        break
                if found:
                    break
                # follow lines with chainTol
                for l in lines:
                    if l["id"] in visited:
                        continue
                    tch = args.chainTol if cur["path"] else args.lineTol
                    if dist(cur["pos"], l["start"]) <= tch:
                        visited.add(l["id"])
                        queue.append({"pos": l["end"], "path": cur["path"] + [l["id"]]})
                    elif dist(cur["pos"], l["end"]) <= tch:
                        visited.add(l["id"])
                        queue.append(
                            {"pos": l["start"], "path": cur["path"] + [l["id"]]}
                        )
            if not found:
                tol *= 2.0
        relations.append(
            {
                "textId": txt["id"],
                "objectId": found["id"] if found else None,
                "note": txt["text"],
                "linePath": path,
            }
        )

    with open("relations.json", "w") as f:
        json.dump(relations, f, indent=2)

    # Group by objectId (None for unpaired)
    by_obj = {}
    for r in relations:
        key = r["objectId"]
        if key not in by_obj:
            obj = next((o for o in inserts if o["id"] == key), None)
            by_obj[key] = {"object": obj, "notes": []}
        by_obj[key]["notes"].append(r["note"])

    objects_with_notes = list(by_obj.values())
    with open("objects-with-notes.json", "w") as f:
        json.dump(objects_with_notes, f, indent=2)

    print(
        "✅ Wrote texts.json, objects.json, lines.json, relations.json, objects-with-notes.json"
    )


if __name__ == "__main__":
    main()
