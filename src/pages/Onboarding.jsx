import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import OnboardingStatus from '../components/OnboardingStatus';
import { MessageSquare } from 'lucide-react';

const Onboarding = () => {
    const [step, setStep] = useState(1); // 1: Form, 2: Status
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setStep(2);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="text-center mb-8">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
                    <MessageSquare className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome to TrackChat</h1>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">Set up your AI Sales Agent in minutes. Connect your WhatsApp number to get started.</p>
            </div>

            <div className="w-full max-w-xl">
                {step === 1 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-in fade-in zoom-in-95 duration-300">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="Company Name" placeholder="Ex. Acme Corp" defaultValue="Acme Corp" required />
                                {/* Custom Select using generic HTML for now, could be a component */}
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Business Type</label>
                                    <select className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                                        <option>Fintech</option>
                                        <option>E-commerce</option>
                                        <option>Healthcare</option>
                                        <option>SaaS</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Primary Use Case</label>
                                <select className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                                    <option>Lead Generation</option>
                                    <option>Customer Support</option>
                                    <option>Sales Booking</option>
                                </select>
                            </div>

                            <Input label="WhatsApp Number" placeholder="+91 98765 43210" defaultValue="+91 " required />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="Contact Person" placeholder="John Doe" defaultValue="John Doe" required />
                                <Input label="Email" type="email" placeholder="john@example.com" defaultValue="john@example.com" required />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700">Opt-in Collection Methods</label>
                                <div className="space-y-2">
                                    {['Website Form', 'Click-to-WhatsApp Ads', 'QR Code'].map((method) => (
                                        <label key={method} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary" />
                                            {method}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <Button type="submit" className="w-full" isLoading={isSubmitting}>
                                Connect & Provision Bot
                            </Button>
                        </form>
                    </div>
                ) : (
                    <OnboardingStatus onComplete={() => navigate('/')} />
                )}
            </div>

            <p className="mt-8 text-xs text-gray-400">© 2026 TrackChat AI. No credit card required.</p>
        </div>
    );
};

export default Onboarding;
