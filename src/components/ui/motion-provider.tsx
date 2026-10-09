"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Global motion configuration.
 * Honours prefers-reduced-motion: users who ask the OS for reduced motion
 * get instant, non-animated UI. All page animations use easeOut-style
 * cubic-bezier(0.16, 1, 0.3, 1) — smooth and premium, never bouncy.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
