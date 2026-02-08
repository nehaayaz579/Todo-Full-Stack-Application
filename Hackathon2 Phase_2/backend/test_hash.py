import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from src.utils.security_fixed import get_password_hash

try:
    hash_result = get_password_hash('TestPass123')
    print('Hash successful:', len(hash_result))
except Exception as e:
    print('Error hashing:', str(e))