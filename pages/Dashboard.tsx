import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SymptomChecker from './SymptomChecker';
import MoodLogger from '../components/MoodLogger';
import AfterLogModal from '../components/AfterLogModal';
import QuickActions from '../components/QuickActions';
import type { QuickActionId, MoodLog } from '../types';
import { IconX, IconStethoscope } from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../App';

interface DashboardProps {
  quickActions: QuickActionId[];
}

const Dashboard: React.FC<DashboardProps> = ({ quickActions }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [isAfterLogModalOpen, setIsAfterLogModalOpen] = useState(false);
  const [lastLoggedMood, setLastLoggedMood] = useState<MoodLog | null>(null);
  const { user } = useAuth();
  const { t } = useTranslation();

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
        <div className="bg-success-light p-4 rounded-r-lg flex justify-between items-center animate-fade-in">
          <p className="text-success-text"><strong>{t("You're all set!")}</strong> {t('Your dashboard is now tailored for you.')}</p>
          <button onClick={() => setShowBanner(false)} className="text-success-text hover:opacity-75" aria-label="Dismiss">
            <IconX className="w-5 h-5" />
          </button>
        </div>
      )}
      
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">{t('Welcome')}{greetingName}</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">{t('How are you feeling today?')}</p>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
        <MoodLogger onLogSuccess={handleLogSuccess} />
      </div>

      <div>
        <QuickActions actions={quickActions} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
            <SymptomChecker />
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 md:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3">
                <IconStethoscope className="w-8 h-8 text-primary"/>
                <h2 className="text-2xl font-bold text-slate-900">{t('Health Screeners')}</h2>
            </div>
            <p className="mt-2 text-slate-600">{t('Use standard screeners for common health concerns like anxiety and depression.')}</p>
            <Link to="/assessments" className="mt-4 inline-block bg-primary-light text-primary-text font-bold py-3 px-6 rounded-full hover:opacity-80 transition-opacity duration-200 self-start">
                {t('Take a Screener')}
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