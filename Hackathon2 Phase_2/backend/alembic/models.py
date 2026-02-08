from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List
from enum import Enum


class PriorityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class RecurrencePatternEnum(str, Enum):
    none = "none"
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"


class User(SQLModel, table=True):
    __tablename__ = "user"

    id: int = Field(primary_key=True)
    email: str = Field(max_length=255, unique=True)
    hashed_password: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to tasks
    tasks: List["Task"] = Relationship(back_populates="user")


class TaskTag(SQLModel, table=True):
    __tablename__ = "tasktag"

    task_id: int = Field(foreign_key="task.id", primary_key=True)
    tag_id: int = Field(foreign_key="tag.id", primary_key=True)


class Tag(SQLModel, table=True):
    __tablename__ = "tag"

    id: int = Field(primary_key=True)
    name: str = Field(max_length=50, unique=True, index=True)

    # Relationship to tasks
    tasks: List["Task"] = Relationship(back_populates="tags", link_model=TaskTag)


class Task(SQLModel, table=True):
    __tablename__ = "task"

    id: int = Field(primary_key=True)
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    priority: PriorityEnum = Field(default=PriorityEnum.medium)
    due_date: Optional[datetime] = Field(default=None)
    recurrence_pattern: RecurrencePatternEnum = Field(default=RecurrencePatternEnum.none)
    reminder_time: Optional[int] = Field(default=None, ge=1)  # Minutes before due date
    last_occurrence_id: Optional[int] = Field(default=None)  # Foreign key to task.id
    user_id: int = Field(foreign_key="user.id")  # Link to user who owns this task
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})

    # Relationship to user (owner)
    user: Optional["User"] = Relationship(back_populates="tasks")

    # Relationship to tags
    tags: List["Tag"] = Relationship(back_populates="tasks", link_model=TaskTag)

    # Relationship to scheduled reminders
    scheduled_reminders: List["ScheduledReminder"] = Relationship(back_populates="task")


class RefreshToken(SQLModel, table=True):
    __tablename__ = "refresh_token"

    id: int = Field(primary_key=True)
    token: str = Field(max_length=500, unique=True)
    user_id: int = Field(foreign_key="user.id")
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)
    revoked: bool = Field(default=False)


class RecurringTaskHistory(SQLModel, table=True):
    __tablename__ = "recurring_task_history"

    id: int = Field(primary_key=True)
    parent_task_id: int = Field(foreign_key="task.id")
    instance_task_id: int = Field(foreign_key="task.id")
    occurrence_number: int
    scheduled_date: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ScheduledReminder(SQLModel, table=True):
    __tablename__ = "scheduled_reminder"

    id: int = Field(primary_key=True)
    task_id: int = Field(foreign_key="task.id")
    scheduled_time: datetime
    triggered: bool = Field(default=False)
    triggered_at: Optional[datetime] = Field(default=None)

    # Relationship to task
    task: "Task" = Relationship(back_populates="scheduled_reminders")