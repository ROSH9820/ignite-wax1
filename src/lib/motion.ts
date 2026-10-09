/**
 * Shared Framer Motion primitives — the animation rulebook.
 *
 * Rules (per design spec):
 * - Scroll reveals use whileInView with `once: true`.
 * - Children stagger via variants.
 * - Easing: easeOut or cubic-bezier(0.16, 1, 0.3, 1) — never bouncy.
 * - Durations: 0.4s–0.7s.
 * - Strictly NO bouncing, spinning or layout shifts.
 * - prefers-reduced-motion is honoured globally via <MotionConfig reducedMotion="user" />.
 */

import type { Variants } from "framer-motion";

/** Signature easing — fast start, long gentle settle. */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.65, ease: EASE },
  },
};

/** Parent container — staggers its children on scroll into view. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

export const viewportOnce = { once: true, margin: "-80px" } as const;
