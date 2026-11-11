'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-neutral-950 text-neutral-400 pt-20 pb-12 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <h3 className="text-xl font-light tracking-[0.25em] text-white uppercase">
              AURA
            </h3>
            <p className="text-sm font-light leading-relaxed text-neutral-400">
              Curated architectural objects, sculptural lighting, and natural fiber textiles created with reverence for materiality and timeless form.
            </p>
            <div className="pt-2 text-xs text-neutral-500 font-mono">
              PAKISTAN • LAHORE 
            </div>
          </div>

          {/* Catalog Col */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-neutral-200 mb-4">
              Collections
            </h4>
            <ul className="space-y-3 text-sm font-light">
              <li>
                <Link href="/products?category=furniture" className="hover:text-white transition">
                  Architectural Furniture
                </Link>
              </li>
              <li>
                <Link href="/products?category=lighting" className="hover:text-white transition">
                  Ambient Lighting
                </Link>
              </li>
              <li>
                <Link href="/products?category=ceramics" className="hover:text-white transition">
                  Hand-Thrown Ceramics
                </Link>
              </li>
              <li>
                <Link href="/products?category=textiles" className="hover:text-white transition">
                  Belgian Linen & Wool
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition">
                  View Full Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Care Col */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-neutral-200 mb-4">
              Client Service
            </h4>
            <ul className="space-y-3 text-sm font-light">
              <li>
                <span className="cursor-pointer hover:text-white transition">
                  Shipping & Delivery
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition">
                  Returns & Exchanges
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition">
                  Material Care Guides
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition">
                  Trade & Commercial
                </span>
              </li>
              <li>
                <Link href="/account/login" className="hover:text-white transition">
                  Order Tracking & Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-neutral-200 mb-4">
              The Journal & Inquiries
            </h4>
            <p className="text-sm font-light text-neutral-400 mb-4">
              Receive limited release notices, architectural essays, and private exhibition invitations.
            </p>

            {subscribed ? (
              <div className="p-3 bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 rounded">
                Thank you for subscribing. Welcome to the AURA circle.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex border-b border-neutral-700 focus-within:border-white transition pb-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="text-xs uppercase tracking-wider text-neutral-300 hover:text-white font-medium pl-2"
                  >
                    Join
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 font-light space-y-4 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} AURA Minimalist Living Inc. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <span className="hover:text-neutral-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-neutral-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-neutral-400 cursor-pointer">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
