import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, ExternalLink } from "lucide-react";
import SignOutButton from "@/components/SignOutButton";
import { createClient } from "@/lib/supabase/server";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products", icon: Package },
];

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-[calc(100vh-1px)] grid grid-cols-1 md:grid-cols-[220px_1fr] bg-background">
      <aside className="border-r border-border md:min-h-screen p-6 flex flex-col">
        <Link href="/admin" className="font-display text-lg uppercase tracking-widest-xl mb-8">
          Fit Coder
          <span className="block text-[10px] text-muted tracking-widest-xl mt-1">Admin</span>
        </Link>

        <nav className="flex flex-col gap-1 text-sm">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-surface transition-colors"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-8 space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-muted hover:text-foreground"
          >
            <ExternalLink size={14} />
            View storefront
          </Link>
          <p className="text-xs text-muted truncate">{user?.email}</p>
          <SignOutButton />
        </div>
      </aside>

      <main className="p-6 sm:p-10">{children}</main>
    </div>
  );
}
