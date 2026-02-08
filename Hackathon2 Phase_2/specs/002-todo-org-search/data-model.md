# Data Model: Intermediate Todo Organization & Search

## Extended Task Entity

### Fields
- **id**: Integer (Primary Key, Auto-generated) - from original Task entity
- **title**: String (Required, Max length: 255 characters) - from original Task entity
- **description**: String (Optional, Max length: 1000 characters) - from original Task entity
- **completed**: Boolean (Default: false) - from original Task entity
- **created_at**: DateTime (Auto-generated on creation) - from original Task entity
- **updated_at**: DateTime (Auto-generated on update) - from original Task entity
- **priority**: String (Enum: 'low', 'medium', 'high', Default: 'medium')
- **tags**: Relationship to Tag entity (Many-to-many relationship)

### Relationships
- **tags**: Many-to-many relationship with Tag entity through task_tags junction table

### Validation Rules
- title: Required, minimum 1 character, maximum 255 characters (from original)
- description: Optional, maximum 1000 characters (from original)
- completed: Boolean value (true/false) (from original)
- priority: Must be one of 'low', 'medium', 'high'

### State Transitions
- completed: false → true (when task is marked as completed) (from original)
- completed: true → false (when task is marked as incomplete) (from original)

## Tag Entity

### Fields
- **id**: Integer (Primary Key, Auto-generated)
- **name**: String (Required, Unique, Max length: 50 characters)

### Relationships
- **tasks**: Many-to-many relationship with Task entity through task_tags junction table

## Junction Table: Task_Tags

### Fields
- **task_id**: Integer (Foreign Key to tasks.id)
- **tag_id**: Integer (Foreign Key to tags.id)

## Database Schema (SQLModel)

```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List
from enum import Enum


class PriorityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    priority: PriorityEnum = Field(default=PriorityEnum.medium)


class Task(TaskBase, table=True):
    id: int = Field(primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})
    
    # Relationship to tags
    tags: List["Tag"] = Relationship(back_populates="tasks", link_model="TaskTag")


class Tag(SQLModel, table=True):
    id: int = Field(primary_key=True)
    name: str = Field(max_length=50, unique=True, index=True)
    
    # Relationship to tasks
    tasks: List[Task] = Relationship(back_populates="tags", link_model="TaskTag")


class TaskTag(SQLModel, table=True):
    task_id: int = Field(foreign_key="task.id", primary_key=True)
    tag_id: int = Field(foreign_key="tag.id", primary_key=True)


class TaskCreate(TaskBase):
    tag_names: Optional[List[str]] = []  # List of tag names to associate with the task


class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = None
    priority: Optional[PriorityEnum] = None
    tag_names: Optional[List[str]] = None  # List of tag names to associate with the task


class TaskQueryParams(SQLModel):
    search: Optional[str] = None
    priority: Optional[PriorityEnum] = None
    completed: Optional[bool] = None
    tag: Optional[str] = None
    sort: Optional[str] = "created_at"  # Default sort by creation date
    order: Optional[str] = "desc"  # Default sort order descending
```

## Indexes
- Primary index on id fields (automatically created)
- Index on priority field for efficient filtering
- Index on completed field for efficient filtering
- Index on tag name field for efficient searching
- Composite indexes may be added later based on query patterns