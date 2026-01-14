import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import KPIcard from '../components/KPIcard';
import Modal from '../components/ui/Modal';
import CampaignWizard from '../components/campaigns/CampaignWizard';
import { Megaphone, Send, MousePointer, Eye, Plus } from 'lucide-react';
import { format } from 'date-fns';

const Campaigns = () => {
    const { campaigns } = useApp();
    const [isWizardOpen, setIsWizardOpen] = useState(false);

    // Aggregated Stats
    const totalSent = campaigns.reduce((acc, c) => acc + c.sent, 0);
    const avgOpen = Math.round(campaigns.reduce((acc, c) => acc + c.openRate, 0) / (campaigns.length || 1));

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Campaigns</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track your WhatsApp broadcasts.</p>
                </div>
                <Button onClick={() => setIsWizardOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Create Campaign
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPIcard title="Total Messages Sent" value={totalSent.toLocaleString()} icon={Send} trend="up" delta="+12%" />
                <KPIcard title="Avg. Open Rate" value={`${avgOpen}%`} icon={Eye} trend="up" delta="+2.4%" />
                <KPIcard title="Avg. Click Rate" value="12%" icon={MousePointer} trend="down" delta="-1.1%" />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Campaigns</h3>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Filter</Button>
                        <Button variant="ghost" size="sm">Export</Button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">Campaign Name</th>
                                <th className="px-6 py-4">Audience</th>
                                <th className="px-6 py-4">Sent</th>
                                <th className="px-6 py-4">Open Rate</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {campaigns.map((camp) => (
                                <tr key={camp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{camp.name}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{camp.sent} Leads</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{camp.sent}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{camp.openRate}%</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${camp.status === 'Sent' ? 'bg-cyan-100 text-cyan-700' :
                                            camp.status === 'Scheduled' ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                            }`}>
                                            {camp.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{format(new Date(camp.createdAt), 'MMM dd, yyyy')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
                title="Create New Campaign"
            >
                <CampaignWizard onClose={() => setIsWizardOpen(false)} onComplete={() => setIsWizardOpen(false)} />
            </Modal>
        </div>
    );
};

export default Campaigns;
