import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SymptomChecker from './SymptomChecker';
import MoodLogger from '../components/MoodLogger';
import AfterLogModal from '../components/AfterLogModal';
import QuickActions from '../components/QuickActions';
import type { QuickActionId, MoodLog } from '../types';
import { IconX, IconStethoscope } from '../components/Icons';
import { useAuth } from '../context/AuthContext';

interface DashboardProps {
  quickActions: QuickActionId[];
}

const Dashboard: React.FC<DashboardProps> = ({ quickActions }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [isAfterLogModalOpen, setIsAfterLogModalOpen] = useState(false);
  const [lastLoggedMood, setLastLoggedMood] = useState<MoodLog | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (sessionStorage.getItem('resqcare_show_welcome_banner') === 'true') {
      setShowBanner(true);
      sessionStorage.removeItem('resqcare_show_welcome_banner');
    }
  }, []);
  
  const handleLogSuccess = (newLog: MoodLog) => {
    setLastLoggedMood(newLog);
    setIsAfterLogModalOpen(true);
  };
  
  const greetingName = user?.preferredName ? `, ${user.preferredName}` : '';

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {showBanner && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-r-lg flex justify-between items-center animate-fade-in">
          <p><strong className="font-bold">You're all set!</strong> Your dashboard is now tailored for you.</p>
          <button onClick={() => setShowBanner(false)} className="text-green-800 hover:text-green-900" aria-label="Dismiss">
            <IconX className="w-5 h-5" />
          </button>
        </div>
      )}
      
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Welcome{greetingName}</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">How are you feeling today?</p>
      </div>
      
      <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8">
        <MoodLogger onLogSuccess={handleLogSuccess} />
      </div>

      <div>
        <QuickActions actions={quickActions} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8">
            <SymptomChecker />
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3">
                <IconStethoscope className="w-8 h-8 text-blue-500"/>
                <h2 className="text-2xl font-bold text-slate-900">Health Screeners</h2>
            </div>
            <p className="mt-2 text-slate-600">Use standard screeners for common health concerns like anxiety and depression.</p>
            <Link to="/assessments" className="mt-4 inline-block bg-blue-100 text-blue-700 font-bold py-3 px-6 rounded-full hover:bg-blue-200 transition-all duration-200 self-start">
                Take a Screener
            </Link>
        </div>
      </div>
      
      {isAfterLogModalOpen && lastLoggedMood && (
        <AfterLogModal
            isOpen={isAfterLogModalOpen}
            onClose={() => setIsAfterLogModalOpen(false)}
            moodLog={lastLoggedMood}
        />
      )}
    </div>
  );
};

export default Dashboard;