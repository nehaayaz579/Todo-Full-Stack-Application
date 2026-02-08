# Quickstart Guide: Advanced Task Scheduling & Automation

## Prerequisites
- Node.js (v18 or higher)
- Python (v3.11 or higher)
- PostgreSQL (or access to Neon Serverless PostgreSQL)
- Redis (for background job queue)
- Celery (for background job processing)
- Git

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install additional dependencies for scheduling features
pip install celery redis

# Set up environment variables
cp .env.example .env
# Update .env with your database and Redis connection details
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
# or
yarn install
```

### 4. Database Setup
```bash
# From the backend directory with activated virtual environment
cd src

# Run database migrations to extend schema with scheduling fields
python -m alembic upgrade head
```

### 5. Running the Application

#### Backend (API Server)
```bash
# From the backend directory with activated virtual environment
cd src
python -m uvicorn main:app --reload --port 8000
```

#### Background Workers
```bash
# From the backend directory with activated virtual environment
celery -A src.workers.celery_app worker --loglevel=info
```

#### Scheduler (for periodic tasks)
```bash
# From the backend directory with activated virtual environment
celery -A src.workers.celery_app beat --loglevel=info
```

#### Frontend (Development Server)
```bash
# From the frontend directory
npm run dev
# or
yarn dev
```

## New API Endpoints & Parameters

### Base URL: `http://localhost:8000`

#### Enhanced GET /api/tasks with query parameters:
- `GET /api/tasks?due_status=overdue` - Filter tasks by due status (overdue, due_today, upcoming)
- `GET /api/tasks?search=keyword` - Search tasks by title or description
- `GET /api/tasks?priority=high` - Filter tasks by priority (low, medium, high)
- `GET /api/tasks?completed=true` - Filter tasks by completion status
- `GET /api/tasks?tag=work` - Filter tasks by tag name
- `GET /api/tasks?sort=due_date&order=asc` - Sort tasks by due date

### Scheduling-Specific Endpoints:
- `GET /api/scheduled-reminders` - Get all scheduled reminders
- `GET /api/scheduled-reminders/{id}` - Get a specific scheduled reminder
- `DELETE /api/scheduled-reminders/{id}` - Cancel a scheduled reminder

### Original Endpoints (maintained for backward compatibility):
- `POST /api/tasks` - Create a new task (now supports due dates, recurrence, and reminders)
- `GET /api/tasks/{id}` - Get a specific task
- `PUT /api/tasks/{id}` - Update a specific task (now supports due dates, recurrence, and reminders)
- `DELETE /api/tasks/{id}` - Delete a specific task
- `PATCH /api/tasks/{id}/toggle-complete` - Toggle task completion status

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://username:password@localhost:5432/todo_db
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
SECRET_KEY=your-secret-key-here
DEBUG=true
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Testing

### Backend Tests
```bash
# From the backend directory
pytest
```

### Frontend Tests
```bash
# From the frontend directory
npm run test
# or
yarn test
```

## Building for Production

### Backend
```bash
# The backend is typically deployed as-is with a WSGI/ASGI server like Gunicorn
pip install gunicorn
gunicorn src.main:app -w 4 -k uvicorn.workers.UvicornWorker

# Run background workers in production
celery -A src.workers.celery_app worker --loglevel=info --detach
celery -A src.workers.celery_app beat --loglevel=info --detach
```

### Frontend
```bash
# Build the production version
npm run build
# or
yarn build

# Run the production server
npm run start
# or
yarn start
```

## Troubleshooting

### Common Issues
1. **Redis Connection Error**: Ensure Redis is running and connection details in `.env` are correct
2. **Celery Worker Not Processing Jobs**: Check that both the worker and beat processes are running
3. **Reminder Timing Issues**: Verify system clock accuracy and timezone settings
4. **Database Migration Error**: Ensure the database connection is correct and run migrations with `python -m alembic upgrade head`
5. **Port Already in Use**: Change the port in the startup commands or terminate the conflicting process
6. **Dependency Issues**: Ensure you're using the correct Python/Node versions and clear dependency caches if needed