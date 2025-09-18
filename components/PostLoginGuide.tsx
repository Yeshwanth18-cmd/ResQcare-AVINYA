import React, { useState, useEffect } from 'react';
import type { UserProfile, QuickActionId } from '../types';
import { getGuideSections, getGuideTitle, getDefaultQuickActions } from '../config/guideConfig';
import { IconX, IconCheckCircle } from './Icons';

interface PostLoginGuideProps {
  profile: UserProfile;
  onComplete: (selectedQuickActions: QuickActionId[]) => void;
  onSkip: () => void;
}

const PostLoginGuide: React.FC<PostLoginGuideProps> = ({ profile, onComplete, onSkip }) => {
  const sections = getGuideSections(profile);
  const title = getGuideTitle(profile);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedActions, setSelectedActions] = useState<Set<QuickActionId>>(() => new Set(getDefaultQuickActions(profile)));

  // Effect to handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSkip();
      if (e.key === 'ArrowRight') setActiveIndex(i => Math.min(i + 1, sections.length - 1));
      if (e.key === 'ArrowLeft') setActiveIndex(i => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSkip, sections.length]);

  const handleActionToggle = (id: QuickActionId) => {
    setSelectedActions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (newSet.size < 4) { // Limit to 4 quick actions
            newSet.add(id);
        }
      }
      return newSet;
    });
  };

  const handleComplete = () => {
    onComplete(Array.from(selectedActions));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="guide-title">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] max-h-[700px] flex flex-col animate-fade-in-up" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <header className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 id="guide-title" className="text-xl font-bold text-slate-800">{title}</h2>
          <button onClick={onSkip} className="text-slate-500 hover:text-slate-800" aria-label="Skip for now">
            <IconX className="w-6 h-6" />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Tabs (Desktop) */}
          <aside className="hidden md:block w-1/3 border-r border-slate-200 overflow-y-auto">
            <nav className="p-4 space-y-1">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => setActiveIndex(index)}
                  className={`w-full flex items-center gap-4 p-3 rounded-lg text-left transition-colors ${activeIndex === index ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  <section.icon className={`w-6 h-6 flex-shrink-0 ${activeIndex === index ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span>{section.title}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Panel */}
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            {sections.map((section, index) => (
                <div key={section.id} className={activeIndex === index ? 'block' : 'hidden'} role="tabpanel">
                    <div className="flex items-center gap-4">
                        <section.icon className="w-10 h-10 text-blue-500" />
                        <div>
                           <h3 className="text-2xl font-bold text-slate-900">{section.title}</h3>
                           <p className="md:hidden text-sm text-slate-500">Step {index + 1} of {sections.length}</p>
                        </div>
                    </div>
                    <p className="mt-4 text-slate-600 text-lg">{section.content}</p>

                    <div className="mt-8">
                       <label className="flex items-center p-4 rounded-lg cursor-pointer transition-colors bg-slate-50 hover:bg-slate-100 border border-slate-200">
                           <input
                            type="checkbox"
                            checked={selectedActions.has(section.id)}
                            onChange={() => handleActionToggle(section.id)}
                            disabled={!selectedActions.has(section.id) && selectedActions.size >= 4}
                            className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                           />
                           <span className="ml-4 font-semibold text-slate-700">Add "{section.quickActionLabel}" to my Quick Actions</span>
                           {selectedActions.has(section.id) && <IconCheckCircle className="w-6 h-6 text-green-500 ml-auto" />}
                       </label>
                        <p className="text-xs text-slate-500 mt-2">You can select up to 4 quick actions to pin to your dashboard.</p>
                    </div>
                </div>
            ))}
          </main>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden p-4 border-t border-slate-200 flex justify-between items-center">
            <button 
                onClick={() => setActiveIndex(i => Math.max(i - 1, 0))} 
                disabled={activeIndex === 0}
                className="font-semibold text-slate-600 disabled:opacity-50"
            >
                Back
            </button>
             <span className="text-sm font-medium text-slate-500">{activeIndex + 1} / {sections.length}</span>
            <button 
                onClick={() => setActiveIndex(i => Math.min(i + 1, sections.length - 1))} 
                disabled={activeIndex === sections.length - 1}
                className="font-semibold text-slate-600 disabled:opacity-50"
            >
                Next
            </button>
        </div>


        {/* Footer */}
        <footer className="p-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            This is supportive guidance, not a substitute for professional care.
          </p>
          <div className="flex items-center gap-4">
            <button onClick={onSkip} className="font-semibold text-slate-600 hover:text-slate-800">Skip for now</button>
            <button onClick={handleComplete} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-700 transition-colors">
                Start Using App
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PostLoginGuide;
