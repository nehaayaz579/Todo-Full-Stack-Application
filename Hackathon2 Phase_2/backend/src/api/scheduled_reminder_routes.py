from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List
from ..db.session import get_session
from ..models.scheduled_reminder_model import ScheduledReminder, ScheduledReminderRead
from ..services.scheduled_reminder_service import ScheduledReminderService

router = APIRouter()


@router.get("/scheduled-reminders", response_model=List[ScheduledReminderRead])
def get_scheduled_reminders(session: Session = Depends(get_session)):
    """Get all scheduled reminders"""
    try:
        reminder_service = ScheduledReminderService(session)
        reminders = reminder_service.get_all_scheduled_reminders()
        return reminders
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to retrieve scheduled reminders")


@router.get("/scheduled-reminders/{id}", response_model=ScheduledReminderRead)
def get_scheduled_reminder(id: int, session: Session = Depends(get_session)):
    """Get a specific scheduled reminder by ID"""
    try:
        reminder_service = ScheduledReminderService(session)
        reminder = reminder_service.get_scheduled_reminder_by_id(id)
        if not reminder:
            raise HTTPException(status_code=404, detail="Scheduled reminder not found")
        return reminder
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to retrieve scheduled reminder")


@router.delete("/scheduled-reminders/{id}", status_code=204)
def delete_scheduled_reminder(id: int, session: Session = Depends(get_session)):
    """Cancel/delete a scheduled reminder"""
    try:
        reminder_service = ScheduledReminderService(session)
        success = reminder_service.cancel_scheduled_reminder(id)
        if not success:
            raise HTTPException(status_code=404, detail="Scheduled reminder not found")
        return {"message": "Scheduled reminder cancelled successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to cancel scheduled reminder")