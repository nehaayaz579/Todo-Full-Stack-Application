# Data Model: Advanced Task Scheduling & Automation

## Extended Task Entity

### Fields
- **id**: Integer (Primary Key, Auto-generated) - from original Task entity
- **title**: String (Required, Max length: 255 characters) - from original Task entity
- **description**: String (Optional, Max length: 1000 characters) - from original Task entity
- **completed**: Boolean (Default: false) - from original Task entity
- **created_at**: DateTime (Auto-generated on creation) - from original Task entity
- **updated_at**: DateTime (Auto-generated on update) - from original Task entity
- **priority**: String (Enum: 'low', 'medium', 'high', Default: 'medium') - from Spec 2
- **due_date**: DateTime (Optional) - new for scheduling
- **recurrence_pattern**: String (Enum: 'none', 'daily', 'weekly', 'monthly', Default: 'none') - new for recurring tasks
- **reminder_time**: Integer (Optional, Minutes before due date) - new for reminders
- **last_occurrence_id**: Integer (Foreign Key to task.id, Optional) - new for recurring tasks

### Relationships
- **tags**: Many-to-many relationship with Tag entity through task_tags junction table (from Spec 2)
- **next_occurrence**: One-to-one relationship with Task entity (for recurring tasks)

### Validation Rules
- title: Required, minimum 1 character, maximum 255 characters (from original)
- description: Optional, maximum 1000 characters (from original)
- completed: Boolean value (true/false) (from original)
- priority: Must be one of 'low', 'medium', 'high' (from Spec 2)
- due_date: If set, must be a valid future or past date/time
- recurrence_pattern: Must be one of 'none', 'daily', 'weekly', 'monthly'
- reminder_time: If set, must be a positive integer representing minutes before due date

### State Transitions
- completed: false → true (when task is marked as completed) (from original)
- completed: true → false (when task is marked as incomplete) (from original)

## ScheduledReminders Entity

### Fields
- **id**: Integer (Primary Key, Auto-generated)
- **task_id**: Integer (Foreign Key to tasks.id, Required)
- **scheduled_time**: DateTime (Required, When the reminder should trigger)
- **triggered**: Boolean (Default: false, Whether the reminder has been triggered)
- **triggered_at**: DateTime (Optional, When the reminder was actually triggered)

### Relationships
- **task**: Belongs to Task entity

## RecurringTaskHistory Entity

### Fields
- **id**: Integer (Primary Key, Auto-generated)
- **parent_task_id**: Integer (Foreign Key to tasks.id, Required, The original recurring task)
- **instance_task_id**: Integer (Foreign Key to tasks.id, Required, The generated instance)
- **occurrence_number**: Integer (Required, The sequence number of this occurrence)
- **scheduled_date**: DateTime (Required, When this instance was scheduled)
- **created_at**: DateTime (Auto-generated on creation)

### Relationships
- **parent_task**: Belongs to Task entity (the recurring template)
- **instance_task**: Belongs to Task entity (the generated instance)

## Database Schema (SQLModel)

```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List
from enum import Enum


class RecurrencePatternEnum(str, Enum):
    none = "none"
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"


class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    priority: str = Field(default="medium")  # Using string instead of enum for compatibility with existing data
    due_date: Optional[datetime] = Field(default=None)
    recurrence_pattern: RecurrencePatternEnum = Field(default=RecurrencePatternEnum.none)
    reminder_time: Optional[int] = Field(default=None, ge=1)  # Minutes before due date
    last_occurrence_id: Optional[int] = Field(default=None, foreign_key="task.id")


class Task(TaskBase, table=True):
    id: int = Field(primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})

    # Relationship to tags (from Spec 2)
    tags: List["Tag"] = Relationship(back_populates="tasks", link_model="TaskTag")


class ScheduledReminder(SQLModel, table=True):
    id: int = Field(primary_key=True)
    task_id: int = Field(foreign_key="task.id")
    scheduled_time: datetime
    triggered: bool = Field(default=False)
    triggered_at: Optional[datetime] = Field(default=None)
    
    # Relationship to task
    task: Task = Relationship(back_populates="scheduled_reminders")


class RecurringTaskHistory(SQLModel, table=True):
    id: int = Field(primary_key=True)
    parent_task_id: int = Field(foreign_key="task.id")
    instance_task_id: int = Field(foreign_key="task.id")
    occurrence_number: int
    scheduled_date: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)


# Add relationship to Task model
Task.model_rebuild()
Task.update_forward_refs()
```

## Indexes
- Primary index on id fields (automatically created)
- Index on priority field for efficient filtering (from Spec 2)
- Index on completed field for efficient filtering (from Spec 2)
- Index on due_date field for efficient scheduling queries
- Index on scheduled_time in ScheduledReminder for efficient reminder processing
- Index on recurrence_pattern for efficient recurring task queries