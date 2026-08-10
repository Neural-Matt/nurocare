'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { IS_MOCK_MODE } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LogoMark } from '@/components/ui/Logo';

export default function ResetPasswordPage() {
  const { user, loading: authLoading, updatePassword } = useAuth();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // A valid recovery link establishes a session client-side on load. If
  // there's no session once auth has settled (and we're not in mock mode,
  // which has no session concept), the link is missing, expired, or reused.
  const linkInvalid = !IS_MOCK_MODE && !authLoading && !user;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.replace('/login'), 1500);
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
        <ShieldCheck className="w-12 h-12 text-accent-400 mx-auto mb-3 relative" />
        <h1 className="text-2xl font-display font-bold text-white relative">Choose a new password</h1>
        <p className="text-white/60 text-sm mt-1 relative">Make it something only you&apos;d know</p>
      </div>

      <div className="flex-1 -mt-6 px-5 pb-10">
        <div className="bg-white rounded-3xl shadow-card-hover border border-neutral-100 p-6 max-w-sm md:max-w-md mx-auto">
          {linkInvalid ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-danger-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-7 h-7 text-danger-500" />
              </div>
              <p className="font-display font-bold text-neutral-900 text-lg">This link has expired</p>
              <p className="text-sm text-neutral-500 mt-1.5 leading-relaxed">
                Reset links only work once and expire after a while. Request a new one to continue.
              </p>
              <Link href="/forgot-password" className="inline-block mt-5">
                <Button size="md">Request a new link</Button>
              </Link>
            </div>
          ) : success ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-accent-600" />
              </div>
              <p className="font-display font-bold text-neutral-900 text-lg">Password updated</p>
              <p className="text-sm text-neutral-500 mt-1">Taking you to sign in…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="New password"
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                leftIcon={<Lock className="w-4 h-4" />}
              />
              <Input
                label="Confirm new password"
                type="password"
                placeholder="Repeat password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                leftIcon={<Lock className="w-4 h-4" />}
              />

              {error && (
                <div className="rounded-xl bg-danger-50 border border-danger-200 px-4 py-3 text-sm text-danger-600">
                  {error}
                </div>
              )}

              <Button type="submit" fullWidth size="lg" loading={loading}>
                Update password
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
