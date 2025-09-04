# backend/app/schemas/boat_position.py
from pydantic import BaseModel, Field, validator
from typing import Optional, TYPE_CHECKING
from datetime import datetime

# Use TYPE_CHECKING to avoid circular imports
if TYPE_CHECKING:
    from .boat_listing import BoatListingResponse
    from .map import MapResponse

class BoatPositionBase(BaseModel):
    x: float = Field(default=200.0, ge=0)
    y: float = Field(default=200.0, ge=0)
    width: float = Field(default=100.0, gt=0)
    height: float = Field(default=50.0, gt=0)
    rotation: float = Field(default=0.0, ge=-360, le=360)
    color: str = Field(default="blue", max_length=50)
    stroke_color: str = Field(default="black", max_length=50)
    stroke_width: float = Field(default=1.0, gt=0)
    is_visible: bool = True

class BoatPositionCreate(BoatPositionBase):
    map_id: int = Field(..., gt=0)
    
    @validator('color', 'stroke_color')
    def validate_colors(cls, v):
        valid_colors = [
            'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink',
            'brown', 'gray', 'black', 'white', 'navy', 'teal', 'lime',
            'maroon', 'olive', 'silver', 'aqua', 'fuchsia'
        ]
        if v.lower() not in valid_colors:
            raise ValueError(f'Color must be one of: {", ".join(valid_colors)}')
        return v.lower()

class BoatPositionUpdate(BaseModel):
    x: Optional[float] = Field(None, ge=0)
    y: Optional[float] = Field(None, ge=0)
    width: Optional[float] = Field(None, gt=0)
    height: Optional[float] = Field(None, gt=0)
    rotation: Optional[float] = Field(None, ge=-360, le=360)
    color: Optional[str] = Field(None, max_length=50)
    stroke_color: Optional[str] = Field(None, max_length=50)
    stroke_width: Optional[float] = Field(None, gt=0)
    is_visible: Optional[bool] = None

class BoatPositionResponse(BoatPositionBase):
    id: int
    map_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True