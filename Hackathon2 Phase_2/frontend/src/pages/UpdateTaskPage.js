// frontend/src/pages/UpdateTaskPage.js
import React, { useState, useEffect } from 'react';
import TaskEdit from '../components/TaskEdit';
import { taskApi } from '../services/api';

const UpdateTaskPage = ({ taskId }) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const taskData = await taskApi.getTaskById(taskId);
        setTask(taskData);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load task');
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const handleTaskSaved = (updatedTask) => {
    // Handle successful task update
    console.log('Task updated:', updatedTask);
    setTask(updatedTask);
    alert(`Task "${updatedTask.title}" updated successfully!`);
  };

  const handleCancel = () => {
    // Handle cancel action - maybe navigate back to task list
    console.log('Task update cancelled');
    window.history.back();
  };

  if (loading) {
    return <div>Loading task...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div className="update-task-page">
      <h1>Edit Task: {task.title}</h1>
      <TaskEdit task={task} onSave={handleTaskSaved} onCancel={handleCancel} />
    </div>
  );
};

export default UpdateTaskPage;