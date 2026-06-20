import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle2, AlertTriangle, Info, AlertCircle } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast: addToast }}>
      {children}
      {/* Toast container floating at the top-right / bottom-right */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          let bgColor = 'bg-white dark:bg-slate-800 border-emerald-500';
          let textColor = 'text-slate-800 dark:text-slate-100';
          let Icon = CheckCircle2;
          let iconColor = 'text-emerald-500';

          if (toast.type === 'error') {
            bgColor = 'bg-white dark:bg-slate-800 border-rose-500';
            Icon = AlertCircle;
            iconColor = 'text-rose-500';
          } else if (toast.type === 'warning') {
            bgColor = 'bg-white dark:bg-slate-800 border-amber-500';
            Icon = AlertTriangle;
            iconColor = 'text-amber-500';
          } else if (toast.type === 'info') {
            bgColor = 'bg-white dark:bg-slate-800 border-brand-500';
            Icon = Info;
            iconColor = 'text-brand-500';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border-l-4 ${bgColor} transition-all duration-300 transform translate-y-0 animate-[fadeIn_0.2s_ease-out]`}
            >
              <div className={`mt-0.5 shrink-0 ${iconColor}`}>
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${textColor}`}>{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
