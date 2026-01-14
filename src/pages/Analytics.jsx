import React from 'react';
import { useApp } from '../context/AppContext';
import KPIcard from '../components/KPIcard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, MessageCircle, UserCheck, PieChart as PieChartIcon } from 'lucide-react';

const Analytics = () => {
    const { analytics } = useApp();

    // Mock Data for Charts
    const conversationData = [
        { name: 'Mon', active: 40, closed: 24 },
        { name: 'Tue', active: 30, closed: 13 },
        { name: 'Wed', active: 20, closed: 58 },
        { name: 'Thu', active: 27, closed: 39 },
        { name: 'Fri', active: 18, closed: 48 },
        { name: 'Sat', active: 23, closed: 38 },
        { name: 'Sun', active: 34, closed: 43 },
    ];

    const sentimentData = [
        { name: 'Positive', value: 65 },
        { name: 'Neutral', value: 25 },
        { name: 'Negative', value: 10 },
    ];


    // New Mock Data
    const hourlyData = [
        { time: '9am', volume: 120 }, { time: '10am', volume: 180 }, { time: '11am', volume: 240 },
        { time: '12pm', volume: 200 }, { time: '1pm', volume: 160 }, { time: '2pm', volume: 220 },
        { time: '3pm', volume: 280 }, { time: '4pm', volume: 250 }, { time: '5pm', volume: 190 },
    ];

    const sourceData = [
        { name: 'WhatsApp Direct', value: 55 },
        { name: 'Website Widget', value: 25 },
        { name: 'Facebook Ads', value: 20 },
    ];

    // Bubbles Theme Colors (Cyan, Violet, Pink)
    const COLORS = ['#22d3ee', '#7c3aed', '#db2777'];
    const SOURCE_COLORS = ['#7c3aed', '#22d3ee', '#f472b6'];

    return (
        <div className="space-y-8 animate-fade-in pb-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Deep dive into your bot performance and sales metrics.</p>
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1 flex text-sm">
                    <button className="px-3 py-1 bg-primary/10 text-primary rounded-md font-medium">7 Days</button>
                    <button className="px-3 py-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">30 Days</button>
                    <button className="px-3 py-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">90 Days</button>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Conversation Volume */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" /> Conversation Volume
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={conversationData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#fff' }}
                                    itemStyle={{ color: '#374151' }}
                                />
                                <Line type="monotone" dataKey="active" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4, fill: '#7c3aed' }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="closed" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4, fill: '#22d3ee' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sentiment Analysis */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <PieChartIcon className="w-5 h-5 text-primary" /> Sentiment Breakdown
                    </h3>
                    <div className="h-80 flex items-center justify-center">
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
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        {sentimentData.map((entry, index) => (
                            <div key={entry.name} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                {entry.name} ({entry.value}%)
                            </div>
                        ))}
                    </div>
                </div>

                {/* New: Hourly Engagement using Bar Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-primary" /> Peak Activity Hours
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hourlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="volume" fill="url(#colorGradient)" radius={[4, 4, 0, 0]}>
                                    {hourlyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#7c3aed' : '#22d3ee'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* New: Source Breakdown */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-primary" /> Lead Sources
                    </h3>
                    <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sourceData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    dataKey="value"
                                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                        const RADIAN = Math.PI / 180;
                                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                        return (
                                            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                                                {`${(percent * 100).toFixed(0)}%`}
                                            </text>
                                        );
                                    }}
                                >
                                    {sourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        {sourceData.map((entry, index) => (
                            <div key={entry.name} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SOURCE_COLORS[index] }}></div>
                                {entry.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
