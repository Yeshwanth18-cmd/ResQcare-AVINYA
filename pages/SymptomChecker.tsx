import React, { useState, useRef, useEffect } from 'react';
import { getSymptomAnalysis } from '../services/geminiService';
import type { Hospital } from '../types';
import { IconAlertTriangle, IconStethoscope, IconMapPin, IconStar, IconAppointments, IconX } from '../components/Icons';
import HospitalCard from '../components/HospitalCard';
import SymptomAnalysisCard from '../components/SymptomAnalysisCard';
import EmergencyCard from '../components/EmergencyCard';
import BookingModal from '../components/BookingModal';
import { useTranslation } from '../App';

// FIX: Declare google namespace on window to resolve TypeScript errors for external Google Maps script.
declare global {
  interface Window {
    google: any;
  }
}

// --- Helper to load Google Maps script ---
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY_HERE"; // Replace with your actual key
let scriptLoaded = false;
const loadGoogleMapsScript = (callback: () => void) => {
    if (scriptLoaded) {
        callback();
        return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
        scriptLoaded = true;
        callback();
    };
    document.head.appendChild(script);
};

// --- Map Component (defined inside SymptomChecker to avoid new files) ---
interface GoogleMapProps {
    hospitals: Hospital[];
    userLocation: { lat: number; lon: number };
    onMarkerClick: (hospital: Hospital) => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ hospitals, userLocation, onMarkerClick }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    // FIX: Use 'any' for the map state type as google.maps types are not available without @types/google.maps
    const [map, setMap] = useState<any | null>(null);

    useEffect(() => {
        loadGoogleMapsScript(() => {
            if (mapRef.current && !map) {
                const newMap = new window.google.maps.Map(mapRef.current, {
                    center: { lat: userLocation.lat, lng: userLocation.lon },
                    zoom: 12,
                    disableDefaultUI: true,
                    zoomControl: true,
                });
                setMap(newMap);
            }
        });
    }, [userLocation, map]);

    useEffect(() => {
        if (map) {
            // Add user location marker
            new window.google.maps.Marker({
                position: { lat: userLocation.lat, lng: userLocation.lon },
                map: map,
                title: "Your Location",
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: '#2a8bf2', // primary theme color
                    fillOpacity: 1,
                    strokeColor: 'white',
                    strokeWeight: 2,
                }
            });

            // Add hospital markers
            hospitals.forEach(hospital => {
                const marker = new window.google.maps.Marker({
                    position: { lat: hospital.lat, lng: hospital.lon },
                    map: map,
                    title: hospital.name,
                    icon: {
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: hospital.marker_color || '#2a8bf2',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2,
                    }
                });
                marker.addListener('click', () => {
                    onMarkerClick(hospital);
                });
            });
        }
    }, [map, hospitals, userLocation, onMarkerClick]);

    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

// --- Map Hospital Card Component ---
interface MapHospitalCardProps {
    hospital: Hospital;
    onClose: () => void;
    onBookNow: (hospital: Hospital) => void;
}
const MapHospitalCard: React.FC<MapHospitalCardProps> = ({ hospital, onClose, onBookNow }) => {
    const { t } = useTranslation();
    return (
    <div className="absolute bottom-4 left-4 right-4 z-10 bg-white p-4 rounded-lg shadow-md animate-fade-in-up max-w-md mx-auto">
        <button onClick={onClose} className="absolute top-2 right-2 text-slate-500 hover:text-slate-800"><IconX className="w-5 h-5" /></button>
        <h4 className="text-lg font-bold text-slate-800 pr-6">{hospital.name}</h4>
        <p className="text-xs text-slate-500 mt-1">{hospital.address}</p>
        <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
            <div className="flex items-center gap-1 font-semibold text-amber-500"><IconStar className="w-3 h-3" /><span>{hospital.rating.toFixed(1)}</span></div>
            <span>&bull;</span>
            <div className="flex items-center gap-1"><IconMapPin className="w-3 h-3" /><span>{hospital.distance_km.toFixed(1)} {t('km away')}</span></div>
        </div>
        <div className="mt-3 flex justify-end gap-2">
            <a href={hospital.directions_url} target="_blank" rel="noopener noreferrer" className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-full transition-colors">{t('Directions')}</a>
            <button onClick={() => onBookNow(hospital)} className="text-sm bg-primary bg-primary-hover text-white font-bold py-2 px-4 rounded-full transition-colors">{t('Book Now')}</button>
        </div>
    </div>
)};


const SymptomChecker: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null); // Using `any` for result to match the new structure
  const [error, setError] = useState<string | null>(null);
  
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedMapHospital, setSelectedMapHospital] = useState<Hospital | null>(null);
  
  const { t } = useTranslation();

  const handleOpenBookingModal = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedHospital(null);
  };

  const handleSubmit = async () => {
    if (symptoms.trim() === '' || isLoading || locationStatus === 'loading') return;

    setIsLoading(true);
    setResult(null);
    setError(null);
    setLocationError(null);
    setLocationStatus('loading');
    setUserLocation(null);
    setSelectedMapHospital(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationData = { lat: latitude, lon: longitude };
        setUserLocation(locationData);
        setLocationStatus('idle');

        getSymptomAnalysis(symptoms, locationData)
          .then(analysisResult => {
            if (analysisResult) {
              setResult(analysisResult);
            } else {
              setError(t("An error occurred while analyzing symptoms. This could be a connection issue or an invalid response from the server. Please try again."));
            }
          })
          .catch(err => {
             console.error(err);
             setError(t("A critical error occurred while fetching the AI analysis."));
          })
          .finally(() => {
            setIsLoading(false);
          });
      },
      (error) => {
        setLocationStatus('error');
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(t("Location access was denied. Please enable location services in your browser settings to find nearby hospitals."));
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError(t("Location information is unavailable. Please check your connection or GPS signal."));
            break;
          case error.TIMEOUT:
            setLocationError(t("The request to get your location timed out. Please try again."));
            break;
          default:
            setLocationError(t("An unknown error occurred while trying to get your location."));
            break;
        }
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };
  
  const getButtonText = () => {
      if(locationStatus === 'loading') return t('Getting Location...');
      if(isLoading) return t('Analyzing...');
      return t('Analyze Symptoms');
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <IconStethoscope className="w-8 h-8 text-primary"/>
        <h2 className="text-2xl font-bold text-slate-900">{t('Symptom Checker & Triage')}</h2>
      </div>
      <p className="mt-1 text-slate-600">{t('Describe your symptoms to get AI-powered, location-aware recommendations.')}</p>
      
      <div className="mt-4 p-4 themed-alert-warning rounded-r-lg flex items-start gap-3">
        <IconAlertTriangle className="w-8 h-8 flex-shrink-0" />
        <div>
          <p className="font-bold">{t('Disclaimer')}</p>
          <p className="text-sm">{t('This is not a medical diagnosis. If this is an emergency, call 911 immediately.')}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
            <label htmlFor="symptoms-input" className="block text-sm font-medium text-slate-800 mb-1">{t('Your Symptoms')}</label>
            <textarea
                id="symptoms-input"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder={t("For example: 'I have a high fever, a persistent cough, and difficulty breathing.'")}
                className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
        </div>
      </div>

      <div className="mt-6 flex justify-end items-center">
        <button
          onClick={handleSubmit}
          disabled={symptoms.trim() === '' || isLoading || locationStatus === 'loading'}
          className="bg-primary text-white font-bold py-3 px-8 rounded-full bg-primary-hover disabled:bg-slate-400 transition-all duration-200"
        >
          {getButtonText()}
        </button>
      </div>
      
      {(locationError || error) && (
         <div className="mt-6 p-4 themed-alert-error rounded-r-lg flex items-start gap-3 animate-fade-in">
            <IconAlertTriangle className="w-6 h-6 flex-shrink-0" />
            <div>
                <p className="font-bold">{t('Analysis Failed')}</p>
                <p className="text-sm">{locationError || error}</p>
            </div>
         </div>
      )}

      {result && (
        <div className="mt-8 space-y-6 animate-fade-in">
            <SymptomAnalysisCard analysis={result.symptom_analysis} />

            {result.emergency && <EmergencyCard contacts={result.emergency_contacts} />}

            {result.hospitals && result.hospitals.length > 0 && (
                <div className="space-y-6">
                    <div className="p-4 bg-primary-light border-l-4 border-primary rounded-r-lg">
                        <h3 className="font-bold text-primary-text">{t('Next Steps')}</h3>
                        <p className="text-sm text-primary-text mt-1">{t(result.message)}</p>
                    </div>
                    {result.hospitals.map((hospital: Hospital, index: number) => (
                        <HospitalCard key={index} hospital={hospital} onBookNow={handleOpenBookingModal} />
                    ))}
                    {userLocation && (
                        <div className="mt-6 relative h-96 w-full rounded-lg shadow-md overflow-hidden border">
                           <GoogleMap 
                                hospitals={result.hospitals}
                                userLocation={userLocation}
                                onMarkerClick={(hospital) => setSelectedMapHospital(hospital)}
                           />
                           {selectedMapHospital && (
                                <MapHospitalCard
                                    hospital={selectedMapHospital}
                                    onClose={() => setSelectedMapHospital(null)}
                                    onBookNow={handleOpenBookingModal}
                                />
                           )}
                        </div>
                    )}
                </div>
            )}
        </div>
      )}
      
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        hospital={selectedHospital}
      />
    </div>
  );
};

export default SymptomChecker;