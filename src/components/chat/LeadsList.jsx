import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { ConversationStage, IntentLevel } from '../../lib/types';

const LeadsList = ({ leads, conversations, selectedId, onSelect }) => {
    const [search, setSearch] = useState('');

    // Only show leads that have conversations
    const leadsWithConversations = (leads || []).filter(lead => {
        const hasConversation = (conversations || []).some(c => c.lead_id === lead.id);
        return hasConversation;
    });

    const filteredLeads = leadsWithConversations.filter(l =>
        (l.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (l.phone || '').includes(search)
    );

    const getLeadConversation = (leadId) => {
        return (conversations || []).find(c => c.lead_id === leadId);
    };
    
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
            </div>

            <div className="flex-1 overflow-y-auto">
                {filteredLeads.map((lead) => {
                    const conv = getLeadConversation(lead.id);
                    return (
                        <div
                            key={lead.id}
                            onClick={() => {
                                console.log('LeadsList - clicked lead:', { id: lead.id, name: lead.name });
                                onSelect(lead.id);
                            }}
                            className={`p-4 border-b border-gray-50 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${selectedId === lead.id ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h3 className={`font-medium text-sm truncate max-w-[150px] ${selectedId === lead.id ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                                    {lead.name || lead.phone}
                                </h3>
                                {conv?.last_message_at && (
                                    <span className="text-[10px] text-gray-400">
                                        {new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">
                                {conv?.last_message || 'New conversation'}
                            </p>

                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${lead.conversation_stage === ConversationStage.GREETING ? 'bg-primary/10 text-primary border-primary/20' :
                                        lead.conversation_stage === ConversationStage.CLOSED ? 'bg-green-100 text-green-700 border-green-200' :
                                            'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                                    }`}>
                                    {lead.conversation_stage || 'New'}
                                </span>
                                {lead.intent_level === IntentLevel.HIGH && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400">
                                        High Intent
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
                {!filteredLeads.length && (
                    <p className="text-center text-gray-400 py-8 text-sm">No leads found.</p>
                )}
            </div>
        </div>
    );
};

export default LeadsList;
