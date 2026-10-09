"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { fetchProducts } from "@/lib/api";
import { formatPrice } from "@/lib/config";
import { useBagCount } from "@/lib/bag";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const bagCount = useBagCount();
  const [open, setOpen] = useState(false); // mobile menu
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInput = useRef<HTMLInputElement>(null);

  // Lock body scroll while an overlay is open (DOM sync only — no setState).
  useEffect(() => {
    document.body.style.overflow = open || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, searchOpen]);

  const allProducts = fetchProducts();
  const results =
    query.trim().length > 0
      ? allProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.fragrance.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()),
        )
      : [];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        aria-label="Primary"
        className="glass-card soft-shadow mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 rounded-full px-4 sm:h-16 sm:px-6"
      >
        <Link href="/" aria-label="Ignite Wax — home" className="shrink-0">
          <Logo />
        </Link>

        {/* Desktop links — active state: sage pill */}
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-[14px] font-medium text-body transition-colors hover:bg-sage-soft hover:text-ink",
                  isActive(l.href) && "bg-sage font-semibold text-softwhite hover:bg-sage hover:text-softwhite",
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop actions — thin line icons */}
        <div className="hidden items-center gap-1 lg:flex">
          <button
            type="button"
            aria-label="Search products"
            onClick={() => setSearchOpen(true)}
            className="rounded-full p-2.5 text-ink/70 transition-colors hover:bg-sage-soft hover:text-ink"
          >
            <Search className="h-5 w-5" strokeWidth={1.6} />
          </button>
          <Link
            href="/order"
            aria-label="Your account and orders"
            className="rounded-full p-2.5 text-ink/70 transition-colors hover:bg-sage-soft hover:text-ink"
          >
            <User className="h-5 w-5" strokeWidth={1.6} />
          </Link>
          <Link
            href="/order"
            aria-label={`Shopping bag, ${bagCount} item${bagCount === 1 ? "" : "s"}`}
            className="relative rounded-full p-2.5 text-ink/70 transition-colors hover:bg-sage-soft hover:text-ink"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.6} />
            {bagCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-peach text-[10px] font-bold text-ink">
                {bagCount > 9 ? "9+" : bagCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile actions — hamburger + cart always accessible */}
        <div className="flex items-center gap-1 lg:hidden">
          <Link
            href="/order"
            aria-label={`Shopping bag, ${bagCount} item${bagCount === 1 ? "" : "s"}`}
            className="relative rounded-full p-2.5 text-ink/80 hover:bg-sage-soft"
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.6} />
            {bagCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-peach text-[10px] font-bold text-ink">
                {bagCount > 9 ? "9+" : bagCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2.5 text-ink hover:bg-sage-soft"
          >
            {open ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
          </button>
        </div>
      </nav>

      {/* ── Mobile menu ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card soft-shadow mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl p-3 lg:hidden"
          >
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-2xl px-4 py-3 text-[15px] font-medium text-body transition-colors hover:bg-sage-soft hover:text-ink",
                      isActive(l.href) && "bg-sage font-semibold text-softwhite hover:bg-sage",
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex gap-2 border-t border-line pt-3">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setSearchOpen(true);
                }}
                className="flex-1 rounded-full border border-ink/15 px-5 py-3 text-center text-sm font-semibold text-ink transition-colors hover:bg-sage-soft"
              >
                Search
              </button>
              <Link
                href="/order"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full bg-sage px-5 py-3 text-center text-sm font-semibold text-softwhite transition-colors hover:bg-sage-deep"
              >
                Order Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Search overlay ──────────────────────────────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-ink/30 px-4 pt-20 backdrop-blur-sm sm:pt-28"
            onClick={() => setSearchOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto max-w-xl overflow-hidden rounded-3xl bg-softwhite soft-shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 border-b border-line px-5 py-4">
                <Search className="h-5 w-5 shrink-0 text-body" strokeWidth={1.6} />
                <input
                  ref={(el) => {
                    searchInput.current = el;
                    if (searchOpen) el?.focus();
                  }}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setSearchOpen(false);
                    if (e.key === "Enter" && results[0]) {
                      router.push(`/shop/${results[0].slug}`);
                      setSearchOpen(false);
                    }
                  }}
                  placeholder="Search candles, scents…"
                  aria-label="Search candles"
                  className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-body/50"
                />
                <button
                  type="button"
                  aria-label="Close search"
                  onClick={() => setSearchOpen(false)}
                  className="rounded-full p-1.5 text-body hover:bg-muted"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {query.trim() === "" ? (
                  <p className="px-4 py-6 text-center text-sm text-body/80">
                    Try &ldquo;serenity&rdquo;, &ldquo;vanilla&rdquo; or &ldquo;floral&rdquo;&hellip;
                  </p>
                ) : results.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-body/80">
                    No candles found for &ldquo;{query}&rdquo;.
                  </p>
                ) : (
                  results.map((p) => (
                    <Link
                      key={p.id}
                      href={`/shop/${p.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-4 rounded-2xl px-3 py-2.5 transition-colors hover:bg-sage-soft/70"
                    >
                      { }
                      <img
                        src={p.image}
                        alt=""
                        className="h-12 w-12 rounded-xl object-cover"
                        loading="lazy"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-serif text-sm font-semibold text-ink">
                          {p.name}
                        </span>
                        <span className="block truncate text-xs text-body">
                          {p.fragrance}
                        </span>
                      </span>
                      <span className="text-sm font-bold text-ink">
                        {formatPrice(p.price)}
                      </span>
                    </Link>
                  ))
                )}
              </div>
              <div className="border-t border-line px-5 py-3 text-center text-xs text-body/80">
                <Heart className="mr-1 inline h-3.5 w-3.5 text-peach" strokeWidth={1.6} />
                Hand-poured in small batches
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
