import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';
import { translateBatch } from './services/geminiService';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import MainApp from './MainApp';
import PreferredNameModal from './components/PreferredNameModal';

// --- Translation Context ---
interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (text: string) => string;
  isTranslating: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const supportedLanguages: Record<string, string> = {
  en: 'English',
  te: 'తెలుగు',
  es: 'Español',
  hi: 'हिन्दी',
  fr: 'Français',
  zh: '中文',
  ar: 'العربية'
};

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState('en');
  const [translationCache, setTranslationCache] = useState<Record<string, Record<string, string>>>({ en: {} });
  const [queue, setQueue] = useState<Set<string>>(new Set());
  const [isTranslating, setIsTranslating] = useState(false);

  const setLanguage = (lang: string) => {
    if (lang !== language && supportedLanguages[lang]) {
      setLanguageState(lang);
      if (!translationCache[lang]) {
        setTranslationCache(prev => ({ ...prev, [lang]: {} }));
      }
    }
  };

  const t = useCallback((text: string): string => {
    if (!text || typeof text !== 'string' || language === 'en') {
      return text;
    }

    const cacheForLang = translationCache[language] || {};
    if (cacheForLang[text]) {
      return cacheForLang[text];
    }
    
    setQueue(prev => {
        if (prev.has(text)) return prev;
        const newQueue = new Set(prev);
        newQueue.add(text);
        return newQueue;
    });

    return text;
  }, [language, translationCache]);

  useEffect(() => {
    const processQueue = async () => {
      if (queue.size === 0 || language === 'en') {
        if (isTranslating) setIsTranslating(false);
        return;
      }

      setIsTranslating(true);
      const textsToTranslate = Array.from(queue);
      const languageName = supportedLanguages[language] || language;
      
      const textsNotInCache = textsToTranslate.filter(text => !(translationCache[language] && translationCache[language][text]));
      
      if(textsNotInCache.length === 0) {
        setIsTranslating(false);
        return;
      }
      
      setQueue(new Set()); 

      try {
        const results = await translateBatch(textsNotInCache, language, languageName);
        setTranslationCache(prev => {
            const newCache = { ...prev };
            if (!newCache[language]) {
                newCache[language] = {};
            }
            for (const key in results) {
                newCache[language][key] = results[key];
            }
            return newCache;
        });
      } catch (error) {
        console.error("Translation failed", error);
      } finally {
        setIsTranslating(false);
      }
    };

    const handler = setTimeout(() => {
        processQueue();
    }, 500);

    return () => clearTimeout(handler);
  }, [queue, language, translationCache, isTranslating]);

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t, isTranslating }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
// --- End Translation Context ---


const App: React.FC = () => {
  return (
    <AuthProvider>
      <TranslationProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <PreferredNameModal />
        </ThemeProvider>
      </TranslationProvider>
    </AuthProvider>
  );
};

export default App;
