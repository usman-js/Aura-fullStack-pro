'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { X, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    freeShippingThreshold,
    shipping,
    total,
  } = useCart();

  if (!isCartOpen) return null;

  const progressPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFree = Math.max(freeShippingThreshold - subtotal, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white text-neutral-900 shadow-2xl flex flex-col">

          {/* Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-lg font-light tracking-widest uppercase text-neutral-950">
              Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-neutral-400 hover:text-black transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="px-6 py-3 bg-neutral-50 border-b border-neutral-100 text-xs text-neutral-600">
            {remainingForFree > 0 ? (
              <p>
                Add <span className="font-semibold text-neutral-950">${remainingForFree.toFixed(2)}</span> more to qualify for complimentary shipping.
              </p>
            ) : (
              <p className="text-emerald-700 font-medium">
                ✓ You have qualified for complimentary worldwide shipping!
              </p>
            )}
            <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-neutral-900 h-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <ShoppingBag className="w-12 h-12 text-neutral-300 mb-4 stroke-1" />
                <p className="text-neutral-500 font-light text-base mb-6">
                  Your shopping bag is currently empty.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-neutral-900 text-white text-xs uppercase tracking-widest hover:bg-black transition"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex space-x-4 pb-6 border-b border-neutral-100 last:border-b-0">
                  <div className="w-20 h-24 bg-neutral-100 relative shrink-0 overflow-hidden rounded-xs">
                    <img
                      src={item.image}
                      alt={item.productTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/products/${item.productSlug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-sm font-normal text-neutral-950 hover:underline line-clamp-1"
                        >
                          {item.productTitle}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.variantId)}
                          className="text-neutral-400 hover:text-rose-600 transition p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-neutral-500 font-light mt-0.5">
                        {item.variantTitle}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-neutral-200 rounded text-xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100 transition"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 font-mono text-neutral-950">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100 transition disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-medium text-neutral-950">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 space-y-4">
              <div className="space-y-1.5 text-xs text-neutral-600 font-light">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-950">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-medium text-neutral-950">
                    {shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium text-neutral-950 pt-2 border-t border-neutral-200">
                  <span>Estimated Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 bg-neutral-950 text-white py-3.5 text-xs uppercase tracking-widest hover:bg-black transition font-medium rounded-xs"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full block text-center py-2 text-xs text-neutral-600 hover:text-black transition"
                >
                  View Full Bag & Estimate Tax
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}