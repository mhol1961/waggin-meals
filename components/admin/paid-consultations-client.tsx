'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Dog {
  name: string;
  breed: string;
  age: string;
  weight: string;
  gender: string;
  spayedNeutered: string;
}

interface CurrentDiet {
  currentFood: string;
  durationOnDiet: string;
  portionSize: string;
  feedingFrequency: string;
}

interface HealthInfo {
  allergies?: string;
  sensitivities?: string;
  chronicConditions?: string;
  medications?: string;
  recentVetVisits?: string;
}

interface PaidConsultation {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city?: string;
  state?: string;
  dogs: Dog[];
  current_diet: CurrentDiet;
  health_info?: HealthInfo;
  goals: string;
  preferred_format: string;
  special_requests?: string;
  status: string;
  scheduled_date?: string;
  scheduled_duration?: number;
  consultation_notes?: string;
  meal_plan_url?: string;
  recommendations_url?: string;
  follow_up_dates?: string[];
  ghl_contact_id?: string;
  ghl_synced_at?: string;
  ghl_tags?: string[];
  assigned_to?: string;
  admin_notes?: string;
  completed_at?: string;
  questionnaire_completed_at?: string;
  payment_completed_at?: string;
  created_at: string;
  updated_at: string;
  order_id?: string;
  customer_id?: string;
  customers?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  orders?: {
    id: string;
    order_number: string;
    total: number;
    created_at: string;
  };
}

interface Props {
  initialConsultations: PaidConsultation[];
}

export default function PaidConsultationsClient({ initialConsultations }: Props) {
  const [consultations] = useState<PaidConsultation[]>(initialConsultations);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter consultations
  const filteredConsultations = useMemo(() => {
    return consultations.filter(c => {
      // Status filter
      if (statusFilter !== 'all' && c.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const fullName = `${c.first_name} ${c.last_name}`.toLowerCase();
        const dogNames = c.dogs.map(d => d.name.toLowerCase()).join(' ');

        return (
          fullName.includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.phone.includes(query) ||
          dogNames.includes(query)
        );
      }

      return true;
    });
  }, [consultations, statusFilter, searchQuery]);

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      questionnaire_pending: {
        label: 'Questionnaire Pending',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-300'
      },
      payment_pending: {
        label: 'Payment Pending',
        className: 'bg-orange-100 text-orange-800 border-orange-300'
      },
      paid: {
        label: 'Paid - Awaiting Review',
        className: 'bg-blue-100 text-blue-800 border-blue-300'
      },
      reviewed: {
        label: 'Reviewed - Ready to Schedule',
        className: 'bg-[#8FAE8F]/10 text-[#5E8C8C] border-[#8FAE8F]/40'
      },
      scheduled: {
        label: 'Scheduled',
        className: 'bg-[#5E8C8C]/10 text-[#5E8C8C] border-[#5E8C8C]/40'
      },
      completed: {
        label: 'Completed',
        className: 'bg-green-100 text-green-800 border-green-300'
      },
      delivered: {
        label: 'Delivered',
        className: 'bg-gray-100 text-gray-800 border-gray-300'
      }
    };

    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800 border-gray-300' };

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${config.className}`}>
        {config.label}
      </span>
    );
  };

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: consultations.length,
      questionnaire_pending: 0,
      payment_pending: 0,
      paid: 0,
      reviewed: 0,
      scheduled: 0,
      completed: 0,
      delivered: 0,
    };

    consultations.forEach(c => {
      counts[c.status] = (counts[c.status] || 0) + 1;
    });

    return counts;
  }, [consultations]);

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name, email, phone, or dog name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'paid', label: 'New (Paid)' },
              { value: 'reviewed', label: 'Ready to Schedule' },
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'completed', label: 'Completed' },
              { value: 'delivered', label: 'Delivered' },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  statusFilter === filter.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
                <span className="ml-2 text-xs opacity-75">
                  ({statusCounts[filter.value] || 0})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Consultations table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredConsultations.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg mb-2">No consultations found</p>
            <p className="text-sm">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'New consultations will appear here'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dog(s)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Format
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredConsultations.map((consultation) => (
                  <tr key={consultation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {consultation.first_name} {consultation.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{consultation.email}</div>
                        <div className="text-sm text-gray-500">{consultation.phone}</div>
                        {consultation.city && consultation.state && (
                          <div className="text-xs text-gray-400">
                            {consultation.city}, {consultation.state}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {consultation.dogs.map((dog, idx) => (
                          <div key={idx} className="mb-1">
                            <span className="font-medium">{dog.name}</span>
                            <span className="text-gray-500 text-xs ml-1">
                              ({dog.breed}, {dog.age})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(consultation.status)}
                      {consultation.ghl_synced_at && (
                        <div className="mt-1 text-xs text-green-600">
                          ✓ Synced to GHL
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                      {consultation.preferred_format || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDistanceToNow(new Date(consultation.created_at), {
                        addSuffix: true,
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <Link
                        href={`/admin/paid-consultations/${consultation.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Consultations</div>
          <div className="text-2xl font-bold text-gray-900">{consultations.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Awaiting Review</div>
          <div className="text-2xl font-bold text-blue-600">{statusCounts.paid || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Scheduled</div>
          <div className="text-2xl font-bold text-[#5E8C8C]">{statusCounts.scheduled || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Completed</div>
          <div className="text-2xl font-bold text-green-600">
            {(statusCounts.completed || 0) + (statusCounts.delivered || 0)}
          </div>
        </div>
      </div>
    </div>
  );
}
