import React from 'react';
import { Link } from 'react-router-dom';
import type { Hospital } from '../types';
import { IconAppointments, IconStar, IconMapPin } from './Icons';

const HospitalCard: React.FC<{ hospital: Hospital; isNearestFallback?: boolean }> = ({ hospital, isNearestFallback = false }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-200/80">
      <div className="p-6 flex flex-col flex-1">
        
        {isNearestFallback && (
          <p className="font-bold text-sm uppercase tracking-wider text-amber-600 mb-2">Nearest Option</p>
        )}

        <div className="flex-grow">
          <h4 className="text-xl font-bold text-slate-800 group-hover:text-blue-800 transition-colors">{hospital.name}</h4>
          
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500 mt-2">
            <div className="flex items-center gap-1 font-semibold text-amber-500">
              <IconStar className="w-4 h-4" />
              <span>{hospital.rating.toFixed(1)}</span>
            </div>
            <span className="text-slate-300">&bull;</span>
            <div className="flex items-center gap-1">
                <IconMapPin className="w-4 h-4 text-slate-400" />
                <span>{hospital.distance_km.toFixed(1)} km away</span>
            </div>
          </div>
          
           <div className="text-xs text-slate-400 mt-2 font-mono">
            {hospital.lat.toFixed(4)}, {hospital.lon.toFixed(4)}
           </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {hospital.services.slice(0, 4).map(service => (
              <span key={service} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {service}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-end items-center gap-3">
          <a
            href={hospital.map_link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 text-slate-500 font-bold py-2.5 px-5 rounded-full hover:bg-slate-100 transition-colors duration-200"
          >
            <IconMapPin className="w-5 h-5" />
            <span>Map</span>
          </a>
          <Link
            to={hospital.booking_url}
            className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 bg-blue-50 text-blue-800 font-bold py-2.5 px-6 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300"
          >
            <IconAppointments className="w-5 h-5" />
            <span>Book Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HospitalCard;