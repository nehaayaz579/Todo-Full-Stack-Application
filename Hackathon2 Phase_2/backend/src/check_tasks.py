from sqlmodel import Session, select
from database import get_engine
from models.task_model import Task

engine = get_engine()
with Session(engine) as session:
    tasks = session.exec(select(Task)).all()
    print('All tasks in database:')
    for task in tasks:
        print(f'ID: {task.id}, Title: {task.title}, User ID: {task.user_id}, Completed: {task.completed}')