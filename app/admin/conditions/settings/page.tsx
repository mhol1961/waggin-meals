'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

interface Setting {
  key: string;
  value: string | null;
  description: string | null;
}

export default function ConditionSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, Setting>>({});
  const [testingAI, setTestingAI] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .in('key', ['openrouter_api_key', 'ai_generation_enabled', 'default_ai_model']);

      if (error) throw error;

      const settingsMap: Record<string, Setting> = {};
      data?.forEach((setting) => {
        settingsMap[setting.key] = setting;
      });

      setSettings(settingsMap);
    } catch (error) {
      console.error('Error fetching settings:', error);
      alert('Failed to load settings');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      // Update each setting
      for (const key in settings) {
        const { error } = await supabase
          .from('seo_settings')
          .update({ value: settings[key].value })
          .eq('key', key);

        if (error) throw error;
      }

      alert('✅ Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('❌ Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  async function testAIConnection() {
    if (!settings.openrouter_api_key?.value) {
      alert('Please enter an API key first');
      return;
    }

    setTestingAI(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/conditions/test-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: settings.openrouter_api_key.value,
          model: settings.default_ai_model?.value || 'anthropic/claude-sonnet-4-5'
        })
      });

      const result = await response.json();

      if (response.ok) {
        setTestResult({ success: true, message: '✅ AI connection successful!' });
      } else {
        setTestResult({ success: false, message: `❌ ${result.error || 'Connection failed'}` });
      }
    } catch (error) {
      setTestResult({ success: false, message: '❌ Network error' });
    } finally {
      setTestingAI(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Condition Pages Settings</h1>
              <p className="text-sm text-gray-600">Configure AI content generation and system settings</p>
            </div>
            <Link
              href="/admin/conditions"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Condition Pages
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">

          {/* AI Content Generation Section */}
          <section className="mb-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">AI Content Generation</h2>
                <p className="text-sm text-gray-600">
                  Enable AI-powered content generation using OpenRouter API
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.ai_generation_enabled?.value === 'true'}
                  onChange={(e) => setSettings({
                    ...settings,
                    ai_generation_enabled: {
                      ...settings.ai_generation_enabled!,
                      value: e.target.checked ? 'true' : 'false'
                    }
                  })}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  {settings.ai_generation_enabled?.value === 'true' ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            <div className="space-y-6">
              {/* OpenRouter API Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OpenRouter API Key
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex gap-3">
                  <input
                    type="password"
                    value={settings.openrouter_api_key?.value || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      openrouter_api_key: {
                        ...settings.openrouter_api_key!,
                        value: e.target.value
                      }
                    })}
                    placeholder="sk-or-v1-..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  />
                  <button
                    onClick={testAIConnection}
                    disabled={testingAI || !settings.openrouter_api_key?.value}
                    className="px-4 py-2 bg-[#5E8C8C] text-white rounded-lg hover:bg-[#6d8c6d] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {testingAI ? 'Testing...' : 'Test Connection'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Get your API key from{' '}
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    openrouter.ai/keys
                  </a>
                </p>
                {testResult && (
                  <div className={`mt-3 p-3 rounded-lg text-sm ${
                    testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    {testResult.message}
                  </div>
                )}
              </div>

              {/* Model Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default AI Model
                </label>
                <select
                  value={settings.default_ai_model?.value || 'anthropic/claude-sonnet-4-5'}
                  onChange={(e) => setSettings({
                    ...settings,
                    default_ai_model: {
                      ...settings.default_ai_model!,
                      value: e.target.value
                    }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="anthropic/claude-sonnet-4-5">Claude Sonnet 4.5 (Recommended)</option>
                  <option value="anthropic/claude-3.7-sonnet">Claude 3.7 Sonnet</option>
                  <option value="openai/gpt-4o">GPT-4o</option>
                  <option value="openai/gpt-4o-mini">GPT-4o Mini (Faster, cheaper)</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  Claude Sonnet 4.5 produces the highest quality content for condition pages
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">How AI Content Generation Works:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Select a health condition in the wizard</li>
                      <li>AI analyzes SEO keywords and creates optimized content</li>
                      <li>Generates H1, sections, FAQ, schema markup automatically</li>
                      <li>You review and edit before publishing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Info */}
          <section className="border-t border-gray-200 pt-8 mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Pricing & Usage</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-2xl font-bold text-gray-900 mb-1">~$0.05</div>
                <div className="text-sm text-gray-600">Per page generation</div>
                <div className="text-xs text-gray-500 mt-2">Claude Sonnet 4.5</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-2xl font-bold text-gray-900 mb-1">~5 sec</div>
                <div className="text-sm text-gray-600">Generation time</div>
                <div className="text-xs text-gray-500 mt-2">Typical response</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-2xl font-bold text-gray-900 mb-1">~1000</div>
                <div className="text-sm text-gray-600">Words per page</div>
                <div className="text-xs text-gray-500 mt-2">SEO-optimized length</div>
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            <div className="text-sm text-gray-600">
              Changes are saved to the database immediately
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 flex items-center gap-4 text-sm">
          <Link
            href="/admin/conditions"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Condition Pages
          </Link>
          <span className="text-gray-300">|</span>
          <Link
            href="/admin/conditions/seo-dashboard"
            className="text-blue-600 hover:text-blue-800"
          >
            View SEO Dashboard →
          </Link>
        </div>
      </main>
    </div>
  );
}
