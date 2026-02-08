// frontend/src/components/TaskVisualIndicator.js
import React from 'react';

const TaskVisualIndicator = ({ task }) => {
  if (!task || !task.due_date) {
    return null; // No indicator needed for tasks without due dates
  }

  const dueDate = new Date(task.due_date);
  const today = new Date();
  
  // Set time to midnight for accurate comparison
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);
  
  const isOverdue = dueDate < today && !task.completed;
  const isDueToday = dueDate.getTime() === today.getTime() && !task.completed;
  
  let indicatorClass = '';
  let indicatorText = '';

  if (isOverdue) {
    indicatorClass = 'task-overdue';
    indicatorText = 'Overdue';
  } else if (isDueToday) {
    indicatorClass = 'task-due-today';
    indicatorText = 'Due Today';
  } else {
    indicatorClass = 'task-upcoming';
    indicatorText = 'Upcoming';
  }

  return (
    <span className={`task-visual-indicator ${indicatorClass}`}>
      {indicatorText}
    </span>
  );
};

export default TaskVisualIndicator;