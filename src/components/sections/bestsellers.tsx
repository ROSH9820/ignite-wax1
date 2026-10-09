"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, StaggerGroup } from "@/components/ui/reveal";
import { ProductCard } from "@/components/shop/product-card";
import { fetchBestsellers } from "@/lib/api";

/**
 * Bestsellers — "Shop Our Bestsellers" heading + View All link, 4-column grid
 * of cards matching the reference design.
 */
export function Bestsellers() {
  const bestsellers = fetchBestsellers();

  return (
    <section aria-labelledby="bestsellers-heading" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold tracking-[0.22em] text-peach-deep uppercase">
            Loved by many
          </p>
          <h2
            id="bestsellers-heading"
            className="mt-2 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl"
          >
            Shop Our Bestsellers
          </h2>
        </div>
        <Link
          href="/shop"
          className="group inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-softwhite px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-sage-soft"
        >
          View All
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.8} />
        </Link>
      </Reveal>

      <StaggerGroup className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {bestsellers.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </StaggerGroup>
    </section>
  );
}
