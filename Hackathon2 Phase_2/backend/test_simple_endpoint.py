from fastapi import FastAPI, HTTPException, Depends
from sqlmodel import Session
from api.request_models import UserCreateRequest
from services.auth_service import create_user
from utils.validation import validate_password_strength
from database import get_session


app = FastAPI()


@app.post("/simple-register")
def simple_register(email: str, password: str, session: Session = Depends(get_session)):
    """Simple register endpoint without models."""
    # Validate email format manually
    import re
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_regex, email):
        raise HTTPException(status_code=400, detail="Invalid email format")
    
    # Manual validation
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must contain at least 8 characters")
    if not any(c.isupper() for c in password):
        raise HTTPException(status_code=400, detail="Password must contain at least one uppercase letter")
    if not any(c.isdigit() for c in password):
        raise HTTPException(status_code=400, detail="Password must contain at least one number")

    # Convert to the SQLModel UserCreate
    from models.user import UserCreate
    sql_user_create = UserCreate(email=email, password=password)
    
    try:
        result = create_user(session, sql_user_create)
        # Return a simple dict instead of the model
        return {"id": result.id, "email": result.email, "created_at": result.created_at.isoformat()}
    except ValueError as e:
        print("Error in register:", e)
        raise HTTPException(status_code=409, detail=str(e))