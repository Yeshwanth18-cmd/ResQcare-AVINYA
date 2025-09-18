import React, { useState } from 'react';
import { getTriageAnalysis } from '../services/geminiService';
import type { TriageResult } from '../types';
import { IconAlertTriangle, IconStethoscope } from '../components/Icons';

const TriageAnalyzer: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (symptoms.trim() === '') return;
    setIsLoading(true);
    setResult(null);
    setError(null);

    const analysisResult = await getTriageAnalysis(symptoms);
    
    if (analysisResult) {
      setResult(analysisResult);
    } else {
      setError("An error occurred while analyzing symptoms. This could be a connection issue or an invalid response from the server. Please try again.");
    }
    
    setIsLoading(false);
  };

  const getUrgencyStyles = (urgency: TriageResult['urgency']) => {
    switch (urgency) {
      case 'Emergency': return 'bg-red-100 border-red-500 text-red-800';
      case 'Urgent': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'Routine': return 'bg-blue-100 border-blue-500 text-blue-800';
      case 'Self-Care': return 'bg-green-100 border-green-500 text-green-800';
      default: return 'bg-slate-100 border-slate-500';
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <IconStethoscope className="w-8 h-8 text-blue-500"/>
        <h2 className="text-2xl font-bold text-slate-900">Symptom Checker & Triage</h2>
      </div>
      <p className="mt-1 text-slate-600">Describe your symptoms to get an AI-powered triage recommendation.</p>
      
      <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-r-lg flex items-start gap-3">
        <IconAlertTriangle className="w-8 h-8 flex-shrink-0" />
        <div>
          <p className="font-bold">Disclaimer</p>
          <p className="text-sm">This is not a medical diagnosis. It is for informational purposes only. If you are having a medical emergency, call 911 immediately.</p>
        </div>
      </div>

      <div className="mt-6">
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="For example: 'I have a high fever, a persistent cough, and difficulty breathing.'"
          className="w-full h-32 p-3 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mt-4 text-right">
        <button
          onClick={handleSubmit}
          disabled={symptoms.trim() === '' || isLoading}
          className="bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 disabled:bg-slate-400 transition-all duration-200"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Symptoms'}
        </button>
      </div>

      {error && (
         <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-r-lg flex items-start gap-3 animate-fade-in">
            <IconAlertTriangle className="w-6 h-6 flex-shrink-0" />
            <div>
                <p className="font-bold">Analysis Failed</p>
                <p className="text-sm">{error}</p>
            </div>
         </div>
      )}

      {result && (
        <div className={`mt-6 p-6 rounded-2xl border-l-8 animate-fade-in ${getUrgencyStyles(result.urgency)}`}>
          <h3 className="text-xl font-bold">Triage Result</h3>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-semibold opacity-80">Urgency</p>
              <p className="text-lg font-extrabold">{result.urgency}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm font-semibold opacity-80">Suggested Pathway</p>
              <p className="text-lg font-extrabold">{result.suggestedPathway}</p>
            </div>
          </div>
          <div className="mt-4">
              <p className="text-sm font-semibold opacity-80">Reasoning</p>
              <p>{result.reasoning}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TriageAnalyzer;