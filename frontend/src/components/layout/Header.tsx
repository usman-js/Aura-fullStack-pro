"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Search, Menu, X, User } from "lucide-react";

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-neutral-900 text-neutral-200 text-xs py-2 px-4 text-center tracking-wider font-light">
        <span>
          Complimentary worldwide shipping on orders over $150 • Designed for
          mindful living
        </span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-800 hover:text-black transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Center Brand Logo */}
          <div className="flex-1 md:flex-none text-center">
            <Link href="/" className="inline-block">
              <span className="text-2xl sm:text-3xl font-light tracking-[0.25em] text-neutral-900 uppercase">
                AURA
              </span>
            </Link>
          </div>

          {/* Right Action Icons */}

          {/* Left Navigation (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-neutral-600">
            <Link
              href="/products"
              className="hover:text-black transition tracking-wide"
            >
              All Objects
            </Link>
            <Link
              href="/products?category=furniture"
              className="hover:text-black transition tracking-wide"
            >
              Furniture
            </Link>
            <Link
              href="/products?category=lighting"
              className="hover:text-black transition tracking-wide"
            >
              Lighting
            </Link>
            <Link
              href="/products?category=ceramics"
              className="hover:text-black transition tracking-wide"
            >
              Ceramics
            </Link>
            <Link
              href="/products?category=textiles"
              className="hover:text-black transition tracking-wide"
            >
              Textiles
            </Link>
          </nav>

          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link
              href="/products"
              className="p-2 text-neutral-700 hover:text-black transition hidden sm:inline-block"
              title="Search catalog"
            >
              <Search className="w-5 h-5" />
            </Link>

            <Link
              href="/account/login"
              className="p-2 text-neutral-700 hover:text-black transition hidden sm:inline-block"
              title="Customer Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Shopping Bag Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-white hover:opacity-75 transition flex items-center"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-5 h-5 text-neutral-900" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-medium leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-black rounded-full min-w-4 h-4">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-100 bg-white px-6 py-8 space-y-5 animate-in slide-in-from-top duration-200">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-lg font-light tracking-wide text-white"
            >
              All Objects
            </Link>
            <Link
              href="/products?category=furniture"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-lg font-light tracking-wide text-white"
            >
              Furniture
            </Link>
            <Link
              href="/products?category=lighting"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-lg font-light tracking-wide text-white"
            >
              Lighting
            </Link>
            <Link
              href="/products?category=ceramics"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-lg font-light tracking-wide text-white"
            >
              Ceramics
            </Link>
            <Link
              href="/products?category=textiles"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-lg font-light tracking-wide text-white"
            >
              Textiles
            </Link>
            <hr className="border-neutral-100 pt-2" />
            <Link
              href="/account/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-light text-neutral-600"
            >
              Account Login / Register
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
