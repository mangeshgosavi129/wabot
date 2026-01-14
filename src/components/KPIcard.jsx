import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const KPIcard = ({ title, value, delta, icon: Icon, trend }) => {
    const isPositive = trend === 'up';

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                    {Icon && <Icon className="w-6 h-6 text-primary" />}
                </div>
                {delta && (
                    <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-primary' : 'text-accent'}`}>
                        {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                        {delta}
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
            </div>
        </div>
    );
};

export default KPIcard;
