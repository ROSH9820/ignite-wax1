"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { addToBag } from "@/lib/bag";
import { formatPrice, whatsappLink, whatsappMessages } from "@/lib/config";
import type { Product } from "@/lib/types";

/**
 * Quantity stepper + "Add to Order" (sage) + "Order via WhatsApp" (green).
 * Add to Order pushes the pre-filled selection straight into the order form.
 */
export function ProductActions({ product }: { product: Product }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);

  const total = product.price * qty;

  function handleAddToOrder() {
    addToBag(qty);
    toast(`${product.name} × ${qty} added to your bag`, {
      description: "Taking you to the order form…",
    });
    router.push(`/order?product=${product.slug}&qty=${qty}`);
  }

  return (
    <div>
      {/* Quantity */}
      <div className="flex items-center gap-4">
        <span className="text-[13px] font-bold tracking-wide text-ink uppercase">Quantity</span>
        <div className="inline-flex items-center rounded-full border border-line bg-softwhite soft-shadow">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-sage-soft disabled:opacity-35"
          >
            <Minus className="h-4 w-4" strokeWidth={1.8} />
          </button>
          <span
            aria-live="polite"
            className="w-9 text-center text-[15px] font-semibold text-ink tabular-nums"
          >
            {qty}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => Math.min(20, q + 1))}
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-sage-soft"
          >
            <Plus className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAddToOrder}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-sage px-7 py-4 text-[15px] font-semibold text-softwhite transition-colors duration-300 hover:bg-sage-deep"
        >
          <ShoppingBag className="h-4.5 w-4.5" strokeWidth={1.8} />
          Add to Order
        </button>
        <a
          href={whatsappLink(whatsappMessages.product(product.name))}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-whatsapp px-7 py-4 text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-whatsapp-deep"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5" aria-hidden="true">
            <path d="M12.04 2a9.9 9.9 0 0 0-8.4 15.2L2.2 21.8l4.7-1.4A9.9 9.9 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 1 1-4.1 15.1l-.3-.17-2.77.83.84-2.7-.19-.31A8.1 8.1 0 0 1 12.04 3.8Zm-3.1 3.9c-.2 0-.5.07-.72.36-.22.3-.86.9-.86 2.18 0 1.29.88 2.53 1 2.7.12.18 1.76 2.87 4.3 3.9 2.12.85 2.55.68 3.01.64.46-.04 1.49-.6 1.7-1.2.21-.58.21-1.08.15-1.19-.07-.1-.24-.16-.5-.29-.27-.13-1.5-.74-1.73-.82-.23-.09-.4-.13-.57.13-.17.27-.66.86-.8 1.03-.15.18-.3.2-.55.07-.27-.13-1.12-.41-2.14-1.32-.79-.7-1.32-1.57-1.47-1.84-.15-.26-.02-.41.11-.54.12-.12.27-.31.4-.47.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.06-.13-.57-1.4-.78-1.91-.2-.5-.41-.43-.57-.44h-.5Z" />
          </svg>
          Order via WhatsApp
        </a>
      </div>

      <p className="mt-4 text-center text-sm text-body sm:text-left">
        <span className="font-semibold text-ink">{formatPrice(total)}</span> total — delivery in
        7–14 days, payment verified manually after checkout.
      </p>
    </div>
  );
}
