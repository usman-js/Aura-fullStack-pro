'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('customer@example.com');
  const [password, setPassword] = useState('CustomerPass123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (email === 'customer@example.com' || email.includes('@')) {
        localStorage.setItem('aura_user', JSON.stringify({
          email,
          name: 'Sophia Sterling',
          role: 'CUSTOMER'
        }));
        router.push('/account/orders');
      } else {
        setError('Invalid credentials.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 space-y-8 bg-white text-neutral-900">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-medium">Customer Portal</span>
        <h1 className="text-3xl font-light text-neutral-950 tracking-tight">Sign In</h1>
        <p className="text-xs text-neutral-500 font-light">
          Access your order tracking, address book, and private reservations.
        </p>
      </div>

      <div className="bg-neutral-50 p-4 border border-neutral-200/60 rounded-xs text-xs text-neutral-600 font-light space-y-1">
        <p className="font-medium text-neutral-950">Pre-seeded Demo Accounts:</p>
        <p>• Customer: <span className="font-mono">customer@example.com</span> / <span className="font-mono">CustomerPass123!</span></p>
        <p>• Admin: <span className="font-mono">admin@aurastore.com</span> / <span className="font-mono">AdminPass123!</span></p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 rounded-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4 text-xs">
        <div>
          <label className="block text-neutral-600 mb-1">Email Address</label>
          <div className="relative">
            <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white text-neutral-900 border border-neutral-200 focus:outline-none focus:border-black rounded-xs"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-neutral-600">Password</label>
            <span className="text-[11px] text-neutral-400 cursor-pointer hover:underline">Forgot password?</span>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white text-neutral-900 border border-neutral-200 focus:outline-none focus:border-black rounded-xs"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-neutral-950 text-white text-xs uppercase tracking-widest font-medium hover:bg-black transition shadow-sm rounded-xs flex items-center justify-center space-x-2"
        >
          <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      <div className="text-center pt-2 text-xs text-neutral-500 font-light">
        <span>Don&apos;t have an account yet? </span>
        <Link href="/account/register" className="text-neutral-950 font-medium hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
}