import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, CreditCard, ArrowRight, AlertCircle, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ConversationStage } from '../../lib/types';
import { api } from '../../lib/apis';

const Actions = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'definitions'
    const [ctas, setCtas] = useState([]);
    const [isCtaModalOpen, setIsCtaModalOpen] = useState(false);
    const [ctaForm, setCtaForm] = useState({ name: '', cta_type: 'book_call' });
    const [loadingCtas, setLoadingCtas] = useState(false);

    // Fetch CTAs when tab changes to definitions
    useEffect(() => {
        if (activeTab === 'definitions') {
            fetchCtas();
        }
    }, [activeTab]);

    const fetchCtas = async () => {
        setLoadingCtas(true);
        try {
            const data = await api.getCTAs();
            setCtas(data);
        } catch (error) {
            console.error('Failed to fetch CTAs', error);
        } finally {
            setLoadingCtas(false);
        }
    };

    const handleCreateCta = async () => {
        try {
            await api.createCTA(ctaForm);
            setIsCtaModalOpen(false);
            setCtaForm({ name: '', cta_type: 'book_call' });
            fetchCtas();
        } catch (error) {
            console.error('Failed to create CTA:', error);
            alert('Failed to create CTA');
        }
    };

    const handleDeleteCta = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.deleteCTA(id);
            fetchCtas();
        } catch (error) {
            console.error('Failed to delete CTA:', error);
            alert('Failed to delete CTA');
        }
    };

    // Since we don't have leads data, show a placeholder for tasks
    const actionableLeads = [];

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


    return (
        <div className="space-y-8 animate-fade-in pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Action Center</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Manage lead actions and configure call-to-actions.
                    </p>
                </div>
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('tasks')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'tasks' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        Pending Tasks
                    </button>
                    <button
                        onClick={() => setActiveTab('definitions')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'definitions' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        CTA Definitions
                    </button>
                </div>
            </div>

            {activeTab === 'tasks' && (
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
            )}

            {activeTab === 'definitions' && (
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <Button onClick={() => setIsCtaModalOpen(true)}>Create New CTA</Button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                        {loadingCtas ? (
                            <div className="p-8 text-center text-gray-500">Loading...</div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 font-medium border-b border-gray-100 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {ctas.map(cta => (
                                        <tr key={cta.id}>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{cta.name}</td>
                                            <td className="px-6 py-4 text-gray-500 capitalize">{cta.cta_type.replace('_', ' ')}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${cta.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {cta.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteCta(cta.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">Delete</Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {ctas.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No CTAs found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}

            {/* CTA Modal - Simplified Inline for now */}
            {isCtaModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create New CTA</h3>
                        <Input
                            label="Name"
                            placeholder="e.g. Book Intro Call"
                            value={ctaForm.name}
                            onChange={e => setCtaForm({ ...ctaForm, name: e.target.value })}
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                                value={ctaForm.cta_type}
                                onChange={e => setCtaForm({ ...ctaForm, cta_type: e.target.value })}
                            >
                                <option value="book_call">Book Call</option>
                                <option value="book_demo">Book Demo</option>
                                <option value="book_meeting">Book Meeting</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" onClick={() => setIsCtaModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateCta}>Create</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Actions;