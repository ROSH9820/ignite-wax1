"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LockKeyhole } from "lucide-react";
import { LogoMark } from "@/components/layout/logo";

/** Minimal password gate for the Phase 1 admin (POST /api/admin/login). */
export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => null);
      setError(data?.message ?? "Login failed. Please try again.");
    } catch {
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-[2rem] bg-softwhite p-8 soft-shadow"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage-soft">
          <LockKeyhole className="h-6 w-6 text-sage" strokeWidth={1.6} />
        </span>
        <h1 className="mt-4 text-center font-serif text-2xl font-semibold text-ink">
          Ignite Wax Admin
        </h1>
        <p className="mt-1.5 text-center text-[13px] text-body">
          Enter the admin password to continue.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-2xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive"
          >
            {error}
          </p>
        )}

        <label htmlFor="admin-password" className="mt-5 mb-1.5 block text-[13px] font-bold text-ink">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full rounded-2xl border border-input bg-softwhite px-4 py-3 text-[14.5px] text-ink transition-colors focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/25"
          placeholder="••••••••"
        />

        <button
          type="submit"
          disabled={busy || password.length === 0}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sage px-6 py-3.5 text-[15px] font-semibold text-softwhite transition-colors hover:bg-sage-deep disabled:opacity-55"
        >
          {busy ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : "Sign in"}
        </button>
        <p className="mt-4 text-center text-xs leading-relaxed text-body/80">
          Phase 1 demo gate — default password{" "}
          <code className="rounded bg-cream px-1.5 py-0.5 text-ink">ignite2026</code>.
          Set <code className="rounded bg-cream px-1.5 py-0.5 text-ink">ADMIN_PASSWORD</code>{" "}
          in production.
        </p>
      </form>
    </div>
  );
}
