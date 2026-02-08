import hashlib
import secrets
from passlib.context import CryptContext

# Initialize bcrypt context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hash."""
    try:
        # Try using bcrypt first
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        # Fallback to manual verification if bcrypt fails
        # Extract salt from hashed password (assuming bcrypt format)
        if '$' in hashed_password:
            # This is a bcrypt hash, we can't easily recreate it without bcrypt
            # Re-raise the original exception
            raise


def get_password_hash(password: str) -> str:
    """Generate a hash for a plain password."""
    try:
        # Bcrypt has a 72 character limit, so we truncate if necessary
        truncated_password = password[:72] if len(password) > 72 else password
        return pwd_context.hash(truncated_password)
    except Exception:
        # Fallback to SHA-256 with salt if bcrypt fails
        salt = secrets.token_hex(32)
        pwdhash = hashlib.pbkdf2_hmac('sha256', 
                                      truncated_password.encode('utf-8'), 
                                      salt.encode('utf-8'), 
                                      100000)
        return salt + pwdhash.hex()