import hashlib
import secrets
from typing import Tuple


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hash."""
    try:
        # Assuming the format is salt:hash
        salt, stored_hash = hashed_password.split('$', 1)
        pwdhash = hashlib.pbkdf2_hmac('sha256',
                                      plain_password.encode('utf-8'),
                                      salt.encode('utf-8'),
                                      100000)
        return pwdhash.hex() == stored_hash
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    """Generate a hash for a plain password."""
    # Bcrypt has a 72 character limit, so we truncate if necessary
    truncated_password = password[:72] if len(password) > 72 else password
    
    # Generate a random salt
    salt = secrets.token_hex(32)
    
    # Hash the password with the salt
    pwdhash = hashlib.pbkdf2_hmac('sha256',
                                  truncated_password.encode('utf-8'),
                                  salt.encode('utf-8'),
                                  100000)
    
    # Return salt and hash combined
    return f"{salt}${pwdhash.hex()}"