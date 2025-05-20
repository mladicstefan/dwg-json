from typing import Union, Dict, Any, List
from math import hypot

Position = Dict[str, float]
PointLike = Union[Position, List[Any]]


def distance(a: Any, b: Any) -> float:
    return hypot(a["x"] - b["x"], a["y"] - b["y"])
