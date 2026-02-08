import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from src.models.user import UserCreate

try:
    user_create = UserCreate(email="test@example.com", password="TestPass123")
    print('UserCreate instantiation successful:', user_create.email, user_create.password)
except Exception as e:
    print('Error instantiating UserCreate:', str(e))