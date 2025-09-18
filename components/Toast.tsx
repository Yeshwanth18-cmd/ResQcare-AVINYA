import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  duration?: number;
  // FIX: Specified that the icon element must accept a className prop to resolve cloneElement typing issue.
  icon?: React.ReactElement<{ className?: string }>;
}

const Toast: React.FC<ToastProps> = ({ message, show, onClose, duration = 3000, icon }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) {
    return null;
  }

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 w-auto max-w-xs p-4 text-slate-700 bg-white rounded-lg shadow-lg ring-1 ring-slate-200 transition-all duration-300 ${show ? 'animate-fade-in-up' : 'animate-fade-out-down'}`}>
      {/* The prop type change fixes the error on the following line. */}
      {icon && React.cloneElement(icon, { className: 'w-6 h-6 text-success' })}
      <div className="text-sm font-semibold">{message}</div>
    </div>
  );
};

export default Toast;