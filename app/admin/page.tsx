'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge, claimStatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Claim, Profile, Subscription } from '@/types';
import toast from 'react-hot-toast';
import { Users, FileText, ShieldCheck, CheckCircle, XCircle } from 'lucide-react';

type Tab = 'claims' | 'users' | 'subscriptions';

export default function AdminPage() {
  const { profile, loading: authLoading } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>('claims');
  const [claims, setClaims] = useState<Claim[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Role guard — redirect non-admins
  useEffect(() => {
    if (!authLoading && profile && profile.role !== 'admin') {
      router.replace('/');
    }
  }, [profile, authLoading, router]);

  useEffect(() => {
    if (profile?.role !== 'admin') return;
    fetchAll();
  }, [profile]);

  const fetchAll = async () => {
    setDataLoading(true);
    const [
      { data: claimsData },
      { data: usersData },
      { data: subsData },
    ] = await Promise.all([
      supabase.from('claims').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('subscriptions').select('*, plan:plans(name, price)').order('created_at', { ascending: false }),
    ]);

    if (claimsData) setClaims(claimsData as Claim[]);
    if (usersData) setUsers(usersData as Profile[]);
    if (subsData) setSubscriptions(subsData as Subscription[]);
    setDataLoading(false);
  };

  const updateClaimStatus = async (claimId: string, status: 'approved' | 'rejected' | 'paid') => {
    const { error } = await supabase
      .from('claims')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', claimId);

    if (!error) {
      setClaims((prev) =>
        prev.map((c) => (c.id === claimId ? { ...c, status } : c))
      );
      toast.success(`Claim ${status}`);
    }
  };

  if (authLoading) return null;
  if (!authLoading && profile?.role !== 'admin') return null;

  const TABS: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }>; count: number }[] = [
    { key: 'claims', label: 'Claims', icon: FileText, count: claims.length },
    { key: 'users', label: 'Users', icon: Users, count: users.length },
    { key: 'subscriptions', label: 'Policies', icon: ShieldCheck, count: subscriptions.length },
  ];

  return (
    <div className="min-h-screen bg-surface-50">
      <Header title="Admin Dashboard" />
      <main className="max-w-2xl mx-auto px-4 pt-4 pb-10">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {TABS.map(({ key, label, icon: Icon, count }) => (
            <Card
              key={key}
              padding="sm"
              hover
              onClick={() => setTab(key)}
              className={`text-center ${tab === key ? 'ring-2 ring-primary-500 ring-offset-1' : ''}`}
            >
              <Icon className="w-5 h-5 text-primary-500 mx-auto mb-1" />
              <p className="text-xl font-bold text-slate-900">{count}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </Card>
          ))}
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-5">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                tab === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {dataLoading ? (
          <ListSkeleton count={5} />
        ) : (
          <>
            {/* ── Claims Tab ── */}
            {tab === 'claims' && (
              <div className="space-y-3">
                {claims.length === 0 && (
                  <Card className="py-8 text-center text-slate-400">No claims yet.</Card>
                )}
                {claims.map((claim) => {
                  const badge = claimStatusBadge(claim.status);
                  return (
                    <Card key={claim.id} padding="md">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-sm text-slate-900 capitalize">{claim.type}</p>
                            <Badge variant={badge.variant}>{badge.label}</Badge>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{formatDate(claim.created_at)}</p>
                          {claim.notes && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{claim.notes}</p>}
                        </div>
                        <p className="font-bold text-slate-900 flex-shrink-0">{formatCurrency(claim.amount)}</p>
                      </div>

                      {/* Actions for reviewable claims */}
                      {['submitted', 'reviewing'].includes(claim.status) && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-slate-50">
                          <Button
                            variant="teal"
                            size="sm"
                            onClick={() => updateClaimStatus(claim.id, 'approved')}
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => updateClaimStatus(claim.id, 'rejected')}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </Button>
                          {claim.status === 'approved' && (
                            <Button size="sm" onClick={() => updateClaimStatus(claim.id, 'paid')}>
                              Mark Paid
                            </Button>
                          )}
                        </div>
                      )}
                      {claim.status === 'approved' && (
                        <div className="mt-3 pt-3 border-t border-slate-50">
                          <Button size="sm" onClick={() => updateClaimStatus(claim.id, 'paid')}>
                            Mark as Paid
                          </Button>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}

            {/* ── Users Tab ── */}
            {tab === 'users' && (
              <div className="space-y-3">
                {users.length === 0 && (
                  <Card className="py-8 text-center text-slate-400">No users yet.</Card>
                )}
                {users.map((user) => (
                  <Card key={user.id} padding="md" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700 flex-shrink-0">
                      {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-900">{user.full_name ?? 'Unnamed User'}</p>
                      <p className="text-xs text-slate-400">{user.phone ?? 'No phone'} · {formatDate(user.created_at)}</p>
                    </div>
                    <Badge variant={user.role === 'admin' ? 'warning' : 'info'}>{user.role}</Badge>
                  </Card>
                ))}
              </div>
            )}

            {/* ── Subscriptions Tab ── */}
            {tab === 'subscriptions' && (
              <div className="space-y-3">
                {subscriptions.length === 0 && (
                  <Card className="py-8 text-center text-slate-400">No subscriptions yet.</Card>
                )}
                {subscriptions.map((sub) => (
                  <Card key={sub.id} padding="md">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm text-slate-900">{sub.plan?.name ?? 'Unknown Plan'}</p>
                        <p className="text-xs font-mono text-slate-400 mt-0.5">{sub.policy_number}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {formatDate(sub.start_date)} → {formatDate(sub.end_date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            sub.status === 'active' ? 'success' :
                            sub.status === 'expired' ? 'error' : 'neutral'
                          }
                        >
                          {sub.status}
                        </Badge>
                        <p className="text-xs text-slate-400 mt-1">{formatCurrency(sub.plan?.price ?? 0)}/mo</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
