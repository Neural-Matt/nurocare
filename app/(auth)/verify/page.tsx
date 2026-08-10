'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MailCheck, ArrowLeft, RotateCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { LogoMark } from '@/components/ui/Logo';

function VerifyContent() {
  const { resendVerification } = useAuth();
  const email = useSearchParams().get('email') ?? '';

  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    setLoading(true);
    await resendVerification(email);
    setLoading(false);
    setResent(true);
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
        <MailCheck className="w-12 h-12 text-accent-400 mx-auto mb-3 relative" />
        <h1 className="text-2xl font-display font-bold text-white relative">Verify your email</h1>
        <p className="text-white/60 text-sm mt-1 relative">One last step before you&apos;re covered</p>
      </div>

      <div className="flex-1 -mt-6 px-5 pb-10">
        <div className="bg-white rounded-3xl shadow-card-hover border border-neutral-100 p-6 max-w-sm md:max-w-md mx-auto text-center">
          <p className="text-sm text-neutral-600 leading-relaxed">
            We&apos;ve sent a confirmation link to
            {email && <span className="block font-semibold text-neutral-900 mt-1">{email}</span>}
          </p>
          <p className="text-sm text-neutral-500 leading-relaxed mt-3">
            Open it on this device to activate your account. The link expires after 24 hours.
          </p>

          <Button
            variant="outline"
            fullWidth
            className="mt-6"
            onClick={handleResend}
            loading={loading}
            disabled={!email || resent}
            leadingIcon={<RotateCw className="w-4 h-4" />}
          >
            {resent ? 'Email sent again' : 'Resend email'}
          </Button>

          <Link
            href="/login"
            className="flex items-center justify-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 font-medium mt-5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyContent />
    </Suspense>
  );
}
