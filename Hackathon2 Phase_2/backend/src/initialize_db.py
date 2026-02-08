from sqlmodel import SQLModel
from database import get_engine
from models.user import User
from models.task_model import Task, Tag, TaskTag
from models.scheduled_reminder_model import ScheduledReminder
from models.refresh_token import RefreshToken

def create_tables():
    engine = get_engine()
    SQLModel.metadata.create_all(engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    create_tables()