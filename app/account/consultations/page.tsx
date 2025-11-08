'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

interface FreeConsultation {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  pet_profile_ids: string[];
  created_at: string;
  ghl_synced_at: string | null;
}

interface PaidConsultation {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  preferred_format: string;
  scheduled_date: string | null;
  completed_at: string | null;
  created_at: string;
  payment_completed_at: string | null;
  dogs: any[];
}

export default function ConsultationsPage() {
  const [freeConsultations, setFreeConsultations] = useState<FreeConsultation[]>([]);
  const [paidConsultations, setPaidConsultations] = useState<PaidConsultation[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return;

    // Redirect if not authenticated
    if (!user) {
      router.push('/auth/login?redirect=/account/consultations');
      return;
    }

    loadConsultations();
  }, [user, loading]);

  async function loadConsultations() {
    try {
      setDataLoading(true);

      if (!user || !user.email) {
        return;
      }

      // Load free consultations
      const { data: freeData } = await supabase
        .from('consultation_requests')
        .select('*')
        .eq('email', user.email)
        .order('created_at', { ascending: false });

      setFreeConsultations(freeData || []);

      // Load paid consultations
      const { data: paidData } = await supabase
        .from('paid_consultations')
        .select('*')
        .eq('email', user.email)
        .order('created_at', { ascending: false });

      setPaidConsultations(paidData || []);

    } catch (error) {
      console.error('Error loading consultations:', error);
    } finally {
      setDataLoading(false);
    }
  }

  function getStatusBadge(status: string) {
    const styles: Record<string, string> = {
      // Free consultation statuses
      pending: 'bg-yellow-100 text-yellow-800',
      contacted: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-gray-100 text-gray-800',
      // Paid consultation statuses
      questionnaire_pending: 'bg-orange-100 text-orange-800',
      payment_pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      reviewed: 'bg-[#8FAE8F]/100 text-[#5E8C8C]',
      scheduled: 'bg-[#5E8C8C]/10 text-[#5E8C8C]',
      delivered: 'bg-green-100 text-green-800',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace(/_/g, ' ').toUpperCase()}
      </span>
    );
  }

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading consultations...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalConsultations = freeConsultations.length + paidConsultations.length;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account"
            className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to account
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">My Consultations</h1>
          <p className="mt-1 text-sm text-gray-500">
            View your free and paid nutrition consultations
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-500">Total Consultations</div>
            <div className="text-2xl font-bold text-gray-900">{totalConsultations}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-500">Free Consultations</div>
            <div className="text-2xl font-bold text-gray-900">{freeConsultations.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-500">Paid Consultations ($395)</div>
            <div className="text-2xl font-bold text-gray-900">{paidConsultations.length}</div>
          </div>
        </div>

        {/* No consultations */}
        {totalConsultations === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No consultations yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              Get started with a free or paid nutrition consultation
            </p>
            <div className="mt-6 space-x-3">
              <Link
                href="/contact-expert"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Free Consultation
              </Link>
              <Link
                href="/nutrition-services"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                $395 Consultation
              </Link>
            </div>
          </div>
        )}

        {/* Paid Consultations ($395) */}
        {paidConsultations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Paid Consultations ($395)</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dogs
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Format
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Scheduled
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paidConsultations.map((consultation) => (
                      <tr key={consultation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(consultation.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {consultation.dogs?.map((dog: any) => dog.name).join(', ') || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {consultation.preferred_format || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getStatusBadge(consultation.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {consultation.scheduled_date
                            ? new Date(consultation.scheduled_date).toLocaleDateString()
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Free Consultations */}
        {freeConsultations.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Free Consultations</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pets
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Synced to CRM
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {freeConsultations.map((consultation) => (
                      <tr key={consultation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(consultation.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {consultation.pet_profile_ids.length} pet(s)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getStatusBadge(consultation.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {consultation.ghl_synced_at ? (
                            <span className="text-green-600">✓ Synced</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        {totalConsultations > 0 && (
          <div className="mt-8 bg-green-50 rounded-lg border border-green-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Need more help?</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Schedule another consultation or upgrade to comprehensive nutrition planning
                </p>
              </div>
              <div className="flex-shrink-0 space-x-3">
                <Link
                  href="/contact-expert"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Free Consultation
                </Link>
                <Link
                  href="/nutrition-services"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  $395 Consultation
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
