import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MENTAL_HEALTH_RESOURCES } from '../constants';
import { IconArrowLeft, IconBookmark, IconShare, IconPrinter, IconCheckCircle, IconBook } from '../components/Icons';

const ResourceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const resource = MENTAL_HEALTH_RESOURCES.find(r => r.id === id);

  if (!resource) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-slate-900">Resource Not Found</h1>
        <p className="mt-4 text-slate-600">Details for this resource are being prepared or it may not exist.</p>
        <Link to="/resources" className="mt-6 inline-block bg-primary bg-primary-hover text-white font-bold py-2 px-6 rounded-full">
          Back to Resources
        </Link>
      </div>
    );
  }
  
  const { title, source, publish_date, author, ai_summary, description, key_points, link, ai_related_links } = resource;

  return (
    <div className="max-w-4xl mx-auto">
        {/* Back and Actions */}
        <div className="flex justify-between items-center mb-6">
            <Link to="/resources" className="flex items-center gap-2 text-slate-600 hover:text-primary font-semibold transition-colors">
                <IconArrowLeft className="w-5 h-5" />
                <span>Back to Resources</span>
            </Link>
            <div className="flex items-center gap-2">
                <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800" aria-label="Bookmark"><IconBookmark className="w-5 h-5" /></button>
                <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800" aria-label="Share"><IconShare className="w-5 h-5" /></button>
                <button onClick={() => window.print()} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800" aria-label="Print"><IconPrinter className="w-5 h-5" /></button>
            </div>
        </div>
      
        <div className="bg-white shadow-md rounded-lg p-8 md:p-10">
            {/* Header */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{title}</h1>
            <div className="mt-3 text-sm text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                <span><strong>Source:</strong> {source}</span>
                {publish_date && <span><strong>Published:</strong> {publish_date}</span>}
                {author && <span><strong>Author:</strong> {author}</span>}
            </div>

            {/* Summary */}
            <div className="mt-8">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Summary</h2>
                <p className="text-slate-600 leading-relaxed prose">{ai_summary || description}</p>
            </div>

            {/* Key Points */}
            {key_points && key_points.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-3">Key Points</h2>
                    <ul className="space-y-3">
                        {key_points.map((point, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <IconCheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                                <span className="text-slate-700">{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            {/* Full Resource Link */}
            <div className="mt-10 pt-6 border-t border-slate-200 text-center">
                 <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-primary bg-primary-hover text-white font-bold py-3 px-8 rounded-full transition-all duration-200">
                    View Full Resource on {source}
                </a>
            </div>

            {/* Related Resources */}
            {ai_related_links && ai_related_links.length > 0 && (
                <div className="mt-10 pt-6 border-t border-slate-200">
                     <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <IconBook className="w-5 h-5" />
                        Related Resources
                     </h2>
                     <div className="space-y-3">
                        {ai_related_links.map((linkItem, index) => (
                           <Link to={linkItem.url} key={index} className="block p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                             <p className="font-semibold text-primary-text">{linkItem.title}</p>
                           </Link>
                        ))}
                     </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default ResourceDetail;