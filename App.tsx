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
import { PHQ9_ASSESSMENT, GAD7_ASSESSMENT } from './constants';

const App: React.FC = () => {
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);

  const assessments = {
    'phq-9': PHQ9_ASSESSMENT,
    'gad-7': GAD7_ASSESSMENT,
  };

  return (
    <div className="min-h-screen font-sans text-slate-800">
      <Header onCrisisClick={() => setIsCrisisModalOpen(true)} />
      <main className="p-4 sm:p-6 md:p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
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
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <CrisisModal
        isOpen={isCrisisModalOpen}
        onClose={() => setIsCrisisModalOpen(false)}
      />
    </div>
  );
};

export default App;