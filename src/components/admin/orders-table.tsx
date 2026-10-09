"use client";

import { useState } from "react";
import { Truck } from "lucide-react";
import { toast } from "sonner";
import { StatusPill } from "@/components/admin/status-pill";
import { fetchOrders } from "@/lib/api";
import { formatPrice } from "@/lib/config";
import type { Order, OrderStatus } from "@/lib/types";

/**
 * Orders management — Phase 1 demo table.
 * "Mark as Shipped" updates local state only (there is no database yet);
 * the shape already matches what a real orders table will return via
 * lib/api.fetchOrders() in Phase 2.
 */
export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>(() => fetchOrders());

  function markShipped(id: string) {
    setOrders((list) =>
      list.map((o) => (o.id === id ? { ...o, status: "Shipped" as OrderStatus } : o)),
    );
    toast.success(`Order ${id} marked as shipped`, {
      description: "Demo state — Phase 2 will persist this to PostgreSQL.",
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-softwhite soft-shadow">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[12px] tracking-wide text-body uppercase">
              <th className="px-5 py-3.5 font-bold">Order ID</th>
              <th className="px-5 py-3.5 font-bold">Date</th>
              <th className="px-5 py-3.5 font-bold">Customer Name</th>
              <th className="px-5 py-3.5 font-bold">Items</th>
              <th className="px-5 py-3.5 font-bold">Total</th>
              <th className="px-5 py-3.5 font-bold">Status</th>
              <th className="px-5 py-3.5 font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-line/60 last:border-0">
                <td className="px-5 py-4 font-semibold text-ink">{o.id}</td>
                <td className="px-5 py-4 text-body">
                  {new Date(o.date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-5 py-4">
                  <span className="block font-medium text-ink">{o.customerName}</span>
                  <span className="block text-xs text-body">{o.customerEmail}</span>
                </td>
                <td className="px-5 py-4 text-body">
                  {o.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                </td>
                <td className="px-5 py-4 font-semibold text-ink">{formatPrice(o.total)}</td>
                <td className="px-5 py-4">
                  <StatusPill status={o.status} />
                </td>
                <td className="px-5 py-4">
                  {o.status === "Pending" ? (
                    <button
                      type="button"
                      onClick={() => markShipped(o.id)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-sage px-4 py-2 text-[12.5px] font-semibold text-softwhite transition-colors hover:bg-sage-deep"
                    >
                      <Truck className="h-3.5 w-3.5" strokeWidth={1.8} />
                      Mark as Shipped
                    </button>
                  ) : (
                    <span className="text-xs text-body/70">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
