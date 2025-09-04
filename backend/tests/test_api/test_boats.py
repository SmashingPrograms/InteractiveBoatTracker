# backend/tests/test_api/test_boats.py
from fastapi.testclient import TestClient

def test_create_boat(client: TestClient, staff_headers):
    """Test creating a boat listing"""
    boat_data = {
        "index": 1,
        "name": "Test Boat",
        "customer_name": "John Doe",
        "size": "30 ft",
        "make_model": "Sea Ray Sundancer",
        "vehicle_type": "boat",
        "section": "A",
        "notes": "Test notes"
    }
    response = client.post(
        "/api/v1/boats/",
        json=boat_data,
        headers=staff_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["index"] == 1
    assert data["name"] == "Test Boat"
    assert data["is_mapped"] == False

def test_create_duplicate_index(client: TestClient, staff_headers):
    """Test creating boat with duplicate index fails"""
    boat_data = {
        "index": 1,
        "customer_name": "John Doe"
    }
    
    # Create first boat
    response = client.post("/api/v1/boats/", json=boat_data, headers=staff_headers)
    assert response.status_code == 200
    
    # Try to create duplicate
    response = client.post("/api/v1/boats/", json=boat_data, headers=staff_headers)
    assert response.status_code == 409

def test_get_boats(client: TestClient, staff_headers):
    """Test getting boat listings"""
    # Create test boats
    for i in range(5):
        boat_data = {
            "index": i + 1,
            "customer_name": f"Customer {i + 1}",
            "size": f"{20 + i * 5} ft"
        }
        client.post("/api/v1/boats/", json=boat_data, headers=staff_headers)
    
    response = client.get("/api/v1/boats/", headers=staff_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 5

def test_search_boats(client: TestClient, staff_headers):
    """Test searching boat listings"""
    # Create test boats
    boat1_data = {
        "index": 1,
        "customer_name": "John Smith",
        "make_model": "Sea Ray"
    }
    boat2_data = {
        "index": 2,
        "customer_name": "Jane Doe",
        "make_model": "Boston Whaler"
    }
    
    client.post("/api/v1/boats/", json=boat1_data, headers=staff_headers)
    client.post("/api/v1/boats/", json=boat2_data, headers=staff_headers)
    
    # Search by customer name
    response = client.get("/api/v1/boats/?search=John", headers=staff_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["customer_name"] == "John Smith"

def test_update_boat(client: TestClient, staff_headers):
    """Test updating boat listing"""
    # Create boat
    boat_data = {
        "index": 1,
        "customer_name": "John Doe",
        "size": "30 ft"
    }
    response = client.post("/api/v1/boats/", json=boat_data, headers=staff_headers)
    boat_id = response.json()["id"]
    
    # Update boat
    update_data = {
        "size": "35 ft",
        "notes": "Updated notes"
    }
    response = client.put(f"/api/v1/boats/{boat_id}", json=update_data, headers=staff_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["size"] == "35 ft"
    assert data["notes"] == "Updated notes"

def test_delete_boat(client: TestClient, staff_headers):
    """Test deleting boat listing"""
    # Create boat
    boat_data = {
        "index": 1,
        "customer_name": "John Doe"
    }
    response = client.post("/api/v1/boats/", json=boat_data, headers=staff_headers)
    boat_id = response.json()["id"]
    
    # Delete boat
    response = client.delete(f"/api/v1/boats/{boat_id}", headers=staff_headers)
    assert response.status_code == 200
    
    # Verify deletion
    response = client.get(f"/api/v1/boats/{boat_id}", headers=staff_headers)
    assert response.status_code == 404

