// frontend/src/components/TaskList.js
import React, { useState, useEffect } from 'react';
import Task from './Task';
import { taskApi } from '../services/api';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all, pending, completed

  // Filter states
  const [priorityFilter, setPriorityFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('created_at'); // Default sort by creation date

  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch tasks whenever filters change
  useEffect(() => {
    fetchTasks();
  }, [priorityFilter, activeFilter, tagFilter, searchQuery, sortOption]);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      // Prepare filter parameters
      const filters = {};
      if (priorityFilter) filters.priority = priorityFilter;
      if (activeFilter !== 'all') filters.completed = activeFilter === 'completed';
      if (tagFilter) filters.tag = tagFilter;
      if (searchQuery) filters.search = searchQuery;
      if (sortOption) {
        // Map our sort options to backend API parameters
        if (sortOption === 'created_at' || sortOption === 'priority') {
          filters.sort = sortOption;
          filters.order = 'desc'; // Default descending order
        }
      }

      const tasksData = await taskApi.getAllTasks(filters);
      setTasks(tasksData);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to tasks (client-side filtering in addition to server-side)
  const filteredTasks = tasks.filter(task => {
    // Priority filter
    if (priorityFilter && task.priority !== priorityFilter) {
      return false;
    }

    // Status filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'completed' && !task.completed) return false;
      if (activeFilter === 'pending' && task.completed) return false;
    }

    // Tag filter
    if (tagFilter && (!task.tags || !task.tags.includes(tagFilter))) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(query);
      const matchesDescription = task.description && task.description.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDescription) return false;
    }

    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOption === 'priority') {
      // Define priority order: high > medium > low
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    } else if (sortOption === 'created_at') {
      // Sort by creation date (newest first)
      return new Date(b.created_at) - new Date(a.created_at);
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-linear-to-r from-blue-200/50 to-indigo-200/50 rounded w-1/4"></div>
            <div className="h-6 bg-linear-to-r from-blue-200/50 to-indigo-200/50 rounded w-1/6"></div>
          </div>

          <div className="flex space-x-2">
            <div className="h-10 bg-linear-to-r from-blue-200/50 to-indigo-200/50 rounded-lg w-20"></div>
            <div className="h-10 bg-linear-to-r from-blue-200/50 to-indigo-200/50 rounded-lg w-24"></div>
            <div className="h-10 bg-linear-to-r from-blue-200/50 to-indigo-200/50 rounded-lg w-24"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="h-10 bg-linear-to-r from-blue-200/50 to-indigo-200/50 rounded-md"></div>
            <div className="h-10 bg-linear-to-r from-blue-200/50 to-indigo-200/50 rounded-md"></div>
            <div className="h-10 bg-linear-to-r from-blue-200/50 to-indigo-200/50 rounded-md"></div>
            <div className="h-10 bg-linear-to-r from-blue-200/50 to-indigo-200/50 rounded-md"></div>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-24 bg-linear-to-r from-blue-200/50 to-indigo-200/50 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Error: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Your Tasks</h2>
          <p className="text-sm text-slate-500 mt-1">{sortedTasks.length} {sortedTasks.length === 1 ? 'task' : 'tasks'}</p>
        </div>

        <div className="relative w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeFilter === 'all'
              ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeFilter === 'pending'
              ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveFilter('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeFilter === 'completed'
              ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label htmlFor="priority-filter" className="block text-sm font-medium text-slate-700 mb-2">
            Priority
          </label>
          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="tag-filter" className="block text-sm font-medium text-slate-700 mb-2">
            Tag
          </label>
          <input
            type="text"
            id="tag-filter"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            placeholder="Filter by tag"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          />
        </div>

        <div>
          <label htmlFor="sort-option" className="block text-sm font-medium text-slate-700 mb-2">
            Sort By
          </label>
          <select
            id="sort-option"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          >
            <option value="created_at">Date Created</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              setPriorityFilter('');
              setTagFilter('');
              setSearchQuery('');
              setSortOption('created_at');
              setActiveFilter('all');
            }}
            className="w-full py-2 px-4 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-1">No tasks found</h3>
            <p className="text-slate-500 mb-4">Get started by creating a new task</p>
            <div className="inline-flex items-center px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>Create Task</span>
            </div>
          </div>
        ) : (
          sortedTasks.map(task => (
            <Task key={task.id} task={task} onTaskUpdate={fetchTasks} />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;