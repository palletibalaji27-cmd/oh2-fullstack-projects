import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CheckSquare, User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register(name, email, password);
      showToast('Account created successfully', 'success');
      navigate('/');
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Failed to create account';
      showToast(errMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/20 mb-4">
            <CheckSquare size={24} />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-slate-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-brand-600 dark:text-brand-400 hover:text-brand-500 hover:underline transition-all"
            >
              Sign in here
            </Link>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700/60 transition-all duration-300">
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all ${
                    errors.name
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700/80 focus:ring-brand-500'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all ${
                    errors.email
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700/80 focus:ring-brand-500'
                  }`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all ${
                    errors.password
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700/80 focus:ring-brand-500'
                  }`}
                  placeholder="•••••••• (Min 6 characters)"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all ${
                    errors.confirmPassword
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700/80 focus:ring-brand-500'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.confirmPassword}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 transition-all duration-200"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                ) : (
                  <>
                    Sign up
                    <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
