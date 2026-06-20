import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Common/Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      {/* Shared Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Shared Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 py-6 text-center text-xs text-slate-400 dark:text-slate-500 transition-colors duration-300">
        <p>&copy; {new Date().getFullYear()} TaskFlow Project Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
