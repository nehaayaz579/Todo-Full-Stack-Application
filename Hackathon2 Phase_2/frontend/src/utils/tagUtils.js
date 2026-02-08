// frontend/src/utils/tagUtils.js

/**
 * Extract unique tags from a list of tasks
 * @param {Array} tasks - Array of task objects
 * @returns {Array} - Array of unique tag names
 */
export const extractUniqueTags = (tasks) => {
  const allTags = tasks.flatMap(task => task.tags || []);
  return [...new Set(allTags)];
};

/**
 * Filter tasks by tag
 * @param {Array} tasks - Array of task objects
 * @param {string} tagName - Tag name to filter by
 * @returns {Array} - Filtered array of task objects
 */
export const filterTasksByTag = (tasks, tagName) => {
  if (!tagName) return tasks;
  return tasks.filter(task => 
    task.tags && task.tags.includes(tagName)
  );
};

/**
 * Filter tasks by priority
 * @param {Array} tasks - Array of task objects
 * @param {string} priority - Priority level to filter by (low, medium, high)
 * @returns {Array} - Filtered array of task objects
 */
export const filterTasksByPriority = (tasks, priority) => {
  if (!priority) return tasks;
  return tasks.filter(task => task.priority === priority);
};

/**
 * Filter tasks by completion status
 * @param {Array} tasks - Array of task objects
 * @param {boolean} completed - Completion status to filter by
 * @returns {Array} - Filtered array of task objects
 */
export const filterTasksByCompletion = (tasks, completed) => {
  if (completed === undefined || completed === null) return tasks;
  return tasks.filter(task => task.completed === completed);
};

/**
 * Search tasks by title or description
 * @param {Array} tasks - Array of task objects
 * @param {string} searchTerm - Term to search for
 * @returns {Array} - Filtered array of task objects
 */
export const searchTasks = (tasks, searchTerm) => {
  if (!searchTerm) return tasks;
  const lowerSearchTerm = searchTerm.toLowerCase();
  return tasks.filter(task => 
    (task.title && task.title.toLowerCase().includes(lowerSearchTerm)) ||
    (task.description && task.description.toLowerCase().includes(lowerSearchTerm))
  );
};

/**
 * Sort tasks by specified field
 * @param {Array} tasks - Array of task objects
 * @param {string} sortBy - Field to sort by ('created_at', 'priority')
 * @param {string} sortOrder - Sort order ('asc', 'desc')
 * @returns {Array} - Sorted array of task objects
 */
export const sortTasks = (tasks, sortBy = 'created_at', sortOrder = 'desc') => {
  return [...tasks].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'priority') {
      // Define priority order: high > medium > low
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
    } else if (sortBy === 'created_at') {
      comparison = new Date(b.created_at) - new Date(a.created_at);
    }
    
    // If ascending order is requested, reverse the comparison
    return sortOrder === 'asc' ? -comparison : comparison;
  });
};

/**
 * Apply all filters to tasks
 * @param {Array} tasks - Array of task objects
 * @param {Object} filters - Object containing filter parameters
 * @returns {Array} - Filtered and sorted array of task objects
 */
export const applyFilters = (tasks, filters) => {
  let filteredTasks = [...tasks];
  
  // Apply search
  if (filters.search) {
    filteredTasks = searchTasks(filteredTasks, filters.search);
  }
  
  // Apply priority filter
  if (filters.priority) {
    filteredTasks = filterTasksByPriority(filteredTasks, filters.priority);
  }
  
  // Apply completion status filter
  if (filters.completed !== undefined && filters.completed !== null) {
    filteredTasks = filterTasksByCompletion(filteredTasks, filters.completed);
  }
  
  // Apply tag filter
  if (filters.tag) {
    filteredTasks = filterTasksByTag(filteredTasks, filters.tag);
  }
  
  // Apply sorting
  filteredTasks = sortTasks(filteredTasks, filters.sort, filters.order);
  
  return filteredTasks;
};