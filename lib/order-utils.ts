// Order management utilities

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `WM-${timestamp}-${random}`;
}

export function calculateOrderTotal(items: any[], shippingCost: number = 0, taxRate: number = 0.08, discountAmount: number = 0) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : shippingCost;
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax - discountAmount;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    shipping: Number(shipping.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    discount: Number(discountAmount.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
}

export function getOrderStatusBadge(status: string) {
  const badges = {
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    processing: { color: 'bg-blue-100 text-blue-800', label: 'Processing' },
    shipped: { color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
    delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
    cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    refunded: { color: 'bg-gray-100 text-gray-800', label: 'Refunded' },
  };
  return badges[status as keyof typeof badges] || badges.pending;
}

export function getPaymentStatusBadge(status: string) {
  const badges = {
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    paid: { color: 'bg-green-100 text-green-800', label: 'Paid' },
    failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
    refunded: { color: 'bg-gray-100 text-gray-800', label: 'Refunded' },
  };
  return badges[status as keyof typeof badges] || badges.pending;
}
