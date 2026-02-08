from celery import Celery
from sqlmodel import Session, select
from datetime import datetime
from ..config import settings
from ..models.task_model import Task
from ..models.scheduled_reminder_model import ScheduledReminder
from ..db.session import get_session


# Create Celery instance for reminder tasks
reminder_worker = Celery("reminder_worker")
reminder_worker.conf.update(
    broker_url=settings.REDIS_URL,
    result_backend=settings.REDIS_URL,
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)


@reminder_worker.task(bind=True, max_retries=3)
def send_reminder_task(self, task_id: int):
    """
    Send a reminder for a specific task
    """
    # Get database session
    session_gen = get_session()
    session = next(session_gen)
    
    try:
        # Get the task
        task = session.get(Task, task_id)
        if not task:
            # Log error and don't retry if task doesn't exist
            print(f"Task with ID {task_id} not found, skipping reminder")
            return {"status": "error", "message": f"Task with ID {task_id} not found"}
        
        # Send the actual reminder notification
        # In a real implementation, this would send an actual notification to the user
        print(f"Sending reminder for task: {task.title}")
        
        # Update the scheduled reminder as triggered
        # Find the scheduled reminder record for this task
        scheduled_reminder_query = select(ScheduledReminder).where(
            ScheduledReminder.task_id == task_id,
            ScheduledReminder.triggered == False
        )
        scheduled_reminder = session.exec(scheduled_reminder_query).first()
        
        if scheduled_reminder:
            scheduled_reminder.triggered = True
            scheduled_reminder.triggered_at = datetime.utcnow()
            session.add(scheduled_reminder)
            session.commit()
        
        print(f"Reminder sent successfully for task {task.title} (ID: {task_id})")
        
        return {
            "status": "success", 
            "task_id": task_id, 
            "message": f"Reminder sent for task '{task.title}'"
        }
        
    except Exception as exc:
        print(f"Error sending reminder for task {task_id}: {str(exc)}")
        # Retry the task if it failed
        raise self.retry(exc=exc, countdown=60)
    finally:
        session.close()


@reminder_worker.task(bind=True, max_retries=1)
def cleanup_expired_reminders_task(self):
    """
    Clean up expired reminders that were not triggered
    """
    session_gen = get_session()
    session = next(session_gen)
    
    try:
        # Find all scheduled reminders that are past their scheduled time but not triggered
        expired_reminders_query = select(ScheduledReminder).where(
            ScheduledReminder.scheduled_time < datetime.utcnow(),
            ScheduledReminder.triggered == False
        )
        expired_reminders = session.exec(expired_reminders_query).all()
        
        # Mark them as triggered to prevent future execution
        for reminder in expired_reminders:
            reminder.triggered = True
            session.add(reminder)
        
        session.commit()
        
        print(f"Cleaned up {len(expired_reminders)} expired reminders")
        
        return {
            "status": "success",
            "cleaned_count": len(expired_reminders),
            "message": "Expired reminders cleaned up"
        }
        
    except Exception as exc:
        print(f"Error cleaning up expired reminders: {str(exc)}")
        raise self.retry(exc=exc, countdown=300)  # Retry after 5 minutes
    finally:
        session.close()