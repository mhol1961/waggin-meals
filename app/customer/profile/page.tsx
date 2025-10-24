import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCustomerFromSession } from '@/lib/customer-auth';
import CustomerProfileClient from '@/components/customer-profile-client';

export const metadata = {
  title: "Profile Settings | Waggin' Meals",
  description: "Manage your profile settings",
};

export default async function CustomerProfilePage() {
  // Check authentication
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('customer_session')?.value;

  if (!sessionToken) {
    redirect('/login');
  }

  const customer = await getCustomerFromSession(sessionToken);

  if (!customer) {
    redirect('/login');
  }

  return <CustomerProfileClient customer={customer} />;
}
