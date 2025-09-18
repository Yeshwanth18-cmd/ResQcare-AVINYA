import type { UserProfile, GuideSection, QuickActionId } from '../types';
import {
  IconAppointments,
  IconHeartbeat,
  IconJournal,
  IconStethoscope,
  IconShieldCheck,
  IconBell,
  IconUsers,
  IconSettings,
  IconChartBar
} from '../components/Icons';

const ALL_SECTIONS: Omit<GuideSection, 'content'>[] = [
  { id: 'appointments', title: 'Appointments', icon: IconAppointments, quickActionLabel: 'Book Visit' },
  { id: 'sos', title: 'SOS/Emergency', icon: IconHeartbeat, quickActionLabel: 'Configure SOS' },
  { id: 'mood', title: 'Mood & Journaling', icon: IconJournal, quickActionLabel: 'Log Mood' },
  { id: 'assessment', title: 'Assessments', icon: IconStethoscope, quickActionLabel: 'Start Assessment' },
  { id: 'resources', title: 'Resource Hub', icon: IconShieldCheck, quickActionLabel: 'Explore' },
  { id: 'reminders', title: 'Notifications', icon: IconBell, quickActionLabel: 'Set Reminders' },
  { id: 'contacts', title: 'Contacts Sync', icon: IconUsers, quickActionLabel: 'Sync Contacts' },
  { id: 'settings', title: 'Settings', icon: IconSettings, quickActionLabel: 'Open Settings' },
  { id: 'mood_history', title: 'Mood History', icon: IconChartBar, quickActionLabel: 'View History' },
];

const getContent = (id: QuickActionId, profile: UserProfile): string => {
    const isYouth = profile.ageTier === 'youth';
    switch (id) {
        case 'appointments': return isYouth ? "Quickly book and see your next appointment. We'll flag anything urgent." : "Manage your appointments, book new ones, and see priority flags for urgent matters.";
        case 'sos': return isYouth ? "Set a trusted contact so help is just one tap away in an emergency." : "Configure your trusted contact and local emergency number. You can trigger this with a long-press or stealth taps.";
        case 'mood': return isYouth ? "Log how it feels today. A few words or an emoji is enough. It's private to you." : "Track your mood with our daily slider and private notes. You can export your journal anytime.";
        case 'assessment': return "Use standard, optional screeners like PHQ-9 and GAD-7. This is not a diagnosis but can be a helpful starting point.";
        case 'resources': return isYouth ? "Find articles and calming exercises picked just for you. See tags and how long each takes." : "Explore a curated library of articles, audio guides, and exercises tailored to your needs.";
        case 'reminders': return isYouth ? "Get pings for your appointments or when it's time to journal. Link your calendar to make it easy." : "Enable reminders for medications, journaling, and appointments to stay on track. Calendar integration is available.";
        case 'contacts': return "Sync and manage your trusted contacts for the SOS feature. We'll help you format numbers correctly.";
        case 'settings': return "Adjust text size, motion, and language. You can also manage your privacy from the dashboard.";
        case 'mood_history': return "Review your past mood entries and notes to see patterns and reflect on your journey. Your data is private to you.";
        default: return "";
    }
};

export const getGuideTitle = (profile: UserProfile): string => {
    if (profile.ageTier === 'youth' && profile.conditionTier === 'anxiety_depression') {
        return "Small steps, big progress. ✨";
    }
    if (profile.ageTier === 'adult' && profile.conditionTier === 'chronic_generic') {
        return "All set to get organized.";
    }
    return "Welcome to ResQcare!";
};

export const getGuideSections = (profile: UserProfile): GuideSection[] => {
  const baseSections = ALL_SECTIONS.map(section => ({
      ...section,
      content: getContent(section.id, profile)
  }));
  
  const sectionMap = new Map(baseSections.map(s => [s.id, s]));
  let orderedIds: QuickActionId[] = ['appointments', 'sos', 'mood', 'mood_history', 'assessment', 'resources', 'reminders', 'contacts', 'settings'];

  if (profile.conditionTier === 'anxiety_depression') {
    orderedIds = ['appointments', 'mood', 'mood_history', 'sos', 'resources', 'assessment', 'reminders', 'contacts', 'settings'];
  } else if (profile.conditionTier === 'chronic_generic') {
    orderedIds = ['appointments', 'reminders', 'resources', 'sos', 'assessment', 'mood', 'mood_history', 'contacts', 'settings'];
  }
  
  return orderedIds.map(id => sectionMap.get(id)!);
};


export const getDefaultQuickActions = (profile: UserProfile): QuickActionId[] => {
    if (profile.ageTier === 'youth' && profile.conditionTier === 'anxiety_depression') {
        return ['mood', 'resources', 'sos'];
    }
    if (profile.ageTier === 'adult' && profile.conditionTier === 'chronic_generic') {
        return ['appointments', 'reminders', 'settings'];
    }
    return ['mood', 'resources', 'appointments'];
};