from celery import Celery
from sqlmodel import Session, select
from datetime import datetime, timedelta
from ..config import settings
from ..models.task_model import Task, RecurrencePatternEnum
from ..models.recurring_task_history_model import RecurringTaskHistory
from ..db.session import get_session
import calendar


# Create Celery instance for recurring task tasks
recurring_task_worker = Celery("recurring_task_worker")
recurring_task_worker.conf.update(
    broker_url=settings.REDIS_URL,
    result_backend=settings.REDIS_URL,
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)


@recurring_task_worker.task(bind=True, max_retries=3)
def create_recurring_task_instance(self, task_id: int):
    """
    Create the next instance of a recurring task
    """
    # Get database session
    session_gen = get_session()
    session = next(session_gen)
    
    try:
        # Get the original recurring task
        original_task = session.get(Task, task_id)
        if not original_task:
            print(f"Original task with ID {task_id} not found, skipping recurring task generation")
            return {"status": "error", "message": f"Original task with ID {task_id} not found"}
        
        # Calculate the next occurrence date based on the recurrence pattern
        next_due_date = calculate_next_occurrence_date(original_task.due_date, original_task.recurrence_pattern)
        
        # Create the next instance of the task
        next_task = Task(
            title=original_task.title,
            description=original_task.description,
            completed=False,  # New instance starts as incomplete
            priority=original_task.priority,
            due_date=next_due_date,
            recurrence_pattern=original_task.recurrence_pattern,
            reminder_time=original_task.reminder_time,
            user_id=original_task.user_id,  # Same user as the original task
            last_occurrence_id=original_task.id  # Link to the original task
        )
        
        session.add(next_task)
        session.commit()
        session.refresh(next_task)
        
        # Create a record in the recurring task history
        history_record = RecurringTaskHistory(
            parent_task_id=original_task.id,
            instance_task_id=next_task.id,
            occurrence_number=get_next_occurrence_number(session, original_task.id),
            scheduled_date=next_due_date,
            created_at=datetime.utcnow()
        )
        
        session.add(history_record)
        session.commit()
        
        print(f"Created next occurrence for recurring task {original_task.title} (ID: {task_id}). New task ID: {next_task.id}")
        
        return {
            "status": "success",
            "parent_task_id": task_id,
            "new_task_id": next_task.id,
            "message": f"Next occurrence created for task '{original_task.title}'"
        }
        
    except Exception as exc:
        print(f"Error creating recurring task instance for task {task_id}: {str(exc)}")
        # Retry the task if it failed
        raise self.retry(exc=exc, countdown=60)
    finally:
        session.close()


def calculate_next_occurrence_date(last_due_date: datetime, pattern: RecurrencePatternEnum) -> datetime:
    """
    Calculate the next occurrence date based on the recurrence pattern
    """
    if not last_due_date:
        return datetime.utcnow()
    
    if pattern == RecurrencePatternEnum.daily:
        return last_due_date + timedelta(days=1)
    elif pattern == RecurrencePatternEnum.weekly:
        return last_due_date + timedelta(weeks=1)
    elif pattern == RecurrencePatternEnum.monthly:
        # For monthly, we'll add approximately one month
        # This is a simplified approach - in a real app, you might want to handle months differently
        year = last_due_date.year
        month = last_due_date.month
        day = last_due_date.day
        
        # Move to next month
        month += 1
        if month > 12:
            month = 1
            year += 1
        
        # Handle days that don't exist in some months (e.g., Jan 31 -> Feb 31 doesn't exist)
        max_day = calendar.monthrange(year, month)[1]
        if day > max_day:
            day = max_day
            
        return last_due_date.replace(year=year, month=month, day=day)
    else:
        # For 'none' or any other value, return the current date
        return datetime.utcnow()


def get_next_occurrence_number(session: Session, parent_task_id: int) -> int:
    """
    Get the next occurrence number for a recurring task
    """
    # Query the recurring task history to find the highest occurrence number for this parent task
    from sqlalchemy import func
    max_occurrence_query = select(func.max(RecurringTaskHistory.occurrence_number)).where(
        RecurringTaskHistory.parent_task_id == parent_task_id
    )
    result = session.exec(max_occurrence_query).first()
    
    if result:
        return result + 1
    else:
        return 1