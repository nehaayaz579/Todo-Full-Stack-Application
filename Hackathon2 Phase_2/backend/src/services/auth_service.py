from sqlmodel import Session, select
from typing import Optional
from datetime import datetime, timedelta
from models.user import User, UserCreate, UserResponse
from models.refresh_token import RefreshToken
from utils.security_fixed import get_password_hash
from utils.jwt import create_access_token, create_refresh_token, authenticate_user, verify_token


def create_user(session: Session, user_create: UserCreate) -> UserResponse:
    """Create a new user with the provided details."""
    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == user_create.email)).first()
    if existing_user:
        raise ValueError("Email already registered")

    # Validate password manually since we removed the method from the model
    password = user_create.password
    if len(password) < 8:
        raise ValueError("Password must contain at least 8 characters")
    if not any(c.isupper() for c in password):
        raise ValueError("Password must contain at least one uppercase letter")
    if not any(c.isdigit() for c in password):
        raise ValueError("Password must contain at least one number")

    # Create new user
    hashed_password = get_password_hash(user_create.password)
    db_user = User(
        email=user_create.email,
        hashed_password=hashed_password
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return UserResponse(
        id=db_user.id,
        email=db_user.email,
        created_at=db_user.created_at,
        updated_at=db_user.updated_at
    )


def authenticate_and_create_tokens(session: Session, email: str, password: str) -> Optional[dict]:
    """Authenticate user and create access/refresh tokens if successful."""
    user = authenticate_user(session, email, password)
    if not user:
        return None

    # Create access token
    access_token_expires = timedelta(minutes=30)  # Use default from settings
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )

    # Create refresh token
    refresh_token_expires = timedelta(days=7)  # Use default from settings
    refresh_token = create_refresh_token(
        data={"sub": str(user.id)},
        expires_delta=refresh_token_expires
    )

    # Store refresh token in database
    db_refresh_token = RefreshToken(
        token=refresh_token,
        user_id=user.id,
        expires_at=datetime.utcnow() + refresh_token_expires
    )
    session.add(db_refresh_token)
    session.commit()
    session.refresh(db_refresh_token)  # Refresh to get the ID

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


def refresh_access_token(session: Session, refresh_token: str) -> Optional[dict]:
    """Refresh an access token using a refresh token."""
    # Find the refresh token in the database
    db_refresh_token = session.exec(
        select(RefreshToken)
        .where(RefreshToken.token == refresh_token)
        .where(RefreshToken.revoked == False)
        .where(RefreshToken.expires_at > datetime.utcnow())
    ).first()
    
    if not db_refresh_token:
        return None
    
    # Verify the refresh token
    payload = verify_token(refresh_token)
    if not payload:
        return None
    
    # Get the user
    user_id = payload.get("sub")
    if not user_id:
        return None
    
    user = session.get(User, int(user_id))
    if not user:
        return None
    
    # Create new access token
    access_token_expires = timedelta(minutes=30)  # Use default from settings
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }