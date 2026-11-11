'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      localStorage.setItem('aura_user', JSON.stringify({
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        role: 'CUSTOMER'
      }));
      router.push('/account/orders');
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 space-y-8 bg-white text-neutral-900">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-medium">Join AURA</span>
        <h1 className="text-3xl font-light text-neutral-950 tracking-tight">Create Account</h1>
        <p className="text-xs text-neutral-500 font-light">
          Enjoy express checkout, personal object curation, and order tracking.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-neutral-600 mb-1">First Name</label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-3 py-2.5 bg-white text-neutral-900 border border-neutral-200 focus:outline-none focus:border-black rounded-xs"
            />
          </div>
          <div>
            <label className="block text-neutral-600 mb-1">Last Name</label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-3 py-2.5 bg-white text-neutral-900 border border-neutral-200 focus:outline-none focus:border-black rounded-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-neutral-600 mb-1">Email Address</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2.5 bg-white text-neutral-900 border border-neutral-200 focus:outline-none focus:border-black rounded-xs"
          />
        </div>

        <div>
          <label className="block text-neutral-600 mb-1">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3 py-2.5 bg-white text-neutral-900 border border-neutral-200 focus:outline-none focus:border-black rounded-xs"
          />
          <p className="text-[10px] text-neutral-400 mt-1">Minimum 8 characters with at least one letter & number.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-neutral-950 text-white text-xs uppercase tracking-widest font-medium hover:bg-black transition shadow-sm rounded-xs flex items-center justify-center space-x-2"
        >
          <span>{loading ? 'Creating Profile...' : 'Complete Registration'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      <div className="text-center pt-2 text-xs text-neutral-500 font-light">
        <span>Already have an account? </span>
        <Link href="/account/login" className="text-neutral-950 font-medium hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}