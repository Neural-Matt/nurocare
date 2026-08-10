'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { LogoMark } from '@/components/ui/Logo';

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    } else {
      router.replace('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Top brand bar */}
      <div className="bg-primary-800 px-5 py-4 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center p-[5px]">
          <LogoMark className="text-white" />
        </div>
        <span className="text-white font-display font-bold text-base">NuroCare</span>
      </div>

      {/* Hero strip */}
      <div className="bg-primary-800 px-5 pt-4 pb-14 text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent-500/15 blur-2xl" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/5 blur-xl" />
        <ShieldCheck className="w-12 h-12 text-accent-400 mx-auto mb-3 relative" />
        <h1 className="text-2xl font-display font-bold text-white relative">Welcome back</h1>
        <p className="text-white/60 text-sm mt-1 relative">Your health cover, always in your pocket</p>
      </div>

      {/* Form card floating over hero */}
      <div className="flex-1 -mt-6 px-5 pb-10">
        <div className="bg-white rounded-3xl shadow-card-hover border border-neutral-100 p-6 max-w-sm md:max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                leftIcon={<Lock className="w-4 h-4" />}
              />
              <div className="flex items-center justify-between mt-1.5">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-accent-600 flex items-center gap-1 hover:text-accent-700"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showPassword ? 'Hide' : 'Show'} password
                </button>
                <Link href="/forgot-password" className="text-xs text-neutral-500 hover:text-neutral-700 font-medium">
                  Forgot password?
                </Link>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-danger-50 border border-danger-200 px-4 py-3 text-sm text-danger-600">
                {error}
              </div>
            )}

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-neutral-500 mt-5">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-accent-600 font-semibold hover:text-accent-700">
              Sign up free
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-neutral-400 mt-5 max-w-sm md:max-w-md mx-auto">
          Regulated by the Pensions and Insurance Authority
        </p>
      </div>
    </div>
  );
}
