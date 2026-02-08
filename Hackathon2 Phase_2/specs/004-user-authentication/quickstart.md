# Quickstart Guide: User Authentication & Secure Multi-User Todo System

## Prerequisites
- Node.js (v18 or higher)
- Python (v3.11 or higher)
- PostgreSQL (or access to Neon Serverless PostgreSQL)
- Git
- Redis (for JWT token storage and session management)

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

# Install dependencies (including new auth dependencies)
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Update .env with your database and JWT secret details
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (including new auth dependencies)
npm install
# or
yarn install
```

### 4. Database Setup
```bash
# From the backend directory with activated virtual environment
cd src

# Run database migrations to extend schema with user authentication tables
python -m alembic upgrade head
```

### 5. Running the Application

#### Backend (API Server)
```bash
# From the backend directory with activated virtual environment
cd src
python -m uvicorn main:app --reload --port 8000
```

#### Frontend (Development Server)
```bash
# From the frontend directory
npm run dev
# or
yarn dev
```

## New API Endpoints & Authentication

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and receive JWT token
- `POST /api/auth/refresh` - Refresh access token using refresh token

### Protected Task Endpoints (require JWT authentication)
- `GET /api/tasks` - Retrieve all tasks for authenticated user
- `POST /api/tasks` - Create a new task for authenticated user
- `GET /api/tasks/{id}` - Get a specific task (must belong to authenticated user)
- `PUT /api/tasks/{id}` - Update a specific task (must belong to authenticated user)
- `DELETE /api/tasks/{id}` - Delete a specific task (must belong to authenticated user)
- `PATCH /api/tasks/{id}/toggle-complete` - Toggle task completion status (must belong to authenticated user)

### Authentication Headers
For all protected endpoints, include the JWT token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://username:password@localhost:5432/todo_db
SECRET_KEY=your-super-secret-jwt-signing-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
DEBUG=true
REDIS_URL=redis://localhost:6379/0
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
1. **Authentication Error**: Ensure JWT tokens are properly formatted and not expired
2. **Database Migration Error**: Ensure the database connection is correct and run migrations with `python -m alembic upgrade head`
3. **Token Expiration**: Use the refresh endpoint to get a new access token when the current one expires
4. **Task Access Error**: Verify that the task belongs to the authenticated user
5. **Port Already in Use**: Change the port in the startup commands or terminate the conflicting process
6. **Dependency Issues**: Ensure you're using the correct Python/Node versions and clear dependency caches if needed
7. **Schema Extension Issues**: Verify that the existing data is compatible with the new schema changes