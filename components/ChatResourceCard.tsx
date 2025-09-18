import React from 'react';
import type { Resource } from '../types';
import { IconBook, IconShieldCheck } from './Icons';

interface ChatResourceCardProps {
  resource: Resource;
}

const ChatResourceCard: React.FC<ChatResourceCardProps> = ({ resource }) => {
  return (
    <a
      href={resource.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 bg-blue-100 p-2 rounded-md mt-1">
          <IconBook className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-slate-800">{resource.title}</p>
          <p className="text-xs text-slate-600 mt-1">{resource.ai_summary || resource.description}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
             <IconShieldCheck className="w-3 h-3 text-slate-400"/>
             <span>{resource.source}</span>
             <span className="font-bold">&middot;</span>
             <span>{resource.contentType}</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default ChatResourceCard;