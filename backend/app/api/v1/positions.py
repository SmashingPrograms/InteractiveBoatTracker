# backend/app/api/v1/positions.py
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...schemas.boat_position import BoatPositionCreate, BoatPositionUpdate, BoatPositionResponse
from ...services.boat import BoatService
from ..deps import get_current_user

router = APIRouter()

@router.get("/map/{map_id}", response_model=List[BoatPositionResponse])
def read_positions_by_map(
    map_id: int,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user)
) -> Any:
    """Get all boat positions for a specific map"""
    positions = BoatService.get_positions_by_map(db, map_id)
    return positions

@router.post("/", response_model=BoatPositionResponse)
def create_position(
    position_in: BoatPositionCreate,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user)
) -> Any:
    """Create new boat position"""
    position = BoatService.create_position(db, position_in)
    return position

@router.get("/{position_id}", response_model=BoatPositionResponse)
def read_position(
    position_id: int,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user)
) -> Any:
    """Get position by ID"""
    position = BoatService.get_position_by_id(db, position_id)
    if position is None:
        raise HTTPException(status_code=404, detail="Position not found")
    return position

@router.put("/{position_id}", response_model=BoatPositionResponse)
def update_position(
    position_id: int,
    position_update: BoatPositionUpdate,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user)
) -> Any:
    """Update boat position"""
    position = BoatService.update_position(db, position_id, position_update)
    return position

@router.delete("/{position_id}")
def delete_position(
    position_id: int,
    db: Session = Depends(get_db),
    current_user: Any = Depends(get_current_user)
) -> Any:
    """Delete boat position"""
    BoatService.delete_position(db, position_id)
    return {"message": "Position deleted successfully"}

