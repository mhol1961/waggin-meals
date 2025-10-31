'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * Admin Tax Management Page
 * Manage sales tax rates for all US states, counties, and ZIP codes
 */

interface TaxRate {
  id: string;
  state_code: string;
  state_name: string;
  county?: string;
  zip_code?: string;
  tax_rate: number;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface TaxRateFormData {
  state_code: string;
  state_name: string;
  county: string;
  zip_code: string;
  tax_rate: string;
  notes: string;
  is_active: boolean;
}

const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];

export default function TaxManagementPage() {
  const router = useRouter();

  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [filteredRates, setFilteredRates] = useState<TaxRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Global tax collection toggle
  const [taxCollectionEnabled, setTaxCollectionEnabled] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  // Filters
  const [searchState, setSearchState] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('active');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingRate, setEditingRate] = useState<TaxRate | null>(null);
  const [formData, setFormData] = useState<TaxRateFormData>({
    state_code: '',
    state_name: '',
    county: '',
    zip_code: '',
    tax_rate: '',
    notes: '',
    is_active: true,
  });

  useEffect(() => {
    fetchTaxRates();
    fetchTaxSettings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [taxRates, searchState, filterActive]);

  async function fetchTaxSettings() {
    try {
      const response = await fetch('/api/settings/site');
      if (response.ok) {
        const data = await response.json();
        setTaxCollectionEnabled(data.settings?.tax_collection_enabled || false);
      }
    } catch (err) {
      console.error('Error fetching tax settings:', err);
    }
  }

  async function fetchTaxRates() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tax/rates');
      if (!response.ok) throw new Error('Failed to fetch tax rates');

      const data = await response.json();
      setTaxRates(data.tax_rates || []);
    } catch (err) {
      console.error('Error fetching tax rates:', err);
      setError('Failed to load tax rates');
    } finally {
      setLoading(false);
    }
  }

  async function toggleTaxCollection() {
    setToggleLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/settings/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tax_collection_enabled: !taxCollectionEnabled,
        }),
      });

      if (!response.ok) throw new Error('Failed to update tax collection setting');

      const data = await response.json();
      setTaxCollectionEnabled(data.settings.tax_collection_enabled);
      setSuccessMessage(
        data.settings.tax_collection_enabled
          ? 'Tax collection enabled successfully'
          : 'Tax collection disabled successfully'
      );
    } catch (err) {
      console.error('Error toggling tax collection:', err);
      setError('Failed to update tax collection setting');
    } finally {
      setToggleLoading(false);
    }
  }

  function applyFilters() {
    let filtered = [...taxRates];

    // Filter by state search
    if (searchState) {
      const search = searchState.toUpperCase();
      filtered = filtered.filter(
        (rate) =>
          rate.state_code.includes(search) ||
          rate.state_name.toUpperCase().includes(search)
      );
    }

    // Filter by active status
    if (filterActive === 'active') {
      filtered = filtered.filter((rate) => rate.is_active);
    } else if (filterActive === 'inactive') {
      filtered = filtered.filter((rate) => !rate.is_active);
    }

    setFilteredRates(filtered);
  }

  function openCreateModal() {
    setEditingRate(null);
    setFormData({
      state_code: '',
      state_name: '',
      county: '',
      zip_code: '',
      tax_rate: '',
      notes: '',
      is_active: true,
    });
    setShowModal(true);
  }

  function openEditModal(rate: TaxRate) {
    setEditingRate(rate);
    setFormData({
      state_code: rate.state_code,
      state_name: rate.state_name,
      county: rate.county || '',
      zip_code: rate.zip_code || '',
      tax_rate: (rate.tax_rate * 100).toFixed(2), // Convert to percentage
      notes: rate.notes || '',
      is_active: rate.is_active,
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingRate(null);
    setError(null);
  }

  function handleStateChange(stateCode: string) {
    const state = US_STATES.find((s) => s.code === stateCode);
    setFormData({
      ...formData,
      state_code: stateCode,
      state_name: state?.name || '',
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      // Validate tax rate
      const taxRateValue = parseFloat(formData.tax_rate);
      if (isNaN(taxRateValue) || taxRateValue < 0 || taxRateValue > 100) {
        setError('Tax rate must be between 0 and 100');
        return;
      }

      // Convert percentage to decimal
      const taxRateDecimal = taxRateValue / 100;

      const payload = {
        state_code: formData.state_code,
        state_name: formData.state_name,
        county: formData.county || null,
        zip_code: formData.zip_code || null,
        tax_rate: taxRateDecimal,
        notes: formData.notes || null,
        is_active: formData.is_active,
      };

      let response;
      if (editingRate) {
        // Update existing rate
        response = await fetch(`/api/tax/rates/${editingRate.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new rate
        response = await fetch('/api/tax/rates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save tax rate');
      }

      setSuccessMessage(
        editingRate ? 'Tax rate updated successfully' : 'Tax rate created successfully'
      );
      closeModal();
      fetchTaxRates();
    } catch (err) {
      console.error('Error saving tax rate:', err);
      setError(err instanceof Error ? err.message : 'Failed to save tax rate');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to deactivate this tax rate?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tax/rates/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete tax rate');

      setSuccessMessage('Tax rate deactivated successfully');
      fetchTaxRates();
    } catch (err) {
      console.error('Error deleting tax rate:', err);
      setError('Failed to delete tax rate');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/admin"
                className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
              >
                ← Back to Admin Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Tax Rate Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage sales tax rates for US states, counties, and ZIP codes
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add Tax Rate
            </button>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Global Tax Collection Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Tax Collection
              </h3>
              <p className="text-sm text-gray-600">
                Master switch to enable or disable tax collection site-wide. When disabled, all
                orders will have $0.00 tax regardless of location.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Current status:{' '}
                <span
                  className={`font-semibold ${
                    taxCollectionEnabled ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {taxCollectionEnabled ? 'ENABLED' : 'DISABLED'}
                </span>
              </p>
            </div>
            <button
              onClick={toggleTaxCollection}
              disabled={toggleLoading}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                taxCollectionEnabled ? 'bg-green-600' : 'bg-gray-300'
              } ${toggleLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  taxCollectionEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search State
              </label>
              <input
                type="text"
                value={searchState}
                onChange={(e) => setSearchState(e.target.value)}
                placeholder="Search by state code or name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value as 'all' | 'active' | 'inactive')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchTaxRates}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Rates Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pb-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-500">Loading tax rates...</p>
            </div>
          ) : filteredRates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No tax rates found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      State
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      County/ZIP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tax Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRates.map((rate) => (
                    <tr key={rate.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {rate.state_code}
                        </div>
                        <div className="text-sm text-gray-500">{rate.state_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {rate.zip_code && <div>ZIP: {rate.zip_code}</div>}
                        {rate.county && <div>{rate.county} County</div>}
                        {!rate.zip_code && !rate.county && (
                          <span className="text-gray-400">State-level</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {(rate.tax_rate * 100).toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            rate.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {rate.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {rate.notes || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditModal(rate)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        {rate.is_active && (
                          <button
                            onClick={() => handleDelete(rate.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Deactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredRates.length} of {taxRates.length} tax rates
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingRate ? 'Edit Tax Rate' : 'Add Tax Rate'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* State Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <select
                    required
                    value={formData.state_code}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a state</option>
                    {US_STATES.map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.code} - {state.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Rate (%) *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.tax_rate}
                    onChange={(e) => setFormData({ ...formData, tax_rate: e.target.value })}
                    placeholder="7.25"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Optional: County & ZIP */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    County (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.county}
                    onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                    placeholder="Los Angeles"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.zip_code}
                    onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                    placeholder="90210"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional information about this tax rate..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                  Active (tax rate will be used for calculations)
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingRate ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
