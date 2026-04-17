'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { MOCK_DOCTORS } from '@/lib/mock-data';
import { Doctor, DoctorSpecialty, DoctorAvailability } from '@/types';
import {
  MessageCircle,
  Star,
  Clock,
  Stethoscope,
  Baby,
  Brain,
  Sparkles,
  Heart,
  Apple,
  ShieldCheck,
  ChevronRight,
  Phone,
} from 'lucide-react';

// ─── Config ──────────────────────────────────────────────────────────────────

const SPECIALTY_CONFIG: Record<DoctorSpecialty, { label: string; icon: React.ElementType }> = {
  general:       { label: 'General',       icon: Stethoscope },
  paediatrics:   { label: 'Paediatrics',   icon: Baby        },
  mental_health: { label: 'Mental Health', icon: Brain       },
  dermatology:   { label: 'Dermatology',   icon: Sparkles    },
  gynaecology:   { label: 'Gynaecology',   icon: Heart       },
  nutrition:     { label: 'Nutrition',     icon: Apple       },
};

const AVAILABILITY_CONFIG: Record<DoctorAvailability, { label: string; color: string; dot: string }> = {
  available: { label: 'Available now', color: 'text-emerald-700', dot: 'bg-emerald-500' },
  busy:      { label: 'Busy',          color: 'text-warning-700', dot: 'bg-warning-500' },
  offline:   { label: 'Offline',       color: 'text-slate-500',   dot: 'bg-slate-400'   },
};

const ALL_SPECIALTIES = ['all', ...Object.keys(SPECIALTY_CONFIG)] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildWhatsAppUrl(doctor: Doctor): string {
  const msg = encodeURIComponent(
    `Hello Dr. ${doctor.name.split(' ').slice(1).join(' ')}, I am a NuroCare member and would like to request a teleconsultation. My concern is: `
  );
  return `https://wa.me/${doctor.whatsapp_number}?text=${msg}`;
}

// ─── DoctorCard ───────────────────────────────────────────────────────────────

function DoctorCard({ doctor }: { doctor: Doctor }) {
  const avail = AVAILABILITY_CONFIG[doctor.availability];
  const specialty = SPECIALTY_CONFIG[doctor.specialty];
  const SpecIcon = specialty.icon;

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm shrink-0', doctor.avatar_color)}>
            {doctor.avatar_initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-primary-800 text-sm leading-tight">{doctor.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <SpecIcon className="w-3 h-3 text-slate-400" />
                  <p className="text-xs text-slate-500">{specialty.label}</p>
                </div>
              </div>
              {/* Availability badge */}
              <div className={cn('flex items-center gap-1.5 shrink-0', avail.color)}>
                <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', avail.dot, doctor.availability === 'available' && 'animate-pulse')} />
                <span className="text-[11px] font-semibold">{avail.label}</span>
              </div>
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-warning-400 text-warning-400" />
                <span className="font-semibold text-slate-600">{doctor.rating}</span>
              </div>
              <span>{doctor.experience_years} yrs exp</span>
              <span>{doctor.consult_count.toLocaleString()} consults</span>
            </div>
          </div>
        </div>

        {/* Languages */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {doctor.languages.map((lang) => (
            <span key={lang} className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
              {lang}
            </span>
          ))}
        </div>

        {/* Qualifications */}
        <p className="text-[11px] text-slate-400 mt-1.5">{doctor.qualifications}</p>

        {doctor.next_available && (
          <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-slate-500">
            <Clock className="w-3 h-3" />
            <span>Next available: <span className="font-semibold">{doctor.next_available}</span></span>
          </div>
        )}
      </div>

      {/* Action footer */}
      <div className="border-t border-slate-100 px-4 py-3">
        <a href={buildWhatsAppUrl(doctor)} target="_blank" rel="noopener noreferrer">
          <Button
            variant={doctor.availability === 'available' ? 'teal' : 'outline'}
            size="sm"
            className="w-full"
            leadingIcon={<MessageCircle className="w-4 h-4" />}
            disabled={doctor.availability === 'offline'}
          >
            {doctor.availability === 'available'
              ? 'Chat on WhatsApp'
              : doctor.availability === 'busy'
              ? 'Send Message'
              : 'Currently Unavailable'}
          </Button>
        </a>
      </div>
    </Card>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TelemedicinePage() {
  const [filter, setFilter] = useState<string>('all');

  const filtered =
    filter === 'all'
      ? MOCK_DOCTORS
      : MOCK_DOCTORS.filter((d) => d.specialty === filter);

  const availableCount = MOCK_DOCTORS.filter((d) => d.availability === 'available').length;

  return (
    <AppShell title="See a Doctor">
      <div className="space-y-5 pb-4">

        {/* Hero banner */}
        <div className="relative overflow-hidden rounded-2xl bg-primary-800 p-5 text-white">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent-500/20 blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">{availableCount} doctors online now</span>
            </div>
            <h2 className="text-xl font-display font-bold mb-1">Speak to a doctor</h2>
            <p className="text-white/60 text-sm leading-snug mb-4">
              Get expert medical advice from the comfort of your home via WhatsApp.
            </p>
            <div className="flex items-center gap-3 text-[11px] text-white/50">
              <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-accent-400" /> Covered by plan</div>
              <div className="flex items-center gap-1"><Clock className="w-3 h-3 text-accent-400" /> Avg response &lt;10 min</div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <Card padding="lg">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">How it works</p>
          <div className="space-y-3">
            {[
              { step: '1', label: 'Choose a doctor', sub: 'Filter by specialty or pick the first available' },
              { step: '2', label: 'Chat on WhatsApp', sub: 'A pre-filled message opens — just add your symptoms' },
              { step: '3', label: 'Get your advice', sub: 'Doctor responds with guidance, referrals or prescription' },
            ].map(({ step, label, sub }) => (
              <div key={step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {step}
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary-800">{label}</p>
                  <p className="text-xs text-slate-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Specialty filter */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Our Doctors</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
            {ALL_SPECIALTIES.map((s) => {
              const label = s === 'all' ? 'All' : SPECIALTY_CONFIG[s as DoctorSpecialty].label;
              return (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={cn(
                    'shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all',
                    filter === s
                      ? 'bg-primary-800 border-primary-800 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-primary-800 hover:text-primary-800',
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Doctor list */}
        <div className="space-y-3">
          {filtered.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-10 text-slate-400">
              <Stethoscope className="w-8 h-8 mx-auto opacity-30 mb-2" />
              <p className="text-sm font-medium">No doctors in this specialty right now</p>
            </div>
          )}
        </div>

        {/* Emergency note */}
        <Card padding="lg" className="border-red-100 bg-red-50">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-red-800 mb-0.5">Emergency?</p>
              <p className="text-xs text-red-600 leading-snug">
                For life-threatening emergencies, call <span className="font-bold">991</span> or go to your nearest A&E. Telemedicine is for non-emergency consultations only.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
