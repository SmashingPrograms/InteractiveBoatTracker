# backend/conftest.py
import pytest
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import get_db, Base
from app.core.config import settings
from app.models.user import User, UserRole
from app.services.auth import AuthService
from app.schemas.user import UserCreate

# Use in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    """Override database dependency for testing"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="session")
def db() -> Generator:
    """Create test database"""
    Base.metadata.create_all(bind=engine)
    yield TestingSessionLocal()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="module")
def client() -> Generator:
    """Create test client"""
    with TestClient(app) as c:
        yield c

@pytest.fixture
def admin_user(db) -> User:
    """Create admin user for testing"""
    user_create = UserCreate(
        email="admin@pier11marina.com",
        full_name="Admin User",
        password="AdminPass123!",
        role=UserRole.ADMIN
    )
    return AuthService.create_user(db, user_create)

@pytest.fixture
def staff_user(db) -> User:
    """Create staff user for testing"""
    user_create = UserCreate(
        email="staff@pier11marina.com",
        full_name="Staff User",
        password="StaffPass123!",
        role=UserRole.STAFF
    )
    return AuthService.create_user(db, user_create)

@pytest.fixture
def admin_headers(client, admin_user) -> dict:
    """Get admin authentication headers"""
    response = client.post(
        "/api/v1/auth/login",
        data={"username": admin_user.email, "password": "AdminPass123!"}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def staff_headers(client, staff_user) -> dict:
    """Get staff authentication headers"""
    response = client.post(
        "/api/v1/auth/login",
        data={"username": staff_user.email, "password": "StaffPass123!"}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

