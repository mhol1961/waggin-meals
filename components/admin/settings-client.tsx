'use client';

import { useState } from 'react';

interface Settings {
  id: string;
  tax_collection_enabled: boolean;
  updated_at: string;
}

interface SettingsClientProps {
  initialSettings: Settings | null;
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [settings, setSettings] = useState<Settings | null>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleToggleTaxCollection = async () => {
    if (!settings) return;

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tax_collection_enabled: !settings.tax_collection_enabled,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update settings');
      }

      setSettings(data.settings);
      setMessage({
        type: 'success',
        text: data.settings.tax_collection_enabled
          ? 'Tax collection enabled! Customers will now be charged sales tax.'
          : 'Tax collection disabled. No sales tax will be charged.',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to update settings',
      });
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-600">No settings found. Contact support.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tax Collection Setting */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sales Tax Collection
            </h3>
            <p className="text-gray-600 mb-4">
              {settings.tax_collection_enabled ? (
                <>
                  Tax collection is <strong>enabled</strong>. Customers are being charged sales tax based on their shipping state.
                </>
              ) : (
                <>
                  Tax collection is <strong>disabled</strong>. No sales tax is being charged to customers. Enable this when you're ready to collect sales taxes.
                </>
              )}
            </p>

            {/* Status Badge */}
            <div className="flex items-center gap-3 mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                settings.tax_collection_enabled
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {settings.tax_collection_enabled ? '✓ Enabled' : '○ Disabled'}
              </span>

              {!settings.tax_collection_enabled && (
                <span className="text-sm text-gray-500">
                  Tax rates are ready (51 states configured)
                </span>
              )}
            </div>

            {/* Important Notes */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-semibold text-amber-900 mb-2">
                💡 Important Notes
              </h4>
              <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                <li>Tax rates are configured for all 50 US states</li>
                <li>Louisiana (your state): 4.45% state sales tax</li>
                <li>Enabling this will add sales tax to all orders at checkout</li>
                <li>You can toggle this on/off anytime</li>
              </ul>
            </div>

            {/* Toggle Button */}
            <button
              onClick={handleToggleTaxCollection}
              disabled={saving}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                settings.tax_collection_enabled
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {saving ? 'Updating...' : (
                settings.tax_collection_enabled ? 'Disable Tax Collection' : 'Enable Tax Collection'
              )}
            </button>
          </div>

          {/* Visual Toggle Indicator */}
          <div className="ml-8">
            <div className={`w-20 h-10 rounded-full p-1 transition duration-300 ${
              settings.tax_collection_enabled ? 'bg-green-500' : 'bg-gray-300'
            }`}>
              <div className={`w-8 h-8 rounded-full bg-white shadow-md transition-transform duration-300 ${
                settings.tax_collection_enabled ? 'transform translate-x-10' : ''
              }`} />
            </div>
          </div>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mt-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          How Tax Calculation Works
        </h3>
        <div className="prose prose-gray max-w-none text-sm text-gray-600 space-y-3">
          <p>
            <strong>Automatic Calculation:</strong> Tax is calculated automatically at checkout based on the customer's shipping address state.
          </p>
          <p>
            <strong>State-Level Rates:</strong> Currently using base state-level tax rates. You can add county or ZIP-level rates later for more accuracy.
          </p>
          <p>
            <strong>Tax-Exempt States:</strong> No tax is charged for orders shipping to Alaska, Delaware, Montana, New Hampshire, or Oregon (states with no sales tax).
          </p>
          <p>
            <strong>Updates:</strong> You can view and manage tax rates at <code className="bg-gray-100 px-2 py-1 rounded">/admin/tax-rates</code> (coming soon).
          </p>
        </div>
      </div>

      {/* Current Settings Display */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Current Configuration</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Tax Collection:</span>
            <span className={`ml-2 font-medium ${
              settings.tax_collection_enabled ? 'text-green-600' : 'text-gray-600'
            }`}>
              {settings.tax_collection_enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Last Updated:</span>
            <span className="ml-2 font-medium text-gray-900">
              {new Date(settings.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
