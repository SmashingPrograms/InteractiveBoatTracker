# backend/app/services/__init__.py
from .auth import AuthService
from .boat import BoatService
from .map import MapService

__all__ = ["AuthService", "BoatService", "MapService"]

