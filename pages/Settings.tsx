import React from 'react';
import ThemePicker from '../components/ThemePicker';
import GoogleCalendarConnect from '../components/GoogleCalendarConnect';
import ReminderSettings from '../components/ReminderSettings';
import { IconSettings } from '../components/Icons';

const Settings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl flex items-center justify-center gap-4">
            <IconSettings className="w-10 h-10" />
            Settings
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
          Customize your app experience and connect your accounts.
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Color Theme</h2>
            <p className="text-slate-600 mb-6">Choose a palette that feels most calming and comfortable for you. The app is in light mode by default.</p>
            <ThemePicker />
        </div>
        
        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8">
          <ReminderSettings />
        </div>
        
        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Integrations</h2>
            <p className="text-slate-600 mb-6">Connect your Google Calendar to sync appointments and stay organized.</p>
            <GoogleCalendarConnect />
        </div>
      </div>
    </div>
  );
};

export default Settings;
