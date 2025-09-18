import React, { useState } from 'react';
import { useCalendar } from '../context/CalendarContext';
import CalendarView from '../components/CalendarView';
import AppointmentModal from '../components/AppointmentModal';
import { IconPlus, IconAppointments } from '../components/Icons';

const CalendarPage: React.FC = () => {
    const { events, isConnecting } = useCalendar();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const handleAddClick = () => {
        setSelectedDate(new Date()); // Default to today
        setIsModalOpen(true);
    };

    if (isConnecting) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                <div className="text-center sm:text-left mb-4 sm:mb-0">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl flex items-center justify-center sm:justify-start gap-4">
                        <IconAppointments className="w-10 h-10" />
                        Calendar
                    </h1>
                    <p className="mt-2 text-lg text-slate-600">
                        View and manage your appointments.
                    </p>
                </div>
                <button
                    onClick={handleAddClick}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105"
                >
                    <IconPlus className="w-5 h-5" />
                    <span>New Appointment</span>
                </button>
            </div>

            <CalendarView events={events} onDayClick={handleDayClick} />

            <AppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedDate={selectedDate}
            />
        </div>
    );
};

export default CalendarPage;
