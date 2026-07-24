'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
import { AdminShell } from '@/components/layout/AdminShell';
import { Card } from '@/components/ui/Card';
import { Badge, claimStatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { IconChip } from '@/components/ui/IconChip';
import { EmptyState } from '@/components/ui/EmptyState';
import { springs, fadeUp } from '@/components/ui/motion';
import { motion } from 'framer-motion';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Claim, Profile, Subscription } from '@/types';
import toast from 'react-hot-toast';
import { Users, FileText, ShieldCheck, CheckCircle, XCircle } from 'lucide-react';

type Tab = 'claims' | 'users' | 'subscriptions';

export default function AdminPage() {
  const { profile } = useAuth();

  const [tab, setTab] = useState<Tab>('claims');
  const [claims, setClaims] = useState<Claim[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Data fetch — role gating (redirects) is fully handled by AdminShell.
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

  const TABS: {
    key: Tab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: 'primary' | 'accent' | 'warning';
    count: number;
  }[] = [
    { key: 'claims', label: 'Claims', icon: FileText, color: 'primary', count: claims.length },
    { key: 'users', label: 'Users', icon: Users, color: 'accent', count: users.length },
    { key: 'subscriptions', label: 'Policies', icon: ShieldCheck, color: 'warning', count: subscriptions.length },
  ];

  const thClass = 'text-left text-xs font-medium uppercase tracking-wide text-neutral-400 px-4 py-3';

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">

        {/* Stats row — informational only, does not control the tab */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {TABS.map(({ key, label, icon: Icon, color, count }) => (
            <Card key={key} padding="md" className="flex items-center gap-3">
              <IconChip icon={<Icon className="w-[18px] h-[18px]" />} color={color} />
              <div className="min-w-0">
                <p className="text-xl font-bold text-neutral-900 leading-tight">{count}</p>
                <p className="text-xs text-neutral-400 truncate">{label}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Tab control — single source of truth for the active tab */}
        <div role="tablist" className="inline-flex gap-1 bg-neutral-100 rounded-xl p-1 mb-6">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                tab === key ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {tab === key && (
                <motion.div
                  layoutId="admin-tab-pill"
                  className="absolute inset-0 bg-white rounded-lg shadow-card"
                  transition={springs.snappy}
                />
              )}
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>

        {dataLoading ? (
          <ListSkeleton count={5} />
        ) : (
          <>
            {/* ── Claims Tab ── */}
            {tab === 'claims' && (
              claims.length === 0 ? (
                <EmptyState icon={FileText} title="No claims yet." />
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-neutral-150 bg-white shadow-card">
                  <table className="w-full text-sm min-w-[640px]">
                    <thead>
                      <tr className="border-b border-neutral-150">
                        <th className={thClass}>Type</th>
                        <th className={thClass}>Date</th>
                        <th className={`${thClass} text-right`}>Amount</th>
                        <th className={thClass}>Status</th>
                        <th className={thClass}>Actions</th>
                      </tr>
                    </thead>
                    <motion.tbody
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: '-80px' }}
                      variants={{ show: { transition: { staggerChildren: 0.05 } } }}
                    >
                      {claims.map((claim) => {
                        const badge = claimStatusBadge(claim.status);
                        return (
                          <motion.tr
                            key={claim.id}
                            variants={fadeUp}
                            className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors"
                          >
                            <td className="px-4 py-3 align-top">
                              <p className="font-medium text-neutral-900 capitalize">{claim.type}</p>
                              {claim.notes && (
                                <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1 max-w-xs">{claim.notes}</p>
                              )}
                            </td>
                            <td className="px-4 py-3 align-top text-neutral-500 whitespace-nowrap">
                              {formatDate(claim.created_at)}
                            </td>
                            <td className="px-4 py-3 align-top text-right font-semibold text-neutral-900 whitespace-nowrap">
                              {formatCurrency(claim.amount)}
                            </td>
                            <td className="px-4 py-3 align-top">
                              <Badge variant={badge.variant}>{badge.label}</Badge>
                            </td>
                            <td className="px-4 py-3 align-top">
                              <div className="flex flex-wrap gap-2">
                                {['submitted', 'reviewing'].includes(claim.status) && (
                                  <>
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
                                  </>
                                )}
                                {claim.status === 'approved' && (
                                  <Button size="sm" onClick={() => updateClaimStatus(claim.id, 'paid')}>
                                    Mark as Paid
                                  </Button>
                                )}
                                {!['submitted', 'reviewing', 'approved'].includes(claim.status) && (
                                  <span className="text-neutral-300 text-xs">—</span>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </motion.tbody>
                  </table>
                </div>
              )
            )}

            {/* ── Users Tab ── */}
            {tab === 'users' && (
              users.length === 0 ? (
                <EmptyState icon={Users} title="No users yet." />
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-neutral-150 bg-white shadow-card">
                  <table className="w-full text-sm min-w-[560px]">
                    <thead>
                      <tr className="border-b border-neutral-150">
                        <th className={thClass}>User</th>
                        <th className={thClass}>Phone</th>
                        <th className={thClass}>Joined</th>
                        <th className={thClass}>Role</th>
                      </tr>
                    </thead>
                    <motion.tbody
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: '-80px' }}
                      variants={{ show: { transition: { staggerChildren: 0.05 } } }}
                    >
                      {users.map((user) => (
                        <motion.tr
                          key={user.id}
                          variants={fadeUp}
                          className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center text-xs font-bold text-primary-800 shrink-0">
                                {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <span className="font-medium text-neutral-900 truncate">
                                {user.full_name ?? 'Unnamed User'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{user.phone ?? '—'}</td>
                          <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{formatDate(user.created_at)}</td>
                          <td className="px-4 py-3">
                            <Badge variant={user.role === 'admin' ? 'warning' : 'info'}>{user.role}</Badge>
                          </td>
                        </motion.tr>
                      ))}
                    </motion.tbody>
                  </table>
                </div>
              )
            )}

            {/* ── Subscriptions Tab ── */}
            {tab === 'subscriptions' && (
              subscriptions.length === 0 ? (
                <EmptyState icon={ShieldCheck} title="No subscriptions yet." />
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-neutral-150 bg-white shadow-card">
                  <table className="w-full text-sm min-w-[640px]">
                    <thead>
                      <tr className="border-b border-neutral-150">
                        <th className={thClass}>Plan</th>
                        <th className={thClass}>Policy No.</th>
                        <th className={thClass}>Period</th>
                        <th className={thClass}>Status</th>
                        <th className={`${thClass} text-right`}>Price</th>
                      </tr>
                    </thead>
                    <motion.tbody
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: '-80px' }}
                      variants={{ show: { transition: { staggerChildren: 0.05 } } }}
                    >
                      {subscriptions.map((sub) => (
                        <motion.tr
                          key={sub.id}
                          variants={fadeUp}
                          className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-neutral-900 whitespace-nowrap">
                            {sub.plan?.name ?? 'Unknown Plan'}
                          </td>
                          <td className="px-4 py-3 font-mono text-neutral-500 whitespace-nowrap">{sub.policy_number}</td>
                          <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">
                            {formatDate(sub.start_date)} → {formatDate(sub.end_date)}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant={
                                sub.status === 'active' ? 'success' :
                                sub.status === 'expired' ? 'error' : 'neutral'
                              }
                            >
                              {sub.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-neutral-900 whitespace-nowrap">
                            {formatCurrency(sub.plan?.price ?? 0)}/mo
                          </td>
                        </motion.tr>
                      ))}
                    </motion.tbody>
                  </table>
                </div>
              )
            )}
          </>
        )}
      </div>
    </AdminShell>
  );
}
