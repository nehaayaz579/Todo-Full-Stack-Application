from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, date
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


# Define TaskTag first so it can be referenced by Tag and Task
class TaskTag(SQLModel, table=True):
    task_id: Optional[int] = Field(default=None, foreign_key="task.id", primary_key=True)
    tag_id: Optional[int] = Field(default=None, foreign_key="tag.id", primary_key=True)


# Define Tag before Task so Task can reference it
class Tag(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=50, unique=True, index=True)

    # Relationship to tasks - using string reference to avoid circular import
    tasks: List["Task"] = Relationship(back_populates="tags", link_model=TaskTag)


class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    priority: PriorityEnum = Field(default=PriorityEnum.medium)
    due_date: Optional[datetime] = Field(default=None)
    recurrence_pattern: RecurrencePatternEnum = Field(default=RecurrencePatternEnum.none)
    reminder_time: Optional[int] = Field(default=None, ge=1)  # Minutes before due date
    last_occurrence_id: Optional[int] = Field(default=None)  # Foreign key to task.id


class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")  # NEW: Link to user who owns this task
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})

    # NEW: Relationship to user (owner)
    user: Optional["User"] = Relationship(back_populates="tasks")

    # Relationship to tags
    tags: List["Tag"] = Relationship(back_populates="tasks", link_model=TaskTag)

    # Relationship to scheduled reminders
    scheduled_reminders: List["ScheduledReminder"] = Relationship(back_populates="task")


    @property
    def visual_status(self):
        """Calculate the visual status of the task based on due date and completion status"""
        if self.completed:
            return "completed"

        if not self.due_date:
            return "no-due-date"

        # Compare just the date parts to determine if task is due today
        due_date_only = self.due_date.date()
        today = date.today()

        if due_date_only < today:
            return "overdue"
        elif due_date_only == today:
            return "due-today"
        else:
            return "upcoming"


class TaskCreate(TaskBase):
    tag_names: Optional[List[str]] = []  # List of tag names to associate with the task


class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = None
    priority: Optional[PriorityEnum] = None
    due_date: Optional[datetime] = None
    recurrence_pattern: Optional[RecurrencePatternEnum] = None
    reminder_time: Optional[int] = Field(default=None, ge=1)  # Minutes before due date
    last_occurrence_id: Optional[int] = Field(default=None)  # Foreign key to task.id
    tag_names: Optional[List[str]] = None  # List of tag names to associate with the task


class TagCreate(SQLModel):
    name: str = Field(max_length=50)


class TagRead(SQLModel):
    id: int
    name: str