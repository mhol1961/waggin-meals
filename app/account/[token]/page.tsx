import { notFound, redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import CustomerPortalClient from '@/components/customer-portal-client';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function CustomerPortalPage({ params }: PageProps) {
  const { token } = await params;

  // Validate token and get subscription
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      customer:customers(*)
    `)
    .eq('secure_token', token)
    .single();

  if (error || !subscription) {
    notFound();
  }

  // Check if token is expired (90 days)
  if (subscription.token_expires_at) {
    const expiresAt = new Date(subscription.token_expires_at);
    if (expiresAt < new Date()) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Link Expired</h1>
            <p className="text-gray-600 mb-6">
              This secure link has expired. Please contact us for a new link to manage your subscription.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-[#a5b5eb] text-white rounded-lg hover:bg-[#8a9fd9] transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Your Subscription
          </h1>
          <p className="text-gray-600">
            Update your payment method and subscription details
          </p>
        </div>

        <CustomerPortalClient
          subscription={subscription}
          customer={subscription.customer}
        />
      </div>
    </div>
  );
}
