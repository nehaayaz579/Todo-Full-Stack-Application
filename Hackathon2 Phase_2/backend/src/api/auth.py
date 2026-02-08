from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from database import get_session
from models.user import UserLogin, UserResponse
from schemas.auth import LoginResponse, RefreshTokenRequest, TokenRefreshResponse
from services.auth_service import create_user, authenticate_and_create_tokens, refresh_access_token
from utils.validation import validate_password_strength
from .request_models import UserCreateRequest


router = APIRouter(prefix="/auth", tags=["auth"])


from models.user import UserCreate  # Import at the top to avoid runtime import

@router.post("/register")  # Temporarily remove response_model to test
def register(user_create: UserCreateRequest, session: Session = Depends(get_session)):
    """Register a new user."""
    # Manual validation to avoid any potential bcrypt-related issues during request parsing
    password = user_create.password
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must contain at least 8 characters")
    if not any(c.isupper() for c in password):
        raise HTTPException(status_code=400, detail="Password must contain at least one uppercase letter")
    if not any(c.isdigit() for c in password):
        raise HTTPException(status_code=400, detail="Password must contain at least one number")

    # Validate email format manually
    import re
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_regex, user_create.email):
        raise HTTPException(status_code=400, detail="Invalid email format")

    # Convert to the SQLModel UserCreate
    sql_user_create = UserCreate(email=user_create.email, password=user_create.password)
    
    try:
        result = create_user(session, sql_user_create)
        # Return a simple dict instead of the model
        return {"id": result.id, "email": result.email, "created_at": result.created_at.isoformat()}
    except ValueError as e:
        print("Error in register:", e )

        raise HTTPException(status_code=409, detail=str(e))


@router.post("/login", response_model=LoginResponse)
def login(user_login: UserLogin, session: Session = Depends(get_session)):
    """Authenticate user and return access/refresh tokens."""
    result = authenticate_and_create_tokens(session, user_login.email, user_login.password)
    if not result:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    return LoginResponse(**result)


@router.post("/refresh", response_model=TokenRefreshResponse)
def refresh_token(refresh_request: RefreshTokenRequest, session: Session = Depends(get_session)):
    """Refresh access token using refresh token."""
    result = refresh_access_token(session, refresh_request.refresh_token)
    if not result:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    
    return TokenRefreshResponse(access_token=result["access_token"])