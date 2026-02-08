// frontend/src/pages/CreateTaskPage.js
import React from 'react';
import TaskForm from '../components/TaskForm';

const CreateTaskPage = () => {
  const handleTaskCreated = (newTask) => {
    // Handle successful task creation
    console.log('Task created:', newTask);
    // In a real app, you might redirect to the task list or show a success message
    alert(`Task "${newTask.title}" created successfully!`);
  };

  const handleCancel = () => {
    // Handle cancel action - maybe navigate back to task list
    console.log('Task creation cancelled');
    window.history.back();
  };

  return (
    <div className="create-task-page">
      <h1>Create New Task</h1>
      <TaskForm onSubmit={handleTaskCreated} onCancel={handleCancel} />
    </div>
  );
};

export default CreateTaskPage;