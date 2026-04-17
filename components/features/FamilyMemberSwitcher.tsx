'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, ChevronDown, Check, X } from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import { useFamilyMembers } from '@/hooks/useFamilyMembers';
import { useFamilyContext } from '@/hooks/useFamilyContext';
import { useAuth } from '@/hooks/useAuth';
import { FamilyMember } from '@/types';

export function FamilyMemberSwitcher() {
  const { profile } = useAuth();
  const { members } = useFamilyMembers();
  const { activeMember, setActiveMember } = useFamilyContext();
  const [open, setOpen] = useState(false);

  const displayName = activeMember ? activeMember.name.split(' ')[0] : (profile?.full_name?.split(' ')[0] ?? 'Me');
  const isOwner = !activeMember;

  if (members.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-150',
          'text-xs font-semibold',
          open
            ? 'bg-primary-800 border-primary-800 text-white'
            : 'bg-white border-slate-200 text-slate-700 hover:border-primary-300',
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {/* Mini avatar */}
        <div className={cn(
          'w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0',
          isOwner
            ? 'bg-primary-100 text-primary-800'
            : activeMember?.gender === 'female'
              ? 'bg-pink-200 text-pink-800'
              : 'bg-blue-200 text-blue-800',
        )}>
          {isOwner ? 'Me' : getInitials(activeMember!.name)}
        </div>
        <span className="max-w-[80px] truncate">{displayName}</span>
        <ChevronDown className={cn('w-3.5 h-3.5 shrink-0 transition-transform', open && 'rotate-180')} />
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />

          <div className="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-xl border border-slate-100 w-56 overflow-hidden animate-fade-up">
            {/* Account holder option */}
            <SwitcherRow
              label={profile?.full_name ?? 'Me (Account Holder)'}
              sublabel="Account holder"
              color="bg-primary-800"
              initials={profile?.full_name ? getInitials(profile.full_name) : 'Me'}
              active={isOwner}
              onClick={() => { setActiveMember(null); setOpen(false); }}
            />

            {members.length > 0 && (
              <div className="border-t border-slate-50 pt-1 pb-1">
                {members.map((m) => (
                  <SwitcherRow
                    key={m.id}
                    label={m.name}
                    sublabel={m.relationship}
                    color={m.gender === 'female' ? 'bg-gradient-to-br from-pink-400 to-rose-500' : 'bg-gradient-to-br from-blue-500 to-primary-700'}
                    initials={getInitials(m.name)}
                    active={activeMember?.id === m.id}
                    onClick={() => { setActiveMember(m); setOpen(false); }}
                  />
                ))}
              </div>
            )}

            {/* Manage link */}
            <div className="border-t border-slate-100 px-3 py-2">
              <Link
                href="/family"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-xs font-semibold text-accent-600 hover:text-accent-700 transition-colors"
              >
                <Users className="w-3.5 h-3.5" />
                Manage family members
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SwitcherRow({
  label, sublabel, color, initials, active, onClick,
}: {
  label: string;
  sublabel: string;
  color: string;
  initials: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors',
        active ? 'bg-primary-50' : 'hover:bg-slate-50',
      )}
      role="option"
      aria-selected={active}
    >
      <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0', color)}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-[13px] font-semibold truncate', active ? 'text-primary-800' : 'text-slate-800')}>
          {label}
        </p>
        <p className="text-[11px] text-slate-400 capitalize">{sublabel}</p>
      </div>
      {active && <Check className="w-3.5 h-3.5 text-accent-500 shrink-0" />}
    </button>
  );
}
