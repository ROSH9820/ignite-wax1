import Link from "next/link";
import { Heart, Instagram } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { siteConfig, whatsappLink, whatsappMessages } from "@/lib/config";

const shopLinks = [
  { href: "/shop", label: "All Candles" },
  { href: "/shop?filter=Floral", label: "Floral" },
  { href: "/shop?filter=Woody", label: "Woody" },
  { href: "/shop?filter=Warm", label: "Warm" },
  { href: "/shop?filter=Fresh", label: "Fresh" },
] as const;

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/collections", label: "Collections" },
  { href: "/contact", label: "Contact" },
] as const;

const helpLinks = [
  { href: "/order", label: "Place an Order" },
  { href: "/contact", label: "Shipping & Returns" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto bg-sage text-softwhite">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Logo tone="light" markClassName="ring-1 ring-softwhite/30" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-softwhite/75">
              {siteConfig.description}
            </p>
            <a
              href={whatsappLink(whatsappMessages.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-softwhite/10 px-4 py-2 text-sm font-medium text-softwhite transition-colors hover:bg-softwhite/20"
            >
              <Heart className="h-4 w-4 text-peach" strokeWidth={1.6} />
              Chat with us
            </a>

            {/* Instagram — QR + handle */}
            <a
              href={siteConfig.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex w-fit items-center gap-3.5 rounded-2xl bg-softwhite/10 p-3 pr-5 transition-colors hover:bg-softwhite/20"
              aria-label={`Follow ${siteConfig.instagram.handle} on Instagram`}
            >
              <img
                src={siteConfig.instagram.qr}
                alt="Instagram QR code — scan to follow Ignite Wax"
                className="h-20 w-20 rounded-xl bg-softwhite"
                loading="lazy"
              />
              <span>
                <span className="flex items-center gap-1.5 text-sm font-bold text-softwhite">
                  <Instagram className="h-4 w-4 text-peach" strokeWidth={1.8} aria-hidden="true" />
                  {siteConfig.instagram.handle}
                </span>
                <span className="mt-0.5 block text-xs text-softwhite/75">
                  Scan to follow — new scents &amp; behind the scenes
                </span>
              </span>
            </a>
          </div>

          {/* Link columns */}
          <nav aria-label="Shop">
            <h3 className="text-[13px] font-bold tracking-[0.18em] text-softwhite/60 uppercase">
              Shop
            </h3>
            <ul className="mt-4 space-y-2.5">
              {shopLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-softwhite/85 transition-colors hover:text-peach">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h3 className="text-[13px] font-bold tracking-[0.18em] text-softwhite/60 uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-softwhite/85 transition-colors hover:text-peach">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Help">
            <h3 className="text-[13px] font-bold tracking-[0.18em] text-softwhite/60 uppercase">
              Help
            </h3>
            <ul className="mt-4 space-y-2.5">
              {helpLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-softwhite/85 transition-colors hover:text-peach">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-softwhite/15 pt-6 sm:flex-row">
          <p className="text-xs text-softwhite/60">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-softwhite/60">
            Handmade with
            <Heart className="h-3.5 w-3.5 fill-peach text-peach" aria-hidden="true" />
            and intention
          </p>
        </div>
      </div>
    </footer>
  );
}
