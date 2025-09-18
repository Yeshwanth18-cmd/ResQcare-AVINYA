import { useState, useEffect, useCallback } from 'react';
import type { ScheduledReminder } from '../types';

const REMINDER_STORAGE_KEY = 'resqcare_scheduled_reminders';

export const useScheduledReminders = () => {
  const [reminders, setReminders] = useState<ScheduledReminder[]>([]);

  useEffect(() => {
    try {
      const savedReminders = localStorage.getItem(REMINDER_STORAGE_KEY);
      if (savedReminders) {
        setReminders(JSON.parse(savedReminders));
      }
    } catch (error) {
      console.error("Failed to load scheduled reminders from localStorage:", error);
    }
  }, []);

  const saveReminders = (updatedReminders: ScheduledReminder[]) => {
      try {
        // Sort reminders by time before saving
        const sorted = updatedReminders.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
        localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(sorted));
        setReminders(sorted);
      } catch (error) {
        console.error("Failed to save reminders to localStorage:", error);
      }
  }

  const addReminder = useCallback((type: string, time: string) => {
    const newReminder: ScheduledReminder = {
      id: crypto.randomUUID(),
      type,
      time,
    };

    setReminders(prevReminders => {
      const updatedReminders = [...prevReminders, newReminder];
      saveReminders(updatedReminders);
      return updatedReminders;
    });
    
    return newReminder;
  }, []);
  
  const deleteReminder = useCallback((id: string) => {
      setReminders(prevReminders => {
          const updatedReminders = prevReminders.filter(r => r.id !== id);
          saveReminders(updatedReminders);
          return updatedReminders;
      })
  }, []);

  return {
    reminders,
    addReminder,
    deleteReminder
  };
};
