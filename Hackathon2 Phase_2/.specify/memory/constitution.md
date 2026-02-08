<!-- 
SYNC IMPACT REPORT
Version change: N/A -> 1.0.0
Modified principles: None (new constitution)
Added sections: All sections (new constitution)
Removed sections: None
Templates requiring updates: 
  - ✅ .specify/templates/plan-template.md (Governance section referenced)
  - ✅ .specify/templates/spec-template.md (Requirements alignment)
  - ✅ .specify/templates/tasks-template.md (Task categorization updated)
Templates unchanged:
  - No command templates found to update
Runtime docs updated:
  - No runtime guidance docs found to update
Follow-up TODOs: None
-->
# Todo Full-Stack Web Application Constitution

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)
Every feature and implementation must originate from a well-defined specification document; No coding begins without an approved spec; Specifications must include user scenarios, requirements, and success criteria.

### II. Full-Stack Architecture
Application must implement both frontend and backend components; Frontend (Next.js 16+) communicates with backend (Python FastAPI) via RESTful APIs; Clear separation of concerns between client and server responsibilities.

### III. Test-First (NON-NEGOTIABLE)
TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced; Both unit and integration tests required for all features.

### IV. User Authentication & Data Isolation
All API endpoints require valid JWT authentication via Better Auth; User data must be isolated and accessible only to the owning user; Unauthorized requests return 401 status.

### V. Persistent Storage with Neon PostgreSQL
All data must be stored in Neon Serverless PostgreSQL using SQLModel ORM; Proper database schema design and migrations are required; Data integrity and relationships must be maintained.

### VI. Responsive Web Interface
Frontend must provide responsive user interface for task management; Interface should support all CRUD operations for tasks; User experience must be intuitive and accessible.

## Technology Stack Requirements
All implementations must adhere to the defined technology stack: Next.js 16+ (App Router), Python FastAPI, SQLModel ORM, Neon Serverless PostgreSQL, and Better Auth for authentication.

## API Design Standards
RESTful API endpoints must follow consistent patterns with proper HTTP methods and status codes; All endpoints must include proper error handling and validation; API contracts must be clearly defined and documented.

## Development Workflow
Follow the Agentic Dev Stack workflow: Write spec → Generate plan → Break into tasks → Implement via Claude Code; No manual coding allowed outside of the defined workflow; All changes must follow the feature branch naming convention (###-feature-name).

## Governance
This constitution supersedes all other development practices; Amendments require documentation, approval, and migration plan; All PRs/reviews must verify compliance with these principles; Code reviews must validate adherence to spec-driven development.

**Version**: 1.0.0 | **Ratified**: 2026-02-05 | **Last Amended**: 2026-02-05