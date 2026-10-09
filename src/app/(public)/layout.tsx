import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";

/**
 * Public storefront chrome — floating pill navbar, warm cream canvas and
 * footer. (The admin dashboard ships its own chrome in the (admin) group.)
 */
export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="page-glow flex min-h-screen flex-col">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
