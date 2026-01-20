import React from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, CreditCard, ArrowRight, AlertCircle, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ConversationStage } from '../lib/types';

const Actions = () => {
    const { leads, loading } = useApp();
    const navigate = useNavigate();

    // Define actionable stages based on ConversationStage enum
    const actionableStages = [
        ConversationStage.PRICING,
        ConversationStage.CTA,
        ConversationStage.FOLLOWUP
    ];

    // Filter leads requiring action
    const actionableLeads = (leads || []).filter(lead =>
        actionableStages.includes(lead.conversation_stage)
    );

    const getActionConfig = (stage) => {
        switch (stage) {
            case ConversationStage.PRICING:
                return {
                    icon: CreditCard,
                    color: 'text-green-500 bg-green-500/10',
                    actionText: 'Process Quote',
                    description: 'Client is inquiring about pricing'
                };
            case ConversationStage.CTA:
                return {
                    icon: Clock,
                    color: 'text-orange-500 bg-orange-500/10',
                    actionText: 'Book Meeting',
                    description: 'Bot has requested a meeting'
                };
            case ConversationStage.FOLLOWUP:
                return {
                    icon: AlertCircle,
                    color: 'text-blue-500 bg-blue-500/10',
                    actionText: 'Follow Up',
                    description: 'Lead needs manual follow-up'
                };
            default:
                return {
                    icon: CheckCircle,
                    color: 'text-gray-500 bg-gray-500/10',
                    actionText: 'View Details',
                    description: 'Action required'
                };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Action Center</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {actionableLeads.length} leads require your attention right now.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input placeholder="Search actions..." className="pl-9 w-64" />
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {actionableLeads.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Caught Up!</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">No pending actions required at this moment.</p>
                    </div>
                ) : (
                    actionableLeads.map(lead => {
                        const config = getActionConfig(lead.conversation_stage);
                        const Icon = config.icon;

                        return (
                            <div key={lead.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${config.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                            {lead.name || lead.phone}
                                        </h3>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${config.color.replace('bg-', 'border-').replace('/10', '/20')} ${config.color.split(' ')[0]}`}>
                                            {lead.conversation_stage}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        {config.description} • {lead.company}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Last active: {new Date(lead.updated_at || lead.created_at).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                                    <Button
                                        variant="outline"
                                        onClick={() => navigate(`/inbox?leadId=${lead.id}`)}
                                        className="flex-1 sm:flex-none"
                                    >
                                        View Chat
                                    </Button>
                                    <Button
                                        onClick={() => navigate(`/inbox?leadId=${lead.id}`)}
                                        className="flex-1 sm:flex-none group"
                                    >
                                        {config.actionText}
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Actions;
