---

description: "Task list for Core Todo CRUD (MVP) feature implementation"
---

# Tasks: Core Todo CRUD (MVP)

**Input**: Design documents from `/specs/001-core-todo-crud/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume web app structure - adjust based on plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create backend project structure: backend/src/, backend/tests/, backend/requirements.txt
- [X] T002 Create frontend project structure: frontend/src/, frontend/tests/, frontend/package.json
- [X] T003 [P] Initialize backend with FastAPI dependencies in backend/requirements.txt
- [X] T004 [P] Initialize frontend with Next.js dependencies in frontend/package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T005 Setup database schema and migrations framework in backend/src/db/
- [X] T006 [P] Create Task model in backend/src/models/task_model.py based on data-model.md
- [X] T007 Create database configuration in backend/src/db/session.py
- [X] T008 Setup API routing and middleware structure in backend/src/main.py
- [X] T009 Configure error handling and logging infrastructure in backend/src/utils/
- [X] T010 Create environment configuration management in backend/src/config.py
- [X] T011 [P] Create frontend API service in frontend/src/services/api.js
- [X] T012 Create frontend components base structure in frontend/src/components/

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create Task (Priority: P1) 🎯 MVP

**Goal**: Enable users to create new tasks with required title and optional description

**Independent Test**: Can be fully tested by creating a task through the UI and verifying it appears in the task list and persists in the database.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T013 [P] [US1] Contract test for POST /api/tasks endpoint in backend/tests/contract/test_tasks_crud.py
- [ ] T014 [P] [US1] Unit test for Task creation in backend/tests/unit/test_task_model.py

### Implementation for User Story 1

- [X] T015 [P] [US1] Create TaskService in backend/src/services/task_service.py
- [X] T016 [US1] Implement POST /api/tasks endpoint in backend/src/api/task_routes.py
- [X] T017 [US1] Add validation and error handling for task creation in backend/src/api/task_routes.py
- [X] T018 [P] [US1] Create TaskForm component in frontend/src/components/TaskForm.js
- [X] T019 [US1] Create Task creation page in frontend/src/pages/CreateTaskPage.js
- [X] T020 [US1] Integrate frontend with backend API for task creation in frontend/src/services/taskApi.js

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View Task List (Priority: P1)

**Goal**: Allow users to view all their tasks with details (title, description, completion status)

**Independent Test**: Can be fully tested by creating multiple tasks and verifying they all appear in the task list.

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T021 [P] [US2] Contract test for GET /api/tasks endpoint in backend/tests/contract/test_tasks_crud.py
- [ ] T022 [P] [US2] Unit test for Task retrieval in backend/tests/unit/test_task_service.py

### Implementation for User Story 2

- [X] T023 [P] [US2] Implement GET /api/tasks endpoint in backend/src/api/task_routes.py
- [X] T024 [US2] Add pagination and filtering options to task retrieval in backend/src/services/task_service.py
- [X] T025 [P] [US2] Create TaskList component in frontend/src/components/TaskList.js
- [X] T026 [US2] Create Task listing page in frontend/src/pages/TaskListPage.js
- [X] T027 [US2] Integrate frontend with backend API for task retrieval in frontend/src/services/taskApi.js

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Update Task (Priority: P2)

**Goal**: Allow users to update task details (title, description) and completion status

**Independent Test**: Can be fully tested by updating a task through the UI and verifying the changes are reflected both in the UI and persisted in the database.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T028 [P] [US3] Contract test for PUT /api/tasks/{id} endpoint in backend/tests/contract/test_tasks_crud.py
- [ ] T029 [P] [US3] Contract test for PATCH /api/tasks/{id}/toggle-complete endpoint in backend/tests/contract/test_tasks_crud.py

### Implementation for User Story 3

- [X] T030 [P] [US3] Implement PUT /api/tasks/{id} endpoint in backend/src/api/task_routes.py
- [X] T031 [US3] Implement PATCH /api/tasks/{id}/toggle-complete endpoint in backend/src/api/task_routes.py
- [X] T032 [US3] Add validation and error handling for task updates in backend/src/api/task_routes.py
- [X] T033 [P] [US3] Create TaskEdit component in frontend/src/components/TaskEdit.js
- [X] T034 [US3] Create Task update page in frontend/src/pages/UpdateTaskPage.js
- [X] T035 [US3] Integrate frontend with backend API for task updates in frontend/src/services/taskApi.js

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Delete Task (Priority: P2)

**Goal**: Allow users to delete tasks from their list

**Independent Test**: Can be fully tested by deleting a task through the UI and verifying it disappears from the list and is removed from the database.

### Tests for User Story 4 (OPTIONAL - only if tests requested) ⚠️

- [ ] T036 [P] [US4] Contract test for DELETE /api/tasks/{id} endpoint in backend/tests/contract/test_tasks_crud.py

### Implementation for User Story 4

- [X] T037 [US4] Implement DELETE /api/tasks/{id} endpoint in backend/src/api/task_routes.py
- [X] T038 [US4] Add validation and error handling for task deletion in backend/src/api/task_routes.py
- [X] T039 [P] [US4] Create DeleteTaskButton component in frontend/src/components/DeleteTaskButton.js
- [X] T040 [US4] Integrate frontend with backend API for task deletion in frontend/src/services/taskApi.js

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: User Story 5 - Error Handling (Priority: P3)

**Goal**: Provide clear error messages to users instead of technical stack traces

**Independent Test**: Can be fully tested by simulating various error conditions and verifying user-friendly error messages are displayed.

### Tests for User Story 5 (OPTIONAL - only if tests requested) ⚠️

- [ ] T041 [P] [US5] Integration test for error handling scenarios in backend/tests/integration/test_error_handling.py

### Implementation for User Story 5

- [X] T042 [US5] Implement custom exception handlers in backend/src/exceptions/handler.py
- [X] T043 [US5] Create error response formatter in backend/src/utils/error_formatter.py
- [X] T044 [P] [US5] Create ErrorDisplay component in frontend/src/components/ErrorDisplay.js
- [X] T045 [US5] Add error handling to all API calls in frontend/src/services/api.js
- [X] T046 [US5] Add user-friendly error messages to all frontend components

**Checkpoint**: All user stories including error handling should now be functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T047 [P] Documentation updates in docs/
- [ ] T048 Code cleanup and refactoring
- [ ] T049 Performance optimization across all stories
- [ ] T050 [P] Additional unit tests (if requested) in backend/tests/unit/ and frontend/tests/
- [ ] T051 Security hardening
- [ ] T052 Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 (needs to create tasks to update)
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 (needs to create tasks to delete)
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - Can integrate with all other stories

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for POST /api/tasks endpoint in backend/tests/contract/test_tasks_crud.py"
Task: "Unit test for Task creation in backend/tests/unit/test_task_model.py"

# Launch all implementation for User Story 1 together:
Task: "Create TaskService in backend/src/services/task_service.py"
Task: "Implement POST /api/tasks endpoint in backend/src/api/task_routes.py"
Task: "Create TaskForm component in frontend/src/components/TaskForm.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
   - Developer E: User Story 5
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence