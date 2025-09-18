import React, { useState, useMemo } from 'react';
import { MENTAL_HEALTH_RESOURCES, RESOURCE_CATEGORIES, RESOURCE_AUDIENCES, RESOURCE_DIFFICULTIES } from '../constants';
import type { Resource } from '../types';
import { IconBook, IconClock, IconUsers, IconBarChart } from '../components/Icons';

const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => (
    <a href={resource.link} target="_blank" rel="noopener noreferrer" className="flex flex-col bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex-grow">
            <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">{resource.source}</span>
                <span className="capitalize text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800">{resource.contentType}</span>
            </div>
            <h3 className="mt-2 text-xl font-bold text-slate-800">{resource.title}</h3>
            <p className="mt-2 text-sm text-slate-600 flex-grow">{resource.description}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-2">
            <div className="flex items-center gap-2"><IconClock className="w-4 h-4"/><span>{resource.timeToComplete} min</span></div>
            <div className="flex items-center gap-2"><IconUsers className="w-4 h-4"/><span>For {resource.audience}</span></div>
            <div className="flex items-center gap-2"><IconBarChart className="w-4 h-4"/><span>{resource.difficulty}</span></div>
        </div>
    </a>
);

const Resources: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        category: 'All',
        audience: 'All',
        difficulty: 'All'
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredResources = useMemo(() => {
        return MENTAL_HEALTH_RESOURCES.filter(resource => {
            const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = filters.category === 'All' || resource.category === filters.category;
            const matchesAudience = filters.audience === 'All' || resource.audience === filters.audience;
            const matchesDifficulty = filters.difficulty === 'All' || resource.difficulty === filters.difficulty;
            
            return matchesSearch && matchesCategory && matchesAudience && matchesDifficulty;
        });
    }, [searchQuery, filters]);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl flex items-center justify-center gap-4">
                    <IconBook className="w-10 h-10" />
                    Resource Hub
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-600">
                    Explore a curated library of high-quality articles, guides, and exercises from trusted sources to support your wellness journey.
                </p>
            </div>

            {/* Filters and Search */}
            <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div className="lg:col-span-2">
                        <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-1">Search</label>
                        <input
                            type="text"
                            id="search"
                            placeholder="Search by title or tag..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                        <select name="category" id="category" value={filters.category} onChange={handleFilterChange} className="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="All">All Categories</option>
                            {RESOURCE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label htmlFor="audience" className="block text-sm font-medium text-slate-700 mb-1">Audience</label>
                            <select name="audience" id="audience" value={filters.audience} onChange={handleFilterChange} className="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="All">All</option>
                                {RESOURCE_AUDIENCES.map(aud => <option key={aud} value={aud}>{aud}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="difficulty" className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
                            <select name="difficulty" id="difficulty" value={filters.difficulty} onChange={handleFilterChange} className="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="All">All</option>
                                {RESOURCE_DIFFICULTIES.map(dif => <option key={dif} value={dif}>{dif}</option>)}
                            </select>
                        </div>
                     </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredResources.length > 0 ? (
                    filteredResources.map((resource) => (
                        <ResourceCard key={resource.id} resource={resource} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-slate-600">No resources match your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Resources;
