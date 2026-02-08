# Research: Core Todo CRUD (MVP)

## Decision: Tech Stack Selection
**Rationale**: Selected based on project requirements and constraints specified in the constitution and feature spec.
- Backend: Python FastAPI for its ease of use, async support, and automatic API documentation
- Database: Neon Serverless PostgreSQL with SQLModel ORM for type safety and SQL best practices
- Frontend: Next.js 16+ with App Router for modern React development and server-side rendering capabilities
- No authentication layer for this MVP as specified in constraints

## Decision: API Design Pattern
**Rationale**: RESTful API design chosen to align with constraints specified in feature spec.
- Standard HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Resource-based endpoints following REST conventions
- JSON request/response format
- Proper HTTP status codes for success/error responses

## Decision: Frontend State Management
**Rationale**: For this MVP, will use React's built-in useState and useEffect hooks combined with direct API calls.
- Simpler than introducing additional state management libraries
- Sufficient for the scope of this MVP
- Allows for easier integration with Next.js data fetching patterns

## Decision: Error Handling Strategy
**Rationale**: Centralized error handling to ensure consistent user experience.
- Backend: Custom exception handlers in FastAPI to return user-friendly messages
- Frontend: Error boundaries and try/catch blocks to prevent crashes
- Both layers: Avoid exposing technical details to end users

## Alternatives Considered
- Authentication: JWT vs Session-based vs OAuth2 - deferred to future spec as not required for MVP
- Database: SQLite vs PostgreSQL vs MongoDB - PostgreSQL chosen as per constraints
- Frontend: React + Vite vs Next.js vs vanilla JavaScript - Next.js chosen as per constraints
- State Management: Redux vs Zustand vs React Query vs Built-in hooks - Built-in hooks chosen for simplicity of MVP