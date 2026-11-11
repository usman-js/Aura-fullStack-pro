'use client';

import React, { useState, useEffect } from 'react';
import { Truck } from 'lucide-react';

export default function CustomerOrdersPage() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('aura_user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser({ email: 'customer@example.com', name: 'Sophia Sterling' });
      }
    } catch {
      setUser({ email: 'customer@example.com', name: 'Sophia Sterling' });
    }
  }, []);

  const orders = [
    {
      id: 'ord-101',
      orderNumber: 'ORD-20261108-984210',
      date: 'November 8, 2026',
      status: 'SHIPPED',
      tracking: 'FX-982410928US',
      carrier: 'FedEx Custom Critical',
      total: 890.00,
      items: [
        { title: 'Komorebi Lounge Chair', variant: 'White Oak / Natural Bouclé', qty: 1, price: 890.00, img: 'https://images.unsplash.com/photo-1580481077195-c3a821a506cb?auto=format&fit=crop&w=400&q=80' },
      ],
    },
    {
      id: 'ord-102',
      orderNumber: 'ORD-20261024-412850',
      date: 'October 24, 2026',
      status: 'DELIVERED',
      tracking: 'FX-381920311US',
      carrier: 'FedEx Freight',
      total: 405.00,
      items: [
        { title: 'Forma Sculptural Pendant Lamp', variant: 'Brushed Brass / 30cm', qty: 1, price: 295.00, img: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=400&q=80' },
        { title: 'Sabi Hand-Thrown Stoneware Vase', variant: 'Chalk White / Medium', qty: 1, price: 110.00, img: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=400&q=80' },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-white text-neutral-900">

      {/* Header */}
      <div className="border-b border-neutral-100 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-medium">Customer Portal</span>
          <h1 className="text-3xl font-light text-neutral-950 tracking-tight mt-1">
            Order History & Tracking
          </h1>
          <p className="text-xs text-neutral-500 font-light mt-1">
            Logged in as <strong className="text-neutral-950">{user?.name}</strong> ({user?.email})
          </p>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem('aura_user');
            window.location.href = '/account/login';
          }}
          className="text-xs text-neutral-500 hover:text-black transition underline w-fit"
        >
          Sign Out
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order.id} className="border border-neutral-200/80 rounded-xs overflow-hidden bg-white">

            {/* Order Card Header */}
            <div className="bg-neutral-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200/60 text-xs text-neutral-600 font-light">
              <div className="space-y-0.5">
                <span className="text-neutral-400 uppercase text-[10px] tracking-wider block">Order Reference</span>
                <span className="font-mono font-medium text-neutral-950">{order.orderNumber}</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-neutral-400 uppercase text-[10px] tracking-wider block">Placed On</span>
                <span className="text-neutral-950">{order.date}</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-neutral-400 uppercase text-[10px] tracking-wider block">Total Amount</span>
                <span className="font-medium text-neutral-950 font-mono">${order.total.toFixed(2)}</span>
              </div>

              <div>
                <span className={`inline-flex items-center px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider rounded-xs ${
                  order.status === 'DELIVERED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-neutral-900 text-white'
                }`}>
                  {order.status === 'DELIVERED' ? '✓ Delivered' : '• In Transit'}
                </span>
              </div>
            </div>

            {/* Tracking Banner if Shipped (dark background, so white text) */}
            {order.status === 'SHIPPED' && (
              <div className="px-6 py-3 bg-neutral-900 text-neutral-200 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-white" />
                  <span>Carrier: {order.carrier} — Tracking #: <span className="font-mono text-white">{order.tracking}</span></span>
                </div>
                <span className="text-[11px] text-neutral-300">Estimated Delivery: Tomorrow by 5 PM</span>
              </div>
            )}

            {/* Order Items */}
            <div className="p-6 divide-y divide-neutral-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-20 bg-neutral-100 overflow-hidden shrink-0 rounded-xs">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-normal text-neutral-950">{item.title}</h4>
                      <p className="text-xs text-neutral-500 font-light">{item.variant}</p>
                      <p className="text-xs text-neutral-400 font-mono mt-0.5">Qty: {item.qty}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-neutral-950 font-mono">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}