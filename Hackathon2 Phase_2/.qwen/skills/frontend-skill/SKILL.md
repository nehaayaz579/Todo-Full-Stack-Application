---
name: "frontend-application"
description: "Build and manage Next.js frontend UI, integrate Better Auth for login/signup, and securely communicate with backend APIs using JWT."
---
# Frontend Skill

## When to Use This Skill
- Displaying task list, creating, updating, deleting tasks
- Managing authentication flows (login, signup, logout)
- Sending authenticated API requests
- Rendering user feedback and UI states

## Procedure
1. Create pages and components using Next.js App Router
2. Integrate Better Auth for signup/login flows
3. Store JWT token securely in memory or session
4. Attach JWT token to all API requests
5. Call backend APIs for task CRUD operations
6. Render tasks dynamically with proper states
7. Handle errors (401, 404, validation errors) gracefully
8. Prevent unauthenticated access to task pages

## Output Format
- **Rendered UI Pages**: Login, Task List, Task Details
- **API Requests**: Authenticated via JWT
- **User Feedback**: Success/Error notifications
- **Client-side State**: Updated after API calls

## Quality Criteria
- JWT attached to all API calls
- Unauthorized users redirected to login
- Responsive and interactive UI
- Clear separation between UI and API logic
- No frontend exposure of secrets or database logic

## Example
**Input**: "User clicks 'Add Task' and enters 'Buy groceries'"

**Output**:
- **API Request**: POST `/api/abc123/tasks` with JWT
- **Response**: `{ "id": 2, "title": "Buy groceries", "completed": false }`
- **UI Update**: New task appears in task list
