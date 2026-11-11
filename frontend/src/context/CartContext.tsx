'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariant } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  updateQuantity: (variantId: number | string, quantity: number) => void;
  removeFromCart: (variantId: number | string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shipping: number;
  freeShippingThreshold: number;
  tax: number;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const freeShippingThreshold = 150;
  const flatShippingRate = 15;
  const taxRate = 0.085;

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('aura_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch {
      // LocalStorage unavailable
    }
    setIsInitialized(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('aura_cart', JSON.stringify(items));
      } catch {
        // LocalStorage unavailable
      }
    }
  }, [items, isInitialized]);

  const addToCart = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => String(item.variantId) === String(variant.id)
      );

      const primaryImg = product.images.find((img) => img.is_primary)?.image || product.images[0]?.image || '';
      const unitPrice = Number(variant.price);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = Math.min(updated[existingIndex].quantity + quantity, variant.stock);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      }

      const newItem: CartItem = {
        id: `${variant.id}-${Date.now()}`,
        productId: product.id,
        productTitle: product.title,
        productSlug: product.slug,
        variantId: variant.id,
        variantTitle: variant.title,
        sku: variant.sku,
        color: variant.color,
        size: variant.size,
        unitPrice,
        quantity: Math.min(quantity, variant.stock),
        image: primaryImg,
        maxStock: variant.stock,
      };

      return [...prevItems, newItem];
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (variantId: number | string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (String(item.variantId) === String(variantId)) {
          return {
            ...item,
            quantity: Math.min(quantity, item.maxStock),
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (variantId: number | string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => String(item.variantId) !== String(variantId))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : flatShippingRate;
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = subtotal + shipping + tax;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        shipping,
        freeShippingThreshold,
        tax,
        total,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
