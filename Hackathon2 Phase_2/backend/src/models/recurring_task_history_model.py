from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class RecurringTaskHistory(SQLModel, table=True):
    id: int = Field(primary_key=True)
    parent_task_id: int = Field(foreign_key="task.id")
    instance_task_id: int = Field(foreign_key="task.id")
    occurrence_number: int
    scheduled_date: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)


class RecurringTaskHistoryCreate(SQLModel):
    parent_task_id: int
    instance_task_id: int
    occurrence_number: int
    scheduled_date: datetime


class RecurringTaskHistoryUpdate(SQLModel):
    occurrence_number: Optional[int] = None
    scheduled_date: Optional[datetime] = None