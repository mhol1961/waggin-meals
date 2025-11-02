'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface PetProfile {
  id: string;
  name: string;
  breed: string;
  weight: string;
  body_condition: string;
  activity_level: string;
  health_goals: string;
  allergies: string;
  current_feeding: string;
  recent_health_issues: string;
}

interface ConsultationRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  current_spending: number | null;
  delivery_frequency: string;
  additional_notes: string;
  pet_profile_ids: string[];
  status: string;
  ghl_contact_id: string | null;
  ghl_synced_at: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export function ConsultationsClient() {
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [petProfiles, setPetProfiles] = useState<Record<string, PetProfile>>({});
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadConsultations();
  }, [statusFilter]);

  async function loadConsultations() {
    try {
      setLoading(true);

      // Build query
      let query = supabase
        .from('consultation_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data: consultationsData, error: consultationsError } = await query;

      if (consultationsError) {
        console.error('Error loading consultations:', consultationsError);
        return;
      }

      setConsultations(consultationsData || []);

      // Load all pet profiles
      const allPetIds = consultationsData?.flatMap(c => c.pet_profile_ids || []) || [];
      if (allPetIds.length > 0) {
        const { data: petsData, error: petsError } = await supabase
          .from('pet_profiles')
          .select('*')
          .in('id', allPetIds);

        if (!petsError && petsData) {
          const petsMap: Record<string, PetProfile> = {};
          petsData.forEach(pet => {
            petsMap[pet.id] = pet;
          });
          setPetProfiles(petsMap);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(consultationId: string, newStatus: string) {
    const { error } = await supabase
      .from('consultation_requests')
      .update({ status: newStatus })
      .eq('id', consultationId);

    if (!error) {
      loadConsultations();
    } else {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  }

  const getStatusBadgeClass = (status: string) => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold uppercase';
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'contacted':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'scheduled':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'cancelled':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-600`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading consultations...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="ml-auto text-sm text-gray-600">
            {consultations.length} {consultations.length === 1 ? 'request' : 'requests'}
          </div>
        </div>
      </div>

      {/* Consultations List */}
      <div className="space-y-4">
        {consultations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-600">No consultation requests found.</p>
          </div>
        ) : (
          consultations.map((consultation) => (
            <div
              key={consultation.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {consultation.first_name} {consultation.last_name}
                  </h3>
                  <div className="text-sm text-gray-600 mt-1 space-y-1">
                    <div>
                      <a href={`mailto:${consultation.email}`} className="text-blue-600 hover:underline">
                        {consultation.email}
                      </a>
                    </div>
                    <div>
                      <a href={`tel:${consultation.phone}`} className="text-blue-600 hover:underline">
                        {consultation.phone}
                      </a>
                    </div>
                    {consultation.address && (
                      <div className="text-gray-500">
                        {consultation.address}, {consultation.city}, {consultation.state} {consultation.zip_code}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={getStatusBadgeClass(consultation.status)}>
                    {consultation.status}
                  </span>
                  <div className="text-xs text-gray-500">
                    {new Date(consultation.created_at).toLocaleDateString()}
                  </div>
                  {consultation.ghl_synced_at ? (
                    <div className="text-xs text-green-600">✓ Synced to GHL</div>
                  ) : consultation.admin_notes?.includes('GHL Sync') ? (
                    <div className="text-xs text-red-600" title={consultation.admin_notes}>
                      ✗ GHL Sync Failed
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Pet Information */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  {consultation.pet_profile_ids.length} Pet{consultation.pet_profile_ids.length !== 1 ? 's' : ''}:
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {consultation.pet_profile_ids.map((petId) => {
                    const pet = petProfiles[petId];
                    if (!pet) return null;
                    return (
                      <div key={petId} className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-900 mb-2">{pet.name}</h5>
                        <div className="text-sm text-gray-600 space-y-1">
                          {pet.breed && <div><strong>Breed:</strong> {pet.breed}</div>}
                          {pet.weight && <div><strong>Weight:</strong> {pet.weight}</div>}
                          {pet.body_condition && <div><strong>Body Condition:</strong> {pet.body_condition}</div>}
                          {pet.activity_level && <div><strong>Activity:</strong> {pet.activity_level}</div>}
                          {pet.health_goals && (
                            <div className="mt-2">
                              <strong>Health Goals:</strong>
                              <p className="mt-1 text-gray-700">{pet.health_goals}</p>
                            </div>
                          )}
                          {pet.allergies && (
                            <div className="mt-2">
                              <strong>Allergies:</strong>
                              <p className="mt-1 text-gray-700">{pet.allergies}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Additional Info */}
              {(consultation.current_spending || consultation.delivery_frequency || consultation.additional_notes) && (
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    {consultation.current_spending && (
                      <div>
                        <strong className="text-gray-700">Current Weekly Spending:</strong>
                        <span className="ml-2 text-gray-600">${consultation.current_spending}</span>
                      </div>
                    )}
                    {consultation.delivery_frequency && (
                      <div>
                        <strong className="text-gray-700">Preferred Frequency:</strong>
                        <span className="ml-2 text-gray-600">{consultation.delivery_frequency}</span>
                      </div>
                    )}
                  </div>
                  {consultation.additional_notes && (
                    <div className="mt-3">
                      <strong className="text-gray-700 text-sm">Additional Notes:</strong>
                      <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{consultation.additional_notes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="border-t border-gray-200 pt-4 flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Update Status:</label>
                <select
                  value={consultation.status}
                  onChange={(e) => updateStatus(consultation.id, e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <a
                  href={`mailto:${consultation.email}?subject=Your Free Nutrition Consultation`}
                  className="ml-auto px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                >
                  Send Email
                </a>
                <a
                  href={`tel:${consultation.phone}`}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                >
                  Call
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
