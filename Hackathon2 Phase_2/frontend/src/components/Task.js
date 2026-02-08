// frontend/src/components/Task.js
import React, { useState } from 'react';
import { taskApi } from '../services/api';

const Task = ({ task, onTaskUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || '',
    completed: task.completed,
    priority: task.priority || 'medium',
    due_date: task.due_date ? new Date(task.due_date) : null
  });

  const handleToggleComplete = async () => {
    try {
      const updatedTask = await taskApi.toggleTaskCompletion(task.id);
      if (onTaskUpdate) {
        onTaskUpdate(updatedTask);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updatedTask = await taskApi.updateTask(task.id, editData);
      if (onTaskUpdate) {
        onTaskUpdate(updatedTask);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleCancel = () => {
    setEditData({
      title: task.title,
      description: task.description || '',
      completed: task.completed,
      priority: task.priority || 'medium',
      due_date: task.due_date ? new Date(task.due_date) : null
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await taskApi.deleteTask(task.id);
      if (onTaskUpdate) {
        onTaskUpdate({ ...task, deleted: true });
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Determine border color based on priority
  const getPriorityBorderClass = () => {
    switch(task.priority) {
      case 'high':
        return 'border-l-4 border-l-red-500';
      case 'medium':
        return 'border-l-4 border-l-blue-500';
      case 'low':
        return 'border-l-4 border-l-green-500';
      default:
        return 'border-l-4 border-l-gray-300';
    }
  };

  return (
    <div className={`p-5 rounded-xl border transition-all duration-200 hover:shadow-md ${getPriorityBorderClass()} ${
      task.completed
        ? 'border-green-200 bg-green-50'
        : 'border-slate-200 bg-white'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <button
            onClick={handleToggleComplete}
            className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 transition-colors duration-200 ${
              task.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-slate-300 hover:border-green-400'
            }`}
            aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.completed && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2">
              <h3 className={`text-base font-medium truncate ${
                task.completed
                  ? 'line-through text-slate-500'
                  : 'text-slate-800'
              }`}>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                    className="w-full px-3 py-1 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                ) : (
                  task.title
                )}
              </h3>

              <span
                className={`px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${
                  task.priority === 'high'
                    ? 'bg-red-100 text-red-800'
                    : task.priority === 'low'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800' // Changed medium to blue
                }`}
                title={`Priority: ${task.priority}`}
              >
                {task.priority}
              </span>
            </div>

            {isEditing ? (
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({...editData, description: e.target.value})}
                className="mt-2 w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows="2"
              />
            ) : (
              <p className={`mt-2 text-sm text-slate-600`}> {/* Changed to slate-600 as requested */}
                {task.description || <span className="italic text-slate-400">No description</span>}
              </p>
            )}

            {task.due_date && (
              <div className="mt-3 flex items-center text-xs text-slate-500">
                <div className="bg-blue-100 p-1 rounded-md mr-2"> {/* Added colorful background for icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>Due: {formatDate(task.due_date)}</span>
              </div>
            )}

            {/* Task tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {task.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4 shrink-0">
          <div className="text-xs text-slate-400">
            {new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>

          {!isEditing ? (
            <div className="flex space-x-1">
              <button
                onClick={handleEdit}
                className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors duration-200"
                aria-label="Edit task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                aria-label="Delete task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex space-x-1">
              <button
                onClick={handleSave}
                className="p-1.5 rounded-md text-slate-500 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                aria-label="Save changes"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={handleCancel}
                className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors duration-200"
                aria-label="Cancel editing"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Task;