import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createTask } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, PlusCircle, CheckSquare, AlignLeft, Info } from 'lucide-react';

const AddTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  // Validate form in real-time
  useEffect(() => {
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Title is required';
    }
    if (!description.trim()) {
      errs.description = 'Description is required';
    } else if (description.trim().length < 20) {
      errs.description = `Description must be at least 20 characters (currently ${description.trim().length}/20)`;
    }
    setErrors(errs);
    setIsValid(Object.keys(errs).length === 0);
  }, [title, description]);

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await createTask({ title, description, status });
      showToast('Task created successfully', 'success');
      navigate('/');
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Failed to create task';
      showToast(errMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 animate-[fadeIn_0.3s_ease-out]">
      {/* Header and Back navigation */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 dark:text-slate-500 px-3 py-1.5 rounded-full">
          New Task
        </span>
      </div>

      {/* Main card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700/60 p-6 md:p-8">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700/60 pb-5 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400">
            <PlusCircle size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Create New Task</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Add a new task to your project board</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <CheckSquare size={18} />
              </div>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => handleBlur('title')}
                className={`block w-full pl-10 pr-4 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all ${
                  touched.title && errors.title
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700/80 focus:ring-brand-500'
                }`}
                placeholder="e.g. Build Login Page"
              />
            </div>
            {touched.title && errors.title && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
                <Info size={12} className="shrink-0" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Description <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3.5 text-slate-400">
                <AlignLeft size={18} />
              </div>
              <textarea
                id="description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => handleBlur('description')}
                className={`block w-full pl-10 pr-4 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none ${
                  touched.description && errors.description
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-slate-200 dark:border-slate-700/80 focus:ring-brand-500'
                }`}
                placeholder="Describe the details, goals, and requirements of this task (minimum 20 characters)..."
              />
            </div>
            {errors.description && (
              <p className={`mt-1.5 text-xs font-medium flex items-center gap-1 ${
                touched.description && errors.description.includes('must be at least')
                  ? 'text-rose-500'
                  : 'text-slate-400 dark:text-slate-500'
              }`}>
                <Info size={12} className="shrink-0" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Status Dropdown */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Initial Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="block w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700/80 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>

          {/* Submit Actions */}
          <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 mt-6">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 py-2.5 px-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="flex-1 py-2.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
