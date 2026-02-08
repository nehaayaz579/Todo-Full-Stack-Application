// frontend/src/components/TaskForm.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { taskApi } from '../services/api';
import { getRecurrenceOptions } from '../utils/recurringTaskUtils';

const TaskForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium'); // Default to medium
  const [dueDate, setDueDate] = useState(null);
  const [recurrencePattern, setRecurrencePattern] = useState('none');
  const [reminderTimeValue, setReminderTimeValue] = useState('');
  const [reminderTimeUnit, setReminderTimeUnit] = useState('minutes');
  const [tagsInput, setTagsInput] = useState(''); // Comma-separated tags input
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    // Process tags input: split by comma, trim whitespace, remove empty strings
    const processedTags = tagsInput.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');

    // Process reminder time if set
    let processedReminderTime = null;
    if (reminderTimeValue && dueDate) {
      const parsedValue = parseInt(reminderTimeValue, 10);
      if (!isNaN(parsedValue) && parsedValue > 0) {
        switch (reminderTimeUnit) {
          case 'minutes':
            processedReminderTime = parsedValue;
            break;
          case 'hours':
            processedReminderTime = parsedValue * 60;
            break;
          case 'days':
            processedReminderTime = parsedValue * 24 * 60;
            break;
          default:
            processedReminderTime = parsedValue;
        }
      }
    }

    try {
      const newTask = await taskApi.createTask({
        title: title.trim(),
        description: description.trim(),
        priority: priority,
        due_date: dueDate,
        recurrence_pattern: recurrencePattern,
        reminder_time: processedReminderTime,
        tag_names: processedTags
      });

      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate(null);
      setRecurrencePattern('none');
      setReminderTimeValue('');
      setReminderTimeUnit('minutes');
      setTagsInput('');
      setError('');

      // Call parent callback with new task
      if (onSubmit) {
        onSubmit(newTask);
      }
    } catch (err) {
      setError(err.message || 'Failed to create task');
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-linear-to-br from-blue-100 to-indigo-100 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-800">Create New Task</h3>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
            Task Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            maxLength={255}
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details about the task (optional)"
            maxLength={1000}
            rows="3"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-2">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label htmlFor="recurrence" className="block text-sm font-medium text-slate-700 mb-2">
              Recurrence
            </label>
            <select
              id="recurrence"
              value={recurrencePattern}
              onChange={(e) => setRecurrencePattern(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            >
              {getRecurrenceOptions().map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="due-date" className="block text-sm font-medium text-slate-700 mb-2">
              Due Date & Time
            </label>
            <DatePicker
              id="due-date"
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              placeholderText="Select due date and time"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Set Reminder
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={reminderTimeValue}
                onChange={(e) => setReminderTimeValue(e.target.value)}
                placeholder="Time"
                min="1"
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
              <select
                value={reminderTimeUnit}
                onChange={(e) => setReminderTimeUnit(e.target.value)}
                className="w-28 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              >
                <option value="minutes">minutes</option>
                <option value="hours">hours</option>
                <option value="days">days</option>
              </select>
            </div>
            <p className="mt-1 text-xs text-slate-500">before due date</p>
          </div>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-2">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Add tags separated by commas (e.g., work, urgent)"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          />
          <p className="mt-1 text-xs text-slate-500">Separate multiple tags with commas</p>
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            className="flex-1 py-3 px-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Add Task</span>
            </div>
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="py-3 px-4 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskForm;