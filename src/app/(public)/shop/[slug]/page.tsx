import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductActions } from "@/components/shop/product-actions";
import { fetchProductBySlug, fetchProducts } from "@/lib/api";
import { formatPrice, siteConfig } from "@/lib/config";
import type { ProductTint } from "@/lib/types";
import { cn } from "@/lib/utils";

const tintClass: Record<ProductTint, string> = {
  sage: "bg-sage-soft",
  blush: "bg-blush",
  peach: "bg-peach-soft",
  cream: "bg-muted",
  lilac: "bg-lilac",
};

export function generateStaticParams() {
  return fetchProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = fetchProductBySlug(slug);
  if (!product) return { title: "Candle not found" };
  return {
    title: `${product.name} — ${product.fragrance}`,
    description: product.description,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: `${product.name} — ${product.fragrance} | ${siteConfig.name}`,
      description: product.description,
      images: [{ url: product.image, alt: `${product.name} soy candle` }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = fetchProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-5 pt-10 pb-20 sm:px-8 sm:pt-14">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-[13px] text-body">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="transition-colors hover:text-sage">Home</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/shop" className="transition-colors hover:text-sage">Shop</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-ink">{product.name}</li>
        </ol>
      </nav>

      <div className="mt-8 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Image */}
        <div className={cn("overflow-hidden rounded-[2rem] soft-shadow", tintClass[product.tint])}>
          { }
          <img
            src={product.image}
            alt={`${product.name} — ${product.fragrance} soy candle`}
            className="aspect-square w-full object-cover"
            fetchPriority="high"
          />
        </div>

        {/* Details */}
        <div>
          <span className="inline-flex items-center rounded-full bg-peach-soft px-3.5 py-1.5 text-[11px] font-bold tracking-[0.16em] text-peach-deep uppercase">
            {product.fragrance}
          </span>
          <h1 className="mt-4 font-serif text-[2.5rem] leading-[1.1] font-medium tracking-tight text-ink sm:text-[2.6rem]">
            {product.name}
          </h1>
          <p className="mt-3 text-2xl font-semibold text-ink">{formatPrice(product.price)}</p>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-body">
            {product.description}
          </p>

          <div className="mt-8">
            <ProductActions product={product} />
          </div>

          {/* Accordions */}
          <Accordion type="single" collapsible className="mt-10">
            <AccordionItem value="notes">
              <AccordionTrigger className="font-serif text-[17px] font-semibold text-ink">
                Fragrance Notes
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-[14px] leading-relaxed text-body">
                  <li>
                    <span className="font-semibold text-ink">Top:</span> {product.scentNotes.top}
                  </li>
                  <li>
                    <span className="font-semibold text-ink">Heart:</span> {product.scentNotes.heart}
                  </li>
                  <li>
                    <span className="font-semibold text-ink">Base:</span> {product.scentNotes.base}
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="details">
              <AccordionTrigger className="font-serif text-[17px] font-semibold text-ink">
                Details
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-[14px] leading-relaxed text-body">
                  <p>{product.details}</p>
                  <ul className="space-y-1.5">
                    <li>
                      <span className="font-semibold text-ink">Weight:</span> {product.weight}
                    </li>
                    <li>
                      <span className="font-semibold text-ink">Burn time:</span> {product.burnTime}
                    </li>
                    <li>
                      <span className="font-semibold text-ink">Wax:</span> 100% natural soy, cotton
                      wick, phthalate-free fragrance oils
                    </li>
                    <li>
                      <span className="font-semibold text-ink">Care:</span> trim the wick to 5 mm
                      before each burn and never leave a burning candle unattended
                    </li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
