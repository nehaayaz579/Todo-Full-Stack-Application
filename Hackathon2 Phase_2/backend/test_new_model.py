import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from src.api.request_models import UserCreateRequest

try:
    user_req = UserCreateRequest(email="test@example.com", password="TestPass123")
    print('UserCreateRequest instantiation successful:', user_req.email, user_req.password)
except Exception as e:
    print('Error instantiating UserCreateRequest:', str(e))