from celery import Celery
from ..config import settings


# Create Celery instance
celery_app = Celery("todo_app")

# Configure Celery
celery_app.conf.update(
    broker_url=settings.REDIS_URL,
    result_backend=settings.REDIS_URL,
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    worker_prefetch_multiplier=1,
    task_acks_late=True,
    worker_max_tasks_per_child=1000,
    worker_max_memory_per_child=100000,  # in KB
)

# Import tasks to register them with Celery
from . import reminder_worker, recurring_task_worker


if __name__ == "__main__":
    celery_app.start()