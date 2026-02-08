// frontend/src/pages/TaskListPage.js
import React from 'react';
import TaskList from '../components/TaskList';

const TaskListPage = () => {
  return (
    <div className="task-list-page">
      <h1>Your Tasks</h1>
      <TaskList />
    </div>
  );
};

export default TaskListPage;