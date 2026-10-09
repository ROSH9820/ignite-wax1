import type { Metadata } from "next";
import { ProductsTable } from "@/components/admin/products-table";

export const metadata: Metadata = {
  title: "Products",
};

export default function AdminProductsPage() {
  return (
    <div>
      <header>
        <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">Products</h1>
        <p className="mt-1 text-sm text-body">
          Catalog data is served through lib/api.ts from lib/data.ts — edit
          freely, then paste the updated JSON back in Phase 1.
        </p>
      </header>
      <div className="mt-8">
        <ProductsTable />
      </div>
    </div>
  );
}
