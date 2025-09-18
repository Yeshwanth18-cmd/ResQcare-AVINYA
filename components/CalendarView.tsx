import React, { useState } from 'react';
import type { CalendarEvent } from '../types';
import { IconGoogle } from './Icons';

interface CalendarViewProps {
  events: CalendarEvent[];
  onDayClick: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, onDayClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startOfMonth.getDay());
  const endDate = new Date(endOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endOfMonth.getDay()));

  const days: Date[] = [];
  let day = new Date(startDate);
  while (day <= endDate) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  const isSameDay = (d1: Date, d2: Date) => 
    d1.getFullYear() === d2.getFullYear() && 
    d1.getMonth() === d2.getMonth() && 
    d1.getDate() === d2.getDate();

  const eventsByDate = new Map<string, CalendarEvent[]>();
  events.forEach(event => {
    const eventDate = new Date(event.start).toDateString();
    if (!eventsByDate.has(eventDate)) {
      eventsByDate.set(eventDate, []);
    }
    eventsByDate.get(eventDate)!.push(event);
  });

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + offset)));
  };

  const today = new Date();

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-100">&larr;</button>
        <h2 className="text-xl font-bold text-slate-800">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-100">&rarr;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-slate-500 text-sm mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          const isCurrentMonth = d.getMonth() === currentDate.getMonth();
          const isToday = isSameDay(d, today);
          const dayEvents = eventsByDate.get(d.toDateString()) || [];
          return (
            <div
              key={i}
              onClick={() => onDayClick(d)}
              className={`p-2 h-28 border border-slate-100 rounded-lg cursor-pointer transition-colors hover:bg-slate-50 ${isCurrentMonth ? 'bg-white' : 'bg-slate-50'}`}
            >
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold ${isToday ? 'bg-blue-600 text-white' : isCurrentMonth ? 'text-slate-700' : 'text-slate-400'}`}>
                {d.getDate()}
              </div>
              <div className="mt-1 space-y-1 overflow-y-auto max-h-16">
                {dayEvents.slice(0, 2).map(event => (
                  <div key={event.id} className={`flex items-center gap-1 text-xs px-1 py-0.5 rounded ${event.source === 'google' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                     {event.source === 'google' && <IconGoogle className="w-3 h-3 flex-shrink-0" />}
                    <p className="truncate">{event.title}</p>
                  </div>
                ))}
                {dayEvents.length > 2 && <div className="text-xs text-slate-500 text-center">...</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
