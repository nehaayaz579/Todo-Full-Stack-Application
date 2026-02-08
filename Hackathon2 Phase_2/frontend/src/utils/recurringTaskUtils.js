// frontend/src/utils/recurringTaskUtils.js

/**
 * Format recurrence pattern for display
 * @param {string} pattern - The recurrence pattern ('none', 'daily', 'weekly', 'monthly')
 * @returns {string} Formatted recurrence string
 */
export const formatRecurrencePattern = (pattern) => {
  switch (pattern) {
    case 'none':
      return 'Does not repeat';
    case 'daily':
      return 'Repeats daily';
    case 'weekly':
      return 'Repeats weekly';
    case 'monthly':
      return 'Repeats monthly';
    default:
      return pattern;
  }
};

/**
 * Get recurrence options for dropdown selection
 * @returns {Array} Array of recurrence option objects
 */
export const getRecurrenceOptions = () => [
  { value: 'none', label: 'Does not repeat' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

/**
 * Calculate the next occurrence date based on recurrence pattern
 * @param {Date} lastOccurrence - The date of the last occurrence
 * @param {string} pattern - The recurrence pattern ('daily', 'weekly', 'monthly')
 * @returns {Date} The calculated next occurrence date
 */
export const calculateNextOccurrence = (lastOccurrence, pattern) => {
  if (!lastOccurrence || !pattern || pattern === 'none') return null;
  
  const nextDate = new Date(lastOccurrence);
  
  switch (pattern) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      // Add one month to the date
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    default:
      return null;
  }
  
  return nextDate;
};

/**
 * Validate recurrence settings
 * @param {string} pattern - The recurrence pattern
 * @returns {Array} Array of validation errors
 */
export const validateRecurrence = (pattern) => {
  const errors = [];
  
  if (pattern && !['none', 'daily', 'weekly', 'monthly'].includes(pattern)) {
    errors.push('Invalid recurrence pattern');
  }
  
  return errors;
};

/**
 * Check if a task is recurring
 * @param {string} pattern - The recurrence pattern
 * @returns {boolean} True if the task is recurring
 */
export const isRecurringTask = (pattern) => {
  return pattern && pattern !== 'none';
};