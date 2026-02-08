from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import Dict, Any
from ..db.session import get_session
from ..models.user import UserCreate, UserLogin
from ..services.auth_service import AuthService
from ..utils.error_formatter import format_error, format_success

router = APIRouter()


@router.post("/auth/register", status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, session: Session = Depends(get_session)):
    """Register a new user"""
    try:
        auth_service = AuthService(session)
        user = auth_service.register_user(user_data)
        
        # Create tokens for the newly registered user
        tokens = auth_service.create_tokens_for_user(user)
        
        return {
            "user": {
                "id": user.id,
                "email": user.email
            },
            "access_token": tokens["access_token"],
            "refresh_token": tokens["refresh_token"],
            "token_type": tokens["token_type"]
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )


@router.post("/auth/login")
def login(user_credentials: UserLogin, session: Session = Depends(get_session)):
    """Authenticate user and return access tokens"""
    try:
        auth_service = AuthService(session)
        user = auth_service.authenticate_user(user_credentials.email, user_credentials.password)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Create tokens for the authenticated user
        tokens = auth_service.create_tokens_for_user(user)
        
        return {
            "user": {
                "id": user.id,
                "email": user.email
            },
            "access_token": tokens["access_token"],
            "refresh_token": tokens["refresh_token"],
            "token_type": tokens["token_type"]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )


@router.post("/auth/refresh")
def refresh_access_token(refresh_token_data: Dict[str, str], session: Session = Depends(get_session)):
    """Refresh access token using refresh token"""
    try:
        refresh_token = refresh_token_data.get("refresh_token")
        if not refresh_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Refresh token is required"
            )
        
        auth_service = AuthService(session)
        token_response = auth_service.refresh_access_token(refresh_token)
        
        if not token_response:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token"
            )
        
        return token_response
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Token refresh failed"
        )