from sqlmodel import Session, select
from database import get_engine
from models.user import User
from models.task_model import Task
from utils.security_fixed import get_password_hash

# Create engine and session
engine = get_engine()
with Session(engine) as session:
    # Check if users exist
    users = session.exec(select(User)).all()
    print(f"Number of users in database: {len(users)}")
    
    # Check if tasks exist
    tasks = session.exec(select(Task)).all()
    print(f"Number of tasks in database: {len(tasks)}")
    
    # Print task details if any exist
    for task in tasks:
        print(f"Task ID: {task.id}, Title: {task.title}, Completed: {task.completed}, User ID: {task.user_id}")
    
    # If no users exist, create a test user
    if not users:
        print("Creating a test user...")
        test_email = "test@example.com"
        test_password = "TestPass123"
        hashed_password = get_password_hash(test_password)
        
        test_user = User(email=test_email, hashed_password=hashed_password)
        session.add(test_user)
        session.commit()
        session.refresh(test_user)
        print(f"Created test user with ID: {test_user.id}")
        
        # Create a test task for this user
        print("Creating a test task...")
        from models.task_model import Task
        test_task = Task(title="Test Task", description="This is a test task", user_id=test_user.id, completed=False)
        session.add(test_task)
        session.commit()
        session.refresh(test_task)
        print(f"Created test task with ID: {test_task.id}")
    
    # If there are tasks, try to toggle one
    if tasks:
        task_to_toggle = tasks[0]
        print(f"Toggling task {task_to_toggle.id}: {task_to_toggle.title}")
        print(f"Current completed status: {task_to_toggle.completed}")
        
        # Toggle the completed status
        task_to_toggle.completed = not task_to_toggle.completed
        session.add(task_to_toggle)
        session.commit()
        session.refresh(task_to_toggle)
        
        print(f"New completed status: {task_to_toggle.completed}")
    elif users:
        # If there are users but no tasks, create a task for the first user
        user = users[0]
        print(f"Creating a test task for user {user.id}")
        test_task = Task(title="Test Task", description="This is a test task", user_id=user.id, completed=False)
        session.add(test_task)
        session.commit()
        session.refresh(test_task)
        print(f"Created test task with ID: {test_task.id}")