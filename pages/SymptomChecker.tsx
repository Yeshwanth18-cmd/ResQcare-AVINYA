import React, { useState } from 'react';
import { getTriageAnalysis } from '../services/geminiService';
import type { SymptomAnalysisResult } from '../types';
import { IconAlertTriangle, IconStethoscope } from '../components/Icons';
import HospitalCard from '../components/HospitalCard';

const SymptomChecker: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SymptomAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (symptoms.trim() === '' || isLoading || locationStatus === 'loading') return;

    // Reset previous results
    setIsLoading(true);
    setResult(null);
    setError(null);
    setLocationError(null);
    setLocationStatus('loading');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationData = { lat: latitude, lon: longitude };
        
        setLocationStatus('idle');

        // Location successful, now call AI
        getTriageAnalysis(symptoms, locationData)
          .then(analysisResult => {
            if (analysisResult) {
              setResult(analysisResult);
            } else {
              setError("An error occurred while analyzing symptoms. This could be a connection issue or an invalid response from the server. Please try again.");
            }
          })
          .catch(err => {
             console.error(err);
             setError("A critical error occurred while fetching the AI analysis.");
          })
          .finally(() => {
            setIsLoading(false);
          });
      },
      (error) => {
        setLocationStatus('error');
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location access was denied. Please enable location services in your browser settings to find nearby hospitals.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable. Please check your connection or GPS signal.");
            break;
          case error.TIMEOUT:
            setLocationError("The request to get your location timed out. Please try again.");
            break;
          default:
            setLocationError("An unknown error occurred while trying to get your location.");
            break;
        }
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };
  
  const getButtonText = () => {
      if(locationStatus === 'loading') return 'Getting Location...';
      if(isLoading) return 'Analyzing...';
      return 'Analyze Symptoms';
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <IconStethoscope className="w-8 h-8 text-blue-600"/>
        <h2 className="text-2xl font-bold text-slate-900">Symptom Checker & Triage</h2>
      </div>
      <p className="mt-1 text-slate-600">Describe your symptoms to get AI-powered, location-aware recommendations.</p>
      
      <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-r-lg flex items-start gap-3">
        <IconAlertTriangle className="w-8 h-8 flex-shrink-0" />
        <div>
          <p className="font-bold">Disclaimer</p>
          <p className="text-sm">This is not a medical diagnosis. If this is an emergency, call 911 immediately.</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
            <label htmlFor="symptoms-input" className="block text-sm font-medium text-slate-800 mb-1">Your Symptoms</label>
            <textarea
                id="symptoms-input"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="For example: 'I have a high fever, a persistent cough, and difficulty breathing.'"
                className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
      </div>

      <div className="mt-6 flex justify-end items-center">
        <button
          onClick={handleSubmit}
          disabled={symptoms.trim() === '' || isLoading || locationStatus === 'loading'}
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 disabled:bg-slate-400 transition-all duration-200"
        >
          {getButtonText()}
        </button>
      </div>
      
      {(locationError || error) && (
         <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-r-lg flex items-start gap-3 animate-fade-in">
            <IconAlertTriangle className="w-6 h-6 flex-shrink-0" />
            <div>
                <p className="font-bold">Analysis Failed</p>
                <p className="text-sm">{locationError || error}</p>
            </div>
         </div>
      )}

      {result && (
        <div className="mt-8 space-y-6 animate-fade-in">
          <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
              <p className="font-semibold text-blue-800">{result.message}</p>
              {!result.action.out_of_range && (
                 <p className="text-sm text-blue-700 mt-1">(Search Radius: {result.radius_km.toFixed(1)} km)</p>
              )}
          </div>
          <div className="space-y-6">
              {result.hospitals.map((hospital, index) => (
                  <HospitalCard 
                      key={index} 
                      hospital={hospital} 
                      isNearestFallback={result.action.show_nearest}
                  />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;