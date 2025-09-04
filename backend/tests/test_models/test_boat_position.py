# backend/tests/test_models/test_boat_position.py
import pytest
from sqlalchemy.orm import Session
from app.models.boat_position import BoatPosition
from app.models.map import Map

def test_create_boat_position(db: Session):
    """Test creating a boat position"""
    map_obj = Map(name="Test Map", image_path="test.jpg")
    db.add(map_obj)
    db.commit()
    
    position = BoatPosition(
        map_id=map_obj.id,
        x=100.5,
        y=200.5,
        width=150.0,
        height=75.0,
        rotation=45.0,
        color="blue"
    )
    db.add(position)
    db.commit()
    db.refresh(position)
    
    assert position.id is not None
    assert position.x == 100.5
    assert position.y == 200.5
    assert position.rotation == 45.0
    assert position.color == "blue"

def test_boat_position_defaults(db: Session):
    """Test default values for boat position"""
    map_obj = Map(name="Test Map", image_path="test.jpg")
    db.add(map_obj)
    db.commit()
    
    position = BoatPosition(map_id=map_obj.id)
    db.add(position)
    db.commit()
    db.refresh(position)
    
    assert position.x == 200.0
    assert position.y == 200.0
    assert position.width == 100.0
    assert position.height == 50.0
    assert position.rotation == 0.0
    assert position.color == "blue"

