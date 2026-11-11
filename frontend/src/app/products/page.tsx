'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PRODUCTS, CATEGORIES } from '@/lib/catalogData';
import { useCart } from '@/context/CartContext';
import { Search, SlidersHorizontal } from 'lucide-react';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);

  const { addToCart } = useCart();

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.category.slug !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCat = product.category.name.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCat) return false;
      }
      // In-stock filter
      if (onlyInStock) {
        const hasStock = product.variants.some((v) => v.is_in_stock);
        if (!hasStock) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') {
        return a.effective_price - b.effective_price;
      }
      if (sortBy === 'price-high') {
        return b.effective_price - a.effective_price;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      // Default: featured first
      return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    });
  }, [selectedCategory, searchQuery, sortBy, onlyInStock]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-white text-neutral-900">

      {/* Header Banner */}
      <div className="border-b border-neutral-100 pb-8 space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-medium">
          The Full Collection
        </span>
        <h1 className="text-3xl sm:text-4xl font-light text-neutral-950 tracking-tight">
          Catalog & Living Objects
        </h1>
        <p className="text-sm font-light text-neutral-500 max-w-xl">
          Quiet minimalism grounded in sustainable wood, unlacquered metals, and natural fibers.
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-100">

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 text-xs font-medium">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 uppercase tracking-wider transition rounded-xs ${
              selectedCategory === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            All Objects
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 uppercase tracking-wider transition rounded-xs ${
                selectedCategory === cat.slug
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search objects..."
              className="pl-9 pr-4 py-2 text-xs bg-neutral-50 text-neutral-900 border border-neutral-200 focus:outline-none focus:border-black rounded-xs w-48 sm:w-56"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 text-xs">
            <SlidersHorizontal className="w-4 h-4 text-neutral-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-neutral-50 text-neutral-900 border border-neutral-200 px-3 py-2 text-xs rounded-xs focus:outline-none focus:border-black"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>

          {/* Only In Stock Toggle */}
          <label className="flex items-center space-x-2 text-xs text-neutral-600 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="rounded text-neutral-950 focus:ring-black"
            />
            <span>In-stock only</span>
          </label>
        </div>
      </div>

      {/* Product Results Counter */}
      <div className="text-xs text-neutral-400 font-light flex justify-between items-center">
        <span>Showing {filteredProducts.length} objects</span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-neutral-950 underline hover:text-neutral-600"
          >
            Clear search &ldquo;{searchQuery}&rdquo;
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="py-24 text-center space-y-4">
          <p className="text-lg font-light text-neutral-500">
            No matching objects found in this view.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setOnlyInStock(false);
            }}
            className="px-6 py-2.5 bg-neutral-900 text-white text-xs uppercase tracking-widest hover:bg-black transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Product Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {filteredProducts.map((product) => {
            const primaryImg = product.images.find((img) => img.is_primary)?.image || product.images[0]?.image;
            const defaultVariant = product.variants[0];

            return (
              <div key={product.id} className="group flex flex-col">
                <Link
                  href={`/products/${product.slug}`}
                  className="relative aspect-3/4 bg-neutral-100 overflow-hidden mb-4 rounded-xs block"
                >
                  <img
                    src={primaryImg}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {product.is_on_sale && (
                      <span className="px-2 py-0.5 bg-neutral-950 text-white text-[10px] uppercase tracking-widest font-medium">
                        Sale
                      </span>
                    )}
                    {!product.variants.some((v) => v.is_in_stock) && (
                      <span className="px-2 py-0.5 bg-neutral-400 text-white text-[10px] uppercase tracking-widest font-medium">
                        Sold Out
                      </span>
                    )}
                  </div>

                  {/* Hover Quick Add */}
                  <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        if (defaultVariant && defaultVariant.is_in_stock) {
                          addToCart(product, defaultVariant, 1);
                        }
                      }}
                      className="w-full py-2.5 bg-white/95 text-neutral-950 text-xs uppercase tracking-widest font-medium hover:bg-black hover:text-white transition shadow-sm backdrop-blur-xs"
                    >
                      {defaultVariant?.is_in_stock ? 'Quick Add' : 'View Details'}
                    </button>
                  </div>
                </Link>

                <div className="flex justify-between items-start text-sm">
                  <div>
                    <span className="text-[11px] text-neutral-400 font-light uppercase tracking-wider block mb-0.5">
                      {product.category.name}
                    </span>
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-normal text-neutral-950 hover:text-neutral-600 transition"
                    >
                      {product.title}
                    </Link>
                    <p className="text-xs text-neutral-500 font-light mt-1 line-clamp-1">
                      {product.short_description}
                    </p>
                  </div>

                  <div className="text-right shrink-0 pl-4">
                    {product.sale_price ? (
                      <div className="flex flex-col items-end">
                        <span className="line-through text-neutral-400 text-xs">
                          ${product.base_price.toFixed(2)}
                        </span>
                        <span className="font-medium text-neutral-950">
                          ${product.sale_price.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-medium text-neutral-950">
                        ${product.base_price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-sm font-light text-neutral-400">Loading catalog...</div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}