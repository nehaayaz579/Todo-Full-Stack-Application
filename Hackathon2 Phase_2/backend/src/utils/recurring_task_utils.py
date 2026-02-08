from datetime import datetime, timedelta
from ..workers.recurring_task_worker import create_next_occurrence_task


def schedule_next_occurrence(parent_task_id: int):
    """
    Schedule the creation of the next occurrence of a recurring task
    """
    # In a real implementation, this would schedule the next occurrence creation
    # based on the recurrence pattern of the parent task
    # For now, we'll just trigger the creation directly
    create_next_occurrence_task.delay(parent_task_id)


def calculate_next_occurrence_date(last_due_date: datetime, recurrence_pattern: str) -> datetime:
    """
    Calculate the next occurrence date based on the recurrence pattern
    """
    if not last_due_date:
        return datetime.utcnow()
    
    if recurrence_pattern == "daily":
        return last_due_date + timedelta(days=1)
    elif recurrence_pattern == "weekly":
        return last_due_date + timedelta(weeks=1)
    elif recurrence_pattern == "monthly":
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