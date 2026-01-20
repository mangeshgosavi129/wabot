import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, MoreVertical } from 'lucide-react';
import { ConversationStage, IntentLevel } from '../lib/types';

const Leads = () => {
    const { leads, loading } = useApp();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    const intentToScore = (level) => {
        switch (level) {
            case IntentLevel.LOW: return 25;
            case IntentLevel.MEDIUM: return 50;
            case IntentLevel.HIGH: return 75;
            case IntentLevel.VERY_HIGH: return 100;
            default: return 0;
        }
    };

    const filteredLeads = (leads || []).filter(l => {
        const matchesSearch = (l.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (l.company || '').toLowerCase().includes(search.toLowerCase()) ||
            (l.phone || '').includes(search);

        const matchesFilter = filter === 'all' || l.conversation_stage === filter;

        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: leads?.length || 0,
        new: (leads || []).filter(l => l.conversation_stage === ConversationStage.GREETING).length,
        contacted: (leads || []).filter(l => l.conversation_stage === ConversationStage.QUALIFICATION).length,
        won: (leads || []).filter(l => l.conversation_stage === ConversationStage.CLOSED).length,
        avgScore: Math.round((leads || []).reduce((acc, curr) => acc + intentToScore(curr.intent_level), 0) / (leads?.length || 1))
    };

    const filters = [
        { id: 'all', label: 'All Leads' },
        { id: ConversationStage.GREETING, label: 'Greeting' },
        { id: ConversationStage.QUALIFICATION, label: 'Qualification' },
        { id: ConversationStage.PRICING, label: 'Pricing' },
        { id: ConversationStage.CTA, label: 'CTA' },
        { id: ConversationStage.CLOSED, label: 'Closed' },
        { id: ConversationStage.LOST, label: 'Lost' }
    ];

    const StatCard = ({ label, value }) => (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</span>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in pb-8">
            {/* Top Controls */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="relative w-full lg:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search leads..."
                        className="pl-9 w-full bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-800 transition-colors"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                    {filters.map(f => (
                        <Button
                            key={f.id}
                            variant={filter === f.id ? 'default' : 'outline'}
                            onClick={() => setFilter(f.id)}
                            size="sm"
                            className="whitespace-nowrap"
                        >
                            {f.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <StatCard label="Total Leads" value={stats.total} />
                <StatCard label="New" value={stats.new} />
                <StatCard label="Contacted" value={stats.contacted} />
                <StatCard label="Won" value={stats.won} />
                <StatCard label="Avg. Score" value={stats.avgScore} />
            </div>

            {/* Main Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 font-medium">Lead</th>
                                <th className="px-6 py-4 font-medium">Company</th>
                                <th className="px-6 py-4 font-medium">Phone</th>
                                <th className="px-6 py-4 font-medium">Stage</th>
                                <th className="px-6 py-4 font-medium">Intent</th>
                                <th className="px-6 py-4 font-medium">Sentiment</th>
                                <th className="px-6 py-4 font-medium">Created</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredLeads.map(lead => (
                                <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                                                {(lead.name || 'L').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-white">{lead.name || 'Unknown'}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{lead.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">
                                        {lead.company || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                        {lead.phone}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${lead.conversation_stage === ConversationStage.GREETING ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                lead.conversation_stage === ConversationStage.CLOSED ? 'bg-green-50 text-green-700 border-green-100' :
                                                    'bg-gray-50 text-gray-600 border-gray-200'
                                            }`}>
                                            {lead.conversation_stage}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-16 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${intentToScore(lead.intent_level) > 70 ? 'bg-emerald-500' : intentToScore(lead.intent_level) > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                    style={{ width: `${intentToScore(lead.intent_level)}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300 capitalize">{lead.intent_level}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 capitalize">
                                        {lead.user_sentiment || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(lead.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400 transition-colors">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Leads;
