'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';
import { ArrowLeft, Plus, MapPin } from 'lucide-react';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUserAndLoadAddresses();
  }, []);

  const checkUserAndLoadAddresses = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    // Load addresses from database (implement when ready)
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e8f4fb]">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-[#a5b5eb] hover:text-[#8a9fd9] mb-8"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1
            className="text-4xl font-normal text-[#3c3a47]"
            style={{ fontFamily: "'Abril Fatface', serif" }}
          >
            Shipping Addresses
          </h1>
          <button
            className="flex items-center gap-2 bg-gradient-to-r from-[#a5b5eb] to-[#c5d4f7] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <Plus className="w-5 h-5" />
            Add Address
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a5b5eb] mx-auto"></div>
          </div>
        ) : addresses.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {addresses.map((address: any) => (
              <div key={address.id} className="bg-white rounded-lg p-6 shadow-lg">
                {/* Address details */}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
            <MapPin className="w-16 h-16 text-[#a5b5eb] mx-auto mb-4" />
            <h3
              className="text-xl font-bold text-[#3c3a47] mb-2"
              style={{ fontFamily: "'Abril Fatface', serif" }}
            >
              No Addresses Saved
            </h3>
            <p
              className="text-[#666666] mb-6"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Add a shipping address to make checkout faster!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
