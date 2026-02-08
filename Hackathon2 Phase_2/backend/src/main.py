import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import all models to ensure they are registered with SQLModel
# Commenting out temporarily to isolate the issue
# from models import User, Task, Tag, TaskTag, ScheduledReminder, RefreshToken

from api.task_routes import router as task_router
from api.tag_routes import router as tag_router
from api.auth import router as auth_router
from config import settings


def create_app():
    app = FastAPI(
        title="Todo API",
        description="API for managing todo tasks with organization and search features",
        version="1.1.0",
        debug=settings.DEBUG
    )
    #####


    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(task_router, prefix="/api", tags=["tasks"])
    app.include_router(tag_router, prefix="/api", tags=["tags"])
    app.include_router(auth_router, prefix="/api", tags=["auth"])

    @app.get("/")
    def read_root():
        return {"message": "Welcome to the Todo API with Organization & Search"}

    return app


app = create_app()