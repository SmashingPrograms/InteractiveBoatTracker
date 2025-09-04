# backend/tests/test_models/test_boat_listing.py
import pytest
from sqlalchemy.orm import Session
from app.models.boat_listing import BoatListing
from app.models.boat_position import BoatPosition
from app.models.map import Map

def test_create_boat_listing(db: Session):
    """Test creating a boat listing"""
    boat = BoatListing(
        index=1,
        name="Test Boat",
        customer_name="John Doe",
        size="30 ft",
        make_model="Sea Ray Sundancer",
        vehicle_type="boat",
        section="A",
        notes="Test notes"
    )
    db.add(boat)
    db.commit()
    db.refresh(boat)
    
    assert boat.id is not None
    assert boat.index == 1
    assert boat.name == "Test Boat"
    assert boat.is_mapped == False

def test_boat_listing_unique_index(db: Session):
    """Test that boat index must be unique"""
    boat1 = BoatListing(index=1, customer_name="John Doe")
    boat2 = BoatListing(index=1, customer_name="Jane Doe")
    
    db.add(boat1)
    db.commit()
    
    db.add(boat2)
    with pytest.raises(Exception):  # Should raise IntegrityError
        db.commit()

def test_boat_position_relationship(db: Session):
    """Test boat listing to position relationship"""
    # Create map first
    map_obj = Map(name="Test Map", image_path="test.jpg")
    db.add(map_obj)
    db.commit()
    
    # Create position
    position = BoatPosition(map_id=map_obj.id, x=100, y=200)
    db.add(position)
    db.commit()
    
    # Create boat and link to position
    boat = BoatListing(
        index=1,
        customer_name="John Doe",
        position_id=position.id,
        is_mapped=True
    )
    db.add(boat)
    db.commit()
    db.refresh(boat)
    
    assert boat.position is not None
    assert boat.position.id == position.id
    assert boat.is_mapped == True

