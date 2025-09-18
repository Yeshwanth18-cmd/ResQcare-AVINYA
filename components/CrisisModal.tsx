
import React from 'react';
import { IconAlertTriangle, IconPhone, IconX } from './Icons';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CrisisModal: React.FC<CrisisModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg m-4 p-8 border-2 border-red-500 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <IconX className="w-6 h-6" />
        </button>

        <div className="text-center">
          <IconAlertTriangle className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900">
            Immediate Support Is Available
          </h2>
          <p className="mt-2 text-slate-600">
            If you are in a crisis or any other person may be in danger, please use these resources.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <a
            href="tel:988"
            className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105"
          >
            <IconPhone className="h-6 w-6" />
            <span>Call or Text 988 (Suicide & Crisis Lifeline)</span>
          </a>
          <a
            href="#" // Placeholder for campus services link
            className="w-full block text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-lg transition"
          >
            Contact Campus Counseling Services
          </a>
        </div>
        
        <p className="mt-6 text-xs text-center text-slate-500">
          Your safety is the top priority. Please reach out for help.
        </p>
      </div>
    </div>
  );
};

export default CrisisModal;