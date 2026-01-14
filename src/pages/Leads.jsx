
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Filter, Download, MoreVertical, Mail, Phone, Plus } from 'lucide-react';

const Leads = () => {
    const { leads } = useApp();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    const filteredLeads = leads.filter(l => {
        const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
            l.company.toLowerCase().includes(search.toLowerCase()) ||
            l.phone.includes(search);

        const matchesFilter = filter === 'all' || l.stage.toLowerCase() === filter.toLowerCase();

        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: leads.length,
        new: leads.filter(l => l.stage === 'New Lead').length,
        contacted: leads.filter(l => l.stage === 'Contacted').length,
        won: leads.filter(l => l.stage === 'Won').length,
        avgScore: Math.round(leads.reduce((acc, curr) => acc + curr.score, 0) / leads.length || 0)
    };

    const filters = [
        { id: 'all', label: 'All Leads' },
        { id: 'New Lead', label: 'New Lead' },
        { id: 'Contacted', label: 'Contacted' },
        { id: 'Demo Scheduled', label: 'Demo Scheduled' },
        { id: 'Proposal Sent', label: 'Proposal Sent' },
        { id: 'Won', label: 'Won' },
        { id: 'Lost', label: 'Lost' }
    ];

    const StatCard = ({ label, value }) => (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</span>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in pb-8">
            {/* Top Controls */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="relative w-full lg:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search leads by name, email, phone, or company..."
                        className="pl-9 w-full bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-800 transition-colors"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                    <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')} size="sm">
                        all
                    </Button>
                    {filters.slice(1).map(f => (
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
                <StatCard label="New Leads" value={stats.new} />
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
                                <th className="px-6 py-4 font-medium">Contact</th>
                                <th className="px-6 py-4 font-medium">Stage</th>
                                <th className="px-6 py-4 font-medium">Score</th>
                                <th className="px-6 py-4 font-medium">Tags</th>
                                <th className="px-6 py-4 font-medium">Last Message</th>
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
                                                {lead.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-white">{lead.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{lead.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 font-medium">
                                        {lead.company}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                        {lead.phone}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${lead.stage === 'New Lead' ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' :
                                                lead.stage === 'Contacted' ? 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800' :
                                                    lead.stage === 'Won' ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                                                        'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                                            }`}>
                                            {lead.stage === 'New Lead' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse"></div>}
                                            {lead.stage}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-16 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${lead.score > 70 ? 'bg-emerald-500' : lead.score > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                    style={{ width: `${lead.score}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{lead.score}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1 flex-wrap max-w-[120px]">
                                            {lead.tags.map(tag => (
                                                <span key={tag} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 text-[10px] rounded font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[150px] truncate">
                                            {lead.lastMessage || "No messages yet"}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Visual) */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <div>Showing {filteredLeads.length} of {leads.length} leads</div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm" disabled>Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leads;
