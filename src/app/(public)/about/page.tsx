import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Flame, Leaf, HeartHandshake } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Ignite Wax began in a small kitchen with a simple belief: a candle should be as clean and honest as the calm it creates. Hand-poured, small batch, always.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-12 pb-20 sm:px-8 sm:pt-16">
      {/* Header */}
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-[12px] font-bold tracking-[0.22em] text-peach-deep uppercase">
          Our Story
        </p>
        <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-balance text-ink sm:text-5xl">
          Light a candle. <span className="text-sage">Find your calm.</span>
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-body">
          Ignite Wax began in a small kitchen with a simple belief — a candle
          should be as clean and honest as the calm it creates.
        </p>
      </header>

      {/* Story image */}
      <Reveal className="mt-12">
        <div className="overflow-hidden rounded-[2rem] soft-shadow">
          { }
          <img
            src="/images/site/story-warm.jpg"
            alt="A warm candlelit corner of the Ignite Wax studio"
            className="aspect-[21/9] w-full object-cover"
            loading="lazy"
          />
        </div>
      </Reveal>

      {/* Narrative */}
      <div className="mx-auto mt-14 max-w-2xl space-y-5 text-[15px] leading-relaxed text-body">
        <p>
          What started as weekend experiments with soy wax and cotton wicks
          quickly became an obsession: how far could we push quality without
          compromising on clean ingredients? Every blend you smell today went
          through dozens of pours, burns and honest rejections before it earned
          a place in the collection.
        </p>
        <p>
          We pour in small batches, never rush curing, and pack every order by
          hand. No paraffins, no dyes, no shortcuts — just natural soy wax,
          premium fragrance oils and wicks that burn clean to the last layer.
          If a batch doesn&apos;t meet our nose test, it doesn&apos;t ship.
        </p>
        <p>
          And because calm is better when it&apos;s shared, a portion of every
          order supports reforestation in the Western Ghats — planting trees
          that will outlive every candle we ever make.
        </p>
      </div>

      {/* Values */}
      <div className="mt-16 grid gap-5 sm:grid-cols-3">
        {[
          {
            icon: Flame,
            title: "Hand-poured, always",
            text: "Small batches, poured and packed by hand in our studio — never mass-produced.",
          },
          {
            icon: Leaf,
            title: "Clean by default",
            text: "100% natural soy wax, cotton wicks and phthalate-free fragrance oils.",
          },
          {
            icon: HeartHandshake,
            title: "Made with intention",
            text: "Honest pricing, careful sourcing, and a tree planted for every order.",
          },
        ].map((v) => (
          <Reveal key={v.title}>
            <div className="h-full rounded-[1.5rem] bg-softwhite p-7 text-center soft-shadow">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage-soft text-sage">
                <v.icon className="h-5.5 w-5.5" strokeWidth={1.6} />
              </span>
              <h2 className="mt-4 font-serif text-lg font-semibold text-ink">{v.title}</h2>
              <p className="mt-2 text-[13.5px] leading-relaxed text-body">{v.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* CTA */}
      <Reveal className="mt-16 text-center">
        <Link
          href="/shop"
          className="group inline-flex items-center gap-2 rounded-full bg-sage px-8 py-4 text-[15px] font-semibold text-softwhite transition-colors hover:bg-sage-deep"
        >
          Shop the Collection
          <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.8} />
        </Link>
      </Reveal>
    </div>
  );
}
