# backend/app/schemas/map.py
from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime

class MapBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    image_width: int = Field(default=794, gt=0)
    image_height: int = Field(default=1123, gt=0)
    is_active: bool = True

class MapCreate(MapBase):
    image_path: str = Field(..., min_length=1)
    
    @validator('image_path')
    def validate_image_path(cls, v):
        allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp']
        if not any(v.lower().endswith(ext) for ext in allowed_extensions):
            raise ValueError('Image must be a valid image file (.jpg, .jpeg, .png, .gif, .bmp)')
        return v

class MapUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    image_path: Optional[str] = None
    image_width: Optional[int] = Field(None, gt=0)
    image_height: Optional[int] = Field(None, gt=0)
    is_active: Optional[bool] = None

class MapResponse(MapBase):
    id: int
    image_path: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    boat_count: Optional[int] = 0  # Computed field
    
    class Config:
        from_attributes = True

