from ezdxf.filemanagement import readfile
from typing import Any, Dict, List
import math

Entity = Dict[str, Any]


class DXFParser:
    def __init__(self, path: str):
        self.doc = readfile(path)
        self.layouts = list(self.doc.layouts)

    def gather_entities(self) -> List[Any]:
        return [e for layout in self.layouts for e in layout]

    def extract_texts(self, entities: List[Any]) -> List[Entity]:
        result: List[Entity] = []
        for e in entities:
            t = e.dxftype()
            if t not in ("TEXT", "MTEXT"):
                continue
            raw = getattr(e, "text", "")
            clean = " ".join(raw.replace("\n", " ").split())
            x, y, *_ = e.dxf.insert
            result.append(
                {"id": e.dxf.handle, "position": {"x": x, "y": y}, "text": clean}
            )
        return result

    def extract_inserts(self, entities: List[Any]) -> List[Entity]:
        inserts: List[Entity] = []
        for e in entities:
            if e.dxftype() != "INSERT":
                continue
            x, y, *_ = e.dxf.insert
            attrs: Dict[str, str] = {}
            for att in getattr(e, "attribs", []):
                raw = getattr(att.dxf, "text", "")
                clean = " ".join(raw.replace("\n", " ").split())
                attrs[att.dxf.tag] = clean
            bbox = self._compute_bbox(e, x, y)
            inserts.append(
                {
                    "id": e.dxf.handle,
                    "block": e.dxf.name,
                    "position": {"x": x, "y": y},
                    "attrs": attrs,
                    "bbox": bbox,
                }
            )
        return inserts

    def extract_lines(self, entities: List[Any]) -> List[Entity]:
        lines: List[Entity] = []
        for e in entities:
            t = e.dxftype()
            if t == "LINE":
                sx, sy, *_ = e.dxf.start
                ex, ey, *_ = e.dxf.end
                lines.append(
                    {
                        "id": e.dxf.handle,
                        "start": {"x": sx, "y": sy},
                        "end": {"x": ex, "y": ey},
                    }
                )
            elif t == "LWPOLYLINE":
                pts = list(getattr(e, "get_points", lambda *args: [])("xy"))
                for (x1, y1), (x2, y2) in zip(pts, pts[1:]):
                    lines.append(
                        {
                            "id": e.dxf.handle,
                            "start": {"x": x1, "y": y1},
                            "end": {"x": x2, "y": y2},
                        }
                    )
            elif t == "CIRCLE":
                cx, cy, *_ = e.dxf.center
                r = e.dxf.radius
                lines.append(
                    {
                        "id": e.dxf.handle,
                        "start": {"x": cx - r, "y": cy},
                        "end": {"x": cx + r, "y": cy},
                    }
                )
        return lines

    def _compute_bbox(self, insert: Any, ix: float, iy: float) -> Dict[str, float]:
        minx, miny, maxx, maxy = (
            float("inf"),
            float("inf"),
            float("-inf"),
            float("-inf"),
        )
        block = self.doc.blocks.get(insert.dxf.name)
        for e in block or []:
            t = e.dxftype()
            if t == "LINE":
                pts = [e.dxf.start, e.dxf.end]
            elif t == "LWPOLYLINE":
                pts = list(getattr(e, "get_points", lambda *args: [])("xy"))
            elif t == "CIRCLE":
                cx, cy, *_ = e.dxf.center
                r = e.dxf.radius
                pts = [(cx - r, cy - r), (cx + r, cy + r)]
            else:
                continue
            for pt in pts:
                x, y, *_ = pt
                if x < minx:
                    minx = x
                if y < miny:
                    miny = y
                if x > maxx:
                    maxx = x
                if y > maxy:
                    maxy = y
        if not all(map(math.isfinite, (minx, miny, maxx, maxy))):
            return {"minx": ix, "miny": iy, "maxx": ix, "maxy": iy}
        return {
            "minx": minx + ix,
            "miny": miny + iy,
            "maxx": maxx + ix,
            "maxy": maxy + iy,
        }
