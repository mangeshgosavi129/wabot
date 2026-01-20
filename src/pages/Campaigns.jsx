import React from 'react';
import { Megaphone } from 'lucide-react';

const Campaigns = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Campaigns</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track your WhatsApp broadcasts.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center">
                <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Campaigns Module Under Development</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                    Advanced targeting and scheduling for mass broadcasts will be available in the next release.
                </p>
            </div>
        </div>
    );
};

export default Campaigns;
