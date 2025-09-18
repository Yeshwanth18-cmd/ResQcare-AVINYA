import React from 'react';
import { Link } from 'react-router-dom';
import TriageAnalyzer from './MoodTracker';

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Welcome to ResQcare</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">Your AI-powered health assistant. Start by checking your symptoms below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Triage Analyzer */}
        <div className="lg:col-span-2 bg-white shadow-lg rounded-2xl p-6 md:p-8">
          <TriageAnalyzer />
        </div>
        
        {/* Other tools */}
        <div className="space-y-8">
          <DashboardCard
            to="/assessments"
            title="Take a Health Screener"
            description="Use standard screeners for common health concerns like anxiety and depression."
            bgColor="bg-indigo-100"
            textColor="text-indigo-800"
          />
          <DashboardCard
            to="/chat"
            title="Chat with AI Assistant"
            description="Ask health-related questions in a safe, private, and AI-powered chat."
            bgColor="bg-purple-100"
            textColor="text-purple-800"
          />
          <DashboardCard
            to="/resources"
            title="Explore Health Hub"
            description="Discover articles, guides, and exercises to support your well-being."
            bgColor="bg-green-100"
            textColor="text-green-800"
          />
        </div>
      </div>
    </div>
  );
};

interface DashboardCardProps {
    to: string;
    title: string;
    description: string;
    bgColor: string;
    textColor: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ to, title, description, bgColor, textColor }) => {
    return (
        <Link to={to} className={`block p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${bgColor}`}>
            <h3 className={`text-xl font-bold ${textColor}`}>{title}</h3>
            <p className={`mt-2 text-sm opacity-90 ${textColor}`}>{description}</p>
        </Link>
    );
}

export default Dashboard;