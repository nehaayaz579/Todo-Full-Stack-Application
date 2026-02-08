# Data Model: User Authentication & Secure Multi-User Todo System

## User Entity

### Fields
- **id**: Integer (Primary Key, Auto-incrementing)
- **email**: String (Required, Unique, Max length: 255, Valid email format)
- **hashed_password**: String (Required, Max length: 255, Stored as bcrypt hash)
- **created_at**: DateTime (Auto-generated on creation)
- **updated_at**: DateTime (Auto-generated on update, updates automatically)

### Validation Rules
- email: Required, must be valid email format, must be unique
- hashed_password: Required, minimum length after hashing (enforced by bcrypt)
- created_at: Auto-generated, cannot be modified by user
- updated_at: Auto-generated, updates automatically when record is modified

### Relationships
- **tasks**: One-to-many relationship with Task entity (a user owns multiple tasks)

## Extended Task Entity

### Fields (in addition to original fields)
- **id**: Integer (Primary Key, Auto-incrementing) - from original Task entity
- **title**: String (Required, Max length: 255 characters) - from original Task entity
- **description**: String (Optional, Max length: 1000 characters) - from original Task entity
- **completed**: Boolean (Default: false) - from original Task entity
- **created_at**: DateTime (Auto-generated on creation) - from original Task entity
- **updated_at**: DateTime (Auto-generated on update) - from original Task entity
- **priority**: String (Enum: 'low', 'medium', 'high', Default: 'medium') - from Spec 2
- **due_date**: DateTime (Optional) - from Spec 3
- **recurrence_pattern**: String (Enum: 'none', 'daily', 'weekly', 'monthly', Default: 'none') - from Spec 3
- **reminder_time**: Integer (Optional, Minutes before due date) - from Spec 3
- **last_occurrence_id**: Integer (Foreign Key to task.id, Optional) - from Spec 3
- **user_id**: Integer (Foreign Key to users.id, Required) - NEW FIELD FOR THIS SPEC

### Relationships
- **user**: Many-to-one relationship with User entity (many tasks belong to one user) - NEW RELATIONSHIP FOR THIS SPEC
- **tags**: Many-to-many relationship with Tag entity through task_tags junction table (from Spec 2)

### Validation Rules
- All original validation rules from previous specs remain
- user_id: Required, must reference a valid user

### State Transitions
- completed: false → true (when task is marked as completed) (from original)
- completed: true → false (when task is marked as incomplete) (from original)

## JWT Token Structure

### Access Token Payload
- **sub**: User ID (subject identifier)
- **email**: User's email address
- **exp**: Expiration timestamp (short-lived, ~15 minutes)
- **iat**: Issued at timestamp
- **jti**: JWT ID for token tracking (optional)

### Refresh Token Payload
- **sub**: User ID (subject identifier)
- **exp**: Expiration timestamp (longer-lived, ~7 days)
- **iat**: Issued at timestamp
- **jti**: JWT ID for token tracking

## Session/Token Management Tables (if needed)

### RefreshToken Entity (optional, for enhanced security)
- **id**: Integer (Primary Key, Auto-incrementing)
- **token**: String (Required, Unique, JWT refresh token)
- **user_id**: Integer (Foreign Key to users.id, Required)
- **expires_at**: DateTime (Required, When the token expires)
- **created_at**: DateTime (Auto-generated on creation)
- **revoked**: Boolean (Default: false, Whether the token has been revoked)

## Database Schema (SQLModel)

```python
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List
from enum import Enum
import re


class UserBase(SQLModel):
    email: str = Field(regex=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', max_length=255, unique=True)


class User(UserBase, table=True):
    id: int = Field(primary_key=True)
    hashed_password: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})
    
    # Relationship to tasks
    tasks: List["Task"] = Relationship(back_populates="user")


class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    priority: str = Field(default="medium")  # Using string instead of enum for compatibility
    due_date: Optional[datetime] = Field(default=None)
    recurrence_pattern: RecurrencePatternEnum = Field(default=RecurrencePatternEnum.none)
    reminder_time: Optional[int] = Field(default=None, ge=1)  # Minutes before due date
    last_occurrence_id: Optional[int] = Field(default=None, foreign_key="task.id")


class Task(TaskBase, table=True):
    id: int = Field(primary_key=True)
    user_id: int = Field(foreign_key="user.id")  # NEW FIELD: Link to user who owns this task
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})

    # Relationship to user (owner)
    user: User = Relationship(back_populates="tasks")
    
    # Relationship to tags (from Spec 2)
    tags: List["Tag"] = Relationship(back_populates="tasks", link_model="TaskTag")


class RefreshToken(SQLModel, table=True):
    id: int = Field(primary_key=True)
    token: str = Field(unique=True, max_length=500)
    user_id: int = Field(foreign_key="user.id")
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)
    revoked: bool = Field(default=False)


class UserCreate(UserBase):
    password: str = Field(min_length=8)  # Raw password before hashing
    
    @validator("password")
    def validate_password(cls, v):
        # Password must have at least 8 characters, 1 uppercase, 1 number
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one number")
        return v


class UserLogin(SQLModel):
    email: str
    password: str  # Raw password to be verified against hash


class TaskCreate(TaskBase):
    tag_names: Optional[List[str]] = []  # List of tag names to associate with the task
    # user_id will be set automatically based on authenticated user


class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = None
    priority: Optional[PriorityEnum] = None
    due_date: Optional[datetime] = None
    recurrence_pattern: Optional[RecurrencePatternEnum] = None
    reminder_time: Optional[int] = Field(default=None, ge=1)  # Minutes before due date
    last_occurrence_id: Optional[int] = Field(default=None, foreign_key="task.id")
    tag_names: Optional[List[str]] = None  # List of tag names to associate with the task
```

## Indexes
- Primary indexes on id fields (automatically created)
- Index on User.email for efficient lookup (automatically created due to UNIQUE constraint)
- Index on Task.user_id for efficient filtering by user (critical for performance)
- Index on Task.priority for efficient filtering (from Spec 2)
- Index on Task.completed for efficient filtering (from original)
- Index on Task.due_date for efficient scheduling queries (from Spec 3)
- Index on RefreshToken.expires_at for efficient cleanup (if using refresh tokens)