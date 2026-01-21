import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, MessageCircle, PieChart as PieChartIcon, Loader2, Gauge, Users } from 'lucide-react';

const Analytics = () => {
    const { dashboardStats, analyticsReport, loading } = useApp();

    if (loading || !dashboardStats || !analyticsReport) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    // Map Sentiment Breakdown
    const sentimentData = Object.entries(analyticsReport.sentiment_breakdown || {}).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value
    }));

    // Map Peak Activity Time
    const hourlyData = Object.entries(analyticsReport.peak_activity_time || {}).map(([time, volume]) => ({
        time,
        volume
    })).sort((a, b) => {
        const hourA = parseInt(a.time);
        const hourB = parseInt(b.time);
        return hourA - hourB;
    });

    // Map Message From Stats
    const msgFromData = Object.entries(analyticsReport.message_from_stats || {}).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value
    }));

    // Map Intent Level Stats
    const intentData = Object.entries(analyticsReport.intent_level_stats || {}).map(([name, value]) => ({
        name: name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        value
    }));


    const COLORS = ['#22d3ee', '#7c3aed', '#db2777', '#facc15', '#f87171', '#a855f7'];
    const INTENT_COLORS = ['#34d399', '#22c55e', '#facc15', '#f87171', '#94a3b8']; // Low, Medium, High, Very High, Unknown

    const hasSentimentData = sentimentData.length > 0;
    const hasHourlyData = hourlyData.length > 0;
    const hasMsgFromData = msgFromData.length > 0;
    const hasIntentData = intentData.length > 0;

    return (
        <div className="space-y-8 animate-fade-in pb-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Deep dive into your bot performance and sales metrics.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sentiment Analysis */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <PieChartIcon className="w-5 h-5 text-primary" /> Sentiment Breakdown
                    </h3>
                    <div className="h-80 flex items-center justify-center">
                        {hasSentimentData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={sentimentData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {sentimentData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-gray-400 dark:text-gray-500 text-sm italic">No sentiment data recorded yet</div>
                        )}
                    </div>
                    {hasSentimentData && (
                        <div className="flex justify-center flex-wrap gap-4 mt-4">
                            {sentimentData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    {entry.name} ({entry.value})
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Intent Level Analysis */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Gauge className="w-5 h-5 text-primary" /> Intent Levels
                    </h3>
                    <div className="h-80 flex items-center justify-center">
                        {hasIntentData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={intentData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} stroke="#e5e7eb" className="dark:stroke-gray-700" />
                                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                    <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="value" fill="#22c55e" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-gray-400 dark:text-gray-500 text-sm italic">No intent data recorded yet</div>
                        )}
                    </div>
                </div>

                {/* Peak Activity Hours */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-primary" /> Peak Activity Hours
                    </h3>
                    <div className="h-80 flex items-center justify-center">
                        {hasHourlyData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={hourlyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} label={{ value: 'Hour of Day (24h)', position: 'insideBottom', offset: -5, fill: '#6b7280' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="volume" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-gray-400 dark:text-gray-500 text-sm italic">No activity data recorded yet</div>
                        )}
                    </div>
                </div>

                {/* Message Source Stats */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" /> Message Sources
                    </h3>
                    <div className="h-60 flex items-center justify-center">
                        {hasMsgFromData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={msgFromData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {msgFromData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-gray-400 dark:text-gray-500 text-sm italic">No message source data</div>
                        )}
                    </div>
                    {hasMsgFromData && (
                        <div className="flex justify-center gap-4 mt-4">
                            {msgFromData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    {entry.name} ({entry.value})
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats Summary from Dashboard Stats */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" /> Core Metrics Summary
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                            <p className="text-sm text-gray-500">Total Conversations</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{dashboardStats.total_conversations}</p>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                            <p className="text-sm text-gray-500">Total Messages</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{dashboardStats.total_messages}</p>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                            <p className="text-sm text-gray-500">Active Leads</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{dashboardStats.active_leads}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
