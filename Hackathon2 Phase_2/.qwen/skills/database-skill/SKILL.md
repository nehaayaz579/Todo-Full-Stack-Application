---
name: "database-management"
description: "Design and manage PostgreSQL database schema for Todo app, including tables, relationships, indexes, and persistent storage of tasks and user data."
---
# Database Skill

## When to Use This Skill
- Designing tables for users and tasks
- Enforcing data relationships and constraints
- Ensuring persistent storage and ownership of tasks
- Optimizing queries for filtering and retrieval

## Procedure
1. Create `users` table (managed by Better Auth)
2. Create `tasks` table with columns:
   - id, user_id (FK), title, description, completed, timestamps
3. Apply constraints:
   - Not null, foreign key, default values
4. Link tasks to users via `user_id`
5. Create indexes for fast filtering by user and status
6. Perform CRUD operations through SQLModel ORM
7. Return query results to backend API

## Output Format
- **Database Tables**: users, tasks
- **Stored Records**: JSON-like ORM objects
- **Query Results**: Filtered by user_id

## Quality Criteria
- Each task must belong to a user
- Data remains persistent and consistent
- Queries always filtered by user_id
- Schema matches specification exactly
- Efficient indexing and retrieval

## Example
**Input**: "Insert new task 'Complete homework' for user_id `abc123`"

**Output**:
- **Record Stored**: `{ "id": 3, "user_id": "abc123", "title": "Complete homework", "completed": false }`
- **Query Result**: `{ "tasks": [ { "id": 3, "title": "Complete homework", "completed": false } ] }`
