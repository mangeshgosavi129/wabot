import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '../ui/Input';

const LeadsList = ({ leads, selectedId, onSelect }) => {
    const [search, setSearch] = useState('');

    const filteredLeads = leads.filter(l =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.phone.includes(search)
    );

    return (
        <div className="flex flex-col h-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-80 transition-colors">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 space-y-3">
                <h2 className="font-semibold text-gray-800 dark:text-white">Inbox</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search leads..."
                        className="pl-9 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {/* Filter tags could go here */}
            </div>

            <div className="flex-1 overflow-y-auto">
                {filteredLeads.map((lead) => (
                    <div
                        key={lead.id}
                        onClick={() => onSelect(lead.id)}
                        className={`p-4 border-b border-gray-50 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${selectedId === lead.id ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <h3 className={`font-medium text-sm ${selectedId === lead.id ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                                {lead.name}
                            </h3>
                            <span className="text-xs text-gray-400">10:30 AM</span> {/* Mock time */}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">{lead.lastMessage}</p>

                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${lead.stage === 'New Lead' ? 'bg-primary/10 text-primary' :
                                lead.stage === 'Contacted' ? 'bg-accent/10 text-accent' :
                                    'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                }`}>
                                {lead.stage}
                            </span>
                            {lead.score > 70 && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400">
                                    High Intent
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeadsList;
