# backend/app/core/exceptions.py
from fastapi import HTTPException, status

class BaseCustomException(HTTPException):
    def __init__(self, detail: str = None, headers: dict = None):
        super().__init__(
            status_code=self.status_code,
            detail=detail or self.detail,
            headers=headers
        )

class NotFoundError(BaseCustomException):
    status_code = status.HTTP_404_NOT_FOUND
    detail = "Resource not found"

class ValidationError(BaseCustomException):
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
    detail = "Validation error"

class DuplicateError(BaseCustomException):
    status_code = status.HTTP_409_CONFLICT
    detail = "Resource already exists"

class UnauthorizedError(BaseCustomException):
    status_code = status.HTTP_401_UNAUTHORIZED
    detail = "Authentication required"

class ForbiddenError(BaseCustomException):
    status_code = status.HTTP_403_FORBIDDEN
    detail = "Insufficient permissions"

