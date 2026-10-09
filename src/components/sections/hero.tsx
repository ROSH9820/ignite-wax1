"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Flower2,
  Hand,
  Heart,
  Leaf,
  Play,
  Star,
} from "lucide-react";
import { EASE, fadeUp, staggerContainer } from "@/lib/motion";
import { fetchProductBySlug } from "@/lib/api";
import { formatPrice } from "@/lib/config";

const badges = [
  { icon: Leaf, label: "100% Natural Soy Wax" },
  { icon: Hand, label: "Hand-Poured Small Batches" },
  { icon: Flower2, label: "Cruelty-Free & Vegan" },
] as const;

/**
 * Hero — two-column layout per the reference image:
 * left: tagline, two-tone serif headline, subtitle, pill CTAs, 4 feature badges.
 * right: large Serenity image with an overlapping floating "Best Seller" card.
 */
export function Hero() {
  const featured = fetchProductBySlug("serenity");

  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-heading">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pt-10 pb-16 sm:px-8 sm:pt-14 lg:grid-cols-2 lg:gap-16 lg:pt-20 lg:pb-24">
        {/* ── Left: copy ─────────────────────────────────────────────── */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.p
            variants={fadeUp}
            className="flex items-center gap-2 text-[13px] font-semibold tracking-wide text-body"
          >
            <Heart className="h-4 w-4 fill-peach text-peach" aria-hidden="true" />
            Handmade with intention
          </motion.p>

          <motion.h1
            id="hero-heading"
            variants={fadeUp}
            className="mt-5 font-serif text-[2.75rem] leading-[1.08] font-medium tracking-tight text-balance text-ink sm:text-6xl lg:text-[4.2rem]"
          >
            <span className="text-sage">Light a candle.</span>
            <br />
            <span className="text-peach">Find your calm.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-lg text-[15px] leading-relaxed text-body sm:text-base"
          >
            Hand-poured soy candles, made with clean, natural ingredients to
            elevate your space and your mood.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-sage px-7 py-3.5 text-[15px] font-semibold text-softwhite transition-colors duration-300 hover:bg-sage-deep"
            >
              Shop All Candles
              <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.8} />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2.5 rounded-full bg-softwhite px-7 py-3.5 text-[15px] font-semibold text-ink soft-shadow transition-colors duration-300 hover:bg-sage-soft"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-peach-soft">
                <Play className="ml-0.5 h-3 w-3 fill-sage text-sage" aria-hidden="true" />
              </span>
              Our Story
            </Link>
          </motion.div>

          <motion.ul variants={fadeUp} className="mt-10 flex max-w-xl flex-wrap gap-2.5">
            {badges.map((b) => (
              <li
                key={b.label}
                className="inline-flex items-center gap-2 rounded-full bg-softwhite px-4 py-2 text-[12.5px] font-medium text-body soft-shadow"
              >
                <b.icon className="h-4 w-4 text-sage" strokeWidth={1.6} aria-hidden="true" />
                {b.label}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* ── Right: image + floating card ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="relative mx-auto w-full max-w-xl lg:max-w-none"
        >
          {/* soft halo behind the pedestal */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 h-[86%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage-soft/70 blur-3xl"
          />
          <div className="relative overflow-hidden rounded-[2rem] soft-shadow-lg">
            { }
            <img
              src="/images/hero-serenity.jpg"
              alt="Serenity — a frosted glass soy candle with eucalyptus on a travertine pedestal"
              className="aspect-[4/5] w-full object-cover sm:aspect-[5/5]"
              fetchPriority="high"
            />
          </div>

          {/* Floating Best Seller card — overlaps top-right */}
          {featured && (
            <motion.aside
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.45, ease: EASE }}
              className="glass-card soft-shadow-lg absolute -top-5 right-3 w-60 rounded-2xl p-5 sm:-top-7 sm:-right-4 sm:w-72"
              aria-label="Best seller highlight"
            >
              <span className="inline-flex items-center rounded-full bg-peach px-3 py-1 text-[10.5px] font-bold tracking-[0.14em] text-ink uppercase">
                Best Seller
              </span>
              <h2 className="mt-3 font-serif text-xl font-semibold text-ink">{featured.name}</h2>
              <p className="mt-0.5 text-xs font-medium tracking-wide text-body">
                {featured.fragrance}
              </p>
              <p className="mt-2 flex items-center gap-1" aria-label={`Rated ${featured.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-peach text-peach"
                    strokeWidth={1}
                    aria-hidden="true"
                  />
                ))}
                <span className="ml-1 text-[11px] font-medium text-body">
                  {featured.rating} ({featured.reviewCount})
                </span>
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-ink">{formatPrice(featured.price)}</span>
                <Link
                  href={`/shop/${featured.slug}`}
                  className="group inline-flex items-center gap-1 text-[13px] font-bold text-sage transition-colors hover:text-sage-deep"
                >
                  Shop Now
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2} />
                </Link>
              </div>
            </motion.aside>
          )}
        </motion.div>
      </div>
    </section>
  );
}
