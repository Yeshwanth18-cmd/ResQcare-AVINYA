import React from 'react';
import { NavLink } from 'react-router-dom';
import { IconHeartbeat, IconShieldCheck, IconHelp } from './Icons';

interface HeaderProps {
  onCrisisClick: () => void;
  onShowTour: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCrisisClick, onShowTour }) => {
  const linkClass = "text-slate-600 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium";
  const activeLinkClass = "text-blue-700 bg-blue-100";

  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex-shrink-0 flex items-center gap-2">
              <IconShieldCheck className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-slate-800">ResQcare</span>
            </NavLink>
            <nav className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <NavLink to="/" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>Dashboard</NavLink>
                <NavLink to="/mood-history" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>History</NavLink>
                <NavLink to="/calendar" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>Calendar</NavLink>
                <NavLink to="/assessments" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>Screeners</NavLink>
                <NavLink to="/chat" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>Chat</NavLink>
                <NavLink to="/resources" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>Resources</NavLink>
                <NavLink to="/profile" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>Profile</NavLink>
                <NavLink to="/settings" className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}>Settings</NavLink>
              </div>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button
                onClick={onShowTour}
                className="hidden sm:flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold py-2 px-4 rounded-full transition-colors duration-200"
                aria-label="Show Quick Tour"
              >
                <IconHelp className="h-5 w-5" />
                <span className="hidden lg:inline">Help</span>
            </button>
            <button
              onClick={onCrisisClick}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-transform duration-200 ease-in-out hover:scale-105"
            >
              <IconHeartbeat className="h-5 w-5" />
              <span>Emergency</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;