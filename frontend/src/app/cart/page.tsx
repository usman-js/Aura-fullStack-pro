'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    freeShippingThreshold,
    shipping,
    tax,
    total,
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'MINIMAL10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try MINIMAL10 for 10% off.');
    }
  };

  const discount = promoApplied ? subtotal * 0.1 : 0;
  const finalTotal = total - discount;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6 bg-white text-neutral-900">
        <ShoppingBag className="w-16 h-16 text-neutral-300 mx-auto stroke-1" />
        <h1 className="text-3xl font-light text-neutral-900">Your shopping bag is empty.</h1>
        <p className="text-sm font-light text-neutral-500 max-w-md mx-auto">
          Explore our collection of architectural furniture, ambient luminaires, and natural textiles.
        </p>
        <Link
          href="/products"
          className="inline-block px-8 py-4 bg-neutral-950 text-white text-xs uppercase tracking-widest font-medium hover:bg-black transition"
        >
          Discover Catalog
        </Link>
      </div>
    );
  }

  const remainingForFree = Math.max(freeShippingThreshold - subtotal, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-white text-neutral-900">
      <div className="border-b border-neutral-100 pb-6 flex justify-between items-end">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-medium">Review Bag</span>
          <h1 className="text-3xl font-light text-neutral-950 tracking-tight mt-1">
            Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-neutral-500 hover:text-rose-600 transition underline"
        >
          Clear bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Cart Items Table */}
        <div className="lg:col-span-8 space-y-6">
          {/* Free Shipping Banner */}
          <div className="p-4 bg-neutral-50 border border-neutral-100 text-xs text-neutral-600 rounded-xs">
            {remainingForFree > 0 ? (
              <span>
                Add <strong className="text-neutral-900">${remainingForFree.toFixed(2)}</strong> more to your order to unlock complimentary worldwide delivery.
              </span>
            ) : (
              <span className="text-emerald-700 font-medium">✓ You qualify for complimentary worldwide delivery!</span>
            )}
          </div>

          <div className="divide-y divide-neutral-100 border-y border-neutral-100">
            {items.map((item) => (
              <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                {/* Image & Details */}
                <div className="flex gap-4">
                  <div className="w-24 h-28 bg-neutral-100 overflow-hidden shrink-0 rounded-xs">
                    <img src={item.image} alt={item.productTitle} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <Link href={`/products/${item.productSlug}`} className="text-sm font-normal text-neutral-900 hover:underline">
                      {item.productTitle}
                    </Link>
                    <p className="text-xs text-neutral-500 font-light">{item.variantTitle}</p>
                    <p className="text-xs text-neutral-400 font-mono">SKU: {item.sku}</p>
                    <p className="text-xs font-medium text-neutral-950 pt-1">${item.unitPrice.toFixed(2)}</p>
                  </div>
                </div>

                {/* Quantity and Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <div className="flex items-center border border-neutral-200 rounded-xs">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100"
                    >
                      −
                    </button>
                    <span className="px-3 py-1.5 text-xs font-mono text-neutral-950">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100 disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-sm font-medium text-neutral-950 w-20 text-right">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.variantId)}
                    className="text-neutral-400 hover:text-rose-600 transition p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Link href="/products" className="inline-block text-xs uppercase tracking-widest text-neutral-600 hover:text-black">
            ← Continue Browsing Objects
          </Link>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-neutral-50 p-8 border border-neutral-100 rounded-xs space-y-6 h-fit">
          <h2 className="text-sm uppercase tracking-widest font-medium text-neutral-900 border-b border-neutral-200 pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs text-neutral-600 font-light">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-neutral-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Insured Shipping</span>
              <span className="font-medium text-neutral-900">
                {shipping === 0 ? 'Complimentary ($0.00)' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax (8.5%)</span>
              <span className="font-medium text-neutral-900">${tax.toFixed(2)}</span>
            </div>

            {promoApplied && (
              <div className="flex justify-between text-emerald-700 font-medium pt-1">
                <span>Promotional Discount (10%)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-base font-normal text-neutral-900 pt-3 border-t border-neutral-200">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Promo Code Form */}
          <form onSubmit={handleApplyPromo} className="space-y-2 pt-2 border-t border-neutral-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promo code (e.g. MINIMAL10)"
                className="flex-1 px-3 py-2 text-xs bg-white text-neutral-900 border border-neutral-200 focus:outline-none focus:border-black rounded-xs uppercase"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-900 text-white text-xs uppercase tracking-wider font-medium hover:bg-black rounded-xs"
              >
                Apply
              </button>
            </div>
            {promoApplied && <p className="text-xs text-emerald-700">✓ Coupon MINIMAL10 applied (-10%)</p>}
            {promoError && <p className="text-xs text-rose-600">{promoError}</p>}
          </form>

          {/* Checkout CTA */}
          <Link
            href="/checkout"
            className="w-full flex items-center justify-center space-x-2 py-4 bg-neutral-950 text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-black transition shadow-md rounded-xs"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center space-x-2 text-[11px] text-neutral-400 font-light justify-center pt-2">
            <ShieldCheck className="w-4 h-4 text-neutral-500" />
            <span>Encrypted SSL checkout & cash on delivery supported</span>
          </div>
        </div>
      </div>
    </div>
  );
}