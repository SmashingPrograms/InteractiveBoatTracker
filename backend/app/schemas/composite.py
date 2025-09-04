# backend/app/schemas/composite.py
from pydantic import BaseModel
from typing import Optional, List
from .boat_listing import BoatListingResponse
from .boat_position import BoatPositionResponse
from .map import MapResponse

class BoatWithPosition(BaseModel):
    """Boat listing with its position data"""
    boat: Optional[BoatListingResponse] = None
    position: BoatPositionResponse

class MapWithBoats(BaseModel):
    """Map with all its boat positions"""
    map: MapResponse
    boats: List[BoatWithPosition] = []