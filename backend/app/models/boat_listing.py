# backend/app/models/boat_listing.py
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..core.database import Base

class BoatListing(Base):
    __tablename__ = "boat_listings"
    
    id = Column(Integer, primary_key=True, index=True)
    index = Column(Integer, unique=True, nullable=False, index=True)
    name = Column(String(100))
    customer_name = Column(String(100), nullable=False, index=True)
    size = Column(String(50))  # e.g., "35 ft"
    make_model = Column(String(100))
    vehicle_type = Column(String(50))  # boat, trailer, jetski, etc.
    section = Column(String(10))  # A, B, C, D, E, F
    notes = Column(Text)
    is_mapped = Column(Boolean, default=False, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign key to boat position (nullable for unmapped boats)
    position_id = Column(Integer, ForeignKey("boat_positions.id"), nullable=True, unique=True)
    
    # Relationships
    position = relationship("BoatPosition", back_populates="boat_listing", cascade="all, delete-orphan", single_parent=True)
    
    def __repr__(self):
        return f"<BoatListing(index={self.index}, name='{self.name}', customer='{self.customer_name}')>"

