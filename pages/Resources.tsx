import React from 'react';
import { RESOURCES_DATA } from '../constants';
import type { Resource } from '../types';

const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => (
    <a href={resource.link} target="_blank" rel="noopener noreferrer" className="block bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-slate-800">{resource.title}</h3>
            <span className="capitalize text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800">{resource.type}</span>
        </div>
        <p className="mt-2 text-slate-600">{resource.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
            {resource.tags.map(tag => (
                <span key={tag} className="text-xs font-medium px-2 py-1 bg-slate-200 text-slate-600 rounded-full">
                    #{tag}
                </span>
            ))}
        </div>
    </a>
);

const Resources: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Health Hub</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
                    Explore a curated collection of articles, guides, and exercises to support your health and wellness journey.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {RESOURCES_DATA.map((resource, index) => (
                    <ResourceCard key={index} resource={resource} />
                ))}
            </div>
        </div>
    );
};

export default Resources;