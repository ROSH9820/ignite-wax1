import type { Metadata } from "next";
import { OrdersTable } from "@/components/admin/orders-table";

export const metadata: Metadata = {
  title: "Orders",
};

export default function AdminOrdersPage() {
  return (
    <div>
      <header>
        <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">Orders</h1>
        <p className="mt-1 text-sm text-body">
          Demo records — real customer orders arrive by email until Phase 2
          connects this table to PostgreSQL.
        </p>
      </header>
      <div className="mt-8">
        <OrdersTable />
      </div>
    </div>
  );
}
