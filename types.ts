import React from 'react';

// For Assessments
export interface Option {
  text: string;
  value: number;
}

export interface Question {
  text: string;
  options: Option[];
}

export interface ScoringLevel {
  level: string;
  range: [number, number];
  interpretation: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  disclaimer: string;
  sourceInfo: string;
  questions: Question[];
  scoring: ScoringLevel[];
}

// For Resources
export interface Resource {
  id: string;
  title: string;
  description: string;
  contentType: 'Article' | 'Video' | 'Audio' | 'Guide' | 'Exercise';
  category: 'Anxiety' | 'Depression' | 'Stress' | 'Sleep' | 'Mindfulness' | 'Self-Care' | 'Crisis Support';
  tags: string[];
  link: string;
  source: 'WHO' | 'NIH' | 'SAMHSA' | 'NIMH' | 'Other Reputable';
  audience: 'General' | 'Youth' | 'Adults' | 'Family';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeToComplete: number; // in minutes
}


// For Theming
export type ThemeName = 'sky' | 'coral' | 'mint' | 'olive' | 'sand' | 'cream';
export type ThemePalette = Record<string, string>;

// For Chat
export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  isError?: boolean;
  isCrisis?: boolean;
  resources?: Resource[];
}

// For Symptom Checker
export interface TriageResult {
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  advice: string;
  appointment_suggestion: string | null;
  appointment_action: {
    show: boolean;
    label: string | null;
    url: string | null;
  };
  emergency: boolean;
  emergency_contacts: string[] | null;
  resources: string[] | null;
}

// For Mood Logging
export interface MoodLog {
  id: string;
  timestamp: string;
  score: number;
  emoji: string;
  notes?: string;
}

// For User and Profile
export interface User {
  id: string;
  name: string;
  email: string;
  preferredName?: string;
  hasSetPreferredName: boolean;
}

export interface UserProfile {
  ageTier: 'youth' | 'adult';
  conditionTier: 'anxiety_depression' | 'chronic_generic';
}

// For Reminders
export interface ScheduledReminder {
    id: string;
    type: string;
    time: string;
}

// For Post-Login Guide and Quick Actions
export type QuickActionId =
  | 'appointments'
  | 'sos'
  | 'mood'
  | 'assessment'
  | 'resources'
  | 'reminders'
  | 'contacts'
  | 'settings'
  | 'mood_history'
  | 'calendar';

export interface GuideSection {
  id: QuickActionId;
  title: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  quickActionLabel: string;
  content: string;
}

// For Calendar
export interface CalendarEvent {
    id: string;
    title: string;
    start: string; // ISO string
    end: string; // ISO string
    description?: string;
    source: 'user' | 'google';
}

// For AI Safety
export interface SafetyAnalysisResult {
    isCrisis: boolean;
    reasoning: string;
}