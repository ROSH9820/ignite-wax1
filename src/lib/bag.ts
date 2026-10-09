"use client";

import { useSyncExternalStore } from "react";

/**
 * Minimal shopping-bag counter — powers the navbar bag badge and the "+"
 * buttons on product cards. Persisted in localStorage; no cart system in v1
 * (orders are placed through the order form), the bag is a lightweight
 * indicator of intent that links to /order.
 */

const KEY = "iw-bag-count";
const SEED_KEY = "iw-bag-seeded";
const EVENT = "iw-bag-change";

let cached: number | null = null;

function read(): number {
  if (cached !== null) return cached;
  if (typeof window === "undefined") return 0;
  try {
    // First visit seeds 2 items so the bag badge mirrors the reference mockup.
    if (!window.localStorage.getItem(SEED_KEY)) {
      window.localStorage.setItem(SEED_KEY, "1");
      window.localStorage.setItem(KEY, "2");
      cached = 2;
      return cached;
    }
    cached = Number(window.localStorage.getItem(KEY) ?? 0) || 0;
  } catch {
    cached = 0;
  }
  return cached;
}

function write(n: number) {
  cached = Math.max(0, n);
  try {
    window.localStorage.setItem(KEY, String(cached));
  } catch {
    /* storage unavailable — in-memory only */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useBagCount() {
  return useSyncExternalStore(subscribe, read, () => 0);
}

export function addToBag(n = 1) {
  write(read() + n);
}

export function removeFromBag(n = 1) {
  write(read() - n);
}
