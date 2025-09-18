import React from 'react';
import type { SymptomAnalysis } from '../types';
import { IconBook } from './Icons';

const UrgencyBadge: React.FC<{ urgency: SymptomAnalysis['urgency'] }> = ({ urgency }) => {
  const urgencyStyles = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-3 py-1 text-sm font-bold rounded-full capitalize ${urgencyStyles[urgency]}`}>
      {urgency} Urgency
    </span>
  );
};

const SymptomAnalysisCard: React.FC<{ analysis: SymptomAnalysis }> = ({ analysis }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border border-slate-200/80">
      <div className="flex justify-between items-start gap-4">
        <h3 className="text-2xl font-bold text-slate-900">Symptom Analysis</h3>
        <UrgencyBadge urgency={analysis.urgency} />
      </div>
      
      <div className="mt-6 space-y-6">
        <div>
          <h4 className="font-semibold text-slate-700">Possible Causes</h4>
          <p className="mt-1 text-slate-600 text-sm">
            Based on your symptoms, possibilities could include: {analysis.possible_causes.join(', ')}. This is not a diagnosis.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-700">Self-Care Advice</h4>
          <p className="mt-1 text-slate-600 text-sm">{analysis.self_care_advice}</p>
        </div>

        {analysis.resources && analysis.resources.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-700 flex items-center gap-2"><IconBook className="w-4 h-4" /> Suggested Resources</h4>
            <ul className="mt-2 list-disc list-inside text-sm space-y-1">
              {analysis.resources.map((resource, index) => (
                <li key={index} className="text-primary hover:underline">
                  <a href="#" target="_blank" rel="noopener noreferrer">{resource}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomAnalysisCard;