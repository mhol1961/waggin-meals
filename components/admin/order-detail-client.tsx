'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PackingSlip from './packing-slip';

interface OrderItem {
  id: string;
  product_name: string;
  product_handle: string;
  variant_title: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  image_url: string | null;
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

interface Order {
  id: string;
  order_number: string;
  status: string;
  customer_email: string;
  customer_first_name: string;
  customer_last_name: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  payment_status: string;
  payment_intent_id: string | null;
  notes: string | null;
  tracking_number: string | null;
  carrier: string | null;
  shipped_at: string | null;
  created_at: string;
  updated_at: string;
  order_type?: string;
}

const ORDER_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
  'canceled',
  'refunded'
];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  out_for_delivery: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  canceled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800'
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  canceled: 'Canceled',
  refunded: 'Refunded'
};

export default function OrderDetailClient({ order: initialOrder }: { order: Order }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order>(initialOrder);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState(order.notes || '');
  const [showNotesEdit, setShowNotesEdit] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('USPS');
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [showPackingSlip, setShowPackingSlip] = useState(false);
  const [packingSlipAutoPrint, setPackingSlipAutoPrint] = useState(false);
  const [showPrintMenu, setShowPrintMenu] = useState(false);
  const [orderType, setOrderType] = useState(order.order_type || 'standard');
  const [showOrderTypeEdit, setShowOrderTypeEdit] = useState(false);

  const updateOrderStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update order');

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      router.refresh();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const updateOrderNotes = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });

      if (!response.ok) throw new Error('Failed to update notes');

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      setShowNotesEdit(false);
      router.refresh();
    } catch (error) {
      console.error('Error updating notes:', error);
      alert('Failed to update order notes');
    } finally {
      setIsUpdating(false);
    }
  };

  const updateOrderType = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_type: orderType })
      });

      if (!response.ok) throw new Error('Failed to update order type');

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      setShowOrderTypeEdit(false);
      router.refresh();
    } catch (error) {
      console.error('Error updating order type:', error);
      alert('Failed to update order type');
    } finally {
      setIsUpdating(false);
    }
  };

  const addTrackingNumber = async () => {
    if (!trackingNumber.trim()) {
      alert('Please enter a tracking number');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/shipping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracking_number: trackingNumber, carrier })
      });

      if (!response.ok) throw new Error('Failed to add tracking number');

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      setShowShippingForm(false);
      setTrackingNumber('');
      alert('Tracking number added and shipping notification sent!');
      router.refresh();
    } catch (error) {
      console.error('Error adding tracking number:', error);
      alert('Failed to add tracking number');
    } finally {
      setIsUpdating(false);
    }
  };

  const getTrackingUrl = (carrier: string | null, trackingNumber: string) => {
    const tracking = encodeURIComponent(trackingNumber);

    switch (carrier?.toUpperCase()) {
      case 'USPS':
        return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${tracking}`;
      case 'UPS':
        return `https://www.ups.com/track?tracknum=${tracking}`;
      case 'FEDEX':
        return `https://www.fedex.com/fedextrack/?trknbr=${tracking}`;
      case 'DHL':
        return `https://www.dhl.com/en/express/tracking.html?AWB=${tracking}`;
      default:
        // Generic Google search for unknown carriers
        return `https://www.google.com/search?q=${tracking}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Order #{order.order_number}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Placed {new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowPrintMenu(!showPrintMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#a5b5eb] text-[#a5b5eb] rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Packing Slip
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showPrintMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowPrintMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <button
                      onClick={() => {
                        setPackingSlipAutoPrint(false);
                        setShowPackingSlip(true);
                        setShowPrintMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <div className="font-medium text-sm">Preview & Print</div>
                      <div className="text-xs text-gray-500">Review before printing</div>
                    </button>
                    <button
                      onClick={() => {
                        setPackingSlipAutoPrint(true);
                        setShowPackingSlip(true);
                        setShowPrintMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <div className="font-medium text-sm">Quick Print</div>
                      <div className="text-xs text-gray-500">Print immediately</div>
                    </button>
                  </div>
                </>
              )}
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[order.status]}`}>
              {STATUS_LABELS[order.status] || order.status}
            </span>
          </div>
        </div>

        {/* Status Update */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Update Status
          </label>
          <div className="flex gap-2 flex-wrap">
            {ORDER_STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => updateOrderStatus(status)}
                disabled={isUpdating || order.status === status}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  order.status === status
                    ? 'bg-[#a5b5eb] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                {STATUS_LABELS[status] || status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-base text-gray-900">
              {order.customer_first_name} {order.customer_last_name}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-base text-gray-900">{order.customer_email}</p>
          </div>
        </div>
      </div>

      {/* Order Type */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Order Type</h3>
          <button
            onClick={() => setShowOrderTypeEdit(!showOrderTypeEdit)}
            className="text-sm text-[#a5b5eb] hover:text-[#8a9fd9] font-medium"
          >
            {showOrderTypeEdit ? 'Cancel' : 'Edit'}
          </button>
        </div>
        {showOrderTypeEdit ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  value="standard"
                  checked={orderType === 'standard'}
                  onChange={(e) => setOrderType(e.target.value)}
                  className="w-4 h-4 text-[#a5b5eb]"
                />
                <div>
                  <div className="font-medium text-gray-900">Standard Shipping</div>
                  <div className="text-sm text-gray-500">Regular mail delivery</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  value="local_delivery"
                  checked={orderType === 'local_delivery'}
                  onChange={(e) => setOrderType(e.target.value)}
                  className="w-4 h-4 text-[#a5b5eb]"
                />
                <div>
                  <div className="font-medium text-gray-900">Local Delivery</div>
                  <div className="text-sm text-gray-500">Hand-delivered to local customers</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  value="pickup"
                  checked={orderType === 'pickup'}
                  onChange={(e) => setOrderType(e.target.value)}
                  className="w-4 h-4 text-[#a5b5eb]"
                />
                <div>
                  <div className="font-medium text-gray-900">Customer Pickup</div>
                  <div className="text-sm text-gray-500">Customer will pick up order</div>
                </div>
              </label>
            </div>
            <button
              onClick={updateOrderType}
              disabled={isUpdating}
              className="px-6 py-2 bg-[#a5b5eb] text-white rounded-lg hover:bg-[#8a9fd9] transition-colors disabled:opacity-50"
            >
              {isUpdating ? 'Saving...' : 'Save Order Type'}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {orderType === 'local_delivery' && (
              <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                🚗 Local Delivery
              </span>
            )}
            {orderType === 'pickup' && (
              <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                📦 Customer Pickup
              </span>
            )}
            {orderType === 'standard' && (
              <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                📮 Standard Shipping
              </span>
            )}
          </div>
        )}
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
        <div className="text-base text-gray-900 space-y-1">
          <p>
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

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.product_name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                {item.variant_title && (
                  <p className="text-sm text-gray-600">{item.variant_title}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  ${item.total_price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  ${item.unit_price.toFixed(2)} each
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Totals */}
        <div className="mt-6 pt-6 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="text-gray-900">${order.shipping_cost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span className="text-gray-900">${order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold pt-2 border-t">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Payment Status</span>
            <span className={`text-sm font-medium ${
              order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
            </span>
          </div>
          {order.payment_intent_id && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Payment Intent ID</span>
              <span className="text-sm text-gray-900 font-mono">
                {order.payment_intent_id}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Shipping Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Shipping Information</h3>
          {order.status !== 'shipped' && order.status !== 'delivered' && !showShippingForm && (
            <button
              onClick={() => setShowShippingForm(true)}
              className="text-sm text-[#a5b5eb] hover:text-[#8a9fd9] font-medium"
            >
              Add Tracking
            </button>
          )}
        </div>

        {showShippingForm ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carrier
              </label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#a5b5eb]"
              >
                <option value="USPS">USPS</option>
                <option value="UPS">UPS</option>
                <option value="FedEx">FedEx</option>
                <option value="DHL">DHL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tracking Number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#a5b5eb]"
                placeholder="Enter tracking number"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={addTrackingNumber}
                disabled={isUpdating}
                className="px-6 py-2 bg-[#a5b5eb] text-white rounded-lg hover:bg-[#8a9fd9] transition-colors disabled:opacity-50"
              >
                {isUpdating ? 'Sending...' : 'Add Tracking & Notify Customer'}
              </button>
              <button
                onClick={() => {
                  setShowShippingForm(false);
                  setTrackingNumber('');
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="text-gray-700">
            {order.tracking_number ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Order Shipped</span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Tracking Number</p>
                      <p className="text-base font-mono text-gray-900 mt-1">{order.tracking_number}</p>
                    </div>
                    <a
                      href={getTrackingUrl(order.carrier, order.tracking_number)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#a5b5eb] hover:text-[#8a9fd9] font-medium flex items-center gap-1"
                    >
                      Track Package
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>

                  {order.carrier && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Carrier</p>
                      <p className="text-base text-gray-900">{order.carrier}</p>
                    </div>
                  )}

                  {order.shipped_at && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Shipped On</p>
                      <p className="text-base text-gray-900">
                        {new Date(order.shipped_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No tracking information yet</p>
            )}
          </div>
        )}
      </div>

      {/* Order Notes */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Order Notes</h3>
          <button
            onClick={() => setShowNotesEdit(!showNotesEdit)}
            className="text-sm text-[#a5b5eb] hover:text-[#8a9fd9] font-medium"
          >
            {showNotesEdit ? 'Cancel' : 'Edit'}
          </button>
        </div>
        {showNotesEdit ? (
          <div className="space-y-3">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#a5b5eb]"
              placeholder="Add notes about this order..."
            />
            <button
              onClick={updateOrderNotes}
              disabled={isUpdating}
              className="px-6 py-2 bg-[#a5b5eb] text-white rounded-lg hover:bg-[#8a9fd9] transition-colors disabled:opacity-50"
            >
              {isUpdating ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        ) : (
          <p className="text-gray-700">
            {order.notes || 'No notes added yet.'}
          </p>
        )}
      </div>

      {/* Packing Slip Modal */}
      {showPackingSlip && (
        <PackingSlip
          order={order}
          autoPrint={packingSlipAutoPrint}
          onClose={() => {
            setShowPackingSlip(false);
            setPackingSlipAutoPrint(false);
          }}
        />
      )}
    </div>
  );
}
