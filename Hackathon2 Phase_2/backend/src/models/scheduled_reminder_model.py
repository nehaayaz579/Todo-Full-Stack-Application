from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional


class ScheduledReminder(SQLModel, table=True):
    id: int = Field(primary_key=True)
    task_id: int = Field(foreign_key="task.id")
    scheduled_time: datetime
    triggered: bool = Field(default=False)
    triggered_at: Optional[datetime] = Field(default=None)

    # Relationship to task
    task: "Task" = Relationship(back_populates="scheduled_reminders")


class ScheduledReminderCreate(SQLModel):
    task_id: int
    scheduled_time: datetime


class ScheduledReminderUpdate(SQLModel):
    triggered: Optional[bool] = None
    triggered_at: Optional[datetime] = None

    