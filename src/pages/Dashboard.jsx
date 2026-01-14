import React from 'react';
import { useApp } from '../context/AppContext';
import KPIcard from '../components/KPIcard';
import { MessageSquare, Users, CheckCircle, BarChart2, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { analytics, campaigns, leads, user } = useApp();
    const navigate = useNavigate();

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of your sales agents and campaigns for {user?.company || 'Your Company'}.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => navigate('/settings')}>Configure Bot</Button>
                    <Button onClick={() => navigate('/campaigns')}>Run Campaign</Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPIcard
                    title="Active Conversations"
                    value={analytics.activeConversations}
                    icon={MessageSquare}
                    delta="+12% vs last week"
                    trend="up"
                />
                <KPIcard
                    title="Positive Leads"
                    value={analytics.positiveLeads}
                    icon={Users}
                    delta="+5% vs last week"
                    trend="up"
                />
                <KPIcard
                    title="Response Rate (24h)"
                    value="68%"
                    icon={CheckCircle}
                    delta="-2% vs last week"
                    trend="down"
                />
                <KPIcard
                    title="Conversion Rate"
                    value={`${analytics.conversionRate}%`}
                    icon={BarChart2}
                    delta="+0.8% vs last week"
                    trend="up"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        <Button variant="link" size="sm">View All</Button>
                    </div>
                    <div className="space-y-6">
                        {/* Mock Activity Stream */}
                        {[
                            { type: 'action', text: 'Action Required: Meeting scheduled with Ravi Patel', time: 'Just now', icon: CheckCircle, color: 'text-orange-500 bg-orange-500/10', link: '/actions' },
                            { type: 'lead', text: 'Lead John Mehra replied "I need a loan"', time: '2 mins ago', icon: Users, color: 'text-primary bg-primary/10', link: '/inbox?leadId=lead_001' },
                            { type: 'campaign', text: `Campaign "${campaigns[0]?.name}" sent to ${campaigns[0]?.sent} users`, time: '1 hour ago', icon: MessageSquare, color: 'text-accent bg-accent/10' },
                            { type: 'system', text: 'Credits purchased: 5000 credits added', time: '5 hours ago', icon: CheckCircle, color: 'text-cyan-500 bg-cyan-500/10' },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="flex gap-4 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                                onClick={() => item.link && navigate(item.link)}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.color}`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">{item.text}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pipeline Overview */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pipeline</h3>
                        <Button variant="link" size="sm" onClick={() => navigate('/leads')}>View CRM</Button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { stage: 'New Lead', count: 34, color: 'bg-primary' },
                            { stage: 'Contacted', count: 18, color: 'bg-indigo-500' },
                            { stage: 'Demo Scheduled', count: 5, color: 'bg-accent' },
                            { stage: 'Proposal Sent', count: 2, color: 'bg-pink-500' },
                            { stage: 'Won', count: 1, color: 'bg-cyan-500' },
                        ].map((item) => (
                            <div key={item.stage}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">{item.stage}</span>
                                    <span className="text-gray-900 dark:text-white font-bold">{item.count}</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${(item.count / 50) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
