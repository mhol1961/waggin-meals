'use client';

import { Package, AlertCircle, CheckCircle } from 'lucide-react';

interface StockStatusBadgeProps {
  quantity: number;
  lowStockThreshold?: number;
  trackInventory: boolean;
  allowBackorder?: boolean;
  showQuantity?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function StockStatusBadge({
  quantity,
  lowStockThreshold = 5,
  trackInventory,
  allowBackorder = false,
  showQuantity = false,
  size = 'md',
}: StockStatusBadgeProps) {
  // If inventory is not tracked, always show "In Stock"
  if (!trackInventory) {
    return (
      <div className={`flex items-center gap-2 ${getSizeClasses(size)}`}>
        <CheckCircle className={`${getIconSize(size)} text-green-600`} />
        <span className="text-green-700 font-medium">In Stock</span>
      </div>
    );
  }

  // Out of stock
  if (quantity <= 0) {
    if (allowBackorder) {
      return (
        <div className={`flex items-center gap-2 ${getSizeClasses(size)}`}>
          <Package className={`${getIconSize(size)} text-yellow-600`} />
          <span className="text-yellow-700 font-medium">Available on Backorder</span>
        </div>
      );
    }
    return (
      <div className={`flex items-center gap-2 ${getSizeClasses(size)}`}>
        <AlertCircle className={`${getIconSize(size)} text-red-600`} />
        <span className="text-red-700 font-bold">Out of Stock</span>
      </div>
    );
  }

  // Low stock
  if (quantity <= lowStockThreshold) {
    return (
      <div className={`flex items-center gap-2 ${getSizeClasses(size)}`}>
        <AlertCircle className={`${getIconSize(size)} text-orange-600`} />
        <span className="text-orange-700 font-medium">
          Low Stock {showQuantity && `(${quantity} remaining)`}
        </span>
      </div>
    );
  }

  // In stock
  return (
    <div className={`flex items-center gap-2 ${getSizeClasses(size)}`}>
      <CheckCircle className={`${getIconSize(size)} text-green-600`} />
      <span className="text-green-700 font-medium">
        In Stock {showQuantity && quantity <= 10 && `(${quantity} available)`}
      </span>
    </div>
  );
}

function getSizeClasses(size: 'sm' | 'md' | 'lg'): string {
  switch (size) {
    case 'sm':
      return 'text-xs';
    case 'lg':
      return 'text-lg';
    default:
      return 'text-sm';
  }
}

function getIconSize(size: 'sm' | 'md' | 'lg'): string {
  switch (size) {
    case 'sm':
      return 'w-3 h-3';
    case 'lg':
      return 'w-6 h-6';
    default:
      return 'w-4 h-4';
  }
}
