'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { useFamilyMembers } from '@/hooks/useFamilyMembers';
import { FamilyMember, Relationship, Gender } from '@/types';
import { formatDate, getInitials, cn } from '@/lib/utils';
import {
  Plus, Users, Trash2, PencilLine, Baby, Heart, PersonStanding,
  UserRound, Shield, ShieldOff, X,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ── Helpers ───────────────────────────────────────────────────────────────────

const RELATIONSHIP_CONFIG: Record<Relationship, { label: string; icon: typeof Heart; color: string; bg: string }> = {
  spouse:  { label: 'Spouse',  icon: Heart,           color: 'text-rose-600',    bg: 'bg-rose-50'    },
  child:   { label: 'Child',   icon: Baby,            color: 'text-blue-600',    bg: 'bg-blue-50'    },
  parent:  { label: 'Parent',  icon: PersonStanding,  color: 'text-amber-600',   bg: 'bg-amber-50'   },
  sibling: { label: 'Sibling', icon: UserRound,       color: 'text-violet-600',  bg: 'bg-violet-50'  },
  other:   { label: 'Other',   icon: UserRound,       color: 'text-slate-600',   bg: 'bg-slate-100'  },
};

function calcAge(dob: string): number {
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

// ── Member card ───────────────────────────────────────────────────────────────

function MemberCard({
  member,
  onEdit,
  onRemove,
}: {
  member: FamilyMember;
  onEdit: (m: FamilyMember) => void;
  onRemove: (m: FamilyMember) => void;
}) {
  const rel = RELATIONSHIP_CONFIG[member.relationship];
  const RelIcon = rel.icon;
  const age = calcAge(member.date_of_birth);
  const initials = getInitials(member.name);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 flex items-start gap-4">
      {/* Avatar */}
      <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base text-white shadow-sm shrink-0',
        member.gender === 'female' ? 'bg-gradient-to-br from-pink-400 to-rose-500' :
        member.gender === 'male'   ? 'bg-gradient-to-br from-blue-500 to-primary-700' :
                                     'bg-gradient-to-br from-slate-400 to-slate-600',
      )}>
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-bold text-slate-900 text-[15px] leading-tight">{member.name}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {/* Relationship pill */}
              <span className={cn('inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full', rel.bg, rel.color)}>
                <RelIcon className="w-3 h-3" />
                {rel.label}
              </span>
              {/* Coverage */}
              <span className={cn(
                'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full',
                member.plan_id ? 'bg-accent-50 text-accent-700' : 'bg-slate-100 text-slate-500',
              )}>
                {member.plan_id ? <Shield className="w-3 h-3" /> : <ShieldOff className="w-3 h-3" />}
                {member.plan_id ? 'Covered' : 'No cover'}
              </span>
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(member)}
              className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-primary-700 transition-colors"
              aria-label="Edit"
            >
              <PencilLine className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onRemove(member)}
              className="w-8 h-8 rounded-xl hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
              aria-label="Remove"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* DOB / age */}
        <p className="text-xs text-slate-400 mt-2">
          {formatDate(member.date_of_birth)} · {age} years old · {member.gender}
        </p>
      </div>
    </div>
  );
}

// ── Add / Edit form ────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: '',
  relationship: 'spouse' as Relationship,
  date_of_birth: '',
  gender: 'female' as Gender,
  plan_id: null as string | null,
};

const RELATIONSHIP_OPTIONS: { value: Relationship; label: string }[] = [
  { value: 'spouse',  label: 'Spouse'  },
  { value: 'child',   label: 'Child'   },
  { value: 'parent',  label: 'Parent'  },
  { value: 'sibling', label: 'Sibling' },
  { value: 'other',   label: 'Other'   },
];

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'female', label: 'Female' },
  { value: 'male',   label: 'Male'   },
  { value: 'other',  label: 'Other'  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FamilyPage() {
  const { members, loading, addMember, updateMember, removeMember } = useFamilyMembers();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<FamilyMember | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<FamilyMember | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(member: FamilyMember) {
    setEditTarget(member);
    setForm({
      name: member.name,
      relationship: member.relationship,
      date_of_birth: member.date_of_birth,
      gender: member.gender,
      plan_id: member.plan_id,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.date_of_birth) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    if (editTarget) {
      await updateMember(editTarget.id, form);
    } else {
      await addMember(form);
    }
    setSaving(false);
    setModalOpen(false);
  }

  async function handleRemove() {
    if (!confirmRemove) return;
    await removeMember(confirmRemove.id);
    setConfirmRemove(null);
  }

  return (
    <AppShell title="My Family">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-xl text-primary-800">My Family</h1>
          <p className="text-slate-400 text-xs font-medium mt-0.5">
            {loading ? '…' : `${members.length} member${members.length !== 1 ? 's' : ''} covered`}
          </p>
        </div>
        <Button
          size="sm"
          variant="gradient"
          onClick={openAdd}
          leadingIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Add Member
        </Button>
      </div>

      {/* Coverage summary bar */}
      {!loading && members.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-4">
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide mb-1">Total Members</p>
            <p className="text-2xl font-display font-bold text-primary-800">{members.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-4">
            <p className="text-[11px] text-accent-600 font-medium uppercase tracking-wide mb-1">Covered</p>
            <p className="text-2xl font-display font-bold text-accent-600">
              {members.filter((m) => m.plan_id).length}
            </p>
          </div>
        </div>
      )}

      {/* Member list */}
      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : members.length === 0 ? (
        <Card padding="none" className="overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-accent-400 via-primary-600 to-accent-500" />
          <div className="flex flex-col items-center py-14 text-center gap-4 px-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center">
              <Users className="w-9 h-9 text-slate-300" />
            </div>
            <div>
              <p className="font-display font-bold text-slate-700 text-lg mb-1">No family members yet</p>
              <p className="text-sm text-slate-400 max-w-[220px] mx-auto leading-snug">
                Add a spouse, child, or parent to extend your health cover.
              </p>
            </div>
            <Button variant="gradient" onClick={openAdd} leadingIcon={<Plus className="w-4 h-4" />}>
              Add First Member
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {members.map((m) => (
            <MemberCard
              key={m.id}
              member={m}
              onEdit={openEdit}
              onRemove={setConfirmRemove}
            />
          ))}
        </div>
      )}

      {/* Add / Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => { if (!saving) setModalOpen(false); }}
        title={editTarget ? 'Edit Member' : 'Add Family Member'}
      >
        <div className="space-y-4">
          <Input
            label="Full name *"
            placeholder="e.g. Grace Mwale"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Select
            label="Relationship *"
            value={form.relationship}
            onChange={(e) => setForm((f) => ({ ...f, relationship: e.target.value as Relationship }))}
            options={RELATIONSHIP_OPTIONS}
          />
          <Input
            label="Date of birth *"
            type="date"
            value={form.date_of_birth}
            onChange={(e) => setForm((f) => ({ ...f, date_of_birth: e.target.value }))}
          />
          <Select
            label="Gender *"
            value={form.gender}
            onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as Gender }))}
            options={GENDER_OPTIONS}
          />
          <div className="flex gap-3 pt-1">
            <Button
              variant="ghost"
              fullWidth
              onClick={() => setModalOpen(false)}
              className="border border-slate-200"
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              fullWidth
              loading={saving}
              onClick={handleSave}
            >
              {editTarget ? 'Save Changes' : 'Add Member'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm remove modal */}
      <Modal
        open={!!confirmRemove}
        onClose={() => setConfirmRemove(null)}
        title="Remove Member"
      >
        <div className="space-y-4">
          <p className="text-slate-600 text-sm leading-relaxed">
            Are you sure you want to remove <strong>{confirmRemove?.name}</strong> from your family cover?
            Their claim history will be preserved.
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" fullWidth onClick={() => setConfirmRemove(null)} className="border border-slate-200">
              Cancel
            </Button>
            <Button variant="danger" fullWidth onClick={handleRemove}>
              Remove
            </Button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
