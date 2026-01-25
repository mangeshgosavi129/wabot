import React from 'react';
import { User, Tag, Calendar, Phone, Mail, Building, ExternalLink, BarChart3, Target, Heart } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const ContextPanel = ({ lead }) => {
    const navigate = useNavigate();
    if (!lead) return <div className="w-80 border-l border-gray-200 bg-white p-6 text-center text-gray-400">Select a conversation</div>;

    return (
        <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col h-full overflow-y-auto transition-colors">
            <div className="p-6 text-center border-b border-gray-100 dark:border-gray-700">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">{(lead.name || lead.phone || '?').charAt(0)}</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{lead.name || lead.phone}</h3>
                {lead.company && <p className="text-sm text-gray-500 dark:text-gray-400">{lead.company}</p>}

                <div className="flex gap-2 justify-center mt-4">
                    <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-primary text-primary hover:bg-primary/10"
                        onClick={() => navigate(`/leads?leadId=${lead.id}`)}
                    >
                        More Details <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>

            <div className="p-6 space-y-6">
                <div>
                    <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Details</h4>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {lead.phone}
                        </div>
                        {lead.email && (
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                <Mail className="w-4 h-4 text-gray-400" />
                                {lead.email}
                            </div>
                        )}
                        {lead.company && (
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                <Building className="w-4 h-4 text-gray-400" />
                                {lead.company}
                            </div>
                        )}
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                            <Target className="w-4 h-4 text-gray-400" />
                            <span className="capitalize">Stage: {lead.conversation_stage || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                            <BarChart3 className="w-4 h-4 text-gray-400" />
                            <span className="capitalize">Intent: {lead.intent_level || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                            <Heart className="w-4 h-4 text-gray-400" />
                            <span className="capitalize">Sentiment: {lead.user_sentiment || 'Neutral'}</span>
                        </div>
                    </div>
                </div>

                {lead.score !== undefined && (
                    <div>
                        <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Lead Score</h4>
                        <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 flex items-center justify-center">
                                {/* Circular progress mock */}
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="24" cy="24" r="20" stroke="#f3f4f6" strokeWidth="4" fill="none" className="dark:stroke-gray-700" />
                                    <circle cx="24" cy="24" r="20" stroke={lead.score > 70 ? '#22d3ee' : '#db2777'} strokeWidth="4" fill="none" strokeDasharray={`${lead.score * 1.25} 100`} />
                                </svg>
                                <span className="absolute text-xs font-bold text-gray-700 dark:text-gray-300">{lead.score}</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{lead.score > 70 ? 'Hot Lead' : 'Warm Lead'}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Based on interactions</p>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};

export default ContextPanel;
