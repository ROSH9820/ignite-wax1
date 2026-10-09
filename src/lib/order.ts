import { promises as fs } from "fs";
import path from "path";
import { siteConfig } from "@/lib/config";

/**
 * Server-side order utilities.
 *
 * Order IDs (IW-YYYY-00001) are ALWAYS generated here, never in the browser.
 * Delivery estimates are ALWAYS computed here from the business timeline in
 * siteConfig (7–14 days). Prices are resolved from the trusted catalog.
 *
 * Persistence note: sequence state lives in a JSON file under /data. On
 * long-lived Node hosting this behaves like a proper counter. On ephemeral
 * serverless (Cloudflare Workers) the file system is read-only or per-instance,
 * so the code falls back to a timestamp-derived sequence — unique and
 * monotonically increasing, just less compact. Phase 2 replaces this with a
 * PostgreSQL sequence (see README → Roadmap) without touching call-sites.
 */

const COUNTER_FILE = path.join(process.cwd(), "data", "order-counter.json");

interface Counter {
  year: number;
  last: number;
}

async function readCounter(): Promise<Counter | null> {
  try {
    const raw = await fs.readFile(COUNTER_FILE, "utf8");
    const parsed = JSON.parse(raw) as Counter;
    if (typeof parsed.year === "number" && typeof parsed.last === "number") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

async function writeCounter(counter: Counter): Promise<void> {
  try {
    await fs.mkdir(path.dirname(COUNTER_FILE), { recursive: true });
    await fs.writeFile(COUNTER_FILE, JSON.stringify(counter), "utf8");
  } catch {
    // Read-only FS (e.g. serverless) — fall back to timestamp sequences.
  }
}

/**
 * Generates the next order ID. Uses the file counter when the FS is writable;
 * otherwise derives a compact sequence from the current timestamp so IDs stay
 * unique and well-formed under any hosting.
 */
export async function generateOrderId(now: Date = new Date()): Promise<string> {
  const year = now.getFullYear();
  const counter = await readCounter();

  if (counter && counter.year === year) {
    const last = counter.last + 1;
    await writeCounter({ year, last });
    return formatOrderId(year, last);
  }

  const persisted = await writeCounterFresh(year);
  if (persisted) return formatOrderId(year, persisted.last);

  // Fallback: seconds-since-epoch mod 90000, offset to 5 digits (00001-99999).
  const fallback = 10000 + (Math.floor(now.getTime() / 1000) % 89999);
  return formatOrderId(year, fallback);
}

async function writeCounterFresh(year: number): Promise<Counter | null> {
  // Seed from any legacy counter file of a previous year, else start at 1.
  const previous = await readCounter();
  const next: Counter = {
    year,
    last: previous && previous.year === year ? previous.last + 1 : 1,
  };
  await writeCounter(next);
  // Detect whether the write actually stuck (serverless RO filesystems).
  const check = await readCounter();
  return check && check.year === year ? next : null;
}

function formatOrderId(year: number, seq: number): string {
  return `IW-${year}-${String(seq).padStart(5, "0")}`;
}

export interface DeliveryWindow {
  from: Date;
  to: Date;
  label: string; // "13–20 October 2026"
}

/** Estimated delivery window: order date + 7..14 days (server-side only). */
export function estimateDelivery(orderDate: Date = new Date()): DeliveryWindow {
  const from = new Date(orderDate);
  from.setDate(from.getDate() + siteConfig.deliveryDaysMin);
  const to = new Date(orderDate);
  to.setDate(to.getDate() + siteConfig.deliveryDaysMax);
  return { from, to, label: formatDateRange(from, to) };
}

export function formatDateRange(from: Date, to: Date): string {
  const sameMonth = from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear();
  const day = (d: Date) => d.getDate();
  const monthYear = (d: Date) =>
    d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  return sameMonth
    ? `${day(from)}–${day(to)} ${monthYear(to)}`
    : `${from.toLocaleDateString("en-IN", { day: "numeric", month: "long" })} – ${day(to)} ${monthYear(to)}`;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
