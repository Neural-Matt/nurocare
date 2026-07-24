'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconChip } from '@/components/ui/IconChip';
import { RevealOnScroll, springs } from '@/components/ui/motion';
import { useClaims } from '@/hooks/useClaims';
import { ClaimType } from '@/types';
import {
  Upload,
  X,
  FileImage,
  FileText,
  CheckCircle2,
  Stethoscope,
  Pill,
  FlaskConical,
  Building2,
  Smile,
  Clock,
  ChevronRight,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CLAIM_TYPES: { value: ClaimType; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'consultation', label: 'Consultation / GP Visit',  description: 'Doctor visits, specialist referrals', icon: Stethoscope },
  { value: 'medication',   label: 'Medication / Pharmacy',    description: 'Prescribed medications',            icon: Pill         },
  { value: 'lab',          label: 'Lab / Diagnostic Test',    description: 'Blood work, scans, X-rays',         icon: FlaskConical },
  { value: 'hospitalization', label: 'Hospitalization',       description: 'Inpatient stays and procedures',    icon: Building2    },
  { value: 'dental',       label: 'Dental Procedure',         description: 'Dental care and treatments',        icon: Smile        },
];

// ─── Success screen ──────────────────────────────────────────────────────────

function SuccessScreen({ onViewClaims }: { onViewClaims: () => void }) {
  return (
    <RevealOnScroll className="flex flex-col items-center justify-center py-16 text-center gap-5">
      <div className="w-20 h-20 rounded-full bg-accent-50 border-4 border-accent-200 flex items-center justify-center">
        <CheckCircle2 className="w-10 h-10 text-accent-500" />
      </div>
      <div>
        <h2 className="font-display font-semibold text-2xl text-neutral-900 mb-2">
          Claim Submitted!
        </h2>
        <p className="text-neutral-500 text-sm leading-relaxed max-w-[260px] mx-auto">
          We have received your claim and will begin reviewing it shortly. You can track its progress below.
        </p>
      </div>
      <div className="w-full bg-accent-50 border border-accent-100 rounded-2xl p-4 text-left">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-accent-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-accent-700 mb-0.5">What happens next?</p>
            <p className="text-xs text-accent-600 leading-snug">
              Our team reviews claims within 2–3 business days. You will be notified when your status changes.
            </p>
          </div>
        </div>
      </div>
      <Button
        variant="primary"
        fullWidth
        size="lg"
        onClick={onViewClaims}
        trailingIcon={<ChevronRight className="w-4 h-4" />}
      >
        View My Claims
      </Button>
    </RevealOnScroll>
  );
}

// ─── File upload ─────────────────────────────────────────────────────────────

function FileUploadZone({
  file,
  onFileChange,
  onRemove,
  error,
}: {
  file: File | null;
  onFileChange: (f: File | null) => void;
  onRemove: () => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const isImage = file?.type.startsWith('image/');

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) validateAndSet(dropped);
  };

  const validateAndSet = (picked: File) => {
    if (picked.size > 5 * 1024 * 1024) return;
    onFileChange(picked);
  };

  if (file) {
    return (
      <div className="rounded-2xl border border-neutral-150 overflow-hidden">
        {/* Image preview */}
        {isImage && (
          <div className="relative bg-neutral-50 h-40 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={URL.createObjectURL(file)}
              alt="receipt preview"
              className="max-h-full max-w-full object-contain p-2"
            />
          </div>
        )}
        {/* File info row */}
        <div className="flex items-center gap-3 bg-white p-3 border-t border-neutral-150">
          <IconChip icon={isImage ? <FileImage className="w-4 h-4" /> : <FileText className="w-4 h-4" />} color="primary" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-800 truncate">{file.name}</p>
            <p className="text-xs text-neutral-400">{(file.size / 1024).toFixed(0)} KB</p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          'flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-10 cursor-pointer transition-colors duration-150',
          dragOver
            ? 'border-accent-400 bg-accent-50/50'
            : 'border-neutral-300 bg-neutral-50 hover:border-neutral-400',
        )}
      >
        <div className="w-11 h-11 rounded-xl bg-white border border-neutral-150 flex items-center justify-center">
          <Upload className={cn('w-5 h-5 transition-colors', dragOver ? 'text-accent-500' : 'text-neutral-400')} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-neutral-700">
            {dragOver ? 'Drop it here' : 'Upload receipt'}
          </p>
          <p className="text-xs text-neutral-400 mt-0.5">JPEG, PNG or PDF — max 5MB</p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const picked = e.target.files?.[0];
          if (picked) validateAndSet(picked);
        }}
      />
      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
    </div>
  );
}

// ─── Type selector ───────────────────────────────────────────────────────────

function ClaimTypeSelector({
  value,
  onChange,
}: {
  value: ClaimType;
  onChange: (v: ClaimType) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = CLAIM_TYPES.find((t) => t.value === value)!;
  const IconCurrent = current.icon;

  return (
    <div>
      <label className="text-sm font-medium text-neutral-700 block mb-1.5">Claim Type</label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 bg-white border border-neutral-200 rounded-xl px-4 py-3 text-left hover:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500/20 transition-colors"
      >
        <IconChip icon={<IconCurrent className="w-4 h-4" />} color="primary" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-neutral-900">{current.label}</p>
          <p className="text-xs text-neutral-400">{current.description}</p>
        </div>
        <ChevronRight className={cn('w-4 h-4 text-neutral-300 transition-transform', open && 'rotate-90')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={springs.gentle}
            className="mt-2 rounded-2xl border border-neutral-150 bg-white shadow-card overflow-hidden"
          >
            {CLAIM_TYPES.map((t) => {
              const Icon = t.icon;
              const active = t.value === value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => { onChange(t.value); setOpen(false); }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-0',
                    active && 'bg-primary-50',
                  )}
                >
                  <IconChip icon={<Icon className="w-4 h-4" />} color={active ? 'primary' : 'neutral'} size="sm" />
                  <div>
                    <p className={cn('text-sm font-semibold', active ? 'text-primary-800' : 'text-neutral-800')}>{t.label}</p>
                    <p className="text-xs text-neutral-400">{t.description}</p>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewClaimPage() {
  const router = useRouter();
  const { submitClaim } = useClaims();

  const [type, setType] = useState<ClaimType>('consultation');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!amount || Number(amount) <= 0) e.amount = 'Enter a valid amount greater than 0';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    const { error } = await submitClaim({
      type,
      amount: Number(amount),
      notes: notes.trim() || null,
      receiptFile: file ?? undefined,
    });
    setLoading(false);

    if (!error) setSuccess(true);
  };

  if (success) {
    return (
      <AppShell title="Claim Submitted">
        <div className="max-w-lg md:max-w-xl mx-auto">
          <SuccessScreen onViewClaims={() => router.replace('/claims')} />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="New Claim">
      <div className="max-w-lg md:max-w-xl mx-auto">
        {/* Trust banner */}
        <div className="flex items-center gap-2.5 bg-primary-50 border border-primary-100 rounded-2xl px-4 py-3 mb-5">
          <Clock className="w-4 h-4 text-primary-700 shrink-0" />
          <p className="text-xs text-primary-700 font-medium leading-snug">
            Claims are reviewed within 2–3 business days. Keep your receipt ready.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Claim details */}
          <Card padding="lg">
            <p className="font-display font-semibold text-neutral-800 mb-5">Claim Details</p>
            <div className="space-y-5">
              <ClaimTypeSelector value={type} onChange={setType} />

              <Input
                label="Amount (ZMW)"
                type="number"
                placeholder="e.g. 350.00"
                min="1"
                size="lg"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors((prev) => ({ ...prev, amount: '' }));
                }}
                error={errors.amount}
                hint="Enter the total amount you paid"
                leftIcon={<span className="text-sm font-semibold text-neutral-400">K</span>}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-700">
                  Notes <span className="text-neutral-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Annual checkup at City Clinic, Dr. Banda"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm resize-none focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 transition-colors placeholder:text-neutral-400"
                />
                <p className="text-xs text-neutral-400">Describe the service, provider, or diagnosis</p>
              </div>
            </div>
          </Card>

          {/* File upload */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-4">
              <p className="font-display font-semibold text-neutral-800">Upload Receipt</p>
              <span className="text-[11px] text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full font-medium">
                Optional
              </span>
            </div>
            <FileUploadZone
              file={file}
              onFileChange={setFile}
              onRemove={() => setFile(null)}
              error={errors.file}
            />
          </Card>

          {/* Submit */}
          <div className="space-y-2.5 pb-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
              trailingIcon={!loading ? <ChevronRight className="w-4 h-4" /> : undefined}
            >
              Submit Claim
            </Button>
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full py-2.5 text-sm text-neutral-400 font-medium hover:text-neutral-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
