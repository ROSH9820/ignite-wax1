import type { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const styles: Record<OrderStatus, string> = {
  Pending: "bg-peach-soft text-peach-deep",
  Shipped: "bg-sage-soft text-sage",
  Delivered: "bg-muted text-body",
};

/** Status pill used across the admin order tables. */
export function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11.5px] font-bold tracking-wide uppercase",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}
