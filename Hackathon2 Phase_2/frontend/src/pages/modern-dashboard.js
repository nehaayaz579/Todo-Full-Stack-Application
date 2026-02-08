import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { taskApi } from '../services/api';

const ModernDashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [activeFilter, setActiveFilter] = useState('all'); // all, pending, completed

  useEffect(() => {
    if (!authLoading && user) {
      fetchTasks();
    }
  }, [authLoading, user]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const tasksData = await taskApi.getAllTasks();
      setTasks(tasksData);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!newTaskTitle.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      setIsLoading(true);

      const newTask = {
        title: newTaskTitle,
        description: newTaskDescription,
        priority: newTaskPriority,
        completed: false
      };

      await taskApi.createTask(newTask);

      // Reset form
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('medium');

      // Refresh tasks
      await fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to add task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      setIsLoading(true);
      await taskApi.toggleTaskCompletion(taskId);
      await fetchTasks(); // Refresh tasks
    } catch (err) {
      setError(err.message || 'Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      setIsLoading(true);
      await taskApi.deleteTask(taskId);
      await fetchTasks(); // Refresh tasks
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter tasks based on active filter
  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'pending') return !task.completed;
    if (activeFilter === 'completed') return task.completed;
    return true; // 'all' filter
  });

  if (authLoading || (isLoading && tasks.length === 0)) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#020617] text-slate-200">
          {/* Header */}
          <header className="sticky top-0 z-10 glass-effect py-4 px-6 border-b border-slate-700">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold uppercase neon-cyan">TODO MASTERY</h1>
              <div className="flex items-center space-x-4">
                <span className="text-slate-300">Welcome, {user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <main className="max-w-6xl mx-auto py-8 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Task Input Card */}
              <div className="glass-effect rounded-xl p-6 inner-glow">
                <div className="animate-pulse h-12 bg-slate-700 rounded-md mb-4"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-10 bg-slate-700 rounded-md"></div>
                  <div className="h-10 bg-slate-700 rounded-md"></div>
                  <div className="h-10 bg-slate-700 rounded-md"></div>
                  <div className="h-10 bg-slate-700 rounded-md w-1/3 ml-auto"></div>
                </div>
              </div>

              {/* Task List Card */}
              <div className="lg:col-span-2 glass-effect rounded-xl p-6 inner-glow">
                <div className="flex space-x-4 mb-6">
                  <div className="h-10 bg-slate-700 rounded-md w-20"></div>
                  <div className="h-10 bg-slate-700 rounded-md w-20"></div>
                  <div className="h-10 bg-slate-700 rounded-md w-20"></div>
                </div>
                
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="h-20 bg-slate-700 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#020617] text-slate-200">
        {/* Header */}
        <header className="sticky top-0 z-10 glass-effect py-4 px-6 border-b border-slate-700">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold uppercase neon-cyan">TODO MASTERY</h1>
            <div className="flex items-center space-x-4">
              <span className="text-slate-300">Welcome, {user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto py-8 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Task Input Card */}
            <div className="glass-effect rounded-xl p-6 inner-glow">
              <h2 className="text-xl font-semibold mb-6 text-neon-cyan">Create New Task</h2>

              {error && (
                <div className="mb-4 p-3 bg-red-900 text-red-200 rounded-md">
                  {error}
                </div>
              )}

              <form onSubmit={handleAddTask}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="task-title" className="block text-sm font-medium mb-1">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      id="task-title"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus-glow"
                      placeholder="What needs to be done?"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="task-description" className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      id="task-description"
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus-glow"
                      placeholder="Add details..."
                    />
                  </div>

                  <div>
                    <label htmlFor="task-priority" className="block text-sm font-medium mb-1">
                      Priority
                    </label>
                    <select
                      id="task-priority"
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus-glow"
                    >
                      <option value="low" className="bg-slate-800">Low</option>
                      <option value="medium" className="bg-slate-800">Medium</option>
                      <option value="high" className="bg-slate-800">High</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full px-4 py-3 bg-linear-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 pulse`}
                  >
                    {isLoading ? 'Adding...' : 'Add Task'}
                  </button>
                </div>
              </form>
            </div>

            {/* Task List Card */}
            <div className="lg:col-span-2 glass-effect rounded-xl p-6 inner-glow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-neon-cyan">Your Tasks</h2>
                <p className="text-sm text-slate-400">{filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}</p>
              </div>

              {/* Filter Buttons */}
              <div className="flex space-x-3 mb-6">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeFilter === 'all'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveFilter('pending')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeFilter === 'pending'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setActiveFilter('completed')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeFilter === 'completed'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Completed
                </button>
              </div>

              {error && !isLoading && (
                <div className="p-4 bg-red-900 text-red-200 rounded-md mb-4">
                  Error: {error}
                </div>
              )}

              {filteredTasks.length === 0 ? (
                <div className="p-8 text-center bg-slate-800/50 rounded-lg">
                  <svg className="mx-auto h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-slate-300">No tasks</h3>
                  <p className="mt-1 text-sm text-slate-500">Get started by adding a new task.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover-lift transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleTask(task.id)}
                            className="mt-1 h-5 w-5 text-cyan-600 rounded focus:ring-cyan-500"
                          />
                          <div>
                            <div className="flex items-center">
                              <h3 className={`text-base font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                {task.title}
                              </h3>
                              {/* Priority indicator with glow */}
                              <span 
                                className={`ml-3 w-3 h-3 rounded-full ${
                                  task.priority === 'high' 
                                    ? 'glow-red bg-red-500' 
                                    : task.priority === 'low' 
                                      ? 'glow-green bg-green-500' 
                                      : 'bg-yellow-500'
                                }`}
                                title={`Priority: ${task.priority}`}
                              ></span>
                            </div>
                            {task.description && (
                              <p className={`mt-1 text-sm ${task.completed ? 'text-slate-500' : 'text-slate-400'}`}>
                                {task.description}
                              </p>
                            )}
                            {task.due_date && (
                              <p className="mt-1 text-xs text-slate-500">
                                Due: {new Date(task.due_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-slate-500">
                            {new Date(task.created_at).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-500 hover:text-red-400 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Task tags */}
                      {task.tags && task.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {task.tags.map((tag, idx) => (
                            <span 
                              key={idx} 
                              className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded-md"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default ModernDashboard;