import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { THEMES } from '../constants';
import type { ThemeName } from '../types';
import { IconCheckCircle } from './Icons';

const ThemePicker: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      {Object.entries(THEMES).map(([themeKey, themeValue]) => {
        const key = themeKey as ThemeName;
        const isActive = theme === key;
        return (
          <button
            key={key}
            onClick={() => setTheme(key)}
            aria-label={`Set ${themeValue.name} theme`}
            className={`relative p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${isActive ? 'border-primary' : 'border-slate-200 hover:border-slate-400'}`}
          >
            <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full" style={{ backgroundColor: themeValue.palette['--color-primary'] }}></div>
                <span className="text-sm font-semibold text-slate-700">{themeValue.name}</span>
            </div>
             {isActive && (
              <div className="absolute top-1 right-1 bg-white rounded-full">
                <IconCheckCircle className="w-5 h-5 text-primary" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ThemePicker;