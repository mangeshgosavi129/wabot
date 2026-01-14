import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ArrowRight, Check, Upload, Users, Clock, AlertTriangle } from 'lucide-react';

const CampaignWizard = ({ onClose, onComplete }) => {
    const { templates, leads, campaigns, setCampaigns, deductCredits } = useApp();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: 'New Campaign',
        audience: 'all',
        templateId: templates[0]?.id || '',
        schedule: 'now',
        verified: false
    });

    const selectedTemplate = templates.find(t => t.id === formData.templateId);
    const costPerUser = selectedTemplate?.cost || 0;
    // Mock audience size
    const audienceSize = formData.audience === 'all' ? leads.length : Math.floor(leads.length / 2);
    const totalCost = Math.ceil(audienceSize * costPerUser);

    const handleNext = () => {
        setStep(prev => prev + 1);
    };

    const handleSubmit = () => {
        // Deduct credits
        deductCredits(totalCost);

        // Create campaign
        const newCampaign = {
            id: `camp_${Date.now()}`,
            name: formData.name,
            sent: audienceSize,
            delivered: 0, // Mock starts at 0
            openRate: 0,
            clickRate: 0,
            status: formData.schedule === 'now' ? 'Sent' : 'Scheduled',
            createdAt: new Date().toISOString()
        };

        setCampaigns([newCampaign, ...campaigns]);
        onComplete();
    };

    return (
        <div className="space-y-6">
            {/* Stepper */}
            <div className="flex items-center justify-between px-8">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= i ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                            }`}>
                            {step > i ? <Check className="w-5 h-5" /> : i}
                        </div>
                        {i < 3 && <div className={`w-24 h-1 mx-2 ${step > i ? 'bg-primary' : 'bg-gray-100'}`}></div>}
                    </div>
                ))}
            </div>

            <div className="pt-4">
                {step === 1 && (
                    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                        <Input
                            label="Campaign Name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Audience</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    className={`p-4 border rounded-xl cursor-pointer ${formData.audience === 'all' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                                    onClick={() => setFormData({ ...formData, audience: 'all' })}
                                >
                                    <Users className="w-5 h-5 mb-2 text-gray-600" />
                                    <p className="font-medium text-sm">All Leads ({leads.length})</p>
                                </div>
                                <div
                                    className={`p-4 border rounded-xl cursor-pointer ${formData.audience === 'segment' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                                    onClick={() => setFormData({ ...formData, audience: 'segment' })}
                                >
                                    <Upload className="w-5 h-5 mb-2 text-gray-600" />
                                    <p className="font-medium text-sm">Upload CSV</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Select Template</label>
                            <select
                                className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                                value={formData.templateId}
                                onChange={e => setFormData({ ...formData, templateId: e.target.value })}
                            >
                                {templates.map(t => (
                                    <option key={t.id} value={t.id}>{t.body.substring(0, 50)}...</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3 text-yellow-800">
                            <AlertTriangle className="w-5 h-5 shrink-0" />
                            <div>
                                <h4 className="font-medium text-sm">Opt-in Verification Required</h4>
                                <p className="text-sm mt-1">You must verify that these contacts have explicitly opted in to receive messages.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                                <input
                                    type="checkbox"
                                    className="mt-1 rounded border-gray-300 text-primary"
                                    checked={formData.verified}
                                    onChange={e => setFormData({ ...formData, verified: e.target.checked })}
                                />
                                <div className="text-sm">
                                    <span className="font-medium text-gray-900">I confirm that all recipients have opted in.</span>
                                    <p className="text-gray-500 mt-1">Proof of opt-in (e.g. screenshot or form link) may be requested during audits.</p>
                                </div>
                            </label>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <h3 className="font-semibold text-gray-900">Review Campaign</h3>

                        <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Recipients</span>
                                <span className="font-medium text-gray-900">{audienceSize}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Template Cost</span>
                                <span className="font-medium text-gray-900">{costPerUser} credits / user</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3 flex justify-between">
                                <span className="text-gray-900 font-medium">Total Estimated Cost</span>
                                <span className="font-bold text-primary text-lg">{totalCost} Credits</span>
                            </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-xl">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Message Preview</p>
                            <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-sm">
                                {selectedTemplate?.body}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-100">
                <Button variant="ghost" onClick={step === 1 ? onClose : () => setStep(prev => prev - 1)}>
                    {step === 1 ? 'Cancel' : 'Back'}
                </Button>
                <Button
                    onClick={step === 3 ? handleSubmit : handleNext}
                    disabled={step === 2 && !formData.verified}
                >
                    {step === 3 ? 'Launch Campaign' : 'Continue'} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

export default CampaignWizard;
