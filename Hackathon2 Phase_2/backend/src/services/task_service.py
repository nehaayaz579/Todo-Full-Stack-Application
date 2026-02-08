from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
from models.task_model import Task, TaskCreate, TaskUpdate, RecurrencePatternEnum
from models.user import User


class TaskService:
    def __init__(self, session: Session):
        self.session = session

    def create_task(self, task_data: TaskCreate, user_id: int) -> Task:
        """Create a new task for a specific user"""
        # Process tags if provided
        tag_names = getattr(task_data, 'tag_names', [])

        # Create the task with user_id
        task_dict = task_data.dict()
        # Remove tag_names from the dict as it's not a field in the Task model
        tag_names = task_dict.pop('tag_names', [])

        task = Task(**task_dict, user_id=user_id)
        self.session.add(task)
        self.session.flush()  # Get the task ID before associating tags

        # Associate tags with the task if provided
        if tag_names:
            from models.task_model import Tag, TaskTag
            for tag_name in tag_names:
                # Get or create tag
                tag_stmt = select(Tag).where(Tag.name == tag_name)
                tag_result = self.session.exec(tag_stmt).first()

                if not tag_result:
                    tag_result = Tag(name=tag_name)
                    self.session.add(tag_result)
                    self.session.flush()

                # Create the association
                task_tag = TaskTag(task_id=task.id, tag_id=tag_result.id)
                self.session.add(task_tag)

        self.session.commit()
        self.session.refresh(task)
        return task

    def get_task_by_id(self, task_id: int, user_id: int) -> Optional[Task]:
        """Get a task by its ID for a specific user"""
        statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
        task = self.session.exec(statement).first()
        return task

    def get_all_tasks(
        self, 
        user_id: int,
        search: Optional[str] = None, 
        priority: Optional[str] = None, 
        completed: Optional[bool] = None, 
        tag: Optional[str] = None,
        due_status: Optional[str] = None,  # overdue, due_today, upcoming
        sort: Optional[str] = "created_at",
        order: Optional[str] = "desc"
    ) -> List[Task]:
        """Get all tasks for a specific user with optional filtering, searching, and sorting"""
        statement = select(Task).where(Task.user_id == user_id)
        
        # Apply filters
        if search and search.strip():  # Check if search is not None and not just whitespace
            # Using coalesce to handle null descriptions properly
            from sqlalchemy import func
            statement = statement.where(
                (Task.title.contains(search)) |
                (func.coalesce(Task.description, '').contains(search))
            )

        if priority:
            statement = statement.where(Task.priority == priority)

        if completed is not None:
            statement = statement.where(Task.completed == completed)

        if due_status:
            today_start = datetime.combine(datetime.utcnow().date(), datetime.min.time())
            today_end = datetime.combine(datetime.utcnow().date(), datetime.max.time())
            
            if due_status == "overdue":
                statement = statement.where(
                    Task.due_date < datetime.utcnow(),
                    Task.completed == False,
                    Task.due_date.is_not(None)
                )
            elif due_status == "due_today":
                statement = statement.where(
                    Task.due_date >= today_start,
                    Task.due_date <= today_end,
                    Task.completed == False,
                    Task.due_date.is_not(None)
                )
            elif due_status == "upcoming":
                statement = statement.where(
                    Task.due_date > datetime.utcnow(),
                    Task.completed == False,
                    Task.due_date.is_not(None)
                )

        # Apply sorting
        if sort == "priority":
            if order == "desc":
                from sqlalchemy import desc
                statement = statement.order_by(desc(Task.priority), desc(Task.created_at))
            else:
                statement = statement.order_by(Task.priority, Task.created_at)
        elif sort == "created_at":
            if order == "desc":
                from sqlalchemy import desc
                statement = statement.order_by(desc(Task.created_at))
            else:
                statement = statement.order_by(Task.created_at)
        elif sort == "due_date":
            if order == "desc":
                from sqlalchemy import desc
                statement = statement.order_by(desc(Task.due_date))
            else:
                statement = statement.order_by(Task.due_date)

        # Execute query
        try:
            tasks = self.session.exec(statement).all()
        except Exception as e:
            # Return empty list if query fails
            print(f"Query failed: {str(e)}")  # This would typically go to a logger
            return []
        return tasks

    def update_task(self, task_id: int, user_id: int, task_data: TaskUpdate) -> Optional[Task]:
        """Update a task for a specific user"""
        task = self.session.exec(
            select(Task).where(Task.id == task_id, Task.user_id == user_id)
        ).first()

        if not task:
            return None

        # Update fields that are provided
        update_data = task_data.dict(exclude_unset=True)
        tag_names = update_data.pop('tag_names', None)

        for field, value in update_data.items():
            setattr(task, field, value)

        # Handle tag updates if provided
        if tag_names is not None:
            from models.task_model import Tag, TaskTag
            # Remove existing tags
            from sqlalchemy import delete
            stmt_delete = delete(TaskTag).where(TaskTag.task_id == task_id)
            self.session.execute(stmt_delete)

            # Add new tags
            for tag_name in tag_names:
                # Get or create tag
                tag_stmt = select(Tag).where(Tag.name == tag_name)
                tag_result = self.session.exec(tag_stmt).first()

                if not tag_result:
                    tag_result = Tag(name=tag_name)
                    self.session.add(tag_result)
                    self.session.flush()

                # Create the association
                task_tag = TaskTag(task_id=task.id, tag_id=tag_result.id)
                self.session.add(task_tag)

        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task

    def delete_task(self, task_id: int, user_id: int) -> bool:
        """Delete a task for a specific user"""
        task = self.session.exec(
            select(Task).where(Task.id == task_id, Task.user_id == user_id)
        ).first()
        
        if not task:
            return False

        self.session.delete(task)
        self.session.commit()
        return True

    def toggle_task_completion(self, task_id: int, user_id: int) -> Optional[Task]:
        """Toggle the completion status of a task for a specific user"""
        try:
            task = self.session.exec(
                select(Task).where(Task.id == task_id, Task.user_id == user_id)
            ).first()

            if not task:
                return None

            task.completed = not task.completed

            # If this is a recurring task, create the next occurrence
            if task.recurrence_pattern != RecurrencePatternEnum.none:
                try:
                    self._create_next_occurrence(task)
                except Exception as recurring_error:
                    # Log the error but don't fail the toggle operation
                    print(f"Warning: Failed to create next occurrence for recurring task {task.id}: {str(recurring_error)}")
                    # Continue with the toggle even if recurring task creation fails

            self.session.add(task)
            self.session.commit()
            self.session.refresh(task)
            return task
        except Exception as e:
            # Rollback the transaction in case of error
            self.session.rollback()
            raise e

    def _create_next_occurrence(self, task: Task):
        """Create the next occurrence of a recurring task"""
        from workers.recurring_task_worker import create_recurring_task_instance

        # Schedule the creation of the next occurrence in the background
        create_recurring_task_instance.delay(task.id)

    def get_pending_reminders(self):
        """Get all pending reminders that should have been triggered"""
        from models.scheduled_reminder_model import ScheduledReminder
        pending_reminders = self.session.exec(
            select(ScheduledReminder).where(
                ScheduledReminder.scheduled_time < datetime.utcnow(),
                ScheduledReminder.triggered == False
            )
        ).all()
        return pending_reminders