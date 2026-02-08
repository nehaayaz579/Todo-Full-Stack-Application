from sqlmodel import Session, select
from database import get_engine
from models.user import User
from utils.security_fixed import get_password_hash

# Create engine and session
engine = get_engine()
with Session(engine) as session:
    # Check if users table exists and count users
    try:
        statement = select(User)
        users = session.exec(statement).all()
        print(f"Number of users in database: {len(users)}")
        
        # Print user emails (without showing hashed passwords)
        for user in users:
            print(f"User ID: {user.id}, Email: {user.email}")
    except Exception as e:
        print(f"Error querying users: {e}")

    # Try creating a test user
    try:
        test_email = "test@example.com"
        test_password = "TestPass123"
        hashed_password = get_password_hash(test_password)
        
        # Check if user already exists
        existing_user = session.exec(select(User).where(User.email == test_email)).first()
        if existing_user:
            print(f"Test user {test_email} already exists")
        else:
            # Create new test user
            test_user = User(email=test_email, hashed_password=hashed_password)
            session.add(test_user)
            session.commit()
            session.refresh(test_user)
            print(f"Created test user with ID: {test_user.id}")
    except Exception as e:
        print(f"Error creating test user: {e}")