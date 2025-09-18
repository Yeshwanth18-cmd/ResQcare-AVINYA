import { useState, useEffect, useCallback } from 'react';
import type { UserProfile, QuickActionId } from '../types';
import { getDefaultQuickActions } from '../config/guideConfig';

const GUIDE_SEEN_KEY = 'resqcare_guide_seen';
const QUICK_ACTIONS_KEY = 'resqcare_quick_actions';
const WELCOME_BANNER_KEY = 'resqcare_show_welcome_banner';

export const usePostLoginGuide = (profile: UserProfile) => {
  const [showGuide, setShowGuide] = useState(false);
  const [quickActions, setQuickActions] = useState<QuickActionId[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    try {
      const hasSeenGuide = localStorage.getItem(GUIDE_SEEN_KEY) === 'true';
      const savedActionsRaw = localStorage.getItem(QUICK_ACTIONS_KEY);
      
      if (savedActionsRaw) {
        setQuickActions(JSON.parse(savedActionsRaw));
      } else {
        setQuickActions(getDefaultQuickActions(profile));
      }
      
      if (!hasSeenGuide) {
        setShowGuide(true);
      }
    } catch (error) {
      console.error("Failed to initialize from localStorage", error);
      setQuickActions(getDefaultQuickActions(profile));
    } finally {
      setIsInitialized(true);
    }
  }, [profile]);

  const completeGuide = useCallback((actions: QuickActionId[]) => {
    try {
      localStorage.setItem(GUIDE_SEEN_KEY, 'true');
      localStorage.setItem(QUICK_ACTIONS_KEY, JSON.stringify(actions));
      sessionStorage.setItem(WELCOME_BANNER_KEY, 'true'); // For one-time banner
      setQuickActions(actions);
      setShowGuide(false);
    } catch (error) {
        console.error("Failed to save guide settings", error);
    }
  }, []);

  const skipGuide = useCallback(() => {
    setShowGuide(false);
  }, []);

  const reopenGuide = useCallback(() => {
    setShowGuide(true);
  }, []);
  
  const updateProfile = useCallback((newProfile: UserProfile) => {
     try {
       // When profile changes, reset quick actions to the new default
       const newDefaultActions = getDefaultQuickActions(newProfile);
       localStorage.setItem(QUICK_ACTIONS_KEY, JSON.stringify(newDefaultActions));
       setQuickActions(newDefaultActions);
     } catch (error) {
        console.error("Failed to update actions for new profile", error);
     }
  }, []);

  return {
    isInitialized,
    showGuide,
    quickActions,
    completeGuide,
    skipGuide,
    reopenGuide,
    updateProfile,
  };
};
