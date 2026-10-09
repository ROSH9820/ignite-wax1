"use client";

import { useLayoutEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SPLISH_KEY = "hasSeenSplash";
/** How long the splash holds before the exit animation starts (ms). */
const HOLD_MS = 3000;
/** Exit animation duration (ms) — fades out + scales the logo up. */
const EXIT_MS = 600;

/**
 * Premium splash screen — shown once per browser session (sessionStorage).
 *
 * Flow:
 *   1. A tiny inline script in `app/layout.tsx` tags <html> with
 *      `splash-pending` BEFORE first paint when the splash will show,
 *      so the page never flashes content underneath (CSS keeps the body
 *      invisible and the background cream).
 *   2. On mount this component removes the tag, shows the full-screen
 *      overlay (cream #F5F0EB) with the Ignite Wax emblem pulsing gently.
 *   3. After HOLD_MS it sets the sessionStorage flag and plays the exit:
 *      overlay fades to 0 while the logo scales 1 → 1.1 (AnimatePresence).
 *
 * Respects prefers-reduced-motion: no pulse, quick simple fade.
 */
export function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    // Reveal the body (the anti-flash tag is only present on first visit).
    document.documentElement.classList.remove("splash-pending");

    let seen = false;
    try {
      seen = sessionStorage.getItem(SPLISH_KEY) === "true";
    } catch {
      /* private mode / storage disabled — treat as seen to avoid loops */
      seen = true;
    }

    if (seen) return;

    setVisible(true);
    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem(SPLISH_KEY, "true");
      } catch {
        /* non-fatal */
      }
      setVisible(false);
    }, reducedMotion ? Math.min(HOLD_MS, 1200) : HOLD_MS);

    return () => clearTimeout(timer);
  }, [reducedMotion]);

  // Lock scroll while the splash is up so the hero never peeks underneath.
  useLayoutEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  return (
    <div data-splash-root aria-hidden={!visible}>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="splash"
            data-splash
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.3 : EXIT_MS / 1000, ease: "easeOut" }}
            role="status"
            aria-label="Ignite Wax is loading"
          >
            {/* Emblem — pulses gently 1.0 → 1.05 → 1.0 (skipped if reduced motion) */}
            <motion.div
              className="relative"
              initial={reducedMotion ? undefined : { scale: 1 }}
              exit={reducedMotion ? undefined : { scale: 1.1 }}
              transition={{ duration: EXIT_MS / 1000, ease: "easeOut" }}
            >
              <motion.div
                animate={reducedMotion ? undefined : { scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/images/site/logo-lockup.png"
                  alt="Ignite Wax — Light up your moments"
                  width={780}
                  height={278}
                  priority
                  draggable={false}
                  className="h-auto w-[min(440px,84vw)] select-none"
                />
              </motion.div>
            </motion.div>

            <motion.p
              className="mt-7 text-[11px] font-bold tracking-[0.35em] text-body/70 uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
            >
              Light up your moments
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
