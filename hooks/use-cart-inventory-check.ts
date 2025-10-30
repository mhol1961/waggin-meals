/**
 * Cart Inventory Check Hook
 *
 * Validates cart items against current inventory before checkout
 */

import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/cart-context';

interface InventoryIssue {
  cart_key: string;
  title: string;
  variant_title?: string;
  requested: number;
  available: number;
  reason: string;
}

interface CartInventoryCheck {
  isValid: boolean;
  issues: InventoryIssue[];
  isChecking: boolean;
  checkInventory: () => Promise<void>;
}

export function useCartInventoryCheck(): CartInventoryCheck {
  const { items } = useCart();
  const [isValid, setIsValid] = useState(true);
  const [issues, setIssues] = useState<InventoryIssue[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const checkInventory = async () => {
    if (items.length === 0) {
      setIsValid(true);
      setIssues([]);
      return;
    }

    setIsChecking(true);
    try {
      // Check availability for all cart items
      const cartItems = items.map(item => ({
        productId: item.id,
        variantId: item.variant_id || null,
        quantity: item.quantity,
      }));

      const response = await fetch('/api/inventory/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // For multiple items, we need to check each one
      const checks = await Promise.all(
        cartItems.map(async (cartItem) => {
          const params = new URLSearchParams({
            productId: cartItem.productId,
            quantity: cartItem.quantity.toString(),
          });

          if (cartItem.variantId) {
            params.append('variantId', cartItem.variantId);
          }

          const res = await fetch(`/api/inventory/status?${params}`);
          const availability = await res.json();

          return {
            ...availability,
            productId: cartItem.productId,
            variantId: cartItem.variantId,
          };
        })
      );

      // Find items with issues
      const problemItems: InventoryIssue[] = [];

      checks.forEach((check) => {
        if (!check.available) {
          const item = items.find(
            (i) =>
              i.id === check.productId &&
              (i.variant_id || null) === (check.variantId || null)
          );

          if (item) {
            problemItems.push({
              cart_key: item.cart_key,
              title: item.title,
              variant_title: item.variant_title,
              requested: check.requested_quantity || item.quantity,
              available: check.current_quantity || 0,
              reason: check.reason || 'Out of stock',
            });
          }
        }
      });

      setIssues(problemItems);
      setIsValid(problemItems.length === 0);
    } catch (error) {
      console.error('Error checking cart inventory:', error);
      // On error, assume valid to not block checkout
      setIsValid(true);
      setIssues([]);
    } finally {
      setIsChecking(false);
    }
  };

  // Check inventory when cart changes
  useEffect(() => {
    checkInventory();
  }, [items]);

  return {
    isValid,
    issues,
    isChecking,
    checkInventory,
  };
}
