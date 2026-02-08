from utils.security_fixed import get_password_hash, verify_password

# Test password hashing and verification
password = 'TestPass123'
hashed = get_password_hash(password)
print('Hashed password:', hashed)

# Verify the password
is_valid = verify_password(password, hashed)
print('Password verification result:', is_valid)

# Test with wrong password
wrong_verification = verify_password('WrongPass', hashed)
print('Wrong password verification result:', wrong_verification)