import React, { useState, useEffect, useMemo } from 'react';
import { useScheduledReminders } from '../hooks/useScheduledReminders';
import { IconBell, IconCheckCircle, IconX } from './Icons';
import Toast from './Toast';

type ReminderFrequency = 'daily' | '3days' | 'weekly';

interface ReminderConfig {
  isEnabled: boolean;
  frequency: ReminderFrequency;
}

const STORAGE_KEY = 'resqcare_reminder_settings';

const calculateNextReminderDate = (frequency: ReminderFrequency): Date => {
  const now = new Date();
  switch (frequency) {
    case 'daily':
      now.setDate(now.getDate() + 1);
      return now;
    case '3days':
      now.setDate(now.getDate() + 3);
      return now;
    case 'weekly':
      now.setDate(now.getDate() + 7);
      return now;
    default:
      // Default to tomorrow
      now.setDate(now.getDate() + 1);
      return now;
  }
};


const ReminderSettings: React.FC = () => {
  const [config, setConfig] = useState<ReminderConfig>({
    isEnabled: false,
    frequency: 'daily',
  });
  const [showToast, setShowToast] = useState(false);
  const { reminders, deleteReminder } = useScheduledReminders();

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        setConfig(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error("Failed to load reminder settings from localStorage:", error);
    }
  }, []);

  const formattedNextDate = useMemo(() => {
    if (!config.isEnabled) return null;
    
    const nextDate = calculateNextReminderDate(config.frequency);
    
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Intl.DateTimeFormat(undefined, options).format(nextDate);
  }, [config.isEnabled, config.frequency]);

  const handleSave = (newConfig: ReminderConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
      setShowToast(true);
    } catch (error) {
      console.error("Failed to save reminder settings to localStorage:", error);
    }
  };
  
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfig = { ...config, isEnabled: e.target.checked };
    handleSave(newConfig);
  };
  
  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newConfig = { ...config, frequency: e.target.value as ReminderFrequency };
    handleSave(newConfig);
  };
  
  const formatReminderTime = (isoTime: string) => {
      try {
          return new Date(isoTime).toLocaleString(undefined, {
             dateStyle: 'medium',
             timeStyle: 'short'
          });
      } catch {
          return "Invalid Date";
      }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <IconBell className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold text-slate-900">Reminder Settings</h2>
      </div>
      
      <div className="mt-6 space-y-4">
        <div>
            <h3 className="text-lg font-semibold text-slate-800">Scheduled Reminders</h3>
            <p className="mt-1 text-slate-600">These are specific reminders you've set, often via the AI chat.</p>
            <div className="mt-4 space-y-3">
                {reminders.length > 0 ? (
                    reminders.map(reminder => (
                        <div key={reminder.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                           <div>
                                <p className="font-semibold text-slate-800 capitalize">{reminder.type}</p>
                                <p className="text-sm text-slate-600">{formatReminderTime(reminder.time)}</p>
                           </div>
                           <button onClick={() => deleteReminder(reminder.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors" aria-label={`Delete reminder for ${reminder.type}`}>
                                <IconX className="w-5 h-5" />
                           </button>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-500 p-3 bg-slate-50 rounded-lg text-center">No reminders scheduled. Try asking the chat: "Remind me to journal tomorrow."</p>
                )}
            </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-slate-800 mt-6">General Reminders</h3>
            <p className="mt-1 text-slate-600">
              Opt-in to receive gentle, recurring reminders for journaling or meditation.
            </p>
        </div>

        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
          <label htmlFor="reminder-toggle" className="font-semibold text-slate-800">
            Enable General Reminders
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              id="reminder-toggle" 
              className="sr-only peer"
              checked={config.isEnabled}
              onChange={handleToggle}
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {config.isEnabled && (
          <div className="p-4 border border-slate-200 rounded-lg animate-fade-in">
            <label htmlFor="frequency-select" className="block font-semibold text-slate-800 mb-2">
              Reminder Cadence
            </label>
            <select
              id="frequency-select"
              value={config.frequency}
              onChange={handleFrequencyChange}
              className="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="daily">Daily</option>
              <option value="3days">Every 3 Days</option>
              <option value="weekly">Weekly</option>
            </select>
            
            {formattedNextDate && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">
                  Your next reminder is estimated to be on:{' '}
                  <strong className="font-semibold text-slate-800">{formattedNextDate}</strong>.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <Toast
        message="Settings saved successfully!"
        show={showToast}
        onClose={() => setShowToast(false)}
        icon={<IconCheckCircle className="w-6 h-6 text-green-500" />}
      />
    </div>
  );
};

export default ReminderSettings;