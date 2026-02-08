from datetime import datetime
from ..workers.reminder_worker import send_reminder_task


def schedule_reminder(task_id: int, scheduled_time: datetime):
    """
    Schedule a reminder for a specific task at a specific time
    """
    # Convert datetime to timestamp for Celery
    from datetime import timezone
    timestamp = scheduled_time.timestamp()
    current_timestamp = datetime.now(timezone.utc).timestamp()
    
    # Calculate delay in seconds from now until scheduled time
    delay = max(0, int(timestamp - current_timestamp))
    
    # Schedule the reminder task with the delay
    send_reminder_task.apply_async(args=[task_id], countdown=delay)


def calculate_next_occurrence(last_due_date: datetime, pattern: str) -> datetime:
    """
    Calculate the next occurrence date based on the recurrence pattern
    """
    if not last_due_date:
        return datetime.utcnow()
    
    from datetime import timedelta
    if pattern == "daily":
        return last_due_date + timedelta(days=1)
    elif pattern == "weekly":
        return last_due_date + timedelta(weeks=1)
    elif pattern == "monthly":
        # For monthly, we'll add approximately one month
        # This is a simplified approach - in a real app, you might want to handle months differently
        import calendar
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
        # For 'none' or any other value, return the same date (shouldn't happen in practice)
        return last_due_date