import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderForm } from "@/components/order/order-form";

export const metadata: Metadata = {
  title: "Place an Order",
  description:
    "Order your Ignite Wax candles in minutes — fill in your details, pay via UPI after ordering, and receive your candles in 7–14 days.",
  alternates: { canonical: "/order" },
};

export default function OrderPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-12 pb-20 sm:px-8 sm:pt-16">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-[12px] font-bold tracking-[0.22em] text-peach-deep uppercase">
          Order
        </p>
        <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-balance text-ink sm:text-5xl">
          Almost yours. <span className="text-peach">Let&apos;s make it official.</span>
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-body">
          Fill in your details and we&apos;ll send payment instructions. No
          account needed — your confirmation arrives by email in seconds.
        </p>
      </header>

      <div className="mt-12">
        <Suspense
          fallback={
            <div className="mx-auto max-w-5xl">
              <div className="h-96 animate-pulse rounded-[2rem] bg-softwhite/70" />
            </div>
          }
        >
          <OrderForm />
        </Suspense>
      </div>
    </div>
  );
}
