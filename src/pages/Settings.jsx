
import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Users, Plug, Shield, Bell, Key, Check, Loader2 } from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('Integrations');
    const [selectedProvider, setSelectedProvider] = useState('WATI');
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // Form State
    const [settings, setSettings] = useState({
        apiUrl: 'https://api.wati.io/v1/sendMessage',
        accessToken: '••••••••••••••••',
        webhookUrl: 'https://app.trackchat.ai/hooks/v1/events'
    });

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }, 1500);
    };

    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6 animate-fade-in relative pb-8">
            {/* Success Toast */}
            {showToast && (
                <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-up z-50">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Settings saved successfully!</span>
                </div>
            )}

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Configure your account, team, and integrations.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 shrink-0 space-y-1">
                    {[
                        { name: 'General', icon: Users },
                        { name: 'Integrations', icon: Plug },
                        { name: 'Security', icon: Shield },
                        { name: 'Notifications', icon: Bell },
                        { name: 'API Keys', icon: Key },
                    ].map((item) => (
                        <button
                            key={item.name}
                            onClick={() => setActiveTab(item.name)}
                            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === item.name
                                    ? 'bg-white dark:bg-gray-800 shadow-sm text-primary ring-1 ring-gray-100 dark:ring-gray-700'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
                                }`}
                        >
                            <item.icon className="w-4 h-4" /> {item.name}
                        </button>
                    ))}
                </div>

                <div className="flex-1 space-y-6">
                    {/* Render active tab content (Mocking other tabs as placeholder) */}
                    {activeTab === 'Integrations' ? (
                        <>
                            {/* Provider Selection */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">WhatsApp Business Provider (BSP)</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    {['WATI', 'Twilio', 'Gupshup'].map((provider) => (
                                        <div
                                            key={provider}
                                            onClick={() => setSelectedProvider(provider)}
                                            className={`border rounded-xl p-4 cursor-pointer flex items-center justify-between transition-all ${selectedProvider === provider
                                                    ? 'border-primary ring-1 ring-primary bg-primary/5 dark:bg-primary/10'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                                }`}
                                        >
                                            <span className="font-medium text-gray-900 dark:text-white">{provider}</span>
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${selectedProvider === provider
                                                    ? 'border-primary bg-primary text-white'
                                                    : 'border-gray-300 dark:border-gray-600'
                                                }`}>
                                                {selectedProvider === provider && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 animate-fade-in">
                                    <Input
                                        label={`${selectedProvider} API Endpoint URL`}
                                        value={settings.apiUrl}
                                        onChange={(e) => handleChange('apiUrl', e.target.value)}
                                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                    <Input
                                        label="Access Token / API Key"
                                        type="password"
                                        value={settings.accessToken}
                                        onChange={(e) => handleChange('accessToken', e.target.value)}
                                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                    <div className="flex justify-end mt-4">
                                        <Button onClick={handleSave} disabled={isSaving}>
                                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                            {isSaving ? 'Saving...' : 'Save Configuration'}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Webhooks Section */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Webhooks</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">We will send event data to this URL.</p>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <Input
                                            value={settings.webhookUrl}
                                            onChange={(e) => handleChange('webhookUrl', e.target.value)}
                                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                    <Button variant="outline">Test</Button>
                                </div>

                                <div className="mt-6 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-xs text-gray-600 dark:text-gray-400 overflow-x-auto border border-gray-100 dark:border-gray-700">
                                    <p className="text-gray-400 dark:text-gray-500 mb-2">// Sample Payload</p>
                                    <pre>{JSON.stringify({
                                        event: "message.received",
                                        data: {
                                            id: "msg_123",
                                            from: "919876543210",
                                            text: "Hello",
                                            timestamp: 1672531200
                                        }
                                    }, null, 2)}</pre>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Coming Soon</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">This section is currently under development.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
