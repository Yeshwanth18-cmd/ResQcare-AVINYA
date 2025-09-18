import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { IconX } from './Icons';

const PreferredNameModal: React.FC = () => {
  const { isNameModalOpen, closeNameModal, updateUserName } = useAuth();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isNameModalOpen) {
      inputRef.current?.focus();
    }
  }, [isNameModalOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeNameModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeNameModal]);
  
  const handleSave = () => {
    if (!name.trim()) {
      setError('Please enter a name or skip for now.');
      inputRef.current?.focus();
      return;
    }
    updateUserName(name.trim());
    setName('');
    setError('');
  };
  
  if (!isNameModalOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={closeNameModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="name-dialog-title"
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-md w-full max-w-md m-4 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeNameModal}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Skip setting a name for now"
        >
          <IconX className="w-6 h-6" />
        </button>

        <div className="text-center">
          <h2 id="name-dialog-title" className="text-2xl font-extrabold text-slate-900">
            What should we call you?
          </h2>
          <p className="mt-2 text-slate-600">
            Using your preferred name helps us personalize your experience.
          </p>
        </div>

        <div className="mt-8 space-y-2">
           <label htmlFor="preferred-name-input" className="sr-only">Enter your preferred name</label>
           <input
              ref={inputRef}
              id="preferred-name-input"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              placeholder="E.g., Alex, Dr. Lee, or a nickname"
              className={`w-full px-4 py-3 bg-slate-100 border rounded-lg focus:outline-none focus:ring-2 ${error ? 'border-error focus:ring-error' : 'border-slate-200 focus:ring-ring'}`}
              aria-invalid={!!error}
              aria-describedby="name-dialog-error"
           />
           {error && <p id="name-dialog-error" className="text-sm text-error">{error}</p>}
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={closeNameModal}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-lg transition"
          >
            Skip for now
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-slate-400"
          >
            Save Name
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferredNameModal;