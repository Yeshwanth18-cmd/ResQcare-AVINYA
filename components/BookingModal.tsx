import React, { useState, useEffect } from 'react';
import { getAppointmentOptions, confirmAppointmentBooking } from '../services/geminiService';
import type { Hospital, AppointmentOptions, BookingConfirmation, AvailableSlot } from '../types';
import { IconX, IconCheckCircle, IconAppointments } from './Icons';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospital: Hospital | null;
}

const LoadingSpinner: React.FC = () => (
    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
);

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, hospital }) => {
  const [view, setView] = useState<'form' | 'confirmation'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [options, setOptions] = useState<AppointmentOptions | null>(null);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);

  // Form state
  const [type, setType] = useState<'in_person' | 'telehealth'>('in_person');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (hospital && isOpen) {
      // Reset state when modal opens with a new hospital
      setView('form');
      setIsLoading(true);
      setError(null);
      setOptions(null);
      setConfirmation(null);
      
      getAppointmentOptions(hospital)
        .then(data => {
          if (data) {
            setOptions(data.appointment_options);
            // Pre-select first available date and time
            if (data.appointment_options.available_slots.length > 0) {
              const firstDate = data.appointment_options.available_slots[0];
              setSelectedDate(firstDate.date);
              if (firstDate.times.length > 0) {
                setSelectedTime(firstDate.times[0]);
              }
            }
          } else {
            setError("Could not fetch appointment slots. Please try again later.");
          }
        })
        .catch(() => setError("An error occurred while fetching availability."))
        .finally(() => setIsLoading(false));
    }
  }, [hospital, isOpen]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospital || !selectedDate || !selectedTime || !reason) return;

    setIsLoading(true);
    setError(null);
    
    const bookingDetails = { date: selectedDate, time: selectedTime, type, reason };

    try {
        const confirmationData = await confirmAppointmentBooking(hospital, bookingDetails);
        if (confirmationData) {
            setConfirmation(confirmationData);
            setView('confirmation');
        } else {
            setError("Booking failed. The selected slot might have been taken. Please try another time.");
        }
    } catch {
        setError("A server error occurred during booking. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  if (!isOpen || !hospital) return null;

  const availableTimesForSelectedDate = options?.available_slots.find(slot => slot.date === selectedDate)?.times || [];
  
  const handleDateChange = (date: string) => {
      setSelectedDate(date);
      const newTimes = options?.available_slots.find(slot => slot.date === date)?.times || [];
      setSelectedTime(newTimes[0] || '');
  }

  const renderForm = () => (
    <form onSubmit={handleBooking} className="space-y-4">
        {options?.telehealth && options?.in_person && (
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Appointment Type</label>
                <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setType('in_person')} className={`p-3 text-sm font-semibold rounded-lg border-2 ${type === 'in_person' ? 'bg-primary-light border-primary text-primary-text' : 'bg-slate-100 border-transparent hover:bg-slate-200'}`}>In-Person</button>
                    <button type="button" onClick={() => setType('telehealth')} className={`p-3 text-sm font-semibold rounded-lg border-2 ${type === 'telehealth' ? 'bg-primary-light border-primary text-primary-text' : 'bg-slate-100 border-transparent hover:bg-slate-200'}`}>Telehealth</button>
                </div>
            </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-700">Date</label>
                <select id="date" value={selectedDate} onChange={(e) => handleDateChange(e.target.value)} required className="mt-1 w-full p-2 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    {options?.available_slots.map(slot => <option key={slot.date} value={slot.date}>{new Date(slot.date + 'T00:00:00').toLocaleDateString(undefined, {weekday: 'long', month: 'long', day: 'numeric'})}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="time" className="block text-sm font-medium text-slate-700">Time</label>
                <select id="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} required disabled={availableTimesForSelectedDate.length === 0} className="mt-1 w-full p-2 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    {availableTimesForSelectedDate.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>
        </div>
        <div>
            <label htmlFor="reason" className="block text-sm font-medium text-slate-700">Reason for Visit</label>
            <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} required className="mt-1 w-full p-2 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Briefly describe your symptoms or reason for booking."></textarea>
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700">Attachments (Optional)</label>
            <button type="button" className="mt-1 w-full text-center p-3 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:bg-slate-50">
                Upload Files
            </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2 px-6 rounded-full transition">Cancel</button>
            <button type="submit" disabled={!selectedTime || !reason} className="bg-primary bg-primary-hover text-white font-bold py-2 px-6 rounded-full transition disabled:bg-slate-400">Confirm Booking</button>
        </div>
    </form>
  );

  const renderConfirmation = () => (
    <div className="text-center">
        <IconCheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900 mt-4">Appointment Confirmed!</h2>
        <p className="text-slate-600 mt-2">{confirmation?.message}</p>
        
        <div className="mt-6 text-left p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-sm">
            <p><strong>Hospital:</strong> {confirmation?.hospital.name}</p>
            <p><strong>Date:</strong> {confirmation?.appointment.date}</p>
            <p><strong>Time:</strong> {confirmation?.appointment.time}</p>
            <p><strong>Type:</strong> {confirmation?.appointment.type}</p>
            <p><strong>Reason:</strong> {confirmation?.appointment.reason}</p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <a href={confirmation?.appointment.calendar_url || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-6 rounded-full transition">
                <IconAppointments className="w-5 h-5"/>
                Add to Calendar
            </a>
            <button onClick={onClose} className="bg-primary bg-primary-hover text-white font-bold py-3 px-6 rounded-full transition">Done</button>
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative bg-white rounded-lg shadow-md w-full max-w-lg p-8 animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">{view === 'form' ? 'Appointment Booking' : 'Confirmation'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800"><IconX className="w-6 h-6" /></button>
        </div>
        <p className="text-slate-600 mb-4 -mt-4">For: <span className="font-semibold">{hospital.name}</span></p>

        {isLoading && <LoadingSpinner />}
        {view === 'form' ? renderForm() : renderConfirmation()}
        
      </div>
    </div>
  );
};

export default BookingModal;