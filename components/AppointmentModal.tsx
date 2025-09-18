import React, { useState, useEffect } from 'react';
import type { CalendarEvent } from '../types';
import { useCalendar } from '../context/CalendarContext';
import { IconX } from './Icons';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose, selectedDate }) => {
  const { addEvent } = useCalendar();
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (selectedDate) {
      const startTime = new Date(selectedDate);
      startTime.setHours(9, 0, 0, 0); // Default to 9 AM
      
      const endTime = new Date(startTime);
      endTime.setHours(10, 0, 0, 0); // Default to 1 hour duration

      // Format for datetime-local input: YYYY-MM-DDTHH:mm
      const toLocalISOString = (date: Date) => {
        const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        const localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0, 16);
        return localISOTime;
      }

      setStart(toLocalISOString(startTime));
      setEnd(toLocalISOString(endTime));
    } else {
        // Reset if no date is selected
        setTitle('');
        setStart('');
        setEnd('');
        setDescription('');
    }
  }, [selectedDate, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !start || !end) return;

    addEvent({
      title,
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
      description: description || undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">New Appointment</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <IconX className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 w-full p-2 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start" className="block text-sm font-medium text-slate-700">Start Time</label>
              <input type="datetime-local" id="start" value={start} onChange={(e) => setStart(e.target.value)} required className="mt-1 w-full p-2 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="end" className="block text-sm font-medium text-slate-700">End Time</label>
              <input type="datetime-local" id="end" value={end} onChange={(e) => setEnd(e.target.value)} required className="mt-1 w-full p-2 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description (Optional)</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 w-full p-2 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2 px-6 rounded-full transition">Cancel</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
