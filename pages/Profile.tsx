import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Toast from '../components/Toast';
import type { UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { IconLogout, IconDevices, IconCheckCircle, IconSettings, IconUserCircle } from '../components/Icons';


const AccountSettings: React.FC = () => {
    const { logout, logoutAll, openNameModal, user } = useAuth();
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const handleLogout = () => {
        logout();
        setToastMessage("You have been signed out.");
    };

    const handleLogoutAll = () => {
        logoutAll();
        setToastMessage("You have been signed out of all devices.");
    };

    return (
        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Account Settings</h2>
            <p className="text-slate-600 mb-6">Manage your session, preferred name, and account security.</p>
            <div className="space-y-4">
                <button
                    onClick={openNameModal}
                    className="w-full flex items-center justify-center gap-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-lg transition-colors h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <IconUserCircle className="w-5 h-5" />
                    <span>{user?.hasSetPreferredName ? 'Change' : 'Set'} Your Name</span>
                </button>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-lg transition-colors h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <IconLogout className="w-5 h-5" />
                    <span>Log Out</span>
                </button>
                <button
                    onClick={handleLogoutAll}
                    className="w-full flex items-center justify-center gap-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-lg transition-colors h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <IconDevices className="w-5 h-5" />
                    <span>Log Out of All Devices</span>
                </button>
            </div>
            <Toast
                message={toastMessage || ''}
                show={!!toastMessage}
                onClose={() => setToastMessage(null)}
                icon={<IconCheckCircle className="w-6 h-6 text-green-500" />}
            />
        </div>
    );
};


interface ProfileProps {
  profile: UserProfile;
  onProfileChange: (newProfile: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, onProfileChange }) => {
  const handleAgeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onProfileChange({ ...profile, ageTier: e.target.value as UserProfile['ageTier'] });
  };

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onProfileChange({ ...profile, conditionTier: e.target.value as UserProfile['conditionTier'] });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Profile</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
          Manage your account and demo settings.
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Demo Profile</h2>
          <p className="text-slate-600 mb-6">Select a profile to see how the app adapts its guidance and content. This is for demonstration purposes.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="age-tier" className="block text-sm font-medium text-slate-700 mb-2">Age Group</label>
              <select id="age-tier" value={profile.ageTier} onChange={handleAgeChange} className="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="youth">Youth (13-24)</option>
                <option value="adult">Adult (25+)</option>
              </select>
            </div>
            <div>
              <label htmlFor="condition-tier" className="block text-sm font-medium text-slate-700 mb-2">Condition Focus</label>
              <select id="condition-tier" value={profile.conditionTier} onChange={handleConditionChange} className="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="anxiety_depression">Anxiety & Depression</option>
                <option value="chronic_generic">Chronic & General</option>
              </select>
            </div>
          </div>
        </div>

        <Link to="/settings" className="block bg-white shadow-lg rounded-2xl p-6 md:p-8 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <IconSettings className="w-8 h-8 text-blue-500"/>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">App Settings</h2>
              <p className="text-slate-600">Customize themes, reminders, and integrations.</p>
            </div>
          </div>
        </Link>
        
        <AccountSettings />

      </div>
    </div>
  );
};

export default Profile;