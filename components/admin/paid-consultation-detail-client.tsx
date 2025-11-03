'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';

interface Dog {
  name: string;
  breed: string;
  age: string;
  weight: string;
  gender: string;
  spayedNeutered: string;
}

interface Consultation {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city?: string;
  state?: string;
  dogs: Dog[];
  current_diet: {
    currentFood: string;
    durationOnDiet: string;
    portionSize: string;
    feedingFrequency: string;
  };
  health_info?: {
    allergies?: string;
    sensitivities?: string;
    chronicConditions?: string;
    medications?: string;
    recentVetVisits?: string;
  };
  goals: string;
  preferred_format: string;
  special_requests?: string;
  status: string;
  scheduled_date?: string;
  scheduled_duration?: number;
  consultation_notes?: string;
  admin_notes?: string;
  payment_completed_at?: string;
  created_at: string;
  orders?: any;
}

interface Props {
  consultation: Consultation;
}

export default function PaidConsultationDetailClient({ consultation: initialConsultation }: Props) {
  const [consultation, setConsultation] = useState(initialConsultation);
  const [status, setStatus] = useState(consultation.status);
  const [scheduledDate, setScheduledDate] = useState(consultation.scheduled_date || '');
  const [consultationNotes, setConsultationNotes] = useState(consultation.consultation_notes || '');
  const [adminNotes, setAdminNotes] = useState(consultation.admin_notes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      const response = await fetch(`/api/admin/paid-consultations/${consultation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          scheduled_date: scheduledDate || null,
          consultation_notes: consultationNotes,
          admin_notes: adminNotes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setConsultation(data.consultation);
        setSaveMessage('✓ Changes saved successfully');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('✗ Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving:', error);
      setSaveMessage('✗ Error saving changes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Link href="/admin/paid-consultations" className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block">
            ← Back to All Consultations
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {consultation.first_name} {consultation.last_name}
          </h1>
          <p className="text-gray-600 mt-1">
            Submitted {formatDistanceToNow(new Date(consultation.created_at), { addSuffix: true })}
          </p>
        </div>
        <div className="text-right">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          {saveMessage && (
            <p className={`text-sm mt-2 ${saveMessage.startsWith('✓') ? 'text-green-600' : 'text-red-600'}`}>
              {saveMessage}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status & Scheduling */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Status & Scheduling</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="paid">Paid - Awaiting Review</option>
                  <option value="reviewed">Reviewed - Ready to Schedule</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scheduled Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Dog Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Dog Information</h2>
            {consultation.dogs.map((dog, idx) => (
              <div key={idx} className="mb-4 pb-4 border-b border-gray-200 last:border-0">
                <h3 className="font-semibold text-lg mb-2">{dog.name}</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Breed:</span> {dog.breed}</div>
                  <div><span className="text-gray-500">Age:</span> {dog.age}</div>
                  <div><span className="text-gray-500">Weight:</span> {dog.weight}</div>
                  <div><span className="text-gray-500">Gender:</span> {dog.gender}</div>
                  <div><span className="text-gray-500">Spayed/Neutered:</span> {dog.spayedNeutered}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Current Diet */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Current Diet</h2>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Current Food:</span> {consultation.current_diet.currentFood}</div>
              <div><span className="font-medium">Duration on Diet:</span> {consultation.current_diet.durationOnDiet}</div>
              <div><span className="font-medium">Portion Size:</span> {consultation.current_diet.portionSize}</div>
              <div><span className="font-medium">Feeding Frequency:</span> {consultation.current_diet.feedingFrequency}</div>
            </div>
          </div>

          {/* Health Information */}
          {consultation.health_info && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Health Information</h2>
              <div className="space-y-3 text-sm">
                {consultation.health_info.allergies && (
                  <div>
                    <span className="font-medium block mb-1">Allergies:</span>
                    <p className="text-gray-700">{consultation.health_info.allergies}</p>
                  </div>
                )}
                {consultation.health_info.sensitivities && (
                  <div>
                    <span className="font-medium block mb-1">Sensitivities:</span>
                    <p className="text-gray-700">{consultation.health_info.sensitivities}</p>
                  </div>
                )}
                {consultation.health_info.chronicConditions && (
                  <div>
                    <span className="font-medium block mb-1">Chronic Conditions:</span>
                    <p className="text-gray-700">{consultation.health_info.chronicConditions}</p>
                  </div>
                )}
                {consultation.health_info.medications && (
                  <div>
                    <span className="font-medium block mb-1">Medications:</span>
                    <p className="text-gray-700">{consultation.health_info.medications}</p>
                  </div>
                )}
                {consultation.health_info.recentVetVisits && (
                  <div>
                    <span className="font-medium block mb-1">Recent Vet Visits:</span>
                    <p className="text-gray-700">{consultation.health_info.recentVetVisits}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Goals */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Goals</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{consultation.goals}</p>
          </div>

          {/* Special Requests */}
          {consultation.special_requests && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Special Requests</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{consultation.special_requests}</p>
            </div>
          )}

          {/* Consultation Notes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Consultation Notes</h2>
            <textarea
              value={consultationNotes}
              onChange={(e) => setConsultationNotes(e.target.value)}
              rows={6}
              placeholder="Add notes from your consultation with the client..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Admin Notes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Admin Notes (Internal)</h2>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              placeholder="Internal admin notes (not visible to customer)..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500 block">Email</span>
                <a href={`mailto:${consultation.email}`} className="text-blue-600 hover:underline">
                  {consultation.email}
                </a>
              </div>
              <div>
                <span className="text-gray-500 block">Phone</span>
                <a href={`tel:${consultation.phone}`} className="text-blue-600 hover:underline">
                  {consultation.phone}
                </a>
              </div>
              {consultation.city && consultation.state && (
                <div>
                  <span className="text-gray-500 block">Location</span>
                  <p>{consultation.city}, {consultation.state}</p>
                </div>
              )}
              <div>
                <span className="text-gray-500 block">Preferred Format</span>
                <p className="capitalize">{consultation.preferred_format || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Order Info */}
          {consultation.orders && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Order Information</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500 block">Order #</span>
                  <Link
                    href={`/admin/orders/${consultation.orders.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {consultation.orders.order_number}
                  </Link>
                </div>
                <div>
                  <span className="text-gray-500 block">Amount Paid</span>
                  <p className="font-semibold">${consultation.orders.total.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-gray-500 block">Payment Date</span>
                  <p>{format(new Date(consultation.payment_completed_at || consultation.orders.created_at), 'MMM d, yyyy')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <a
                href={`mailto:${consultation.email}?subject=Re: Your Nutrition Consultation`}
                className="block w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-center text-sm"
              >
                Send Email
              </a>
              <a
                href={`tel:${consultation.phone}`}
                className="block w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-center text-sm"
              >
                Call Customer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
