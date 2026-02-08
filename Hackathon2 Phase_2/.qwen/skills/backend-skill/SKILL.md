---
name: "backend-service"
description: "Implement and manage FastAPI backend services including REST API endpoints, task CRUD operations, JWT verification, and user-based access control. Use this skill when building server-side logic for Todo app."
---
# Backend Skill

## When to Use This Skill
- Creating, updating, deleting, or retrieving tasks
- Validating JWT tokens from requests
- Filtering tasks by authenticated user
- Handling errors and returning JSON responses

## Procedure
1. Define all REST API endpoints under `/api/`
2. Apply JWT middleware globally
3. Extract authenticated user from JWT token
4. Verify user ID matches request URL parameter
5. Perform CRUD operations:
   - Create task linked to authenticated user
   - Fetch only tasks belonging to the user
   - Update or delete only user-owned tasks
6. Interact with database using SQLModel ORM
7. Return JSON responses for success or error conditions

## Output Format
- **HTTP Status Code**: 200, 201, 401, 403, 404
- **Response Body**: JSON object with data or error message
- **Error Messages**: Clear and descriptive

## Quality Criteria
- No operation allowed without valid JWT
- Strict user-based data filtering
- Consistent RESTful response structure
- Proper error handling using FastAPI HTTPException
- Backend never trusts frontend input without verification

## Example
**Input**: "GET /api/abc123/tasks with valid JWT for user_id `abc123`"

**Output**:
- **HTTP Status**: 200 OK
- **Response Body**: `[ { "id": 1, "title": "Buy milk", "completed": false } ]`
