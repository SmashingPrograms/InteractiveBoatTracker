# backend/tests/test_services/test_boat_service.py
import pytest
from sqlalchemy.orm import Session
from app.services.boat import BoatService
from app.schemas.boat_listing import BoatListingCreate, BoatListingUpdate
from app.schemas.boat_position import BoatPositionCreate
from app.models.map import Map
from app.core.exceptions import NotFoundError, DuplicateError, ValidationError

def test_create_boat_service(db: Session):
    """Test creating boat via service"""
    boat_create = BoatListingCreate(
        index=1,
        customer_name="John Doe",
        size="30 ft"
    )
    boat = BoatService.create_boat(db, boat_create)
    
    assert boat.id is not None
    assert boat.index == 1
    assert boat.customer_name == "John Doe"

def test_create_duplicate_boat_service(db: Session):
    """Test creating duplicate boat raises error"""
    boat_create = BoatListingCreate(index=1, customer_name="John Doe")
    
    BoatService.create_boat(db, boat_create)
    
    with pytest.raises(DuplicateError):
        BoatService.create_boat(db, boat_create)

def test_get_boats_with_search(db: Session):
    """Test getting boats with search filter"""
    # Create test boats
    boat1 = BoatListingCreate(
        index=1,
        customer_name="John Smith",
        make_model="Sea Ray"
    )
    boat2 = BoatListingCreate(
        index=2,
        customer_name="Jane Doe",
        make_model="Boston Whaler"
    )
    
    BoatService.create_boat(db, boat1)
    BoatService.create_boat(db, boat2)
    
    # Search by customer name
    results = BoatService.get_boats(db, search="John")
    assert len(results) == 1
    assert results[0].customer_name == "John Smith"
    
    # Search by make/model
    results = BoatService.get_boats(db, search="Boston")
    assert len(results) == 1
    assert results[0].make_model == "Boston Whaler"

def test_assign_boat_to_position(db: Session):
    """Test assigning boat to position"""
    # Create map
    map_obj = Map(name="Test Map", image_path="test.jpg")
    db.add(map_obj)
    db.commit()
    
    # Create boat
    boat_create = BoatListingCreate(index=1, customer_name="John Doe")
    boat = BoatService.create_boat(db, boat_create)
    
    # Create position
    position_create = BoatPositionCreate(map_id=map_obj.id, x=100, y=200)
    position = BoatService.create_position(db, position_create)
    
    # Assign boat to position
    updated_boat = BoatService.assign_boat_to_position(db, boat.id, position.id)
    
    assert updated_boat.is_mapped == True
    assert updated_boat.position_id == position.id

def test_assign_boat_to_occupied_position(db: Session):
    """Test assigning boat to already occupied position fails"""
    # Create map
    map_obj = Map(name="Test Map", image_path="test.jpg")
    db.add(map_obj)
    db.commit()
    
    # Create two boats
    boat1 = BoatService.create_boat(db, BoatListingCreate(index=1, customer_name="John Doe"))
    boat2 = BoatService.create_boat(db, BoatListingCreate(index=2, customer_name="Jane Doe"))
    
    # Create position
    position = BoatService.create_position(db, BoatPositionCreate(map_id=map_obj.id))
    
    # Assign first boat
    BoatService.assign_boat_to_position(db, boat1.id, position.id)
    
    # Try to assign second boat to same position
    with pytest.raises(ValidationError):
        BoatService.assign_boat_to_position(db, boat2.id, position.id)

