import React from 'react';
import { NavLink } from 'react-router-dom';
import { IconHeartbeat, IconShieldCheck, IconHelp } from './Icons';
import { useTranslation, supportedLanguages } from '../App';

interface HeaderProps {
  onCrisisClick: () => void;
  onShowTour: () => void;
}

const LanguageSelector: React.FC = () => {
    const { language, setLanguage, isTranslating } = useTranslation();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value);
    };

    return (
        <div className="relative flex items-center gap-2">
            {isTranslating && <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" title="Translating..."></div>}
            <select
                value={language}
                onChange={handleChange}
                className="bg-white border border-slate-300 rounded-md py-1 pl-2 pr-8 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 ring-primary"
                aria-label="Select a language"
            >
                {Object.entries(supportedLanguages).map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                ))}
            </select>
        </div>
    );
};


const Header: React.FC<HeaderProps> = ({ onCrisisClick, onShowTour }) => {
  const { t } = useTranslation();
  const linkClass = "text-slate-600 hover:text-primary transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium";
  const activeLinkClass = "text-primary-text bg-primary-light";

  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex-shrink-0 flex items-center gap-2">
              <IconShieldCheck className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-slate-800">ResQcare</span>
            </NavLink>
            <nav className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <NavLink to="/" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>{t('Dashboard')}</NavLink>
                <NavLink to="/mood-history" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>{t('History')}</NavLink>
                <NavLink to="/calendar" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>{t('Calendar')}</NavLink>
                <NavLink to="/assessments" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>{t('Screeners')}</NavLink>
                <NavLink to="/chat" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>{t('Chat')}</NavLink>
                <NavLink to="/resources" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>{t('Resources')}</NavLink>
                <NavLink to="/profile" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>{t('Profile')}</NavLink>
                <NavLink to="/settings" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>{t('Settings')}</NavLink>
              </div>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <button
                onClick={onShowTour}
                className="hidden sm:flex items-center gap-2 text-slate-600 hover:text-primary font-semibold py-2 px-4 rounded-full transition-colors duration-200"
                aria-label="Show Quick Tour"
              >
                <IconHelp className="h-5 w-5" />
                <span className="hidden lg:inline">{t('Help')}</span>
            </button>
            <button
              onClick={onCrisisClick}
              className="flex items-center gap-2 themed-bg-error themed-bg-error-hover text-white font-bold py-2 px-4 rounded-full transition-transform duration-200 ease-in-out hover:scale-105"
            >
              <IconHeartbeat className="h-5 w-5" />
              <span>{t('Emergency')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;