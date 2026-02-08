from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session
from typing import List, Optional
from database import get_session
from models.task_model import Task, TaskCreate, TaskUpdate, PriorityEnum
from services.task_service import TaskService
from middleware.auth_middleware import get_current_user
from models.user import User


router = APIRouter()


@router.post("/tasks", response_model=Task, status_code=201)
def create_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create a new task for the authenticated user"""
    try:
        task_service = TaskService(session)
        task = task_service.create_task(task_data, current_user.id)
        return task
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to create task")


@router.get("/tasks", response_model=List[Task])
def get_tasks(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
    search: Optional[str] = Query(None, description="Search term to filter tasks by title or description"),
    priority: Optional[PriorityEnum] = Query(None, description="Filter tasks by priority (low, medium, high)"),
    completed: Optional[bool] = Query(None, description="Filter tasks by completion status"),
    tag: Optional[str] = Query(None, description="Filter tasks by tag name"),
    due_status: Optional[str] = Query(None, description="Filter tasks by due status (overdue, due_today, upcoming)"),
    sort: Optional[str] = Query("created_at", description="Sort tasks by field (created_at, priority, due_date)"),
    order: Optional[str] = Query("desc", description="Sort order (asc, desc)")
):
    """Get all tasks for the authenticated user with optional filtering, searching, and sorting"""
    try:
        task_service = TaskService(session)
        # Safely handle empty or missing search query
        search_param = search if search and search.strip() else None
        
        tasks = task_service.get_all_tasks(
            user_id=current_user.id,
            search=search_param,
            priority=priority,
            completed=completed,
            tag=tag,
            due_status=due_status,
            sort=sort,
            order=order
        )
        return tasks
    except Exception as e:
        # Log the actual error for debugging
        print(f"Error retrieving tasks: {str(e)}")  # This would typically go to a logger
        raise HTTPException(status_code=500, detail="Failed to retrieve tasks")


@router.get("/tasks/{id}", response_model=Task)
def get_task(
    id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get a specific task by ID for the authenticated user"""
    try:
        task_service = TaskService(session)
        task = task_service.get_task_by_id(id, current_user.id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        return task
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to retrieve task")


@router.put("/tasks/{id}", response_model=Task)
def update_task(
    id: int,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Update a specific task by ID for the authenticated user"""
    try:
        task_service = TaskService(session)
        task = task_service.update_task(id, current_user.id, task_data)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        return task
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to update task")


@router.delete("/tasks/{id}", status_code=204)
def delete_task(
    id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Delete a specific task by ID for the authenticated user"""
    try:
        task_service = TaskService(session)
        success = task_service.delete_task(id, current_user.id)
        if not success:
            raise HTTPException(status_code=404, detail="Task not found")
        return {"message": "Task deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to delete task")


@router.patch("/tasks/{id}/toggle-complete", response_model=Task)
def toggle_task_complete(
    id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Toggle the completion status of a specific task for the authenticated user"""
    try:
        task_service = TaskService(session)
        task = task_service.toggle_task_completion(id, current_user.id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        return task
    except HTTPException:
        raise
    except Exception as e:
        # Log the actual error for debugging
        print(f"Error toggling task completion: {str(e)}")  # This would typically go to a logger
        raise HTTPException(status_code=500, detail="Failed to toggle task completion")