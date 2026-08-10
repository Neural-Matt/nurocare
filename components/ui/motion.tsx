'use client';

import { motion, useReducedMotion, useScroll, useTransform, type Transition, type Variants } from 'framer-motion';
import { ReactNode, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Shared spring configs. Apple-style motion is springy but never
 * overshoots — keep damping high enough that nothing bounces past rest.
 */
export const springs: Record<'snappy' | 'gentle' | 'page', Transition> = {
  snappy: { type: 'spring', stiffness: 500, damping: 34 },
  gentle: { type: 'spring', stiffness: 300, damping: 32 },
  page:   { type: 'spring', stiffness: 380, damping: 34 },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: springs.gentle },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

/** Shared gesture props for tappable elements (buttons, interactive cards). */
export const tapScale = {
  whileTap: { scale: 0.96 },
  transition: springs.snappy,
};

/** Shared gesture props for hoverable surfaces (cards, tiles). */
export const hoverLift = {
  whileHover: { y: -2 },
  whileTap: { scale: 0.985 },
  transition: springs.snappy,
};

interface StaggerProps {
  children: ReactNode;
  className?: string;
  /** Delay between each direct child's reveal, in seconds. */
  gap?: number;
  /** Re-run every time the element scrolls into view instead of only once. */
  repeat?: boolean;
}

/**
 * Wraps a group of children, revealing each one in sequence as the group
 * scrolls into view. Children should be plain elements — Stagger applies
 * `fadeUp` as the variant for immediate children via variant inheritance,
 * so wrap each child in a `motion.div variants={fadeUp}` (or reuse
 * `<Reveal>` below) for the stagger to animate them individually.
 */
export function Stagger({ children, className, gap = 0.08, repeat = false }: StaggerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: !repeat, margin: '-80px' }}
      variants={{ show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
}

/** A single staggered child — use inside <Stagger>. */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  /** Vertical travel in pixels as the layer crosses the viewport. Negative = moves up relative to scroll. */
  offset?: number;
}

/**
 * Subtle scroll-linked depth for landing/hero compositions — a layer drifts
 * `offset` px over its own scroll-through of the viewport. This is the
 * "spatial" primitive standing in for 3D: no new dependency, and it's a
 * no-op transform (flat, static) under prefers-reduced-motion.
 */
export function ParallaxLayer({ children, className, offset = 40 }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-offset, offset]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/** Consistent page-entrance treatment — wrap a page's top-level content in this for a settled fade/rise on mount. */
export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.page}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: Variants;
  repeat?: boolean;
}

/** Single-item scroll reveal, for sections that aren't a staggered group. */
export function RevealOnScroll({
  children,
  className,
  delay = 0,
  variant = fadeUp,
  repeat = false,
}: RevealOnScrollProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: !repeat, margin: '-80px' }}
      variants={variant}
      transition={{ ...springs.gentle, delay }}
    >
      {children}
    </motion.div>
  );
}
