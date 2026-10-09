"use client";

import { useState } from "react";
import { Copy, Pencil } from "lucide-react";
import { toast } from "sonner";
import { fetchProducts } from "@/lib/api";
import { formatPrice } from "@/lib/config";
import type { Product, ProductTint } from "@/lib/types";
import { cn } from "@/lib/utils";

type StockStatus = "In stock" | "Low stock" | "Out of stock";

function stockStatusOf(p: Product): StockStatus {
  if (!p.available || p.stock <= 0) return "Out of stock";
  if (p.stock <= 5) return "Low stock";
  return "In stock";
}

const stockStyles: Record<StockStatus, string> = {
  "In stock": "bg-sage-soft text-sage",
  "Low stock": "bg-peach-soft text-peach-deep",
  "Out of stock": "bg-muted text-body",
};

const stockValues: Record<StockStatus, number> = {
  "In stock": 25,
  "Low stock": 4,
  "Out of stock": 0,
};

const inputBase =
  "w-full rounded-2xl border border-input bg-softwhite px-4 py-3 text-[14.5px] text-ink placeholder:text-body/45 transition-colors focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/25";
const labelBase = "mb-1.5 block text-[13px] font-bold text-ink";

/**
 * Products management — reads the catalog through lib/api.ts and offers an
 * Edit Product modal. Because there is no database in Phase 1, saving
 * updates UI state and surfaces the documented workflow toast.
 */
export function ProductsTable() {
  const [items, setItems] = useState<Product[]>(() => fetchProducts());
  const [editing, setEditing] = useState<Product | null>(null);

  function handleSave(next: Product) {
    setItems((list) => list.map((p) => (p.id === next.id ? next : p)));
    setEditing(null);
    toast.info("Edit saved to UI state", {
      description:
        "In Phase 1, copy this updated JSON and paste it into lib/data.ts. In Phase 2, this will save to PostgreSQL.",
      duration: 8000,
    });
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-softwhite soft-shadow">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[12px] tracking-wide text-body uppercase">
                <th className="px-5 py-3.5 font-bold">Product</th>
                <th className="px-5 py-3.5 font-bold">Fragrance</th>
                <th className="px-5 py-3.5 font-bold">Category</th>
                <th className="px-5 py-3.5 font-bold">Price</th>
                <th className="px-5 py-3.5 font-bold">Stock</th>
                <th className="px-5 py-3.5 font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => {
                const status = stockStatusOf(p);
                return (
                  <tr key={p.id} className="border-b border-line/60 last:border-0">
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-3">
                        { }
                        <img
                          src={p.image}
                          alt=""
                          className="h-11 w-11 rounded-xl object-cover"
                          loading="lazy"
                        />
                        <span className="font-serif font-semibold text-ink">{p.name}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-body">{p.fragrance}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-muted px-3 py-1 text-[11.5px] font-bold tracking-wide text-body uppercase">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-ink">{formatPrice(p.price)}</td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-3 py-1 text-[11.5px] font-bold tracking-wide uppercase",
                          stockStyles[status],
                        )}
                      >
                        {status} · {p.stock}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setEditing({ ...p })}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-[12.5px] font-semibold text-ink transition-colors hover:bg-sage-soft"
                      >
                        <Pencil className="h-3.5 w-3.5" strokeWidth={1.8} />
                        Edit Product
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <EditProductModal
          product={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
}

/* ── Edit modal ─────────────────────────────────────────────────────────── */

function EditProductModal({
  product,
  onClose,
  onSave,
}: {
  product: Product;
  onClose: () => void;
  onSave: (p: Product) => void;
}) {
  const [draft, setDraft] = useState<Product>({ ...product });

  function save() {
    // Apply the chosen stock status to the product record.
    const status =
      (Object.keys(stockValues) as StockStatus[]).find(
        (k) => stockValues[k] === draft.stock,
      ) ?? "In stock";
    onSave({
      ...draft,
      available: status !== "Out of stock",
      stock: draft.stock,
      price: Math.max(0, Math.round(draft.price)),
    });
  }

  async function copyJson() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(draft, null, 2));
      toast.success("Product JSON copied", {
        description: "Paste it into the products array in lib/data.ts.",
      });
    } catch {
      toast.error("Couldn't access the clipboard.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/40 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Edit ${product.name}`}
      onClick={onClose}
    >
      <div
        className="max-h-full w-full max-w-lg overflow-y-auto rounded-[1.75rem] bg-softwhite p-7 soft-shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-serif text-2xl font-semibold text-ink">Edit Product</h2>
        <p className="mt-1 text-[13px] text-body">
          {product.name} · {product.id}
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="edit-name" className={labelBase}>Name</label>
            <input
              id="edit-name"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className={inputBase}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-price" className={labelBase}>Price (USD)</label>
              <input
                id="edit-price"
                type="number"
                min={0}
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
                className={inputBase}
              />
            </div>
            <div>
              <label htmlFor="edit-stock" className={labelBase}>Stock status</label>
              <select
                id="edit-stock"
                value={stockStatusOf(draft)}
                onChange={(e) => {
                  const key = e.target.value as StockStatus;
                  setDraft({ ...draft, stock: stockValues[key] });
                }}
                className={cn(inputBase, "appearance-none")}
              >
                {Object.keys(stockValues).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="edit-desc" className={labelBase}>Description</label>
            <textarea
              id="edit-desc"
              rows={4}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              className={cn(inputBase, "resize-none")}
            />
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-2.5 sm:flex-row-reverse">
          <button
            type="button"
            onClick={save}
            className="flex-1 rounded-full bg-sage px-6 py-3.5 text-sm font-semibold text-softwhite transition-colors hover:bg-sage-deep"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={copyJson}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-line px-5 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-sage-soft"
          >
            <Copy className="h-4 w-4" strokeWidth={1.8} />
            Copy JSON
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-3.5 text-sm font-semibold text-body transition-colors hover:bg-muted sm:flex-none"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
