import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard, Package, ShoppingBag } from "lucide-react";
import { AdminLogin } from "@/components/admin/admin-login";
import { LogoMark } from "@/components/layout/logo";
import { AdminLogoutButton } from "@/components/admin/admin-logout";
import { isAdminAuthed } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
] as const;

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const authed = await isAdminAuthed();
  if (!authed) return <AdminLogin />;

  return (
    <div className="page-glow flex min-h-screen flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="flex shrink-0 flex-col border-b border-line bg-softwhite lg:min-h-screen lg:w-64 lg:border-r lg:border-b-0">
        <div className="flex items-center gap-3 px-6 py-5 lg:py-7">
          <LogoMark className="h-9 w-9" />
          <div>
            <p className="font-serif text-[16px] font-bold leading-tight text-ink">Ignite Wax</p>
            <p className="text-[11px] font-medium tracking-[0.14em] text-body uppercase">Admin</p>
          </div>
        </div>

        <nav aria-label="Admin" className="flex gap-1 px-3 pb-3 lg:flex-1 lg:flex-col lg:px-4 lg:pb-0">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-body transition-colors hover:bg-sage-soft hover:text-ink lg:flex-none lg:justify-start lg:rounded-2xl lg:py-3"
            >
              <item.icon className="h-4.5 w-4.5" strokeWidth={1.6} />
              {item.label}
            </Link>
          ))}

          <div className="hidden lg:mt-6 lg:block lg:border-t lg:border-line lg:pt-4 lg:w-full">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-body transition-colors hover:bg-sage-soft hover:text-ink"
            >
              <ArrowLeft className="h-4.5 w-4.5" strokeWidth={1.6} />
              Back to store
            </Link>
            <AdminLogoutButton />
          </div>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
