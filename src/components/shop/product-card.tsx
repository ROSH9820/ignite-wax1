"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Plus } from "lucide-react";
import { toast } from "sonner";
import { addToBag } from "@/lib/bag";
import { formatPrice } from "@/lib/config";
import type { Product, ProductTint } from "@/lib/types";
import { cn } from "@/lib/utils";

const tintClass: Record<ProductTint, string> = {
  sage: "bg-sage-soft",
  blush: "bg-blush",
  peach: "bg-peach-soft",
  cream: "bg-muted",
  lilac: "bg-lilac",
};

/**
 * Product card — matches the reference design exactly:
 * soft-white rounded-2xl card, diffused shadow, image well with heart button,
 * serif name, fragrance line, short description, price + circular "+" button.
 */
export function ProductCard({ product }: { product: Product }) {
  const [loved, setLoved] = useState(false);

  function handleAdd() {
    addToBag(1);
    toast(`${product.name} added to your bag`, {
      description: "Tap the bag to place your order.",
    });
  }

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
      }}
      className="group overflow-hidden rounded-2xl bg-softwhite soft-shadow transition-shadow duration-500 hover:soft-shadow-lg"
    >
      <div className={cn("relative", tintClass[product.tint])}>
        <Link
          href={`/shop/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="block aspect-square overflow-hidden"
        >
          { }
          <img
            src={product.image}
            alt={`${product.name} — ${product.fragrance} soy candle`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </Link>
        <button
          type="button"
          aria-label={loved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={loved}
          onClick={() => setLoved((v) => !v)}
          className="absolute top-3 right-3 rounded-full bg-softwhite/90 p-2.5 text-ink/70 backdrop-blur-sm transition-colors hover:text-ink"
        >
          <Heart
            className={cn("h-4.5 w-4.5 transition-colors", loved && "fill-peach text-peach")}
            strokeWidth={1.6}
          />
        </button>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="font-serif text-[17px] font-semibold text-ink">
          <Link href={`/shop/${product.slug}`} className="transition-colors hover:text-sage">
            {product.name}
          </Link>
        </h3>
        <p className="mt-0.5 text-xs font-medium tracking-wide text-body uppercase">
          {product.fragrance}
        </p>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-body">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[15px] font-semibold text-ink">{formatPrice(product.price)}</span>
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${product.name} to bag`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-sage text-softwhite transition-all duration-300 hover:scale-105 hover:bg-sage-deep"
          >
            <Plus className="h-4.5 w-4.5" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
