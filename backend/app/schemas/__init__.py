# backend/app/schemas/__init__.py
from .user import UserCreate, UserUpdate, UserResponse, Token
from .map import MapCreate, MapUpdate, MapResponse
from .boat_listing import BoatListingCreate, BoatListingUpdate, BoatListingResponse
from .boat_position import BoatPositionCreate, BoatPositionUpdate, BoatPositionResponse

__all__ = [
    "UserCreate", "UserUpdate", "UserResponse", "Token",
    "MapCreate", "MapUpdate", "MapResponse", 
    "BoatListingCreate", "BoatListingUpdate", "BoatListingResponse",
    "BoatPositionCreate", "BoatPositionUpdate", "BoatPositionResponse"
]

