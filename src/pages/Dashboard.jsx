import React from 'react';
import { useApp } from '../context/AppContext';
import KPIcard from '../components/KPIcard';
import { MessageSquare, Users, BarChart2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { analytics, user, loading } = useApp();
    const navigate = useNavigate();

    if (loading || !analytics) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

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
                    title="Total Conversations"
                    value={analytics.total_conversations}
                    icon={MessageSquare}
                    delta="+0 vs last week"
                    trend="up"
                />
                <KPIcard
                    title="Total Messages"
                    value={analytics.total_messages}
                    icon={MessageSquare}
                    delta="+0 vs last week"
                    trend="up"
                />
                <KPIcard
                    title="Active Leads"
                    value={analytics.active_leads}
                    icon={Users}
                    delta="+0 vs last week"
                    trend="up"
                />
                <KPIcard
                    title="Lead Quality"
                    value="Good"
                    icon={BarChart2}
                    delta="N/A"
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
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No recent activity found.</p>
                    </div>
                </div>

                {/* Pipeline Overview */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sentiment Overview</h3>
                        <Button variant="link" size="sm" onClick={() => navigate('/analytics')}>Details</Button>
                    </div>
                    <div className="space-y-4">
                        {Object.entries(analytics.sentiment_breakdown || {}).map(([sentiment, count]) => (
                            <div key={sentiment}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-700 dark:text-gray-300 font-medium capitalize">{sentiment}</span>
                                    <span className="text-gray-900 dark:text-white font-bold">{count}</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full"
                                        style={{ width: `${(count / Math.max(1, analytics.total_conversations)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {!Object.keys(analytics.sentiment_breakdown || {}).length && (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No data available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
