# Data Model: Core Todo CRUD (MVP)

## Task Entity

### Fields
- **id**: Integer (Primary Key, Auto-generated)
- **title**: String (Required, Max length: 255 characters)
- **description**: String (Optional, Max length: 1000 characters)
- **completed**: Boolean (Default: false)
- **created_at**: DateTime (Auto-generated on creation)
- **updated_at**: DateTime (Auto-generated on update)

### Relationships
- No relationships required for this MVP (single user context)

### Validation Rules
- title: Required, minimum 1 character, maximum 255 characters
- description: Optional, maximum 1000 characters
- completed: Boolean value (true/false)

### State Transitions
- completed: false → true (when task is marked as completed)
- completed: true → false (when task is marked as incomplete)

## Database Schema (SQLModel)

```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)

class Task(TaskBase, table=True):
    id: int = Field(primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})
```

## Indexes
- Primary index on id field (automatically created)
- Consider adding indexes on frequently queried fields in future iterations if needed