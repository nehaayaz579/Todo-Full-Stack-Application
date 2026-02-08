---

description: "Task list for Intermediate Todo Organization & Search feature implementation"
---

# Tasks: Intermediate Todo Organization & Search

**Input**: Design documents from `/specs/002-todo-org-search/`
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

- [ ] T001 [P] Update backend requirements.txt with any new dependencies for enhanced features
- [ ] T002 [P] Update frontend package.json with any new dependencies for enhanced features

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [X] T003 [P] Extend Task model with priority field in backend/src/models/task_model.py
- [X] T004 [P] Create Tag model in backend/src/models/tag_model.py
- [X] T005 Create TaskTag junction model in backend/src/models/task_tag_model.py
- [X] T006 Update TaskService to handle priority and tags in backend/src/services/task_service.py
- [X] T007 [P] Update Task API endpoints to support priority and tags in backend/src/api/task_routes.py
- [X] T008 [P] Create Tag API endpoints in backend/src/api/tag_routes.py
- [ ] T009 Update database migration files to add priority column and tags tables in backend/src/db/migrations/
- [X] T010 [P] Update frontend API service to handle priority and tags in frontend/src/services/api.js
- [X] T011 Create Tag management utilities in frontend/src/utils/tagUtils.js

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Assign Priority and Tags (Priority: P1) 🎯 MVP

**Goal**: Enable users to assign priority levels and tags to tasks for better organization and categorization

**Independent Test**: Can be fully tested by creating tasks with different priority levels and tags, then verifying they are saved correctly in the database.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T012 [P] [US1] Contract test for POST /api/tasks with priority and tags in backend/tests/contract/test_tasks_enhanced.py
- [ ] T013 [P] [US1] Unit test for Task creation with priority and tags in backend/tests/unit/test_task_model.py

### Implementation for User Story 1

- [X] T014 [P] [US1] Update TaskForm component to include priority selection in frontend/src/components/TaskForm.js
- [X] T015 [US1] Update TaskForm component to include tags input in frontend/src/components/TaskForm.js
- [ ] T016 [US1] Update Task creation page to use enhanced TaskForm in frontend/src/pages/CreateTaskPage.js
- [X] T017 [US1] Update TaskEdit component to include priority selection in frontend/src/components/TaskEdit.js
- [X] T018 [US1] Update TaskEdit component to include tags input in frontend/src/components/TaskEdit.js
- [ ] T019 [US1] Update UpdateTaskPage to use enhanced TaskEdit in frontend/src/pages/UpdateTaskPage.js
- [X] T020 [US1] Update frontend API service to send priority and tags in frontend/src/services/taskApi.js

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Filter Tasks (Priority: P1)

**Goal**: Allow users to filter tasks by priority, completion status, and tags to focus on the most relevant tasks

**Independent Test**: Can be fully tested by applying different filters to a list of tasks and verifying that only matching tasks are displayed.

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T021 [P] [US2] Contract test for GET /api/tasks with filter parameters in backend/tests/contract/test_tasks_filters.py
- [ ] T022 [P] [US2] Unit test for Task filtering in backend/tests/unit/test_task_service.py

### Implementation for User Story 2

- [X] T023 [P] [US2] Update TaskService to implement filtering by priority, completion status, and tag in backend/src/services/task_service.py
- [X] T024 [US2] Update GET /api/tasks endpoint to accept and process filter parameters in backend/src/api/task_routes.py
- [X] T025 [P] [US2] Create FilterControls component in frontend/src/components/FilterControls.js
- [X] T026 [US2] Update TaskList component to accept and apply filters in frontend/src/components/TaskList.js
- [X] T027 [US2] Integrate FilterControls with TaskList in frontend/src/components/TaskList.js
- [X] T028 [US2] Update frontend API service to send filter parameters in frontend/src/services/taskApi.js

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Search and Sort Tasks (Priority: P2)

**Goal**: Allow users to search and sort tasks to quickly find specific tasks and organize them by importance or recency

**Independent Test**: Can be fully tested by performing searches and sorts on a list of tasks and verifying the results are accurate and properly ordered.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T029 [P] [US3] Contract test for GET /api/tasks with search parameter in backend/tests/contract/test_tasks_search.py
- [ ] T030 [P] [US3] Contract test for GET /api/tasks with sort parameters in backend/tests/contract/test_tasks_sort.py

### Implementation for User Story 3

- [X] T031 [P] [US3] Update TaskService to implement search functionality in backend/src/services/task_service.py
- [X] T032 [US3] Update TaskService to implement sorting functionality in backend/src/services/task_service.py
- [X] T033 [US3] Update GET /api/tasks endpoint to accept and process search and sort parameters in backend/src/api/task_routes.py
- [X] T034 [P] [US3] Create SearchBar component in frontend/src/components/SearchBar.js
- [X] T035 [US3] Create SortControls component in frontend/src/components/SortControls.js
- [X] T036 [US3] Update TaskList component to accept and apply search and sort in frontend/src/components/TaskList.js
- [X] T037 [US3] Integrate SearchBar and SortControls with TaskList in frontend/src/components/TaskList.js
- [X] T038 [US3] Update frontend API service to send search and sort parameters in frontend/src/services/taskApi.js

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Combined Filters and Search (Priority: P2)

**Goal**: Allow users to combine filters and search to narrow down task lists with multiple criteria simultaneously

**Independent Test**: Can be fully tested by applying multiple filters and search terms simultaneously and verifying that only tasks matching all criteria are displayed.

### Tests for User Story 4 (OPTIONAL - only if tests requested) ⚠️

- [ ] T039 [P] [US4] Contract test for GET /api/tasks with combined parameters in backend/tests/contract/test_tasks_combined.py

### Implementation for User Story 4

- [X] T040 [US4] Update TaskService to handle combined filters, search and sort in backend/src/services/task_service.py
- [X] T041 [US4] Update GET /api/tasks endpoint to properly combine all query parameters in backend/src/api/task_routes.py
- [X] T042 [US4] Update TaskList component to properly combine all filters, search and sort in frontend/src/components/TaskList.js
- [X] T043 [US4] Update frontend API service to send combined parameters in frontend/src/services/taskApi.js

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: User Story 5 - Real-time UI Updates (Priority: P3)

**Goal**: Update UI without full page reloads when applying filters, search, or sorting for smooth and responsive experience

**Independent Test**: Can be fully tested by applying filters, search, or sorting and verifying that the UI updates immediately without a full page refresh.

### Tests for User Story 5 (OPTIONAL - only if tests requested) ⚠️

- [ ] T044 [P] [US5] Integration test for real-time UI updates in frontend/tests/integration/test_ui_updates.js

### Implementation for User Story 5

- [X] T045 [US5] Optimize TaskList component for efficient re-rendering in frontend/src/components/TaskList.js
- [ ] T046 [US5] Implement client-side caching for improved performance in frontend/src/utils/cache.js
- [X] T047 [US5] Add loading indicators for filter/search/sort actions in frontend/src/components/LoadingIndicator.js
- [X] T048 [US5] Optimize API calls to prevent unnecessary requests in frontend/src/services/taskApi.js

**Checkpoint**: All user stories including real-time UI updates should now be functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T049 [P] Update documentation to reflect new features in docs/
- [ ] T050 Code cleanup and refactoring
- [ ] T051 Performance optimization across all stories
- [ ] T052 [P] Additional unit tests (if requested) in backend/tests/unit/ and frontend/tests/
- [ ] T053 Security hardening for new endpoints
- [ ] T054 Run quickstart.md validation

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
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 and US2
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Depends on US2 and US3 (needs filtering and search to combine)
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
Task: "Contract test for POST /api/tasks with priority and tags in backend/tests/contract/test_tasks_enhanced.py"
Task: "Unit test for Task creation with priority and tags in backend/tests/unit/test_task_model.py"

# Launch all implementation for User Story 1 together:
Task: "Update TaskForm component to include priority selection in frontend/src/components/TaskForm.js"
Task: "Update TaskForm component to include tags input in frontend/src/components/TaskForm.js"
Task: "Update Task creation page to use enhanced TaskForm in frontend/src/pages/CreateTaskPage.js"
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