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
  title:string;
  description: string;
  contentType: 'Article' | 'Video' | 'Audio' | 'Guide' | 'Exercise';
  category: 'Anxiety' | 'Depression' | 'Stress' | 'Sleep' | 'Mindfulness' | 'Self-Care' | 'Crisis Support';
  tags: string[];
  link: string;
  source: 'WHO' | 'NIH' | 'SAMHSA' | 'NIMH' | 'Other Reputable';
  audience: 'General' | 'Youth' | 'Adults' | 'Family';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeToComplete: number; // in minutes
  publish_date?: string;
  author?: string;
  key_points?: string[];
  ai_summary?: string;
  ai_related_links?: { title: string; url: string; }[];
  is_ai_generated?: boolean;
  needs_review?: boolean;
}


// For Theming
export type ThemeName = 'sky' | 'coral' | 'mint' | 'olive' | 'sand' | 'cream' | 'clinic';
export type ThemePalette = Record<string, string>;

// For Chat
export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  isError?: boolean;
  isCrisis?: boolean;
  resources?: Resource[];
}

// For Hospital Recommendations
export interface Hospital {
  name: string;
  lat: number;
  lon: number;
  distance_km: number;
  rating: number;
  services: string[];
  booking_url: string;
  address: string;
  directions_url: string;
  marker_color?: string;
}

// For Symptom Checker
export interface SymptomAnalysis {
  possible_causes: string[];
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  self_care_advice: string;
  resources: string[];
}

export interface SymptomAnalysisResult {
  symptom_analysis: SymptomAnalysis;
  hospitals: Hospital[] | null;
  emergency: boolean;
  emergency_contacts: string[] | null;
  message: string;
  ui: {
    theme: string;
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
}

// For Appointment Booking
export interface AvailableSlot {
  date: string; // "YYYY-MM-DD"
  times: string[]; // ["HH:MM"]
}

export interface AppointmentOptions {
  in_person: boolean;
  telehealth: boolean;
  available_slots: AvailableSlot[];
  requires_reason: boolean;
  allows_attachments: boolean;
}

export interface AppointmentDetails {
  id: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  type: 'in_person' | 'telehealth';
  reason: string;
  confirmation_url: string;
  calendar_url: string;
  reminder: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface BookingConfirmation {
  status: 'booked';
  hospital: Hospital;
  appointment: AppointmentDetails;
  message: string;
}

export interface AppointmentOptionsResult {
    hospital: Hospital;
    appointment_options: AppointmentOptions;
    ui: {
        theme: string;
        primary: string;
        secondary: string;
        text: string;
        background: string;
    };
    message: string;
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
