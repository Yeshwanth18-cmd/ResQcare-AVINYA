import React from 'react';
import { Link } from 'react-router-dom';
import type { QuickActionId } from '../types';
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
} from './Icons';

interface QuickActionsProps {
  actions: QuickActionId[];
}

// FIX: Added 'calendar' property to satisfy the Record<QuickActionId, ...> type and updated the 'appointments' action link.
const ACTION_MAP: Record<QuickActionId, { label: string; link: string; icon: React.FC<React.SVGProps<SVGSVGElement>>; }> = {
  appointments: { label: 'Appointments', link: '/calendar', icon: IconAppointments },
  sos: { label: 'Emergency SOS', link: '/profile', icon: IconHeartbeat },
  mood: { label: 'Log Your Mood', link: '/', icon: IconJournal },
  assessment: { label: 'Take Screener', link: '/assessments', icon: IconStethoscope },
  resources: { label: 'Find Resources', link: '/resources', icon: IconShieldCheck },
  reminders: { label: 'Set Reminders', link: '/profile', icon: IconBell },
  contacts: { label: 'Sync Contacts', link: '/profile', icon: IconUsers },
  settings: { label: 'My Settings', link: '/profile', icon: IconSettings },
  mood_history: { label: 'Review Mood', link: '/mood-history', icon: IconChartBar },
  calendar: { label: 'Calendar', link: '/calendar', icon: IconAppointments },
};

const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  return (
    <div>
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {actions.map(actionId => {
                const action = ACTION_MAP[actionId];
                if (!action) return null;
                return (
                    <Link
                        key={actionId}
                        to={action.link}
                        className="group flex flex-col items-center justify-center text-center p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="bg-blue-100 rounded-full p-4 transition-colors group-hover:bg-blue-200">
                           <action.icon className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="mt-3 font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">{action.label}</p>
                    </Link>
                );
            })}
        </div>
    </div>
  );
};

export default QuickActions;