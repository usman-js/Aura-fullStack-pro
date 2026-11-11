'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/lib/catalogData';
import { useCart } from '@/context/CartContext';
import { ProductVariant } from '@/types';
import { Check, Star, Truck, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const product = PRODUCTS.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const { addToCart } = useCart();

  // State
  const [selectedImage, setSelectedImage] = useState<string>(
    product.images[0]?.image || ''
  );
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0]
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>('materials');
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const handleAddToCart = () => {
    if (selectedVariant && selectedVariant.is_in_stock) {
      addToCart(product, selectedVariant, quantity);
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 3000);
    }
  };

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category.slug === product.category.slug && p.id !== product.id
  ).slice(0, 3);

  const isLowStock = selectedVariant.stock > 0 && selectedVariant.stock <= 5;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24 bg-white text-neutral-900">

      {/* Product Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

        {/* Left: Gallery (Thumbnails + Main Image) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible shrink-0">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedImage(img.image)}
                  className={`relative w-16 h-20 bg-neutral-100 overflow-hidden rounded-xs border transition ${
                    selectedImage === img.image
                      ? 'border-neutral-950 opacity-100'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.image}
                    alt={img.alt_text || product.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image */}
          <div className="flex-1 aspect-3/4 bg-neutral-100 rounded-xs overflow-hidden relative">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.is_on_sale && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-black text-white text-[11px] uppercase tracking-widest font-medium">
                Sale
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Buy Box & Details */}
        <div className="lg:col-span-5 flex flex-col justify-start space-y-8">

          {/* Header & Title */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-400 font-light">
              <Link href={`/products?category=${product.category.slug}`} className="hover:text-black">
                {product.category.name}
              </Link>
              <span>/</span>
              <span>SKU: {selectedVariant.sku}</span>
            </div>

            <h1 className="text-3xl font-light tracking-tight text-neutral-950">
              {product.title}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center space-x-2 pt-1 text-xs text-neutral-500 font-light">
              <div className="flex text-neutral-950">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span>4.9 (18 verified reviews)</span>
            </div>

            {/* Price */}
            <div className="pt-2">
              {product.sale_price ? (
                <div className="flex items-baseline space-x-3">
                  <span className="text-2xl font-normal text-neutral-950">
                    ${(selectedVariant.price).toFixed(2)}
                  </span>
                  <span className="text-base line-through text-neutral-400">
                    ${(product.base_price + Number(selectedVariant.additional_price)).toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-normal text-neutral-950">
                  ${(selectedVariant.price).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Short Description */}
          <p className="text-sm font-light text-neutral-600 leading-relaxed border-t border-neutral-100 pt-6">
            {product.description}
          </p>

          {/* Variants Selector */}
          <div className="space-y-5 border-t border-neutral-100 pt-6">
            <label className="block text-xs uppercase tracking-wider font-medium text-neutral-950">
              Select Finish & Variant: <span className="font-normal text-neutral-500">{selectedVariant.title}</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => {
                    setSelectedVariant(variant);
                    setQuantity(1);
                  }}
                  className={`p-3 text-left border rounded-xs transition flex flex-col justify-between ${
                    selectedVariant.id === variant.id
                      ? 'border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-medium text-neutral-950">
                      {variant.title}
                    </span>
                    {selectedVariant.id === variant.id && (
                      <Check className="w-3.5 h-3.5 text-neutral-950" />
                    )}
                  </div>
                  <div className="flex justify-between items-center w-full mt-2 text-[11px] text-neutral-500 font-light">
                    <span>${variant.price.toFixed(2)}</span>
                    <span className={variant.is_in_stock ? 'text-neutral-600' : 'text-neutral-400 italic'}>
                      {variant.is_in_stock ? `${variant.stock} available` : 'Sold out'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Stock Availability Alert */}
          <div className="text-xs">
            {selectedVariant.is_in_stock ? (
              isLowStock ? (
                <span className="text-amber-800 font-medium">
                  • Only {selectedVariant.stock} left in stock — order soon
                </span>
              ) : (
                <span className="text-emerald-700 font-medium">
                  • In Stock — Ready to ship from San Francisco
                </span>
              )
            ) : (
              <span className="text-rose-700 font-medium">
                • Out of stock — Restock expected in 2 weeks
              </span>
            )}
          </div>

          {/* Quantity Stepper & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">

              {/* Quantity */}
              <div className="flex items-center border border-neutral-300 rounded-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-3 text-neutral-600 hover:bg-neutral-100 transition"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="px-4 py-3 font-mono text-sm text-neutral-950 min-w-10 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                  className="px-3.5 py-3 text-neutral-600 hover:bg-neutral-100 transition"
                  disabled={quantity >= selectedVariant.stock}
                >
                  +
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!selectedVariant.is_in_stock}
                className="flex-1 py-4 bg-neutral-950 text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-black transition disabled:bg-neutral-300 disabled:cursor-not-allowed shadow-sm"
              >
                {selectedVariant.is_in_stock ? 'Add to Shopping Bag' : 'Out of Stock'}
              </button>
            </div>

            {/* Added Toast Confirmation */}
            {addedNotice && (
              <div className="p-3 bg-neutral-900 text-white text-xs text-center tracking-wider animate-in fade-in duration-200">
                ✓ Added to your bag. Opening drawer...
              </div>
            )}
          </div>

          {/* Delivery & Assurance Info */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100 text-xs text-neutral-500 font-light">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-neutral-700" />
              <span>Complimentary insured shipping on orders &gt; $150</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-neutral-700" />
              <span>30-day home trial & 10-year structural warranty</span>
            </div>
          </div>

          {/* Accordions */}
          <div className="border-t border-neutral-200 divide-y divide-neutral-200 pt-2 text-xs">

            {/* Materials & Craft */}
            <div className="py-4">
              <button
                type="button"
                onClick={() => toggleAccordion('materials')}
                className="w-full flex justify-between items-center text-left font-medium uppercase tracking-wider text-neutral-950"
              >
                <span>Materiality & Dimensions</span>
                {openAccordion === 'materials' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'materials' && (
                <div className="pt-3 font-light text-neutral-600 space-y-2 leading-relaxed">
                  <p>• Sustainably sourced kiln-dried American white oak / smoked walnut.</p>
                  <p>• Hand-rubbed organic plant-based oil finish (zero VOC).</p>
                  <p>• Designed for residential and commercial architectural environments.</p>
                </div>
              )}
            </div>

            {/* Shipping & Delivery */}
            <div className="py-4">
              <button
                type="button"
                onClick={() => toggleAccordion('shipping')}
                className="w-full flex justify-between items-center text-left font-medium uppercase tracking-wider text-neutral-950"
              >
                <span>White-Glove Delivery & Returns</span>
                {openAccordion === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openAccordion === 'shipping' && (
                <div className="pt-3 font-light text-neutral-600 space-y-2 leading-relaxed">
                  <p>• Dispatched within 2-3 business days in custom reinforced wooden crates.</p>
                  <p>• Seamless 30-day returns with complimentary pickup service.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-8 pt-12 border-t border-neutral-100">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-medium">Harmonizing Objects</span>
            <h2 className="text-2xl font-light text-neutral-950 mt-1">Complete the Space</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {relatedProducts.map((rel) => (
              <Link key={rel.id} href={`/products/${rel.slug}`} className="group space-y-3">
                <div className="aspect-3/4 bg-neutral-100 overflow-hidden rounded-xs">
                  <img
                    src={rel.images[0]?.image}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <h3 className="font-normal text-neutral-950 group-hover:underline">{rel.title}</h3>
                  <span className="text-neutral-950 font-medium">${rel.effective_price.toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}