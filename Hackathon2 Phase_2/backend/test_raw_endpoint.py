from fastapi import FastAPI, HTTPException, Depends, Request
from sqlmodel import Session
from services.auth_service import create_user
from database import get_session
import json
import re


app = FastAPI()


@app.post("/raw-register")
async def raw_register(request: Request, session: Session = Depends(get_session)):
    """Register endpoint that parses raw JSON to avoid model validation issues."""
    body = await request.json()
    
    email = body.get("email")
    password = body.get("password")
    
    # Validate email format manually
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not email or not re.match(email_regex, email):
        raise HTTPException(status_code=400, detail="Invalid email format")
    
    # Manual validation
    if not password:
        raise HTTPException(status_code=400, detail="Password is required")
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