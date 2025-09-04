# backend/app/models/boat_position.py
from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..core.database import Base

class BoatPosition(Base):
    __tablename__ = "boat_positions"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Map relationship
    map_id = Column(Integer, ForeignKey("maps.id"), nullable=False, index=True)
    
    # Canvas coordinates and dimensions
    x = Column(Float, nullable=False, default=200.0)
    y = Column(Float, nullable=False, default=200.0)
    width = Column(Float, nullable=False, default=100.0)
    height = Column(Float, nullable=False, default=50.0)
    rotation = Column(Float, nullable=False, default=0.0)  # in degrees
    
    # Visual properties
    color = Column(String(50), nullable=False, default="blue")
    stroke_color = Column(String(50), nullable=False, default="black")
    stroke_width = Column(Float, nullable=False, default=1.0)
    
    # Metadata
    is_visible = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    map = relationship("Map", back_populates="boat_positions")
    boat_listing = relationship("BoatListing", back_populates="position", uselist=False)
    
    def __repr__(self):
        return f"<BoatPosition(id={self.id}, x={self.x}, y={self.y}, map_id={self.map_id})>"

