import React, { useState } from 'react';
import { CreditCard, Zap, History, Check } from 'lucide-react';

const Credits = () => {
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

    // Using local state for now as backend doesn't have credits yet
    const [credits, setCredits] = useState({
        balance: 5000,
        history: [
            { id: '1', type: 'purchase', credits: 5000, amount: 2300, date: new Date().toISOString() }
        ]
    });

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Credits & Billing</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your prepaid credits for messages and AI usage.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white font-bold uppercase transition-all">
                <div className="bg-gradient-to-br from-primary to-primary-dark p-6 rounded-2xl text-white shadow-lg overflow-hidden relative">
                    <p className="text-primary-light font-medium mb-2 opacity-80 uppercase tracking-wider text-xs">Available Balance</p>
                    <h2 className="text-4xl font-bold">{credits.balance.toLocaleString()}</h2>
                    <Zap className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center">
                <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Billing Integration Pending</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                    We are currently integrating with Stripe for real-time credit top-ups.
                    Contact support for enterprise credit allocation.
                </p>
            </div>
        </div>
    );
};

export default Credits;
