'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { LogOut, Shield, PencilLine, X, Users, CreditCard, MessageCircle, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getInitials } from '@/lib/utils';

export default function ProfilePage() {
  const { profile, user, refreshProfile, signOut } = useAuth();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? '',
    nrc: profile?.nrc ?? '',
    date_of_birth: profile?.date_of_birth ?? '',
    gender: profile?.gender ?? '',
    phone: profile?.phone ?? '',
  });

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name || null,
        nrc: form.nrc || null,
        date_of_birth: form.date_of_birth || null,
        gender: form.gender || null,
        phone: form.phone || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (!error) {
      await refreshProfile();
      toast.success('Profile updated!');
      setEditing(false);
    } else {
      toast.error('Failed to update profile');
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  const genderOptions = [
    { value: '', label: 'Select gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <AppShell title="Profile">
      {/* Avatar + name */}
      <Card className="flex flex-col items-center pt-8 pb-6 mb-5">
        {/* Initials avatar with gradient ring */}
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-700 to-accent-500 flex items-center justify-center shadow-md">
            <span className="text-white text-2xl font-black tracking-tight">
              {profile?.full_name ? getInitials(profile.full_name) : '?'}
            </span>
          </div>
          <div className="absolute inset-0 rounded-full ring-4 ring-white" />
        </div>
        <p className="font-display font-bold text-slate-900 text-xl">{profile?.full_name ?? 'Set your name'}</p>
        <p className="text-sm text-slate-400 mt-0.5">{user?.email}</p>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          <Badge variant={profile?.role === 'admin' ? 'warning' : 'info'}>
            <Shield className="w-3 h-3" />
            {profile?.role ?? 'user'}
          </Badge>
          {profile?.created_at && (
            <Badge variant="neutral">Member since {formatDate(profile.created_at)}</Badge>
          )}
        </div>
      </Card>

      {/* Profile details */}
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Personal info</p>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-accent-600 hover:text-accent-700 transition-colors"
            >
              <PencilLine className="w-3.5 h-3.5" />
              Edit
            </button>
          ) : (
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              placeholder="John Banda"
            />
            <Input
              label="NRC Number"
              value={form.nrc}
              onChange={(e) => setForm((f) => ({ ...f, nrc: e.target.value }))}
              placeholder="123456/78/9"
            />
            <Input
              label="Date of Birth"
              type="date"
              value={form.date_of_birth}
              onChange={(e) => setForm((f) => ({ ...f, date_of_birth: e.target.value }))}
            />
            <Select
              label="Gender"
              options={genderOptions}
              value={form.gender}
              onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
            />
            <Input
              label="Phone Number"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="+260 97 123 4567"
            />
            <div className="flex gap-3 pt-2">
              <Button variant="gradient" fullWidth loading={loading} onClick={handleSave}>
                Save changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {[
              { label: 'Full Name', value: profile?.full_name },
              { label: 'NRC', value: profile?.nrc },
              { label: 'Date of Birth', value: profile?.date_of_birth ? formatDate(profile.date_of_birth) : null },
              { label: 'Gender', value: profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : null },
              { label: 'Phone', value: profile?.phone },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-sm font-medium text-slate-800">{value ?? '—'}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick links */}
      <Card padding="none" className="mb-4 overflow-hidden">
        <div className="px-5 pt-4 pb-2">
          <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Account</p>
        </div>
        {[
          { label: 'My Family', sub: 'Manage covered family members', icon: Users, color: 'text-rose-500 bg-rose-50', href: '/family' },
          { label: 'Payment History', sub: 'View invoices and receipts', icon: CreditCard, color: 'text-warning-600 bg-warning-50', href: '/payments' },
          { label: 'See a Doctor', sub: 'WhatsApp teleconsultation', icon: MessageCircle, color: 'text-accent-600 bg-accent-50', href: '/telemedicine' },
        ].map(({ label, sub, icon: Icon, color, href }) => (
          <button
            key={href}
            onClick={() => router.push(href)}
            className="w-full flex items-center gap-3.5 px-5 py-3.5 border-t border-slate-50 hover:bg-slate-50 transition-colors text-left"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
              <Icon className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-primary-800">{label}</p>
              <p className="text-[11px] text-slate-400">{sub}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
          </button>
        ))}
      </Card>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-red-100 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors mt-1"
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </button>
    </AppShell>
  );
}
