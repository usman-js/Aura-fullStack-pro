'use client';

import React from 'react';
import Link from 'next/link';
import { PRODUCTS, CATEGORIES } from '@/lib/catalogData';
import { useCart } from '@/context/CartContext';
import { ArrowRight, ShieldCheck, Sparkles, Leaf, Truck } from 'lucide-react';

export default function HomePage() {
  const { addToCart } = useCart();
  const featuredProducts = PRODUCTS.filter((p) => p.is_featured);

  return (
    <div className="space-y-24 pb-20 bg-white text-neutral-900">

      {/* 1. Large Hero Banner (dark background, white text) */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center bg-neutral-900 overflow-hidden">
        {/* Background Hero Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-65 scale-105 transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2400&q=85')`,
          }}
        />
        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
          <span className="inline-block text-xs uppercase tracking-[0.3em] font-medium text-neutral-300">
            Fall / Winter 2026 Edition
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extralight tracking-tight text-white leading-[1.1]">
            Curated Objects for Calm Living.
          </h1>

          <p className="max-w-xl mx-auto text-base sm:text-lg text-neutral-300 font-light leading-relaxed">
            Architectural furniture, ambient brass illumination, and hand-thrown stoneware crafted to elevate the everyday ritual.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-4 bg-white text-neutral-950 text-xs uppercase tracking-[0.2em] font-medium hover:bg-neutral-100 transition shadow-lg"
            >
              Explore Collection
            </Link>
            <Link
              href="/products?category=furniture"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/40 text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-white/10 transition backdrop-blur-xs"
            >
              View Spaces
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Value Propositions Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between gap-6 md:gap-4 py-8 border-y border-neutral-100">
          <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left md:flex-1 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-950">
              <Sparkles className="w-4 h-4 text-white stroke-1" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-medium text-neutral-950">Artisanal Integrity</h4>
              <p className="text-xs text-neutral-500 font-light mt-1">Master craftspeople using traditional joinery and glazes.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left md:flex-1 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-950">
              <Leaf className="w-4 h-4 text-white stroke-1" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-medium text-neutral-950">Sustainable Timber</h4>
              <p className="text-xs text-neutral-500 font-light mt-1">100% certified organic European flax & harvested oak.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left md:flex-1 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-950">
              <Truck className="w-4 h-4 text-white stroke-1" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-medium text-neutral-950">Complimentary Shipping</h4>
              <p className="text-xs text-neutral-500 font-light mt-1">Free delivery worldwide on orders exceeding $150.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left md:flex-1 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-950">
              <ShieldCheck className="w-4 h-4 text-white stroke-1" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-medium text-neutral-950">10-Year Warranty</h4>
              <p className="text-xs text-neutral-500 font-light mt-1">Guaranteed structural integrity for generations of use.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories / Collections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-medium">Curated Series</span>
            <h2 className="text-2xl sm:text-3xl font-light tracking-wide text-neutral-950 mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs uppercase tracking-widest font-medium text-neutral-700 hover:text-black transition flex items-center space-x-1"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative h-96 overflow-hidden bg-neutral-900 flex flex-col justify-end p-6"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url('${cat.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="relative z-10 text-white space-y-1">
                <h3 className="text-lg font-normal tracking-wide group-hover:translate-x-1 transition-transform duration-300">
                  {cat.name}
                </h3>
                <p className="text-xs text-neutral-300 font-light line-clamp-1">
                  {cat.description}
                </p>
                <div className="pt-2 text-[10px] uppercase tracking-widest text-neutral-300 group-hover:text-white transition">
                  Explore Collection →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Best-Selling Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-medium">Iconic Pieces</span>
            <h2 className="text-2xl sm:text-3xl font-light tracking-wide text-neutral-950 mt-1">
              Featured Essentials
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs uppercase tracking-widest font-medium text-neutral-700 hover:text-black transition flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {featuredProducts.map((product) => {
            const primaryImg = product.images.find((img) => img.is_primary)?.image || product.images[0]?.image;
            const defaultVariant = product.variants[0];

            return (
              <div key={product.id} className="group flex flex-col">
                <Link
                  href={`/products/${product.slug}`}
                  className="relative aspect-3/4 bg-neutral-100 overflow-hidden mb-4 rounded-xs"
                >
                  <img
                    src={primaryImg}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {product.is_on_sale && (
                      <span className="px-2 py-0.5 bg-neutral-950 text-white text-[10px] uppercase tracking-widest font-medium">
                        Sale
                      </span>
                    )}
                  </div>

                  {/* Quick Add overlay button */}
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
                      {defaultVariant?.is_in_stock ? 'Quick Add' : 'Sold Out'}
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
                  </div>

                  <div className="text-right">
                    {product.sale_price ? (
                      <div className="flex items-center space-x-1.5">
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
      </section>

      {/* 5. Promotional Editorial Banner (dark background, white text) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-xs overflow-hidden bg-neutral-950 text-white grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
          <div className="p-10 sm:p-16 flex flex-col justify-center space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] font-medium text-neutral-400">
              The Autumn Solstice Release
            </span>
            <h2 className="text-3xl sm:text-4xl font-extralight tracking-tight leading-tight">
              Honoring natural grain, tactile warmth, and shadow.
            </h2>
            <p className="text-sm font-light text-neutral-300 leading-relaxed max-w-md">
              Each edition in our Autumn Solstice series is produced in strictly limited runs of twenty pieces, numbered and signed by our workshop atelier.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-neutral-950 text-xs uppercase tracking-widest font-medium hover:bg-neutral-100 transition"
              >
                <span>Discover the Editorial</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div
            className="bg-cover bg-center min-h-[300px] md:min-h-full"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80')`,
            }}
          />
        </div>
      </section>

      {/* 6. Brand Introduction / Manifesto */}
      <section className="max-w-4xl mx-auto px-6 text-center space-y-6 py-12">
        <span className="text-xs uppercase tracking-[0.3em] text-neutral-400 font-medium">
          Philosophy & Origins
        </span>
        <h3 className="text-2xl sm:text-3xl font-extralight text-neutral-950 leading-relaxed">
          &ldquo;We believe that the objects surrounding you should bring clarity, quietude, and a profound sense of permanence.&rdquo;
        </h3>
        <p className="text-sm font-light text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          Founded in 2024, AURA operates between the quiet discipline of Japanese aesthetics and the functional warmth of Scandinavian modernism. We select raw materials that age with grace: unlacquered brass, full-grain vegetable tanned hide, and sustainably managed white oak.
        </p>
      </section>

      {/* 7. Press & Customer Testimonials */}
      <section className="bg-neutral-50 py-20 border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-neutral-400 font-medium">Critical Acclaim</span>
            <h2 className="text-2xl font-light text-neutral-950 mt-1">What Design Critics Are Saying</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-neutral-200/60 rounded-xs space-y-4">
              <div className="text-xs tracking-widest uppercase font-mono text-neutral-400">Architectural Digest</div>
              <p className="text-sm font-light text-neutral-700 leading-relaxed">
                &ldquo;A masterclass in restraint. The Komorebi chair manages to feel both historically grounded and utterly contemporary.&rdquo;
              </p>
              <div className="text-xs font-medium text-neutral-950">— Review Editorial</div>
            </div>

            <div className="bg-white p-8 border border-neutral-200/60 rounded-xs space-y-4">
              <div className="text-xs tracking-widest uppercase font-mono text-neutral-400">Wallpaper* Magazine</div>
              <p className="text-sm font-light text-neutral-700 leading-relaxed">
                &ldquo;AURA brings a poetic, gallery-caliber sensibility to home retail without sacrificing tactile comfort or durability.&rdquo;
              </p>
              <div className="text-xs font-medium text-neutral-950">— Design Awards 2026</div>
            </div>

            <div className="bg-white p-8 border border-neutral-200/60 rounded-xs space-y-4">
              <div className="text-xs tracking-widest uppercase font-mono text-neutral-400">Monocle Index</div>
              <p className="text-sm font-light text-neutral-700 leading-relaxed">
                &ldquo;Their Belgian linen duvets and cast bronze lighting set a gold benchmark for residential living objects.&rdquo;
              </p>
              <div className="text-xs font-medium text-neutral-950">— Quality of Life Survey</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}