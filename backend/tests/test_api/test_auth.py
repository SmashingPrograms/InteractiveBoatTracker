# backend/tests/test_api/test_auth.py
from fastapi.testclient import TestClient

def test_login_success(client: TestClient, admin_user):
    """Test successful login"""
    response = client.post(
        "/api/v1/auth/login",
        data={"username": admin_user.email, "password": "AdminPass123!"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_password(client: TestClient, admin_user):
    """Test login with wrong password"""
    response = client.post(
        "/api/v1/auth/login",
        data={"username": admin_user.email, "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"

def test_login_nonexistent_user(client: TestClient):
    """Test login with nonexistent user"""
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "nonexistent@example.com", "password": "password"}
    )
    assert response.status_code == 401

def test_create_user_admin(client: TestClient, admin_headers):
    """Test creating user as admin"""
    user_data = {
        "email": "newuser@pier11marina.com",
        "full_name": "New User",
        "password": "NewPass123!",
        "role": "staff"
    }
    response = client.post(
        "/api/v1/auth/register",
        json=user_data,
        headers=admin_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == user_data["email"]
    assert data["role"] == "staff"

def test_create_user_staff_forbidden(client: TestClient, staff_headers):
    """Test that staff cannot create users"""
    user_data = {
        "email": "newuser@pier11marina.com",
        "full_name": "New User",
        "password": "NewPass123!",
        "role": "staff"
    }
    response = client.post(
        "/api/v1/auth/register",
        json=user_data,
        headers=staff_headers
    )
    assert response.status_code == 403

