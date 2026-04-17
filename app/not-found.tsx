import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 bg-primary-100 rounded-3xl flex items-center justify-center mb-6">
        <span className="text-primary-600 text-3xl font-extrabold">NH</span>
      </div>
      <h1 className="text-4xl font-extrabold text-slate-800 mb-2">404</h1>
      <p className="text-slate-500 mb-6">This page doesn&apos;t exist. Let&apos;s get you back home.</p>
      <Link
        href="/"
        className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
