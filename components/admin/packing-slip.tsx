'use client';

import { useEffect, useRef } from 'react';

interface OrderItem {
  id: string;
  product_name: string;
  variant_title: string | null;
  quantity: number;
}

interface ShippingAddress {
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string | null;
}

interface PackingSlipData {
  order_number: string;
  created_at: string;
  customer_first_name: string;
  customer_last_name: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  notes: string | null;
}

interface PackingSlipProps {
  order: PackingSlipData;
  onClose?: () => void;
  autoPrint?: boolean;
}

export default function PackingSlip({ order, onClose, autoPrint = false }: PackingSlipProps) {
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoPrint) {
      // Wait for content to render before printing
      setTimeout(() => {
        window.print();
      }, 100);
    }
  }, [autoPrint]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #packing-slip-content,
          #packing-slip-content * {
            visibility: visible;
          }
          #packing-slip-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .print-break {
            page-break-after: always;
          }
        }

        @page {
          margin: 0.5in;
          size: letter;
        }
      `}</style>

      {/* Screen View */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
          {/* Header Buttons */}
          <div className="no-print sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Packing Slip Preview</h2>
            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="px-6 py-2 bg-[#a5b5eb] text-white rounded-lg hover:bg-[#8a9fd9] transition-colors font-medium"
              >
                Print Packing Slip
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
              )}
            </div>
          </div>

          {/* Packing Slip Content */}
          <div id="packing-slip-content" ref={printRef} className="p-8">
            {/* Company Header */}
            <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
              <h1 className="text-3xl font-bold text-[#3c3a47] mb-2">
                Waggin' Meals
              </h1>
              <p className="text-sm text-gray-600">Premium Dog Nutrition Co.</p>
              <p className="text-lg font-semibold text-gray-800 mt-4">PACKING SLIP</p>
            </div>

            {/* Order Information */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Order Information
                </h3>
                <div className="space-y-1">
                  <p className="text-base">
                    <span className="font-semibold">Order #:</span> {order.order_number}
                  </p>
                  <p className="text-base">
                    <span className="font-semibold">Date:</span>{' '}
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Ship To
                </h3>
                <div className="text-base space-y-0.5">
                  <p className="font-semibold">
                    {order.shipping_address.first_name} {order.shipping_address.last_name}
                  </p>
                  <p>{order.shipping_address.address_line1}</p>
                  {order.shipping_address.address_line2 && (
                    <p>{order.shipping_address.address_line2}</p>
                  )}
                  <p>
                    {order.shipping_address.city}, {order.shipping_address.state}{' '}
                    {order.shipping_address.postal_code}
                  </p>
                  <p>{order.shipping_address.country}</p>
                  {order.shipping_address.phone && (
                    <p className="mt-2 text-sm text-gray-600">
                      Phone: {order.shipping_address.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                Items to Pack
              </h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-2 text-sm font-semibold text-gray-700">
                      QTY
                    </th>
                    <th className="text-left py-2 text-sm font-semibold text-gray-700">
                      Product
                    </th>
                    <th className="text-left py-2 text-sm font-semibold text-gray-700">
                      SKU / Variant
                    </th>
                    <th className="text-center py-2 text-sm font-semibold text-gray-700">
                      ☐ Packed
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="py-3 text-base font-semibold">{item.quantity}</td>
                      <td className="py-3 text-base">{item.product_name}</td>
                      <td className="py-3 text-sm text-gray-600">
                        {item.variant_title || '—'}
                      </td>
                      <td className="py-3 text-center">
                        <div className="inline-block w-6 h-6 border-2 border-gray-400 rounded"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Item Count Summary */}
              <div className="mt-4 text-right">
                <p className="text-base font-semibold text-gray-700">
                  Total Items: {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
              </div>
            </div>

            {/* Special Notes */}
            {order.notes && (
              <div className="mb-8 p-4 bg-yellow-50 border-2 border-yellow-300 rounded">
                <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">
                  ⚠️ Special Instructions
                </h3>
                <p className="text-base text-gray-900 whitespace-pre-wrap">{order.notes}</p>
              </div>
            )}

            {/* Quality Check Section */}
            <div className="border-t-2 border-gray-300 pt-6 mt-8">
              <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4">
                Quality Check
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-gray-400 rounded"></div>
                  <span className="text-base text-gray-700">
                    All items accounted for and in good condition
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-gray-400 rounded"></div>
                  <span className="text-base text-gray-700">
                    Package sealed properly
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-gray-400 rounded"></div>
                  <span className="text-base text-gray-700">
                    Shipping label attached
                  </span>
                </div>
              </div>

              {/* Signature Line */}
              <div className="mt-8 pt-6 border-t border-gray-300">
                <div className="flex justify-between items-end">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">Packed By:</p>
                    <div className="border-b-2 border-gray-400 w-64 pb-1"></div>
                    <p className="text-xs text-gray-500 mt-1">(Signature)</p>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-sm text-gray-600 mb-2">Date:</p>
                    <div className="border-b-2 border-gray-400 w-48 pb-1 ml-auto"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
              <p>Thank you for supporting Waggin' Meals!</p>
              <p className="mt-1">For questions: support@wagginmeals.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
