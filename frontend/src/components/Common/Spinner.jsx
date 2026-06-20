import React from 'react';

const Spinner = ({ size = 'medium', color = 'text-brand-500' }) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={`${sizeClasses[size]} border-slate-200 border-t-current rounded-full animate-spin ${color}`}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
