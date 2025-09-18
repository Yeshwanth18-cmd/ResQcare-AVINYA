import React from 'react';
import { IconAlertTriangle, IconPhone } from './Icons';

const EmergencyCard: React.FC<{ contacts: string[] | null }> = ({ contacts }) => {
  return (
    <div className="mt-6 p-4 bg-error-light text-error-text rounded-r-lg flex items-start gap-4">
      <IconAlertTriangle className="w-10 h-10 text-current flex-shrink-0" />
      <div>
        <h4 className="font-extrabold text-current">Potential Emergency</h4>
        <p className="mt-1 text-current text-sm">
          Your symptoms may indicate a serious condition. Please seek immediate medical attention.
        </p>
        {contacts && contacts.length > 0 && (
           <div className="mt-3 flex flex-wrap gap-3">
               {contacts.map(contact => (
                   <a key={contact} href={`tel:${contact}`} className="inline-flex items-center gap-2 bg-error hover:bg-error-hover text-white font-bold py-2 px-4 rounded-full transition-colors text-sm">
                       <IconPhone className="w-4 h-4" />
                       Call {contact}
                   </a>
               ))}
           </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyCard;