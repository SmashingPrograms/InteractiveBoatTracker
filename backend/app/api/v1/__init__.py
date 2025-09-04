# backend/app/api/v1/__init__.py
from fastapi import APIRouter
from .auth import router as auth_router
from .maps import router as maps_router  
from .boats import router as boats_router
from .positions import router as positions_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["authentication"])
api_router.include_router(maps_router, prefix="/maps", tags=["maps"])
api_router.include_router(boats_router, prefix="/boats", tags=["boats"])
api_router.include_router(positions_router, prefix="/positions", tags=["positions"])

