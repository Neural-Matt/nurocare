'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User as UserIcon, Phone, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LogoMark } from '@/components/ui/Logo';

export default function OnboardingPage() {
  const { profile, loading: authLoading, updateProfile } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Onboarding only exists to collect a name — a returning user who already
  // has one has nothing left to do here.
  useEffect(() => {
    if (!authLoading && profile?.full_name) {
      router.replace('/dashboard');
    }
  }, [authLoading, profile, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim()) {
      setError('Tell us your name so we can personalize your account.');
      return;
    }
    setLoading(true);
    const { error } = await updateProfile({ full_name: fullName.trim(), phone: phone.trim() || null });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.replace('/dashboard');
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
        <Sparkles className="w-12 h-12 text-accent-400 mx-auto mb-3 relative" />
        <h1 className="text-2xl font-display font-bold text-white relative">You&apos;re almost set up</h1>
        <p className="text-white/60 text-sm mt-1 relative">Just a couple of details to personalize your cover</p>
      </div>

      <div className="flex-1 -mt-6 px-5 pb-10">
        <div className="bg-white rounded-3xl shadow-card-hover border border-neutral-100 p-6 max-w-sm md:max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              placeholder="e.g. Chanda Mwansa"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
              leftIcon={<UserIcon className="w-4 h-4" />}
            />
            <Input
              label="Phone number (optional)"
              type="tel"
              placeholder="e.g. 0977 123 456"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              leftIcon={<Phone className="w-4 h-4" />}
            />

            {error && (
              <div className="rounded-xl bg-danger-50 border border-danger-200 px-4 py-3 text-sm text-danger-600">
                {error}
              </div>
            )}

            <Button type="submit" fullWidth size="lg" loading={loading} variant="teal">
              Continue to dashboard
            </Button>

            <button
              type="button"
              onClick={() => router.replace('/dashboard')}
              className="w-full text-center text-sm text-neutral-500 hover:text-neutral-700 font-medium pt-1"
            >
              Skip for now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
