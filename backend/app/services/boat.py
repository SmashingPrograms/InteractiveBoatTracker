# backend/app/services/boat.py
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from ..models.boat_listing import BoatListing
from ..models.boat_position import BoatPosition
from ..schemas.boat_listing import BoatListingCreate, BoatListingUpdate
from ..schemas.boat_position import BoatPositionCreate, BoatPositionUpdate
from ..core.exceptions import NotFoundError, ValidationError, DuplicateError

class BoatService:
    """Service layer for boat management"""
    
    # Boat Listing methods
    @staticmethod
    def get_boat_by_id(db: Session, boat_id: int) -> Optional[BoatListing]:
        """Get boat listing by ID"""
        return db.query(BoatListing).filter(BoatListing.id == boat_id).first()
    
    @staticmethod
    def get_boat_by_index(db: Session, index: int) -> Optional[BoatListing]:
        """Get boat listing by index"""
        return db.query(BoatListing).filter(BoatListing.index == index).first()
    
    @staticmethod
    def get_boats(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        search: Optional[str] = None,
        mapped_only: Optional[bool] = None,
        section: Optional[str] = None
    ) -> List[BoatListing]:
        """Get boat listings with filters and pagination"""
        query = db.query(BoatListing)
        
        # Search filter
        if search:
            search_filter = or_(
                BoatListing.name.ilike(f"%{search}%"),
                BoatListing.customer_name.ilike(f"%{search}%"),
                BoatListing.make_model.ilike(f"%{search}%"),
                BoatListing.vehicle_type.ilike(f"%{search}%"),
                BoatListing.size.ilike(f"%{search}%"),
                BoatListing.notes.ilike(f"%{search}%")
            )
            query = query.filter(search_filter)
        
        # Mapped filter
        if mapped_only is not None:
            query = query.filter(BoatListing.is_mapped == mapped_only)
        
        # Section filter
        if section:
            query = query.filter(BoatListing.section == section.upper())
        
        return query.order_by(BoatListing.index).offset(skip).limit(limit).all()
    
    @staticmethod
    def create_boat(db: Session, boat_create: BoatListingCreate) -> BoatListing:
        """Create new boat listing"""
        # Check if index already exists
        if BoatService.get_boat_by_index(db, boat_create.index):
            raise DuplicateError(f"Boat with index {boat_create.index} already exists")
        
        db_boat = BoatListing(**boat_create.dict())
        db.add(db_boat)
        db.commit()
        db.refresh(db_boat)
        return db_boat
    
    @staticmethod
    def update_boat(db: Session, boat_id: int, boat_update: BoatListingUpdate) -> BoatListing:
        """Update existing boat listing"""
        db_boat = BoatService.get_boat_by_id(db, boat_id)
        if not db_boat:
            raise NotFoundError("Boat not found")
        
        # Check index uniqueness if being updated
        if boat_update.index and boat_update.index != db_boat.index:
            existing_boat = BoatService.get_boat_by_index(db, boat_update.index)
            if existing_boat:
                raise DuplicateError(f"Boat with index {boat_update.index} already exists")
        
        update_data = boat_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_boat, field, value)
        
        db.commit()
        db.refresh(db_boat)
        return db_boat
    
    @staticmethod
    def delete_boat(db: Session, boat_id: int) -> bool:
        """Delete boat listing and its position"""
        db_boat = BoatService.get_boat_by_id(db, boat_id)
        if not db_boat:
            raise NotFoundError("Boat not found")
        
        # Delete associated position first (cascade should handle this)
        if db_boat.position:
            db.delete(db_boat.position)
        
        db.delete(db_boat)
        db.commit()
        return True
    
    # Boat Position methods
    @staticmethod
    def get_position_by_id(db: Session, position_id: int) -> Optional[BoatPosition]:
        """Get boat position by ID"""
        return db.query(BoatPosition).filter(BoatPosition.id == position_id).first()
    
    @staticmethod
    def get_positions_by_map(db: Session, map_id: int) -> List[BoatPosition]:
        """Get all boat positions for a specific map"""
        return db.query(BoatPosition).filter(BoatPosition.map_id == map_id).all()
    
    @staticmethod
    def create_position(db: Session, position_create: BoatPositionCreate) -> BoatPosition:
        """Create new boat position"""
        db_position = BoatPosition(**position_create.dict())
        db.add(db_position)
        db.commit()
        db.refresh(db_position)
        return db_position
    
    @staticmethod
    def update_position(db: Session, position_id: int, position_update: BoatPositionUpdate) -> BoatPosition:
        """Update existing boat position"""
        db_position = BoatService.get_position_by_id(db, position_id)
        if not db_position:
            raise NotFoundError("Position not found")
        
        update_data = position_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_position, field, value)
        
        db.commit()
        db.refresh(db_position)
        return db_position
    
    @staticmethod
    def delete_position(db: Session, position_id: int) -> bool:
        """Delete boat position"""
        db_position = BoatService.get_position_by_id(db, position_id)
        if not db_position:
            raise NotFoundError("Position not found")
        
        # Update associated boat listing
        if db_position.boat_listing:
            db_position.boat_listing.is_mapped = False
            db_position.boat_listing.position_id = None
        
        db.delete(db_position)
        db.commit()
        return True
    
    @staticmethod
    def assign_boat_to_position(db: Session, boat_id: int, position_id: int) -> BoatListing:
        """Assign a boat listing to a position"""
        db_boat = BoatService.get_boat_by_id(db, boat_id)
        if not db_boat:
            raise NotFoundError("Boat not found")
        
        db_position = BoatService.get_position_by_id(db, position_id)
        if not db_position:
            raise NotFoundError("Position not found")
        
        # Check if position is already assigned
        if db_position.boat_listing:
            raise ValidationError("Position already assigned to another boat")
        
        # Unassign boat from previous position if any
        if db_boat.position:
            db_boat.position.boat_listing = None
        
        # Assign boat to new position
        db_boat.position_id = position_id
        db_boat.is_mapped = True
        
        db.commit()
        db.refresh(db_boat)
        return db_boat
    
    @staticmethod
    def unassign_boat_from_position(db: Session, boat_id: int) -> BoatListing:
        """Unassign a boat from its current position"""
        db_boat = BoatService.get_boat_by_id(db, boat_id)
        if not db_boat:
            raise NotFoundError("Boat not found")
        
        if not db_boat.position:
            raise ValidationError("Boat is not currently assigned to any position")
        
        db_boat.position_id = None
        db_boat.is_mapped = False
        
        db.commit()
        db.refresh(db_boat)
        return db_boat
    
    @staticmethod
    def get_boats_with_positions(db: Session, map_id: int) -> List[Dict[str, Any]]:
        """Get all boats with their positions for a specific map"""
        # Get all positions for the map
        positions = BoatService.get_positions_by_map(db, map_id)
        
        result = []
        for position in positions:
            boat_data = {
                "position": position,
                "boat": position.boat_listing if position.boat_listing else None
            }
            result.append(boat_data)
        
        return result