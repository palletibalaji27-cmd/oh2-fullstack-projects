import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getTasks, updateTask, deleteTask, getTaskStats } from '../services/api';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/Common/Spinner';
import {
  ListTodo,
  Clock,
  PlayCircle,
  CheckCircle2,
  Search,
  Plus,
  Trash2,
  Check,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  ArrowUpDown,
  Inbox,
  Calendar,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  // Query parameters state
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // desc or asc
  const [currentPage, setCurrentPage] = useState(1);
  const limitPerPage = 6;

  // Data state
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);

  const { showToast } = useToast();

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // reset to page 1 on search change
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Reset page when filter changes
  const handleFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // Fetch tasks and statistics
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsData = await getTaskStats();
      setStats(statsData);

      // Fetch tasks
      const params = {
        status: statusFilter,
        search: debouncedSearch,
        sort: sortOrder,
        page: currentPage,
        limit: limitPerPage,
      };
      const tasksData = await getTasks(params);
      setTasks(tasksData.tasks);
      setTotalPages(tasksData.pages);
      setTotalTasks(tasksData.totalTasks);
    } catch (error) {
      console.error(error);
      showToast('Failed to retrieve task data', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedSearch, sortOrder, currentPage, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Complete Task action
  const handleCompleteTask = async (taskId) => {
    try {
      await updateTask(taskId, { status: 'Completed' });
      showToast('Task marked as Completed!', 'success');
      fetchData(); // Refresh tasks and stats
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Failed to update task';
      showToast(errMsg, 'error');
    }
  };

  // Delete Task action
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        showToast('Task deleted successfully', 'success');
        fetchData(); // Refresh tasks and stats
      } catch (error) {
        console.error(error);
        const errMsg = error.response?.data?.message || 'Failed to delete task';
        showToast(errMsg, 'error');
      }
    }
  };

  // Helper: Format Date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper: Get Badge Color
  const getBadgeClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50';
      case 'Pending':
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50';
    }
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      {/* Upper Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Workspace Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage, filter, and track all your task flows in real-time.
          </p>
        </div>
        <Link
          to="/add-task"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 transition-all duration-200"
        >
          <Plus size={18} />
          Create Task
        </Link>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Tasks */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Total Tasks
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mt-2">
                {stats.total}
              </h3>
            </div>
            <div className="p-3 bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 rounded-xl shadow-inner">
              <ListTodo size={20} />
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Pending
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mt-2">
                {stats.pending}
              </h3>
            </div>
            <div className="p-3 bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400 rounded-xl shadow-inner">
              <Clock size={20} />
            </div>
          </div>
        </div>

        {/* In Progress Tasks */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                In Progress
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mt-2">
                {stats.inProgress}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 rounded-xl shadow-inner">
              <PlayCircle size={20} />
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Completed
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mt-2">
                {stats.completed}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-xl shadow-inner">
              <CheckCircle2 size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 transition-colors duration-300 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Status Filters */}
          <div className="flex flex-wrap gap-1.5">
            {['All', 'Pending', 'In Progress', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => handleFilterChange(status)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 ${
                  statusFilter === status
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/10'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 dark:bg-slate-900/60 dark:hover:bg-slate-900 dark:text-slate-300'
                }`}
              >
                {status} {status === 'All' ? `(${stats.total})` : ''}
              </button>
            ))}
          </div>

          {/* Search, Sort Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search title, description..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700/80 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Sort Select */}
            <div className="relative min-w-[140px] shrink-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <ArrowUpDown size={14} />
              </div>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm border border-slate-200 dark:border-slate-700/80 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all cursor-pointer appearance-none"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <ChevronRight size={14} className="rotate-90" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Cards Area */}
      {loading ? (
        <div className="min-h-[250px] flex items-center justify-center">
          <Spinner size="large" />
        </div>
      ) : tasks.length === 0 ? (
        /* Empty State */
        <div className="min-h-[300px] flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center transition-colors duration-300">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-4">
            <Inbox size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
            No Tasks Found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
            {statusFilter !== 'All' || debouncedSearch
              ? "We couldn't find any tasks matching your filters or search terms. Try adjusting them!"
              : "You haven't created any tasks yet. Get started by clicking 'Create Task' above!"}
          </p>
          {(statusFilter !== 'All' || debouncedSearch) && (
            <button
              onClick={() => {
                setStatusFilter('All');
                setSearchTerm('');
              }}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        /* Tasks List Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden relative hover:-translate-y-0.5"
            >
              {/* Task Header info */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getBadgeClass(task.status)}`}>
                    {task.status}
                  </span>
                  <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <Calendar size={12} />
                    {formatDate(task.createdAt)}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-800 dark:text-white leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-200">
                    {task.title}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed whitespace-pre-line">
                    {task.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-end gap-2 shrink-0">
                {task.status !== 'Completed' && (
                  <button
                    onClick={() => handleCompleteTask(task._id)}
                    className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:text-slate-400 dark:hover:text-emerald-400 dark:hover:bg-emerald-950/30 rounded-xl transition-all"
                    title="Mark Completed"
                  >
                    <Check size={18} />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 rounded-xl transition-all"
                  title="Delete Task"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {!loading && totalTasks > limitPerPage && (
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-slate-200 dark:border-slate-700 text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-200 dark:border-slate-700 text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing{' '}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {(currentPage - 1) * limitPerPage + 1}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {Math.min(currentPage * limitPerPage, totalTasks)}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-slate-900 dark:text-white">{totalTasks}</span>{' '}
                tasks
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-xl -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-3 py-2 rounded-l-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft size={16} />
                </button>
                
                {/* Numbered Page Buttons */}
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNum = index + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      aria-current={currentPage === pageNum ? 'page' : undefined}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-semibold transition-all ${
                        currentPage === pageNum
                          ? 'z-10 bg-brand-600 border-brand-600 text-white shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-3 py-2 rounded-r-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight size={16} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
