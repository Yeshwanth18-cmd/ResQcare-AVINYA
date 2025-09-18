import type { CalendarEvent } from '../types';

const GOOGLE_CONNECTED_KEY = 'resqcare_google_calendar_connected';

// Mock Google Calendar API
const MOCK_GOOGLE_EVENTS: CalendarEvent[] = [
  {
    id: 'gcal-1',
    title: 'Therapist Appointment',
    start: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    end: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    description: 'Follow-up session with Dr. Anya Sharma.',
    source: 'google'
  },
  {
    id: 'gcal-2',
    title: 'Annual Physical Exam',
    start: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
    end: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
    description: 'Check-up at the main clinic.',
    source: 'google'
  }
];

export const isConnected = async (): Promise<boolean> => {
    // Simulate async check
    await new Promise(resolve => setTimeout(resolve, 300));
    return localStorage.getItem(GOOGLE_CONNECTED_KEY) === 'true';
};

export const connect = async (): Promise<void> => {
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1500));
    localStorage.setItem(GOOGLE_CONNECTED_KEY, 'true');
};

export const disconnect = (): void => {
    localStorage.removeItem(GOOGLE_CONNECTED_KEY);
};

export const getEvents = async (): Promise<CalendarEvent[]> => {
    // Simulate fetching events
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (localStorage.getItem(GOOGLE_CONNECTED_KEY) !== 'true') {
        return [];
    }
    // In a real app, you would adjust the dates to be relevant.
    // For this mock, we'll keep them relative to today.
    const today = new Date();
    const mockEventsWithCurrentDates = MOCK_GOOGLE_EVENTS.map((event, index) => {
        const startDate = new Date();
        startDate.setDate(today.getDate() + (index === 0 ? 3 : 10));
        startDate.setHours(10 + index, 0, 0, 0);

        const endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + 1);

        return {
            ...event,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
        }
    });

    return mockEventsWithCurrentDates;
};
