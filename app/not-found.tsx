import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LogoBadge } from '@/components/ui/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-8 text-center">
      <LogoBadge size="lg" className="rounded-3xl w-20 h-20 p-4 mb-6" />
      <h1 className="text-4xl font-display font-bold text-neutral-900 mb-2">404</h1>
      <p className="text-neutral-500 mb-6">This page doesn&apos;t exist. Let&apos;s get you back home.</p>
      <Link href="/dashboard">
        <Button variant="primary">Go to Dashboard</Button>
      </Link>
    </div>
  );
}
