---
name: "authentication-management"
description: "Handle full user authentication lifecycle including sign up, sign in, JWT issuance, verification, and secure user access across frontend and backend. Use this skill when managing user accounts and protected resources."
---
# Authentication Skill

## When to Use This Skill
- User requests to create a new account or login
- Securing REST API requests with JWT
- Ensuring user can only access their own tasks
- Validating and refreshing authentication sessions

## Procedure
1. Setup Better Auth on the frontend for signup/login flows
2. Issue JWT token after successful login including user_id, email, and expiry
3. Attach JWT token to all API requests via `Authorization: Bearer <token>` header
4. Verify token on backend using shared secret
5. Decode JWT to extract user identity (user_id, email)
6. Enforce access:
   - Only allow authenticated users
   - Only allow user to access their own tasks
   - Reject invalid or expired tokens
7. Handle errors gracefully and return proper HTTP status codes (401 Unauthorized)

## Output Format
- **Auth Status**: Success / Failure
- **JWT Token**: Issued or verified
- **User Context**: user_id, email
- **Access Decision**: Allowed / Denied

## Quality Criteria
- JWT required for all protected endpoints
- Stateless authentication; no session sharing
- Proper token expiry handling
- Unauthorized requests return 401
- Users cannot access data of others

## Example
**Input**: "User signs in with email `user@example.com` and correct password"

**Output**:
- **Auth Status**: Success
- **JWT Token**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **User Context**: `{ "user_id": "abc123", "email": "user@example.com" }`
- **Access Decision**: Allowed
