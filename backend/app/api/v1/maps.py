# backend/app/api/v1/maps.py
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...schemas.map import MapCreate, MapUpdate, MapResponse, MapWithBoats
from ...schemas.boat_listing import BoatWithPosition
from ...services.map import MapService
from ...services.boat import BoatService
from ..deps import get_current_user, get_current_admin_user

router = APIRouter()

@router.get("/", response_model=List[MapResponse])
def read_maps(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    active_only: bool = Query(True),
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user)
) -> Any:
    """Retrieve maps with pagination"""
    maps = MapService.get_maps(db, skip=skip, limit=limit, active_only=active_only)
    
    # Add boat count to each map
    for map_obj in maps:
        map_obj.boat_count = MapService.get_map_boat_count(db, map_obj.id)
    
    return maps

@router.post("/", response_model=MapResponse)
def create_map(
    map_in: MapCreate,
    db: Session = Depends(get_db),
    current_admin: Any = Depends(get_current_admin_user)
) -> Any:
    """Create new map (admin only)"""
    map_obj = MapService.create_map(db, map_in)
    map_obj.boat_count = 0
    return map_obj

@router.get("/{map_id}", response_model=MapWithBoats)
def read_map(
    map_id: int,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user)
) -> Any:
    """Get map with all boat positions"""
    map_obj = MapService.get_map_by_id(db, map_id)
    if map_obj is None:
        raise HTTPException(status_code=404, detail="Map not found")
    
    # Get all boats with positions for this map
    boats_with_positions = BoatService.get_boats_with_positions(db, map_id)
    
    # Format response
    boats = []
    for item in boats_with_positions:
        boat_with_pos = BoatWithPosition(
            boat=item["boat"] if item["boat"] else None,
            position=item["position"]
        )
        boats.append(boat_with_pos)
    
    map_obj.boat_count = len(boats)
    
    return MapWithBoats(
        map=map_obj,
        boats=boats
    )

@router.put("/{map_id}", response_model=MapResponse)
def update_map(
    map_id: int,
    map_update: MapUpdate,
    db: Session = Depends(get_db),
    current_admin: Any = Depends(get_current_admin_user)
) -> Any:
    """Update map (admin only)"""
    map_obj = MapService.update_map(db, map_id, map_update)
    map_obj.boat_count = MapService.get_map_boat_count(db, map_id)
    return map_obj

@router.delete("/{map_id}")
def delete_map(
    map_id: int,
    db: Session = Depends(get_db),
    current_admin: Any = Depends(get_current_admin_user)
) -> Any:
    """Delete map (admin only)"""
    MapService.delete_map(db, map_id)
    return {"message": "Map deleted successfully"}

