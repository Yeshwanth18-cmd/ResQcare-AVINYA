import React from 'react';
import { useCalendar } from '../context/CalendarContext';
import { IconGoogle } from './Icons';

const GoogleCalendarConnect: React.FC = () => {
    const { isConnected, isConnecting, connectGoogleCalendar, disconnectGoogleCalendar } = useCalendar();

    if (isConnecting) {
        return (
             <div className="flex items-center justify-center gap-3 bg-slate-100 text-slate-800 font-semibold py-3 px-4 rounded-lg h-[48px]">
                <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Checking connection...</span>
            </div>
        );
    }

    if (isConnected) {
        return (
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                    <IconGoogle className="w-6 h-6" />
                    <p className="font-semibold text-green-800">Calendar Connected</p>
                </div>
                <button
                    onClick={disconnectGoogleCalendar}
                    className="font-semibold text-sm text-slate-600 hover:text-red-600"
                >
                    Disconnect
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={connectGoogleCalendar}
            className="w-full flex items-center justify-center gap-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-lg transition-colors h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <IconGoogle className="w-6 h-6" />
            <span>Connect Google Calendar</span>
        </button>
    );
};

export default GoogleCalendarConnect;
