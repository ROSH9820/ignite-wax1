"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

/** Clears the Phase 1 admin cookie and returns to the login screen. */
export function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => null);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-body transition-colors hover:bg-destructive/10 hover:text-destructive"
    >
      <LogOut className="h-4.5 w-4.5" strokeWidth={1.6} />
      Sign out
    </button>
  );
}
