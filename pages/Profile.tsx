import React from 'react';
import ReminderSettings from '../components/ReminderSettings';

const Profile: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Profile & Settings</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
          Manage your preferences and settings for your ResQcare account.
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8">
        <ReminderSettings />
      </div>
    </div>
  );
};

export default Profile;