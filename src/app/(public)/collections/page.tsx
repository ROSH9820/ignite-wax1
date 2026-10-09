import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, StaggerGroup } from "@/components/ui/reveal";
import { fetchProductsByCategory } from "@/lib/api";
import { formatPrice } from "@/lib/config";
import type { ProductCategory } from "@/lib/types";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore Ignite Wax collections by scent family — Floral, Woody, Warm and Fresh. Every candle hand-poured with clean soy wax.",
  alternates: { canonical: "/collections" },
};

const collections: Array<{
  key: ProductCategory;
  title: string;
  blurb: string;
}> = [
  {
    key: "Floral",
    title: "Floral",
    blurb: "Garden-fresh petals — peony, rose and lavender for soft, romantic rooms.",
  },
  {
    key: "Woody",
    title: "Woody",
    blurb: "Grounding woods — pine, cedar and amber for cozy, grounded evenings.",
  },
  {
    key: "Warm",
    title: "Warm",
    blurb: "Comforting wraps — vanilla, tonka and sandalwood for slow nights in.",
  },
  {
    key: "Fresh",
    title: "Fresh",
    blurb: "Clean air energy — eucalyptus, mint and citrus to lift the whole room.",
  },
];

export default function CollectionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-12 pb-20 sm:px-8 sm:pt-16">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-[12px] font-bold tracking-[0.22em] text-peach-deep uppercase">
          Collections
        </p>
        <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-balance text-ink sm:text-5xl">
          Four families of calm
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-body">
          Every Ignite Wax candle belongs to a scent family — start with the
          mood you want and follow your nose from there.
        </p>
      </header>

      <div className="mt-14 space-y-16">
        {collections.map((c) => {
          const items = fetchProductsByCategory(c.key);
          return (
            <section key={c.key} aria-labelledby={`collection-${c.key}`} className="scroll-mt-28">
              <Reveal className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2
                    id={`collection-${c.key}`}
                    className="font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
                  >
                    {c.title}
                  </h2>
                  <p className="mt-1.5 max-w-xl text-[14px] text-body">{c.blurb}</p>
                </div>
                <Link
                  href={`/shop?filter=${c.key}`}
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-sage transition-colors hover:text-sage-deep"
                >
                  Explore {c.title}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.8} />
                </Link>
              </Reveal>

              <StaggerGroup className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                {items.map((p) => (
                  <StaggerItemCard key={p.id} product={{ slug: p.slug, name: p.name, image: p.image, fragrance: p.fragrance, price: p.price }} />
                ))}
              </StaggerGroup>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function StaggerItemCard({
  product,
}: {
  product: { slug: string; name: string; image: string; fragrance: string; price: number };
}) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group overflow-hidden rounded-2xl bg-softwhite soft-shadow transition-shadow duration-500 hover:soft-shadow-lg"
    >
      <div className="aspect-square overflow-hidden">
        { }
        <img
          src={product.image}
          alt={`${product.name} — ${product.fragrance} soy candle`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="p-4">
        <h3 className="font-serif text-[15.5px] font-semibold text-ink transition-colors group-hover:text-sage">
          {product.name}
        </h3>
        <p className="mt-0.5 flex items-center justify-between text-xs text-body">
          <span className="truncate">{product.fragrance}</span>
          <span className="ml-2 shrink-0 font-semibold text-ink">{formatPrice(product.price)}</span>
        </p>
      </div>
    </Link>
  );
}
