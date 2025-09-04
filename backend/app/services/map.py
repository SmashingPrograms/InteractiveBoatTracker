# backend/app/services/map.py
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import and_
from ..models.map import Map
from ..models.boat_position import BoatPosition
from ..schemas.map import MapCreate, MapUpdate
from ..core.exceptions import NotFoundError, ValidationError

class MapService:
    """Service layer for map management"""
    
    @staticmethod
    def get_map_by_id(db: Session, map_id: int) -> Optional[Map]:
        """Get map by ID"""
        return db.query(Map).filter(Map.id == map_id).first()
    
    @staticmethod
    def get_maps(
        db: Session, 
        skip: int = 0, 
        limit: int = 100, 
        active_only: bool = True
    ) -> List[Map]:
        """Get all maps with pagination"""
        query = db.query(Map)
        if active_only:
            query = query.filter(Map.is_active == True)
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def create_map(db: Session, map_create: MapCreate) -> Map:
        """Create new map"""
        # Validate unique name for active maps
        existing_map = db.query(Map).filter(
            and_(Map.name == map_create.name, Map.is_active == True)
        ).first()
        if existing_map:
            raise ValidationError("Active map with this name already exists")
        
        db_map = Map(**map_create.dict())
        db.add(db_map)
        db.commit()
        db.refresh(db_map)
        return db_map
    
    @staticmethod
    def update_map(db: Session, map_id: int, map_update: MapUpdate) -> Map:
        """Update existing map"""
        db_map = MapService.get_map_by_id(db, map_id)
        if not db_map:
            raise NotFoundError("Map not found")
        
        # Validate unique name if being updated
        if map_update.name and map_update.name != db_map.name:
            existing_map = db.query(Map).filter(
                and_(Map.name == map_update.name, Map.is_active == True, Map.id != map_id)
            ).first()
            if existing_map:
                raise ValidationError("Active map with this name already exists")
        
        update_data = map_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_map, field, value)
        
        db.commit()
        db.refresh(db_map)
        return db_map
    
    @staticmethod
    def delete_map(db: Session, map_id: int) -> bool:
        """Soft delete map (set inactive)"""
        db_map = MapService.get_map_by_id(db, map_id)
        if not db_map:
            raise NotFoundError("Map not found")
        
        # Check if map has boat positions
        position_count = db.query(BoatPosition).filter(BoatPosition.map_id == map_id).count()
        if position_count > 0:
            # Soft delete - set inactive
            db_map.is_active = False
            db.commit()
        else:
            # Hard delete if no positions
            db.delete(db_map)
            db.commit()
        
        return True
    
    @staticmethod
    def get_map_boat_count(db: Session, map_id: int) -> int:
        """Get count of boat positions on map"""
        return db.query(BoatPosition).filter(
            BoatPosition.map_id == map_id
        ).count()

