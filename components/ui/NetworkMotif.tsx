'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

type NetworkTone = 'teal' | 'white' | 'navy';

interface NetworkMotifProps {
  className?: string;
  tone?: NetworkTone;
  animated?: boolean;
}

const toneColors: Record<NetworkTone, string> = {
  teal: '#14B8A6',
  white: '#FFFFFF',
  navy: '#0A2540',
};

// Fixed, hand-placed node/edge layout — an abstract healthcare + financial
// infrastructure network, not a literal map or chart. Deterministic (no
// randomness) so server and client markup match exactly.
const NODES = [
  { x: 40, y: 60 }, { x: 160, y: 30 }, { x: 280, y: 80 },
  { x: 90, y: 160 }, { x: 220, y: 190 }, { x: 340, y: 140 },
  { x: 60, y: 260 }, { x: 300, y: 260 },
];

const EDGES: [number, number][] = [
  [0, 1], [1, 2], [0, 3], [1, 4], [2, 4], [2, 5],
  [3, 4], [4, 5], [3, 6], [4, 7], [5, 7],
];

/**
 * Decorative "infrastructure network" motif — layered SVG lines + pulsing
 * nodes standing in for a real 3D scene. Zero bundle cost beyond an inline
 * SVG, degrades to a static image under prefers-reduced-motion.
 */
export function NetworkMotif({ className, tone = 'teal', animated = true }: NetworkMotifProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;
  const color = toneColors[tone];

  return (
    <svg viewBox="0 0 380 320" fill="none" className={cn('w-full h-full', className)} aria-hidden="true">
      <g opacity={0.35}>
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke={color}
            strokeWidth={1}
          />
        ))}
      </g>
      {NODES.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={i % 3 === 0 ? 4 : 2.5}
          fill={color}
          initial={{ opacity: 0.8 }}
          animate={shouldAnimate ? { opacity: [0.5, 1, 0.5] } : undefined}
          transition={
            shouldAnimate
              ? { duration: 3 + (i % 4), repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }
              : undefined
          }
        />
      ))}
    </svg>
  );
}
