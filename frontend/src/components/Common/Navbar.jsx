import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, LogOut, Menu, X, CheckSquare, PlusCircle, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Add Task', path: '/add-task', icon: PlusCircle },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-brand-600 dark:text-brand-400">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-500 text-white shadow-md shadow-brand-500/20">
                <CheckSquare size={18} />
              </div>
              <span className="bg-gradient-to-r from-brand-600 to-indigo-500 dark:from-brand-400 dark:to-indigo-400 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User Profile Info & Logout */}
            {user && (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {user.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-[fadeIn_0.15s_ease-out]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile User Profile Section */}
          {user && (
            <div className="pt-4 pb-3 border-t border-slate-200 dark:border-slate-800 px-4 bg-slate-50 dark:bg-slate-950/45">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-base font-semibold text-slate-800 dark:text-slate-200">
                    {user.name}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg text-base font-medium text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
