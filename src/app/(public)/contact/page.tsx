import type { Metadata } from "next";
import { Clock, Instagram, Mail, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { siteConfig, whatsappLink, whatsappMessages } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Questions about an order, wholesale or collaborations? Write to Ignite Wax or chat with us on WhatsApp — we reply within one business day.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-12 pb-20 sm:px-8 sm:pt-16">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-[12px] font-bold tracking-[0.22em] text-peach-deep uppercase">
          Contact
        </p>
        <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-balance text-ink sm:text-5xl">
          We&apos;d love to hear from you
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-body">
          Order questions, scent advice, wholesale or collaborations — send a
          message and a real human will get back to you.
        </p>
      </header>

      <div className="mt-12 grid items-start gap-8 lg:grid-cols-[380px_1fr]">
        {/* Contact channels */}
        <aside className="space-y-4">
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="flex items-start gap-4 rounded-[1.5rem] bg-softwhite p-6 soft-shadow transition-shadow hover:soft-shadow-lg"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage">
              <Mail className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <span>
              <span className="block text-sm font-bold text-ink">Email us</span>
              <span className="mt-0.5 block text-[13.5px] text-body">{siteConfig.contactEmail}</span>
            </span>
          </a>

          <a
            href={whatsappLink(whatsappMessages.general)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 rounded-[1.5rem] bg-softwhite p-6 soft-shadow transition-shadow hover:soft-shadow-lg"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage-soft text-whatsapp">
              <MessageCircle className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <span>
              <span className="block text-sm font-bold text-ink">WhatsApp</span>
              <span className="mt-0.5 block text-[13.5px] text-body">
                Fastest for order updates — usually replies within hours
              </span>
            </span>
          </a>

          <a
            href={siteConfig.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-[1.5rem] bg-sage-soft/70 p-6 soft-shadow transition-shadow hover:soft-shadow-lg"
          >
            <img
              src={siteConfig.instagram.qr}
              alt="Instagram QR code — scan to follow Ignite Wax"
              className="h-16 w-16 shrink-0 rounded-xl bg-softwhite"
              loading="lazy"
            />
            <span>
              <span className="flex items-center gap-1.5 text-sm font-bold text-ink">
                <Instagram className="h-4 w-4 text-peach-deep" strokeWidth={1.8} aria-hidden="true" />
                {siteConfig.instagram.handle}
              </span>
              <span className="mt-0.5 block text-[13.5px] text-body">
                Scan or tap to follow — new scents &amp; behind the scenes
              </span>
            </span>
          </a>

          <div className="flex items-start gap-4 rounded-[1.5rem] bg-softwhite p-6 soft-shadow">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage">
              <Clock className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <span>
              <span className="block text-sm font-bold text-ink">Response time</span>
              <span className="mt-0.5 block text-[13.5px] text-body">
                Monday–Saturday, 9am–6pm — within one business day
              </span>
            </span>
          </div>
        </aside>

        <ContactForm />
      </div>
    </div>
  );
}
