import React from 'react';
import type { Hospital } from '../types';
import { IconAppointments, IconStar, IconMapPin } from './Icons';

interface HospitalCardProps {
    hospital: Hospital;
    onBookNow: (hospital: Hospital) => void;
}

const HospitalCard: React.FC<HospitalCardProps> = ({ hospital, onBookNow }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-200/80">
      <div className="p-6 flex flex-col flex-1">
        
        <div className="flex-grow">
          <h4 className="text-xl font-bold text-slate-800 group-hover:text-primary transition-colors">{hospital.name}</h4>
          
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
          
           <div className="text-sm text-slate-500 mt-2">
            {hospital.address}
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
            href={hospital.directions_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 text-slate-500 font-bold py-2.5 px-5 rounded-full hover:bg-slate-100 transition-colors duration-200"
          >
            <IconMapPin className="w-5 h-5" />
            <span>Directions</span>
          </a>
          <button
            onClick={() => onBookNow(hospital)}
            className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 bg-primary-light text-primary-text font-bold py-2.5 px-6 rounded-full bg-primary bg-primary-hover hover:text-white transition-all duration-300"
          >
            <IconAppointments className="w-5 h-5" />
            <span>Book Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HospitalCard;