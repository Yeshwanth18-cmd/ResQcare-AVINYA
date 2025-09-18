import React from 'react';
import { Link } from 'react-router-dom';
import type { MoodLog, Resource } from '../types';
// FIX: Corrected import to use the exported MENTAL_HEALTH_RESOURCES constant.
import { MENTAL_HEALTH_RESOURCES } from '../constants';
import { IconX, IconAlertTriangle, IconShieldCheck, IconJournal, IconChartBar } from './Icons';

interface AfterLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  moodLog: MoodLog;
}

interface Recommendation {
    title: string;
    description: string;
    journalPrompt: string;
    suggestedResource?: Resource;
    isCrisis: boolean;
}

const getRecommendations = (moodLog: MoodLog, allResources: Resource[]): Recommendation => {
  const { score } = moodLog;

  const lowMoodTags = ['stress', 'anxiety', 'coping-strategies', 'mindfulness', 'depression'];
  const neutralMoodTags = ['self-care', 'mindfulness', 'education', 'resilience'];
  const positiveMoodTags = ['positivity', 'resilience', 'growth', 'gratitude'];

  let relevantTags: string[] = [];
  let title = "Thanks for checking in.";
  let description = "Acknowledging your feelings is a great step. Here are some options to explore.";
  let journalPrompt = "What's one thing you could do today to take care of yourself?";
  let isCrisis = false;

  if (score <= 4) { // Low mood
    relevantTags = lowMoodTags;
    title = "It's okay to not be okay.";
    description = "Thanks for checking in. Taking a moment for yourself can make a difference. Here is something that might help.";
    journalPrompt = "What's on your mind? Writing it down can sometimes lighten the load.";
    isCrisis = score <= 2; // Flag as crisis for very low scores
  } else if (score <= 6) { // Neutral mood
    relevantTags = neutralMoodTags;
  } else { // Positive mood
    relevantTags = positiveMoodTags;
    title = "Great to hear you're feeling good!";
    description = "Thanks for logging your mood. Let's build on this positive momentum.";
    journalPrompt = "What's something that went well today? Take a moment to savor it.";
  }
  
  const potentialResources = allResources.filter(resource => 
    resource.tags.some(tag => relevantTags.includes(tag))
  );

  let suggestedResource: Resource | undefined = undefined;
  if (potentialResources.length > 0) {
    const randomIndex = Math.floor(Math.random() * potentialResources.length);
    suggestedResource = potentialResources[randomIndex];
  }

  return { title, description, journalPrompt, isCrisis, suggestedResource };
};


const AfterLogModal: React.FC<AfterLogModalProps> = ({ isOpen, onClose, moodLog }) => {
  if (!isOpen) return null;

  const recommendations = getRecommendations(moodLog, MENTAL_HEALTH_RESOURCES);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="after-log-title"
    >
      <div
        className="relative bg-white rounded-lg shadow-md w-full max-w-2xl m-4 p-8 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Close"
        >
          <IconX className="w-6 h-6" />
        </button>

        <div className="text-center">
          <span className="text-6xl">{moodLog.emoji}</span>
          <h2 id="after-log-title" className="mt-4 text-3xl font-extrabold text-slate-900">
            {recommendations.title}
          </h2>
          <p className="mt-2 max-w-lg mx-auto text-slate-600">
            {recommendations.description}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {recommendations.isCrisis && (
            <div className="p-4 themed-alert-warning rounded-r-lg flex items-start gap-3">
              <IconAlertTriangle className="w-8 h-8 flex-shrink-0" />
              <div>
                <p className="font-bold">Feeling Overwhelmed?</p>
                <p className="text-sm">If you're in distress, please remember that immediate help is available. You are not alone.</p>
              </div>
            </div>
          )}
          
          <div className="p-6 bg-slate-50 rounded-lg">
             <h3 className="font-bold text-slate-800 flex items-center gap-2"><IconJournal className="w-5 h-5"/> Journal Prompt</h3>
             <p className="mt-2 text-slate-600">{recommendations.journalPrompt}</p>
          </div>

          {recommendations.suggestedResource && (
             <a href={recommendations.suggestedResource.link} target="_blank" rel="noopener noreferrer" className="block text-left p-6 bg-primary-light rounded-lg hover:opacity-80 transition-opacity">
                <h3 className="font-bold text-primary-text flex items-center gap-2"><IconShieldCheck className="w-5 h-5"/> Suggested For You</h3>
                <p className="mt-2 text-primary-text font-semibold">{recommendations.suggestedResource.title}</p>
                <p className="text-sm text-primary mt-1">{recommendations.suggestedResource.description}</p>
            </a>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/mood-history" onClick={onClose} className="w-full flex items-center justify-center gap-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-lg transition">
              <IconChartBar className="w-5 h-5"/>
              View Mood History
            </Link>
             <button onClick={onClose} className="w-full bg-primary bg-primary-hover text-white font-bold py-3 px-4 rounded-lg transition">
                Done
            </button>
        </div>
      </div>
    </div>
  );
};

export default AfterLogModal;