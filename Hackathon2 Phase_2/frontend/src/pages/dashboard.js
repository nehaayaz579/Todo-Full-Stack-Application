import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const DashboardPage = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  const handleTaskSubmit = (newTask) => {
    // This function can be used to handle the newly created task
    console.log('New task created:', newTask);
  };

  if (authLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col relative overflow-hidden">
          {/* Background glow effects */}
          <div className="fixed top-1/4 right-0 w-50 h-50 blur-[120px] opacity-30 bg-linear-to-r from-blue-200 to-indigo-200"></div>
          <div className="fixed bottom-1/4 left-0 w-50 h-50 blur-[120px] opacity-30 bg-linear-to-r from-purple-200 to-pink-200"></div>

          {/* Header - Full Width */}
          <header className="w-full bg-white/80 backdrop-blur-md py-5 px-6 border-b border-white/20 sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-linear-to-br from-blue-100 to-indigo-100 w-10 h-10 rounded-lg flex items-center justify-center">
                  <div className="bg-linear-to-br from-blue-200 to-indigo-200 w-6 h-6 rounded"></div>
                </div>
                <div className="h-7 bg-linear-to-r from-blue-200/50 to-indigo-200/50 rounded w-32"></div>
              </div>
              <div className="h-8 bg-linear-to-r from-blue-200/50 to-indigo-200/50 rounded w-24"></div>
            </div>
          </header>

          {/* Loading State - Full Width */}
          <div className="grow py-8 px-6">
            <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_2.8fr] gap-8">
              <div>
                <div className="bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 h-full transition-all duration-300 hover:shadow-xl">
                  <div className="animate-pulse space-y-8">
                    {/* Header loading */}
                    <div className="flex justify-between items-center pb-6 border-b border-white/20">
                      <div className="flex items-center space-x-3">
                        <div className="bg-linear-to-br from-blue-100 to-indigo-100 w-10 h-10 rounded-lg flex items-center justify-center">
                          <div className="bg-linear-to-br from-blue-200 to-indigo-200 w-6 h-6 rounded"></div>
                        </div>
                        <div className="h-7 bg-linear-to-r from-blue-200/50 to-indigo-200/50 rounded w-32"></div>
                      </div>
                      <div className="h-8 bg-linear-to-r from-blue-200/50 to-indigo-200/50 rounded w-24"></div>
                    </div>

                    {/* Form loading */}
                    <div className="space-y-4">
                      <div className="h-6 bg-linear-to-r from-blue-200/50 to-indigo-200/50 rounded w-3/4"></div>
                      <div className="space-y-3">
                        <div className="h-4 bg-linear-to-r from-blue-200/50 to-indigo-200/50 rounded w-full"></div>
                        <div className="h-10 bg-linear-to-r from-blue-200/50 to-indigo-200/50 rounded-md"></div>
                        <div className="h-10 bg-linear-to-r from-blue-200/50 to-indigo-200/50 rounded-md"></div>
                        <div className="h-10 bg-linear-to-r from-blue-200/50 to-indigo-200/50 rounded-md"></div>
                        <div className="h-10 bg-linear-to-r from-blue-200/50 to-indigo-200/50 rounded-md w-1/2 ml-auto"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task List loading */}
              <div>
                <div className="bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 h-full transition-all duration-300 hover:shadow-xl">
                  <div className="space-y-6">
                    <div className="flex justify-between">
                      <div className="h-6 bg-linear-to-r from-blue-200/50 to-indigo-200/50 rounded w-1/4"></div>
                      <div className="h-6 bg-linear-to-r from-blue-200/50 to-indigo-200/50 rounded w-1/6"></div>
                    </div>

                    <div className="flex space-x-2">
                      <div className="h-10 bg-linear-to-r from-blue-200/50 to-indigo-200/50 rounded-lg w-20"></div>
                      <div className="h-10 bg-linear-to-r from-blue-200/50 to-indigo-200/50 rounded-lg w-20"></div>
                      <div className="h-10 bg-linear-to-r from-blue-200/50 to-indigo-200/50 rounded-lg w-24"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
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
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col relative overflow-hidden">
        {/* Background glow effects */}
        <div className="fixed top-1/4 right-0 w-50 h-50 blur-[120px] opacity-30 bg-linear-to-r from-blue-200 to-indigo-200"></div>
        <div className="fixed bottom-1/4 left-0 w-50 h-50 blur-[120px] opacity-30 bg-linear-to-r from-purple-200 to-pink-200"></div>

        {/* Header - Full Width */}
        <header className="w-full bg-white/80 backdrop-blur-md py-5 px-6 border-b border-white/20 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-linear-to-br from-blue-600 to-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">TaskMaster</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="bg-slate-200 border-2 border-dashed rounded-xl w-10 h-10" />
                <span className="text-slate-600 hidden sm:block font-medium">Hi, {user?.email?.split('@')[0]}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-5 py-2 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="grow py-8 px-6">
          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_2.8fr] gap-8">
            {/* Task Input Card */}
            <div>
              <div className="bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 h-full transition-all duration-300 hover:shadow-xl">
                <TaskForm onSubmit={handleTaskSubmit} />
              </div>
            </div>

            {/* Task List Card */}
            <div>
              <div className="bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 h-full transition-all duration-300 hover:shadow-xl">
                <TaskList />
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;