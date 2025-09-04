# backend/app/schemas/boat_listing.py
from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime

class BoatListingBase(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    customer_name: str = Field(..., min_length=1, max_length=100)
    size: Optional[str] = Field(None, max_length=50)
    make_model: Optional[str] = Field(None, max_length=100)
    vehicle_type: Optional[str] = Field(None, max_length=50)
    section: Optional[str] = Field(None, max_length=10)
    notes: Optional[str] = None

class BoatListingCreate(BoatListingBase):
    index: int = Field(..., gt=0)
    
    @validator('index')
    def validate_index(cls, v):
        if v <= 0:
            raise ValueError('Index must be a positive integer')
        return v
    
    @validator('section')
    def validate_section(cls, v):
        if v is not None:
            allowed_sections = ['A', 'B', 'C', 'D', 'E', 'F']
            if v.upper() not in allowed_sections:
                raise ValueError(f'Section must be one of: {", ".join(allowed_sections)}')
            return v.upper()
        return v

class BoatListingUpdate(BaseModel):
    index: Optional[int] = Field(None, gt=0)
    name: Optional[str] = Field(None, max_length=100)
    customer_name: Optional[str] = Field(None, min_length=1, max_length=100)
    size: Optional[str] = Field(None, max_length=50)
    make_model: Optional[str] = Field(None, max_length=100)
    vehicle_type: Optional[str] = Field(None, max_length=50)
    section: Optional[str] = Field(None, max_length=10)
    notes: Optional[str] = None
    
    @validator('section')
    def validate_section(cls, v):
        if v is not None:
            allowed_sections = ['A', 'B', 'C', 'D', 'E', 'F']
            if v.upper() not in allowed_sections:
                raise ValueError(f'Section must be one of: {", ".join(allowed_sections)}')
            return v.upper()
        return v

class BoatListingResponse(BoatListingBase):
    id: int
    index: int
    is_mapped: bool
    position_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

