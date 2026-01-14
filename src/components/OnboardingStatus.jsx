import React from 'react';
import { CheckCircle, Clock, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';

const Step = ({ title, status, description }) => {
    const icons = {
        pending: Clock,
        processing: Loader2,
        completed: CheckCircle,
        rejected: XCircle
    };

    const colors = {
        pending: 'text-gray-400 bg-gray-50',
        processing: 'text-blue-600 bg-blue-50',
        completed: 'text-green-600 bg-green-50',
        rejected: 'text-red-600 bg-red-50'
    };

    const Icon = icons[status] || Clock;

    return (
        <div className="flex gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colors[status]}`}>
                <Icon className={`w-5 h-5 ${status === 'processing' ? 'animate-spin' : ''}`} />
            </div>
            <div>
                <p className="font-medium text-gray-900">{title}</p>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
    );
};

const OnboardingStatus = ({ onComplete }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-8 animate-in slide-in-from-bottom duration-500">
            <h3 className="text-lg font-semibold text-gray-900">Setup Progress</h3>

            <div className="space-y-6 relative before:absolute before:left-5 before:top-2 before:bottom-6 before:w-px before:bg-gray-200">
                <Step
                    title="Business Verification"
                    status="completed"
                    description="Your business details have been verified."
                />
                <Step
                    title="WhatsApp Number Integration"
                    status="completed"
                    description="+91 98765 43210 is now connected."
                />
                <Step
                    title="Template Approval"
                    status="processing"
                    description="Waiting for approval on standard templates (2/5 approved)."
                />
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
                <h4 className="text-sm font-medium text-gray-900">Templates Status</h4>
                {[
                    { name: 'Welcome_Msg_01', status: 'Approved', color: 'text-green-600' },
                    { name: 'Loan_Offer_Promo', status: 'Pending', color: 'text-yellow-600' },
                    { name: 'Payment_Reminder', status: 'Approved', color: 'text-green-600' },
                ].map((t) => (
                    <div key={t.name} className="flex justify-between text-sm">
                        <span className="text-gray-600">{t.name}</span>
                        <span className={`font-medium ${t.color}`}>{t.status}</span>
                    </div>
                ))}
            </div>

            <div className="flex justify-end pt-4">
                <Button onClick={onComplete} className="w-full sm:w-auto">
                    Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

export default OnboardingStatus;
