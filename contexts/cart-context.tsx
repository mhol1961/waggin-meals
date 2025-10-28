'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string; // Product ID
  cart_key: string; // Unique cart identifier (product_id or product_id-variant_id)
  handle: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  weight?: string;
  isBundle?: boolean;
  bundleDetails?: {
    selectedItems: Record<string, string[]>;
    frequency: string;
    isSubscription: boolean;
  };
  // Variant support
  variant_id?: string; // Variant ID if product has variants
  variant_title?: string; // e.g., "5lb", "10lb - Beef"
  sku?: string; // Variant SKU for tracking
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to generate unique cart item identifier
function getCartItemId(productId: string, variantId?: string): string {
  return variantId ? `${productId}-${variantId}` : productId;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('waggin-meals-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('waggin-meals-cart', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<CartItem, 'quantity' | 'cart_key'>) => {
    setItems((currentItems) => {
      // Generate cart_key if not provided
      const cartKey = getCartItemId(newItem.id, newItem.variant_id);
      const existingItem = currentItems.find((item) => item.cart_key === cartKey);

      if (existingItem) {
        return currentItems.map((item) =>
          item.cart_key === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentItems, { ...newItem, cart_key: cartKey, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (cartKey: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.cart_key !== cartKey));
  };

  const updateQuantity = (cartKey: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(cartKey);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.cart_key === cartKey ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
