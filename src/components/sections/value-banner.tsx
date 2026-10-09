"use client";

import { Clock, Heart, Leaf } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/reveal";

const values = [
  {
    icon: Heart,
    title: "More than a candle",
    text: "Hand-poured in small batches with intention and care.",
  },
  {
    icon: Leaf,
    title: "Clean ingredients",
    text: "Natural soy wax, cotton wicks, premium fragrance oils — nothing else.",
  },
  {
    icon: Clock,
    title: "Long, clean burn",
    text: "Up to 55 hours of steady, smoke-free fragrance.",
  },
  {
    icon: Heart,
    title: "Made to gift",
    text: "Arrives gift-ready, with a note card included.",
  },
] as const;

/**
 * Value banner — 4-column band with icon wells and short value propositions,
 * matching the reference design's feature strip.
 */
export function ValueBanner() {
  return (
    <section aria-label="Why choose Ignite Wax" className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-24">
      <Reveal>
        <div className="rounded-[2.5rem] bg-sage-soft/70 px-6 py-10 sm:px-10 sm:py-12">
          <StaggerGroup className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <StaggerItem key={v.title} className="text-center sm:text-left">
                <div className="flex justify-center sm:justify-start">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-softwhite text-sage soft-shadow">
                    <v.icon className="h-5.5 w-5.5" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold text-ink">{v.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-body">{v.text}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </Reveal>
    </section>
  );
}
