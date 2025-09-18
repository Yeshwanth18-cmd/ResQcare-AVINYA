import { useState, useEffect, useCallback } from 'react';
import type { MoodLog } from '../types';

const MOOD_LOG_STORAGE_KEY = 'resqcare_mood_log';

export const useMoodLog = () => {
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);

  useEffect(() => {
    try {
      const savedLogs = localStorage.getItem(MOOD_LOG_STORAGE_KEY);
      if (savedLogs) {
        setMoodLogs(JSON.parse(savedLogs));
      }
    } catch (error) {
      console.error("Failed to load mood logs from localStorage:", error);
    }
  }, []);

  const addMoodLog = useCallback((newLog: Omit<MoodLog, 'id' | 'timestamp'>) => {
    const logWithMetadata: MoodLog = {
      ...newLog,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    setMoodLogs(prevLogs => {
      const updatedLogs = [...prevLogs, logWithMetadata];
      try {
        localStorage.setItem(MOOD_LOG_STORAGE_KEY, JSON.stringify(updatedLogs));
      } catch (error) {
        console.error("Failed to save mood logs to localStorage:", error);
      }
      return updatedLogs;
    });
    
    return logWithMetadata;
  }, []);

  return {
    moodLogs,
    addMoodLog,
  };
};