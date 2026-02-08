from pydantic import BaseModel
import re


class UserCreateRequest(BaseModel):
    email: str  # Using str instead of EmailStr to avoid email-validator dependency
    password: str