'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { CartItem } from '@/types';
import { CheckCircle2, ShieldCheck, CreditCard, Banknote, ArrowRight } from 'lucide-react';

interface ConfirmedOrder {
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  shippingMethod: string;
  createdAt: string;
}

export default function CheckoutPage() {
  const { items, subtotal, shipping, tax, total, clearCart } = useCart();

  // Form State
  const [formData, setFormData] = useState({
    email: 'customer@example.com',
    fullName: 'Sophia Sterling',
    phone: '+1 (415) 555-0142',
    street1: '450 Sutter St, Suite 800',
    street2: '',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94108',
    country: 'United States',
    shippingMethod: 'standard', // standard | express
    paymentMethod: 'COD', // COD | CARD
    notes: 'Please leave with concierge if unavailable.',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<ConfirmedOrder | null>(null);

  const expressShippingAdd = formData.shippingMethod === 'express' ? 25 : 0;
  const grandTotal = total + expressShippingAdd;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate atomic order placement
    setTimeout(() => {
      const confirmedOrder = {
        orderNumber: `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100000 + Math.random() * 900000)}`,
        items: [...items],
        subtotal,
        shipping: shipping + expressShippingAdd,
        tax,
        total: grandTotal,
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: `${formData.street1}, ${formData.city}, ${formData.state} ${formData.postalCode}, ${formData.country}`,
        paymentMethod: formData.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Secure Online Payment',
        shippingMethod: formData.shippingMethod === 'express' ? 'Express White-Glove Delivery' : 'Standard Insured Freight',
        createdAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      };

      setOrderConfirmed(confirmedOrder);
      clearCart();
      setIsSubmitting(false);
    }, 1200);
  };

  // Order Confirmation Screen
  if (orderConfirmed) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-10 bg-white text-neutral-900">
        <div className="text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-neutral-950 mx-auto stroke-1" />
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-400 font-medium">Order Confirmed</span>
          <h1 className="text-3xl sm:text-4xl font-light text-neutral-950 tracking-tight">
            Thank you for your order, {orderConfirmed.customerName.split(' ')[0]}.
          </h1>
          <p className="text-sm font-light text-neutral-500">
            A confirmation email and tracking link have been dispatched to <strong className="text-neutral-950">{orderConfirmed.customerEmail}</strong>.
          </p>
        </div>

        <div className="bg-neutral-50 p-8 border border-neutral-200/80 rounded-xs space-y-6">
          <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
            <div>
              <span className="text-xs text-neutral-400 font-light block">Order Reference</span>
              <span className="font-mono text-sm font-medium text-neutral-950">{orderConfirmed.orderNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-400 font-light block">Date</span>
              <span className="text-sm text-neutral-950">{orderConfirmed.createdAt}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-neutral-600 font-light">
            <div>
              <h4 className="font-medium text-neutral-950 uppercase tracking-wider mb-1">Destination Address</h4>
              <p>{orderConfirmed.shippingAddress}</p>
              <p className="mt-1">Contact: {orderConfirmed.customerPhone}</p>
            </div>
            <div>
              <h4 className="font-medium text-neutral-950 uppercase tracking-wider mb-1">Fulfillment Details</h4>
              <p>Method: {orderConfirmed.shippingMethod}</p>
              <p>Payment: {orderConfirmed.paymentMethod}</p>
              <p className="text-emerald-700 font-medium mt-1">Status: Confirmed / In Preparation</p>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="border-t border-neutral-200 pt-4 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-medium text-neutral-950">Purchased Objects</h4>
            <div className="divide-y divide-neutral-200/60">
              {orderConfirmed.items.map((item: CartItem) => (
                <div key={item.id} className="py-2.5 flex justify-between text-xs">
                  <div>
                    <span className="text-neutral-950 font-medium">{item.productTitle}</span>
                    <span className="text-neutral-500 ml-2">({item.variantTitle}) × {item.quantity}</span>
                  </div>
                  <span className="text-neutral-950 font-mono">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-neutral-200 pt-4 space-y-1.5 text-xs text-neutral-600 font-light">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-neutral-950 font-medium">${orderConfirmed.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="text-neutral-950 font-medium">
                {orderConfirmed.shipping === 0 ? 'Complimentary ($0.00)' : `$${orderConfirmed.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax</span>
              <span className="text-neutral-950 font-medium">${orderConfirmed.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-normal text-neutral-950 pt-2 border-t border-neutral-200">
              <span>Total Paid / Due</span>
              <span>${orderConfirmed.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link
            href="/products"
            className="inline-block px-8 py-4 bg-neutral-950 text-white text-xs uppercase tracking-widest font-medium hover:bg-black transition"
          >
            Return to Storefront
          </Link>
        </div>
      </div>
    );
  }

  // If bag is empty during checkout
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4 bg-white text-neutral-900">
        <h1 className="text-2xl font-light text-neutral-950">No objects to checkout.</h1>
        <p className="text-xs text-neutral-500">Your shopping bag is currently empty.</p>
        <Link href="/products" className="inline-block text-xs uppercase tracking-widest text-neutral-950 underline">
          Explore the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-white text-neutral-900">
      <div className="border-b border-neutral-100 pb-4">
        <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-medium">Secure Checkout</span>
        <h1 className="text-3xl font-light text-neutral-950 tracking-tight mt-1">
          Finalize Order
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Left Form: Customer & Shipping Details */}
        <div className="lg:col-span-7 space-y-10">

          {/* 1. Customer Information */}
          <div className="space-y-4">
            <h2 className="text-sm uppercase tracking-widest font-medium text-neutral-950">
              1. Customer Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-neutral-600 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-neutral-50 text-neutral-900 border border-neutral-200 focus:outline-none focus:border-black rounded-xs"
                />
              </div>
              <div>
                <label className="block text-neutral-600 mb-1">Email Address (for receipt)</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-neutral-50 text-neutral-900 border border-neutral-200 focus:outline-none focus:border-black rounded-xs"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-neutral-600 mb-1">Phone Number (delivery notifications)</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-neutral-50 text-neutral-900 border border-neutral-200 focus:outline-none focus:border-black rounded-xs"
                />
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="space-y-4 border-t border-neutral-100 pt-8">
            <h2 className="text-sm uppercase tracking-widest font-medium text-neutral-950">
              2. Shipping Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-neutral-600 mb-1">Street Address</label>
                <input
                  type="text"
                  name="street1"
                  required
                  value={formData.street1}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-neutral-50 text-neutral-900 border border-neutral-200 focus:outline-none focus:border-black rounded-xs"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-neutral-600 mb-1">Apartment, Suite, Unit (optional)</label>
                <input
                  type="text"
                  name="street2"
                  value={formData.street2}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-neutral-50 text-neutral-900 border border-neutral-200 focus:outline-none focus:border-black rounded-xs"
                />
              </div>
              <div>
                <label className="block text-neutral-600 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-neutral-50 text-neutral-900 border border-neutral-200 focus:outline-none focus:border-black rounded-xs"
                />
              </div>
              <div>
                <label className="block text-neutral-600 mb-1">State / Province</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-neutral-50 text-neutral-900 border border-neutral-200 focus:outline-none focus:border-black rounded-xs"
                />
              </div>
              <div>
                <label className="block text-neutral-600 mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-neutral-50 text-neutral-900 border border-neutral-200 focus:outline-none focus:border-black rounded-xs"
                />
              </div>
              <div>
                <label className="block text-neutral-600 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-neutral-50 text-neutral-900 border border-neutral-200 focus:outline-none focus:border-black rounded-xs"
                />
              </div>
            </div>
          </div>

          {/* 3. Delivery Method */}
          <div className="space-y-4 border-t border-neutral-100 pt-8">
            <h2 className="text-sm uppercase tracking-widest font-medium text-neutral-950">
              3. Delivery Method
            </h2>
            <div className="space-y-3 text-xs">
              <label
                className={`flex items-center justify-between p-4 border rounded-xs cursor-pointer transition ${
                  formData.shippingMethod === 'standard'
                    ? 'border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950'
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="standard"
                    checked={formData.shippingMethod === 'standard'}
                    onChange={handleChange}
                    className="text-black focus:ring-black"
                  />
                  <div>
                    <span className="font-medium text-neutral-950">Standard Insured Freight</span>
                    <p className="text-neutral-500 font-light mt-0.5">3-5 business days. Curbside delivery.</p>
                  </div>
                </div>
                <span className="font-medium text-neutral-950">
                  {shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}
                </span>
              </label>

              <label
                className={`flex items-center justify-between p-4 border rounded-xs cursor-pointer transition ${
                  formData.shippingMethod === 'express'
                    ? 'border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950'
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="express"
                    checked={formData.shippingMethod === 'express'}
                    onChange={handleChange}
                    className="text-black focus:ring-black"
                  />
                  <div>
                    <span className="font-medium text-neutral-950">Express White-Glove Installation</span>
                    <p className="text-neutral-500 font-light mt-0.5">1-2 business days. Room-of-choice placement & uncrating.</p>
                  </div>
                </div>
                <span className="font-medium text-neutral-950">+$25.00</span>
              </label>
            </div>
          </div>

          {/* 4. Payment Method */}
          <div className="space-y-4 border-t border-neutral-100 pt-8">
            <h2 className="text-sm uppercase tracking-widest font-medium text-neutral-950">
              4. Payment Method
            </h2>
            <div className="space-y-3 text-xs">
              <label
                className={`flex items-start space-x-3 p-4 border rounded-xs cursor-pointer transition ${
                  formData.paymentMethod === 'COD'
                    ? 'border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950'
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={handleChange}
                  className="mt-0.5 text-black focus:ring-black"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Banknote className="w-4 h-4 text-neutral-700" />
                    <span className="font-medium text-neutral-950">Cash on Delivery (COD)</span>
                  </div>
                  <p className="text-neutral-500 font-light mt-1">
                    Pay securely upon delivery receipt by cash or debit terminal. Zero upfront fees.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start space-x-3 p-4 border rounded-xs cursor-pointer transition ${
                  formData.paymentMethod === 'CARD'
                    ? 'border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950'
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CARD"
                  checked={formData.paymentMethod === 'CARD'}
                  onChange={handleChange}
                  className="mt-0.5 text-black focus:ring-black"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-neutral-700" />
                    <span className="font-medium text-neutral-950">Credit / Debit Card (Online Gateway Simulation)</span>
                  </div>
                  <p className="text-neutral-500 font-light mt-1">
                    End-to-end tokenized payment interface. Raw card credentials are never stored.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Delivery Notes */}
          <div className="border-t border-neutral-100 pt-8 space-y-2">
            <label className="block text-xs text-neutral-600">Special Delivery Instructions (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 text-xs bg-neutral-50 text-neutral-900 border border-neutral-200 focus:outline-none focus:border-black rounded-xs"
            />
          </div>

        </div>

        {/* Right Sidebar: Order Review & Submit */}
        <div className="lg:col-span-5 bg-neutral-50 p-8 border border-neutral-100 rounded-xs space-y-6 h-fit">
          <h2 className="text-sm uppercase tracking-widest font-medium text-neutral-950 border-b border-neutral-200 pb-3">
            In Your Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
          </h2>

          <div className="max-h-80 overflow-y-auto divide-y divide-neutral-200/60 pr-1 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="pt-3 flex gap-3 text-xs items-center">
                <div className="w-14 h-16 bg-neutral-200 overflow-hidden shrink-0 rounded-xs">
                  <img src={item.image} alt={item.productTitle} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-neutral-950 truncate">{item.productTitle}</h4>
                  <p className="text-[11px] text-neutral-500">{item.variantTitle} × {item.quantity}</p>
                </div>
                <span className="font-medium text-neutral-950 font-mono">
                  ${(item.unitPrice * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 text-xs text-neutral-600 font-light border-t border-neutral-200 pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-neutral-950">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-medium text-neutral-950">
                {shipping + expressShippingAdd === 0 ? 'Complimentary' : `$${(shipping + expressShippingAdd).toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax</span>
              <span className="font-medium text-neutral-950">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-normal text-neutral-950 pt-3 border-t border-neutral-200">
              <span>Grand Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-neutral-950 text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-black transition shadow-md disabled:bg-neutral-400 rounded-xs flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <span>Authorizing & Reserving Stock...</span>
            ) : (
              <>
                <span>Complete Purchase</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center space-x-2 text-[11px] text-neutral-400 font-light justify-center">
            <ShieldCheck className="w-4 h-4 text-neutral-500" />
            <span>Pessimistic stock reservation & 256-bit SSL encryption</span>
          </div>
        </div>

      </form>
    </div>
  );
}