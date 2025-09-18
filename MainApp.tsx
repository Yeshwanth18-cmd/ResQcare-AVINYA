import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import CrisisModal from './components/CrisisModal';
import Dashboard from './pages/Dashboard';
import Assessments from './pages/Assessments';
import AssessmentForm from './components/AssessmentForm';
import Chat from './pages/Chat';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import PostLoginGuide from './components/PostLoginGuide';
import MoodLogHistory from './pages/MoodLogHistory';
import Settings from './pages/Settings';
import CalendarPage from './pages/CalendarPage';
import { PHQ9_ASSESSMENT, GAD7_ASSESSMENT } from './constants';
import type { UserProfile } from './types';
import { usePostLoginGuide } from './hooks/usePostLoginGuide';
// FIX: Import CalendarProvider to make context available to child components.
import { CalendarProvider } from './context/CalendarContext';

const MainApp: React.FC = () => {
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      return savedProfile ? JSON.parse(savedProfile) : { ageTier: 'youth', conditionTier: 'anxiety_depression' };
    } catch {
      return { ageTier: 'youth', conditionTier: 'anxiety_depression' };
    }
  });

  const {
    isInitialized,
    showGuide,
    quickActions,
    completeGuide,
    skipGuide,
    reopenGuide,
    updateProfile,
  } = usePostLoginGuide(profile);

  const handleProfileChange = (newProfile: UserProfile) => {
    setProfile(newProfile);
    updateProfile(newProfile);
    try {
      localStorage.setItem('userProfile', JSON.stringify(newProfile));
    } catch (error) {
      console.error("Could not save profile to localStorage", error);
    }
  };
  
  const assessments = {
    'phq-9': PHQ9_ASSESSMENT,
    'gad-7': GAD7_ASSESSMENT,
  };

  if (!isInitialized) {
      return <div className="min-h-screen flex items-center justify-center"><p>Loading preferences...</p></div>;
  }

  return (
    <div className="min-h-screen font-sans text-slate-800">
      <Header 
        onCrisisClick={() => setIsCrisisModalOpen(true)}
        onShowTour={reopenGuide}
      />
      <main className="p-4 sm:p-6 md:p-8">
        {/* FIX: Wrap routes in CalendarProvider so Calendar and Settings pages can access the context. */}
        <CalendarProvider>
          <Routes>
            <Route path="/" element={<Dashboard quickActions={quickActions} />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route 
              path="/assessments/phq-9" 
              element={<AssessmentForm assessment={assessments['phq-9']} />} 
            />
            <Route 
              path="/assessments/gad-7" 
              element={<AssessmentForm assessment={assessments['gad-7']} />} 
            />
            <Route path="/chat" element={<Chat />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/profile" element={<Profile profile={profile} onProfileChange={handleProfileChange} />} />
            <Route path="/mood-history" element={<MoodLogHistory />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </CalendarProvider>
      </main>
      <CrisisModal
        isOpen={isCrisisModalOpen}
        onClose={() => setIsCrisisModalOpen(false)}
      />
      {showGuide && (
         <PostLoginGuide 
            profile={profile}
            onComplete={completeGuide}
            onSkip={skipGuide}
         />
      )}
    </div>
  );
};

export default MainApp;
