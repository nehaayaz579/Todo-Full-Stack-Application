# Todo Full-Stack Web Application

This is a full-stack todo application built with Next.js 16+ (frontend) and FastAPI (backend) with PostgreSQL database.

## Features

- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- View all tasks in a list
- Responsive web interface

## Tech Stack

- **Frontend**: Next.js 16+, React, JavaScript
- **Backend**: Python, FastAPI
- **Database**: PostgreSQL with SQLModel ORM
- **API**: RESTful endpoints

## Project Structure

```
backend/
├── src/
│   ├── models/          # Data models
│   ├── services/        # Business logic
│   ├── api/             # API routes
│   ├── db/              # Database configuration
│   ├── utils/           # Utility functions
│   ├── exceptions/      # Exception handlers
│   └── main.py          # Main application entry point
└── requirements.txt

frontend/
├── src/
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── services/        # API service
│   └── styles/          # CSS styles
└── package.json
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your database connection details.

6. Run the application:
   ```bash
   cd src
   uvicorn main:app --reload --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /api/tasks` - Retrieve all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get a specific task
- `PUT /api/tasks/{id}` - Update a specific task
- `DELETE /api/tasks/{id}` - Delete a specific task
- `PATCH /api/tasks/{id}/toggle-complete` - Toggle task completion status