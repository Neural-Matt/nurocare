'use client';

import { Claim, ClaimStatus } from '@/types';
import {
  ClipboardList,
  Search,
  CheckCircle2,
  XCircle,
  Banknote,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Stage definitions ────────────────────────────────────────────────────

interface Stage {
  status: ClaimStatus;
  label: string;
  description: string;
  eta?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STAGES: Stage[] = [
  {
    status: 'submitted',
    label: 'Claim Received',
    description: 'Your claim has been logged and is awaiting review.',
    eta: 'Typically reviewed within 1 business day',
    icon: ClipboardList,
  },
  {
    status: 'reviewing',
    label: 'Under Review',
    description: 'Our team is verifying your claim details and receipt.',
    eta: 'Usually takes 1–2 business days',
    icon: Search,
  },
  {
    status: 'approved',
    label: 'Approved',
    description: 'Your claim was approved and payment is being processed.',
    eta: 'Payment within 1–3 business days',
    icon: CheckCircle2,
  },
  {
    status: 'paid',
    label: 'Payment Sent',
    description: 'Funds have been disbursed to your registered account.',
    icon: Banknote,
  },
];

const REJECTED_STAGE: Stage = {
  status: 'rejected',
  label: 'Not Approved',
  description: 'This claim could not be approved after review.',
  icon: XCircle,
};

const STATUS_ORDER: ClaimStatus[] = ['submitted', 'reviewing', 'approved', 'paid'];
const REJECTED_ORDER: ClaimStatus[] = ['submitted', 'reviewing', 'rejected', 'paid'];

type NodeState = 'done' | 'current' | 'pending' | 'unreachable';

function getNodeState(
  stageIndex: number,
  currentIndex: number,
  isRejected: boolean,
  isPaidStage: boolean,
): NodeState {
  if (isRejected && isPaidStage) return 'unreachable';
  if (stageIndex < currentIndex) return 'done';
  if (stageIndex === currentIndex) return 'current';
  return 'pending';
}

export function ClaimTimeline({ claim }: { claim: Claim }) {
  const isRejected = claim.status === 'rejected';

  const stages = isRejected
    ? STAGES.map((s) => (s.status === 'approved' ? REJECTED_STAGE : s))
    : STAGES;

  const orderedStatuses = isRejected ? REJECTED_ORDER : STATUS_ORDER;
  const currentIndex = orderedStatuses.indexOf(claim.status);

  return (
    <div className="relative">
      {stages.map((stage, index) => {
        const stageStatus = orderedStatuses[index];
        const isLast = index === stages.length - 1;
        const isPaidStage = stage.status === 'paid';
        const nodeState = getNodeState(index, currentIndex, isRejected, isPaidStage);
        const Icon = stage.icon;

        const nodeStyles: Record<NodeState, string> = {
          done: 'bg-accent-500 border-accent-500 text-white',
          current:
            stageStatus === 'rejected'
              ? 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-100 ring-4 ring-red-50'
              : 'bg-primary-800 border-primary-800 text-white shadow-lg shadow-primary-100 ring-4 ring-primary-50',
          pending: 'bg-white border-slate-200 text-slate-300',
          unreachable: 'bg-slate-50 border-slate-150 text-slate-200',
        };

        const connectorFilled = index < currentIndex && !(isRejected && index >= 2);

        const labelColor = cn(
          'font-display font-semibold text-sm leading-tight',
          nodeState === 'done' && 'text-slate-700',
          nodeState === 'current' && stageStatus === 'rejected' && 'text-red-600',
          nodeState === 'current' && stageStatus !== 'rejected' && 'text-slate-900',
          nodeState === 'pending' && 'text-slate-400',
          nodeState === 'unreachable' && 'text-slate-300',
        );

        const descColor = cn(
          'text-xs leading-snug mt-0.5',
          nodeState === 'done' && 'text-slate-500',
          nodeState === 'current' && 'text-slate-600',
          nodeState === 'pending' && 'text-slate-300',
          nodeState === 'unreachable' && 'text-slate-200',
        );

        return (
          <div key={stage.status} className={cn('relative flex gap-4', !isLast && 'pb-6')}>
            {/* Vertical connector line */}
            {!isLast && (
              <div
                className={cn(
                  'absolute left-[19px] w-0.5 transition-colors duration-500',
                  connectorFilled ? 'bg-accent-300' : 'bg-slate-100',
                )}
                style={{ top: '40px', bottom: 0 }}
              />
            )}

            {/* Node */}
            <div className="relative z-10 shrink-0">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                  nodeStyles[nodeState],
                )}
              >
                {nodeState === 'current' &&
                stageStatus !== 'rejected' &&
                stageStatus !== 'paid' ? (
                  <span className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex w-5 h-5 rounded-full bg-white opacity-20" />
                    <Icon className="w-4 h-4 relative z-10" />
                  </span>
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pt-1.5">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <p className={labelColor}>{stage.label}</p>
                {nodeState === 'current' && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border',
                      stageStatus === 'rejected'
                        ? 'bg-red-50 text-red-500 border-red-100'
                        : 'bg-primary-50 text-primary-700 border-primary-100',
                    )}
                  >
                    <span
                      className={cn(
                        'w-1 h-1 rounded-full',
                        stageStatus === 'rejected'
                          ? 'bg-red-500'
                          : 'bg-primary-700 animate-pulse',
                      )}
                    />
                    Current
                  </span>
                )}
                {nodeState === 'done' && (
                  <span className="text-[10px] font-semibold text-accent-600 bg-accent-50 border border-accent-100 px-2 py-0.5 rounded-full">
                    ✓ Done
                  </span>
                )}
              </div>

              <p className={descColor}>{stage.description}</p>

              {/* ETA — current or upcoming stages only */}
              {stage.eta && (nodeState === 'current' || nodeState === 'pending') && (
                <div
                  className={cn(
                    'flex items-center gap-1 mt-1.5',
                    nodeState === 'current' ? 'text-slate-400' : 'text-slate-300',
                  )}
                >
                  <Clock className="w-3 h-3 shrink-0" />
                  <p className="text-[11px]">{stage.eta}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
