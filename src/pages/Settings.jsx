import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Users, Plug, Shield, Check, Loader2 } from 'lucide-react';
import { api } from '../lib/apis';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Integrations');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const [status, setStatus] = useState(null);

  // ✅ Organization form state
  const [org, setOrg] = useState({
    org_name: '',
    org_id: '',
  });

  // Form State for WhatsApp Cloud API
  const [config, setConfig] = useState({
    access_token: '',
    version: 'v18.0',
    verify_token: '',
    app_secret: '',
    phone_number_id: '',
    business_account_id: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // ✅ Fetch WhatsApp status
        const res = await api.getWhatsAppStatus();
        setStatus(res);

        if (res) {
          setConfig((prev) => ({
            ...prev,
            phone_number_id: res.phone_number_id,
            business_account_id: res.business_account_id,
            access_token: '••••••••••••••••', // Masked
          }));
        }

        // ✅ Fetch Organization details (you need these endpoints)
        // If not available yet, remove this block.
        try {
          const orgRes = await api.getOrganization(); // { org_name, org_id }
          if (orgRes) setOrg(orgRes);
        } catch (err) {
          console.warn('Org details API not available yet:', err);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const showSuccessToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSaveWhatsApp = async () => {
    setIsSaving(true);
    try {
      if (status) {
        await api.updateWhatsAppConfig(config);
      } else {
        const res = await api.connectWhatsApp(config);
        setStatus(res);
      }
      showSuccessToast();
    } catch (error) {
      alert('Failed to save WhatsApp configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveOrg = async () => {
    setIsSaving(true);
    try {
        await api.updateOrganization({
        org_name: org.org_name, // ✅ only name
        });

        showSuccessToast();
    } catch (error) {
        alert('Failed to save organization details');
    } finally {
        setIsSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleOrgChange = (field, value) => {
    setOrg((prev) => ({ ...prev, [field]: value }));
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect?')) return;
    try {
      await api.disconnectWhatsApp();
      setStatus(null);
      setConfig({
        access_token: '',
        version: 'v18.0',
        verify_token: '',
        app_secret: '',
        phone_number_id: '',
        business_account_id: '',
      });
    } catch (error) {
      alert('Failed to disconnect');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in relative pb-8">
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-up z-50">
          <Check className="w-5 h-5" />
          <span className="font-medium">Settings saved successfully!</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Configure your account, organization, and integrations.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 shrink-0 space-y-1">
          {[
            { name: 'General', icon: Users },
            { name: 'Integrations', icon: Plug },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.name
                  ? 'bg-white dark:bg-gray-800 shadow-sm text-primary ring-1 ring-gray-100 dark:ring-gray-700'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50'
              }`}
            >
              <item.icon className="w-4 h-4" /> {item.name}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-6">
          {/* ✅ GENERAL TAB */}
          {activeTab === 'General' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Organization Details
                </h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Organization Name"
                    value={org.org_name}
                    onChange={(e) => handleOrgChange('org_name', e.target.value)}
                    placeholder="Enter organization name"
                  />
                  <Input
                    label="Organization ID"
                    value={org.org_id}
                    onChange={(e) => handleOrgChange('org_id', e.target.value)}
                    placeholder="Enter organization id"
                  />
                </div>

                <div className="flex justify-end mt-6">
                  <Button onClick={handleSaveOrg} disabled={isSaving}>
                    {isSaving && (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    )}
                    Save Organization Details
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ✅ INTEGRATIONS TAB */}
          {activeTab === 'Integrations' ? (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    WhatsApp Cloud API
                  </h3>
                  {status?.is_connected ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                      Connected
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                      Disconnected
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Phone Number ID"
                      value={config.phone_number_id}
                      onChange={(e) =>
                        handleChange('phone_number_id', e.target.value)
                      }
                      placeholder="Enter Phone Number ID"
                    />
                    <Input
                      label="Business Account ID"
                      value={config.business_account_id}
                      onChange={(e) =>
                        handleChange('business_account_id', e.target.value)
                      }
                      placeholder="Enter Business Account ID"
                    />
                  </div>

                  <Input
                    label="API Version"
                    value={config.version}
                    onChange={(e) => handleChange('version', e.target.value)}
                    placeholder="e.g. v18.0"
                  />
                  <Input
                    label="Access Token"
                    type="password"
                    value={config.access_token}
                    onChange={(e) =>
                      handleChange('access_token', e.target.value)
                    }
                    placeholder="Enter permanent access token"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Verify Token (Webhook)"
                      value={config.verify_token}
                      onChange={(e) =>
                        handleChange('verify_token', e.target.value)
                      }
                      placeholder="Token you specify in Meta dev portal"
                    />
                    <Input
                      label="App Secret"
                      type="password"
                      value={config.app_secret}
                      onChange={(e) =>
                        handleChange('app_secret', e.target.value)
                      }
                      placeholder="Enter Meta App Secret"
                    />
                  </div>

                  <div className="flex justify-between mt-6">
                    {status && (
                      <Button
                        variant="outline"
                        className="text-red-500 hover:text-red-600"
                        onClick={handleDisconnect}
                      >
                        Disconnect
                      </Button>
                    )}

                    <div className="flex-1"></div>

                    <Button onClick={handleSaveWhatsApp} disabled={isSaving}>
                      {isSaving && (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      )}
                      {status ? 'Update Configuration' : 'Connect WhatsApp'}
                    </Button>
                  </div>
                </div>
              </div>

              {status?.is_connected && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Webhook Callback URL
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Copy this URL to your Meta App Dashboard Webhook settings.
                  </p>
                  <div className="flex gap-4">
                    <Input
                      readOnly
                      value={`http://localhost:8000/webhook/whatsapp`}
                      className="flex-1 bg-gray-50 dark:bg-gray-900 font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `http://localhost:8000/webhook/whatsapp`
                        );
                        alert('Copied!');
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : activeTab !== 'General' ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center">
              <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Coming Soon
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Other settings tabs are currently under development.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Settings;