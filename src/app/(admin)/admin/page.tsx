import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, PackageX, ReceiptText, Wallet } from "lucide-react";
import { computeAdminStats, fetchOrders } from "@/lib/api";
import { formatPrice } from "@/lib/config";
import type { OrderStatus } from "@/lib/types";
import { StatusPill } from "@/components/admin/status-pill";

export const metadata: Metadata = {
  title: "Dashboard",
};

/**
 * Dashboard overview — 3 stat cards (Total Orders (Month), Revenue
 * (Estimated), Low Stock Items) + the recent-orders table. All data flows
 * through lib/api.ts, so the Phase 2 database swap touches nothing here.
 */
export default function AdminDashboardPage() {
  const stats = computeAdminStats();
  const recentOrders = fetchOrders().slice(0, 5);

  const cards = [
    {
      label: "Total Orders (Month)",
      value: String(stats.ordersThisMonth),
      sub: "orders received in October",
      icon: ReceiptText,
    },
    {
      label: "Revenue (Estimated)",
      value: formatPrice(stats.revenueEstimate),
      sub: "across all recorded orders",
      icon: Wallet,
    },
    {
      label: "Low Stock Items",
      value: String(stats.lowStockCount),
      sub: "products at 5 units or fewer",
      icon: PackageX,
    },
  ];

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">Dashboard</h1>
          <p className="mt-1 text-sm text-body">A quick pulse of the store this month.</p>
        </div>
        <Link
          href="/admin/orders"
          className="group inline-flex items-center gap-1.5 rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-softwhite transition-colors hover:bg-sage-deep"
        >
          Manage Orders
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.8} />
        </Link>
      </header>

      {/* Stat cards */}
      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-softwhite p-6 soft-shadow">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-soft text-sage">
                <c.icon className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <p className="text-[13px] font-bold tracking-wide text-body uppercase">{c.label}</p>
            </div>
            <p className="mt-4 font-serif text-4xl font-semibold text-ink">{c.value}</p>
            <p className="mt-1 text-[12.5px] text-body">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <section aria-labelledby="recent-orders" className="mt-10">
        <div className="flex items-center justify-between">
          <h2 id="recent-orders" className="font-serif text-xl font-semibold text-ink">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-sm font-semibold text-sage transition-colors hover:text-sage-deep"
          >
            View all →
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl bg-softwhite soft-shadow">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[12px] tracking-wide text-body uppercase">
                  <th className="px-5 py-3.5 font-bold">Order ID</th>
                  <th className="px-5 py-3.5 font-bold">Customer</th>
                  <th className="px-5 py-3.5 font-bold">Items</th>
                  <th className="px-5 py-3.5 font-bold">Total</th>
                  <th className="px-5 py-3.5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-line/60 last:border-0">
                    <td className="px-5 py-4 font-semibold text-ink">{o.id}</td>
                    <td className="px-5 py-4 text-ink">{o.customerName}</td>
                    <td className="px-5 py-4 text-body">
                      {o.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                    </td>
                    <td className="px-5 py-4 font-semibold text-ink">{formatPrice(o.total)}</td>
                    <td className="px-5 py-4">
                      <StatusPill status={o.status as OrderStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
