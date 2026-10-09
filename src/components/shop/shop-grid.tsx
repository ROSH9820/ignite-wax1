"use client";

import { useMemo, useState } from "react";
import { StaggerGroup } from "@/components/ui/reveal";
import { ProductCard } from "@/components/shop/product-card";
import { fetchProducts } from "@/lib/api";
import type { ProductCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const filters: Array<"All" | ProductCategory> = ["All", "Floral", "Woody", "Warm", "Fresh"];

/**
 * Shop grid — filter pills across the top, full product grid below.
 * Client-side filtering keeps it instant; the catalog is tiny.
 */
export function ShopGrid({ initialFilter = "All" }: { initialFilter?: string }) {
  const [active, setActive] = useState<(typeof filters)[number]>(
    (filters as readonly string[]).includes(initialFilter)
      ? (initialFilter as (typeof filters)[number])
      : "All",
  );
  const products = useMemo(() => fetchProducts(), []);

  const visible =
    active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter candles by scent family"
        className="flex flex-wrap justify-center gap-2"
      >
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={active === f}
            onClick={() => setActive(f)}
            className={cn(
              "rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300",
              active === f
                ? "bg-sage font-semibold text-softwhite"
                : "bg-softwhite text-body soft-shadow hover:bg-sage-soft hover:text-ink",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <StaggerGroup
        key={active}
        className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
      >
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </StaggerGroup>

      {visible.length === 0 && (
        <p className="mt-16 text-center text-sm text-body">
          No candles in this collection yet — check back soon.
        </p>
      )}
    </div>
  );
}
