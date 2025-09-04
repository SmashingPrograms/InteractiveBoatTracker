# backend/app/models/map.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..core.database import Base

class Map(Base):
    __tablename__ = "maps"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    description = Column(Text)
    image_path = Column(String(255), nullable=False)
    image_width = Column(Integer, nullable=False, default=794)
    image_height = Column(Integer, nullable=False, default=1123)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    boat_positions = relationship("BoatPosition", back_populates="map", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Map(name='{self.name}', active={self.is_active})>"

