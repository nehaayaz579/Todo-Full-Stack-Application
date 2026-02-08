// frontend/src/components/TaskEdit.js
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { taskApi } from '../services/api';
import { getRecurrenceOptions } from '../utils/recurringTaskUtils';
import { validateReminder } from '../utils/reminderUtils';

const TaskEdit = ({ task, onSave, onCancel }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState(task.priority || 'medium');
  const [dueDate, setDueDate] = useState(task.due_date ? new Date(task.due_date) : null);
  const [recurrencePattern, setRecurrencePattern] = useState(task.recurrence_pattern || 'none');
  const [reminderTimeValue, setReminderTimeValue] = useState('');
  const [reminderTimeUnit, setReminderTimeUnit] = useState('minutes');
  const [tagsInput, setTagsInput] = useState(task.tags ? task.tags.join(', ') : '');
  const [error, setError] = useState('');

  // Initialize reminder time fields based on task's reminder_time
  useEffect(() => {
    if (task.reminder_time) {
      if (task.reminder_time % 1440 === 0) { // Days
        setReminderTimeValue(task.reminder_time / 1440);
        setReminderTimeUnit('days');
      } else if (task.reminder_time % 60 === 0) { // Hours
        setReminderTimeValue(task.reminder_time / 60);
        setReminderTimeUnit('hours');
      } else { // Minutes
        setReminderTimeValue(task.reminder_time);
        setReminderTimeUnit('minutes');
      }
    } else {
      setReminderTimeValue('');
    }
  }, [task]);

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
    if (reminderTimeValue) {
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

    // Validate reminder settings
    if (dueDate && processedReminderTime) {
      const validationErrors = validateReminder(dueDate, processedReminderTime);
      if (validationErrors.length > 0) {
        setError(validationErrors[0]);
        return;
      }
    }

    try {
      const updatedTask = await taskApi.updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
        priority: priority,
        due_date: dueDate,
        recurrence_pattern: recurrencePattern,
        reminder_time: processedReminderTime,
        tag_names: processedTags
      });

      // Reset form
      setError('');

      // Call parent callback with updated task
      if (onSave) {
        onSave(updatedTask);
      }
    } catch (err) {
      setError(err.message || 'Failed to update task');
    }
  };

  return (
    <div className="task-edit-container">
      <h3>Edit Task</h3>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="edit-title">Title *</label>
          <input
            type="text"
            id="edit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            maxLength={255}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-description">Description</label>
          <textarea
            id="edit-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description (optional)"
            maxLength={1000}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-priority">Priority</label>
          <select
            id="edit-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="edit-due-date">Due Date & Time</label>
          <DatePicker
            id="edit-due-date"
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            placeholderText="Select due date and time"
            className="date-picker"
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-recurrence">Recurrence Pattern</label>
          <select
            id="edit-recurrence"
            value={recurrencePattern}
            onChange={(e) => setRecurrencePattern(e.target.value)}
          >
            {getRecurrenceOptions().map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="edit-reminder-time-value">Set Reminder</label>
          <div className="reminder-inputs">
            <input
              type="number"
              id="edit-reminder-time-value"
              value={reminderTimeValue}
              onChange={(e) => setReminderTimeValue(e.target.value)}
              placeholder="Time before due"
              min="1"
              className="reminder-value-input"
            />
            <select
              id="edit-reminder-time-unit"
              value={reminderTimeUnit}
              onChange={(e) => setReminderTimeUnit(e.target.value)}
              className="reminder-unit-select"
            >
              <option value="minutes">minutes</option>
              <option value="hours">hours</option>
              <option value="days">days</option>
            </select>
            <span>before due date</span>
          </div>
          {dueDate && reminderTimeValue && (
            <small className="reminder-preview">
              Reminder will be set for {new Date(
                new Date(dueDate).getTime() - (parseInt(reminderTimeValue) * 
                (reminderTimeUnit === 'hours' ? 60 : 
                 reminderTimeUnit === 'days' ? 1440 : 1)) * 60000
              ).toLocaleString()}
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="edit-tags">Tags</label>
          <input
            type="text"
            id="edit-tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Enter tags separated by commas (e.g., work, urgent)"
          />
          <small>Separate multiple tags with commas</small>
        </div>

        <div className="form-actions">
          <button type="submit">Save Changes</button>
          {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
        </div>
      </form>
    </div>
  );
};

export default TaskEdit;