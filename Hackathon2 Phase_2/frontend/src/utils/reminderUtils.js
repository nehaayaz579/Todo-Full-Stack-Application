// frontend/src/utils/reminderUtils.js

/**
 * Format reminder time for display
 * @param {number} minutesBefore - Minutes before due date to trigger reminder
 * @returns {string} Formatted reminder time string
 */
export const formatReminderTime = (minutesBefore) => {
  if (!minutesBefore) return 'No reminder set';
  
  if (minutesBefore < 60) {
    return `${minutesBefore} minutes before`;
  } else if (minutesBefore < 1440) { // Less than a day
    const hours = Math.floor(minutesBefore / 60);
    const minutes = minutesBefore % 60;
    if (minutes > 0) {
      return `${hours}h ${minutes}m before`;
    } else {
      return `${hours} hours before`;
    }
  } else { // More than a day
    const days = Math.floor(minutesBefore / 1440);
    const hours = Math.floor((minutesBefore % 1440) / 60);
    if (hours > 0) {
      return `${days}d ${hours}h before`;
    } else {
      return `${days} days before`;
    }
  }
};

/**
 * Parse reminder time from user input
 * @param {string} timeUnit - The unit of time (minutes, hours, days)
 * @param {number} timeValue - The value for the time unit
 * @returns {number} Minutes before due date
 */
export const parseReminderTime = (timeUnit, timeValue) => {
  if (!timeValue || !timeUnit) return null;
  
  switch (timeUnit) {
    case 'minutes':
      return timeValue;
    case 'hours':
      return timeValue * 60;
    case 'days':
      return timeValue * 24 * 60;
    default:
      return timeValue;
  }
};

/**
 * Calculate the reminder time based on due date and reminder offset
 * @param {Date} dueDate - The task's due date
 * @param {number} minutesBefore - Minutes before due date to trigger reminder
 * @returns {Date} The calculated reminder time
 */
export const calculateReminderTime = (dueDate, minutesBefore) => {
  if (!dueDate || !minutesBefore) return null;
  
  const reminderTime = new Date(dueDate);
  reminderTime.setMinutes(reminderTime.getMinutes() - minutesBefore);
  return reminderTime;
};

/**
 * Validate reminder settings
 * @param {Date} dueDate - The task's due date
 * @param {number} minutesBefore - Minutes before due date to trigger reminder
 * @returns {Array} Array of validation errors
 */
export const validateReminder = (dueDate, minutesBefore) => {
  const errors = [];
  
  if (!dueDate) {
    errors.push('Due date is required to set a reminder');
  }
  
  if (minutesBefore && minutesBefore <= 0) {
    errors.push('Reminder time must be greater than 0 minutes');
  }
  
  if (dueDate && minutesBefore) {
    const reminderTime = calculateReminderTime(dueDate, minutesBefore);
    if (reminderTime && reminderTime > new Date()) {
      // Valid case - reminder is in the future
    } else if (reminderTime && reminderTime <= new Date()) {
      errors.push('Reminder time cannot be in the past');
    }
  }
  
  return errors;
};