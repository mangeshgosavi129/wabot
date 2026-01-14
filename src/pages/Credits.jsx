import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import KPIcard from '../components/KPIcard';
import Modal from '../components/ui/Modal';
import { CreditCard, Zap, MessageSquare, History, Check } from 'lucide-react';
import { format } from 'date-fns';

const Credits = () => {
    const { credits, addCredits } = useApp();
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

    const packs = [
        { credits: 1000, price: 500, popular: false },
        { credits: 5000, price: 2300, popular: true },
        { credits: 10000, price: 4500, popular: false },
    ];

    const handlePurchase = (pack) => {
        addCredits(pack.credits, pack.price);
        setIsBuyModalOpen(false);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Credits & Billing</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your prepaid credits for messages and AI usage.</p>
                </div>
                <Button onClick={() => setIsBuyModalOpen(true)}><CreditCard className="w-4 h-4 mr-2" /> Buy Credits</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-primary to-primary-dark p-6 rounded-2xl text-white shadow-lg">
                    <p className="text-primary-light font-medium mb-2">Available Balance</p>
                    <h2 className="text-4xl font-bold">{credits.balance.toLocaleString()}</h2>
                    <p className="text-sm opacity-80 mt-4">Credits never expire.</p>
                </div>
                <KPIcard title="Monthly Usage" value="4,200" icon={Zap} trend="up" delta="+15%" />
                <KPIcard title="Est. Runway" value="12 Days" icon={History} trend="down" delta="-2 Days" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pricing Table */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pricing</h3>
                    <div className="space-y-4">
                        {[
                            { item: 'Marketing Template', cost: '0.90 Credits / msg' },
                            { item: 'Utility Template', cost: '0.13 Credits / msg' },
                            { item: 'Authentication Template', cost: '0.13 Credits / msg' },
                            { item: 'Service Conversation (24h)', cost: 'Free' },
                            { item: 'AI Response Generation', cost: '1 Credit / 1k tokens' },
                        ].map((row, idx) => (
                            <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-gray-700 last:border-0">
                                <span className="text-gray-600 dark:text-gray-300">{row.item}</span>
                                <span className="font-medium text-gray-900 dark:text-white">{row.cost}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* History */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Transaction History</h3>
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                        {credits.history.map((txn) => (
                            <div key={txn.id} className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-gray-700 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${txn.type === 'purchase' ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                                        {txn.type === 'purchase' ? <CreditCard className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{txn.type.replace('_', ' ')}</p>
                                        <p className="text-xs text-gray-400">{format(new Date(txn.date), 'MMM dd, h:mm a')}</p>
                                    </div>
                                </div>
                                <span className={`font-medium ${txn.amount > 0 ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-900 dark:text-white'}`}>
                                    {txn.amount > 0 ? '+' : ''}{Math.abs(txn.credits)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isBuyModalOpen}
                onClose={() => setIsBuyModalOpen(false)}
                title="Buy Credits"
                size="lg"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                    {packs.map((pack) => (
                        <div
                            key={pack.credits}
                            className={`border rounded-xl p-6 text-center cursor-pointer transition-all hover:scale-105 active:scale-95 flex flex-col dark:bg-gray-800 ${pack.popular ? 'border-primary shadow-md ring-1 ring-primary' : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'}`}
                            onClick={() => handlePurchase(pack)}
                        >
                            {pack.popular && <div className="text-xs font-bold text-primary uppercase tracking-wide mb-2">Most Popular</div>}
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{pack.credits.toLocaleString()}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Credits</p>
                            <div className="text-2xl font-bold text-gray-900 mb-6">₹{pack.price}</div>
                            <ul className="text-sm text-gray-600 space-y-2 mb-6 text-left mx-auto">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> No Expiry</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Priority Support</li>
                            </ul>
                            <Button variant={pack.popular ? 'primary' : 'outline'} className="w-full mt-auto">Select Pack</Button>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default Credits;
