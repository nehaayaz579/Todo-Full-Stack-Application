import re


def validate_password_strength(password: str):
    """
    Validates password strength based on requirements:
    - At least 8 characters
    - Contains at least one uppercase letter
    - Contains at least one number
    
    Returns a tuple of (is_valid, error_message)
    """
    if len(password) < 8:
        return False, "Password must contain at least 8 characters"
    
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r"\d", password):
        return False, "Password must contain at least one number"
        
    return True, ""