# backend/app/api/v1/boats.py
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...schemas.boat_listing import BoatListingCreate, BoatListingUpdate, BoatListingResponse
from ...services.boat import BoatService
from ..deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[BoatListingResponse])
def read_boats(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    search: Optional[str] = Query(None),
    mapped_only: Optional[bool] = Query(None),
    section: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user)
) -> Any:
    """Retrieve boats with filtering and pagination"""
    boats = BoatService.get_boats(
        db, 
        skip=skip, 
        limit=limit, 
        search=search, 
        mapped_only=mapped_only,
        section=section
    )
    return boats

@router.post("/", response_model=BoatListingResponse)
def create_boat(
    boat_in: BoatListingCreate,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user)
) -> Any:
    """Create new boat listing"""
    boat = BoatService.create_boat(db, boat_in)
    return boat

@router.get("/{boat_id}", response_model=BoatListingResponse)
def read_boat(
    boat_id: int,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user)
) -> Any:
    """Get boat by ID"""
    boat = BoatService.get_boat_by_id(db, boat_id)
    if boat is None:
        raise HTTPException(status_code=404, detail="Boat not found")
    return boat

@router.get("/index/{index}", response_model=BoatListingResponse)
def read_boat_by_index(
    index: int,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user)
) -> Any:
    """Get boat by index"""
    boat = BoatService.get_boat_by_index(db, index)
    if boat is None:
        raise HTTPException(status_code=404, detail="Boat not found")
    return boat

@router.put("/{boat_id}", response_model=BoatListingResponse)
def update_boat(
    boat_id: int,
    boat_update: BoatListingUpdate,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user)
) -> Any:
    """Update boat listing"""
    boat = BoatService.update_boat(db, boat_id, boat_update)
    return boat

@router.delete("/{boat_id}")
def delete_boat(
    boat_id: int,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user)
) -> Any:
    """Delete boat listing"""
    BoatService.delete_boat(db, boat_id)
    return {"message": "Boat deleted successfully"}

@router.post("/{boat_id}/assign/{position_id}", response_model=BoatListingResponse)
def assign_boat_to_position(
    boat_id: int,
    position_id: int,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user)
) -> Any:
    """Assign boat to position on map"""
    boat = BoatService.assign_boat_to_position(db, boat_id, position_id)
    return boat

@router.post("/{boat_id}/unassign", response_model=BoatListingResponse)
def unassign_boat_from_position(
    boat_id: int,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user)
) -> Any:
    """Unassign boat from its current position"""
    boat = BoatService.unassign_boat_from_position(db, boat_id)
    return boat

