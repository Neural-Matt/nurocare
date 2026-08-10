'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LogoMark } from '@/components/ui/Logo';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    // Show the same success state regardless of whether the address is
    // registered — don't let this form reveal which emails have accounts.
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <div className="bg-primary-800 px-5 py-4 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center p-[5px]">
          <LogoMark className="text-white" />
        </div>
        <span className="text-white font-display font-bold text-base">NuroCare</span>
      </div>

      <div className="bg-primary-800 px-5 pt-4 pb-14 text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent-500/15 blur-2xl" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/5 blur-xl" />
        <KeyRound className="w-12 h-12 text-accent-400 mx-auto mb-3 relative" />
        <h1 className="text-2xl font-display font-bold text-white relative">Reset your password</h1>
        <p className="text-white/60 text-sm mt-1 relative">We&apos;ll email you a secure link</p>
      </div>

      <div className="flex-1 -mt-6 px-5 pb-10">
        <div className="bg-white rounded-3xl shadow-card-hover border border-neutral-100 p-6 max-w-sm md:max-w-md mx-auto">
          {sent ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-accent-600" />
              </div>
              <p className="font-display font-bold text-neutral-900 text-lg">Check your inbox</p>
              <p className="text-sm text-neutral-500 mt-1.5 leading-relaxed">
                If an account exists for <span className="font-semibold text-neutral-700">{email}</span>, we&apos;ve
                sent a link to reset your password.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm text-accent-600 font-semibold hover:text-accent-700 mt-5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-neutral-500 -mt-1 mb-1">
                Enter the email address on your account and we&apos;ll send you a link to reset your password.
              </p>
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

              {error && (
                <div className="rounded-xl bg-danger-50 border border-danger-200 px-4 py-3 text-sm text-danger-600">
                  {error}
                </div>
              )}

              <Button type="submit" fullWidth size="lg" loading={loading}>
                Send reset link
              </Button>

              <Link
                href="/login"
                className="flex items-center justify-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 font-medium pt-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to sign in
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
