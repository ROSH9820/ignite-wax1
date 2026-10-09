import type { Metadata } from "next";
import { ShopGrid } from "@/components/shop/shop-grid";

export const metadata: Metadata = {
  title: "Shop All Candles",
  description:
    "Browse every Ignite Wax candle — floral, woody, warm and fresh scent families, all hand-poured with natural soy wax.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;

  return (
    <div className="mx-auto max-w-7xl px-5 pt-12 pb-20 sm:px-8 sm:pt-16">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-[12px] font-bold tracking-[0.22em] text-peach-deep uppercase">
          The Collection
        </p>
        <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-balance text-ink sm:text-5xl">
          Find your scent
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-body">
          Eight small-batch candles across four scent families — every one
          hand-poured with clean soy wax, cotton wicks and nothing you
          wouldn&apos;t want in your home.
        </p>
      </header>

      <div className="mt-10">
        <ShopGrid initialFilter={filter ?? "All"} />
      </div>
    </div>
  );
}
