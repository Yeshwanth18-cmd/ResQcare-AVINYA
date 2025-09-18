import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import type { CalendarEvent } from '../types';
import * as googleCalendarService from '../services/googleCalendarService';

interface CalendarContextType {
  events: CalendarEvent[];
  isConnected: boolean;
  isConnecting: boolean;
  connectGoogleCalendar: () => Promise<void>;
  disconnectGoogleCalendar: () => void;
  addEvent: (event: Omit<CalendarEvent, 'id' | 'source'>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

const USER_EVENTS_STORAGE_KEY = 'resqcare_user_calendar_events';

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);

  const fetchAllEvents = useCallback(async (googleConnected: boolean) => {
    try {
      const userEventsRaw = localStorage.getItem(USER_EVENTS_STORAGE_KEY);
      const userEvents: CalendarEvent[] = userEventsRaw ? JSON.parse(userEventsRaw) : [];
      
      let googleEvents: CalendarEvent[] = [];
      if (googleConnected) {
        googleEvents = await googleCalendarService.getEvents();
      }
      
      setEvents([...userEvents, ...googleEvents]);
    } catch (error) {
      console.error("Failed to fetch calendar events:", error);
      // Fallback to user events if google fetch fails
      const userEventsRaw = localStorage.getItem(USER_EVENTS_STORAGE_KEY);
      setEvents(userEventsRaw ? JSON.parse(userEventsRaw) : []);
    }
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      setIsConnecting(true);
      const connected = await googleCalendarService.isConnected();
      setIsConnected(connected);
      await fetchAllEvents(connected);
      setIsConnecting(false);
    };
    checkConnection();
  }, [fetchAllEvents]);

  const connectGoogleCalendar = async () => {
    setIsConnecting(true);
    await googleCalendarService.connect();
    setIsConnected(true);
    await fetchAllEvents(true);
    setIsConnecting(false);
  };

  const disconnectGoogleCalendar = () => {
    googleCalendarService.disconnect();
    setIsConnected(false);
    setEvents(events.filter(e => e.source !== 'google'));
  };

  const addEvent = async (eventData: Omit<CalendarEvent, 'id' | 'source'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: crypto.randomUUID(),
      source: 'user',
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);

    const userEvents = updatedEvents.filter(e => e.source === 'user');
    localStorage.setItem(USER_EVENTS_STORAGE_KEY, JSON.stringify(userEvents));
  };
  
  const deleteEvent = async (eventId: string) => {
    const eventToDelete = events.find(e => e.id === eventId);
    if (!eventToDelete || eventToDelete.source === 'google') {
        // For this demo, we won't allow deleting Google events
        return;
    }
    const updatedEvents = events.filter(e => e.id !== eventId);
    setEvents(updatedEvents);

    const userEvents = updatedEvents.filter(e => e.source === 'user');
    localStorage.setItem(USER_EVENTS_STORAGE_KEY, JSON.stringify(userEvents));
  };


  const value = {
    events,
    isConnected,
    isConnecting,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    addEvent,
    deleteEvent
  };

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};
