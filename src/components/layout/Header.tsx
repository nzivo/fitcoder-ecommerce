"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Search, User, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCartStore, cartCount } from "@/lib/cart-store";
import ThemeToggle from "@/components/layout/ThemeToggle";

const NAV_LINKS = [
  { href: "/shop", label: "Shop All" },
  { href: "/shop?category=hoodies", label: "Hoodies" },
  { href: "/shop?category=sweatpants", label: "Sweatpants" },
  { href: "/shop?category=jackets", label: "Jackets" },
  { href: "/#our-story", label: "Our Story" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.open);
  const count = cartCount(items);

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
      <div className="bg-foreground text-background text-center text-[11px] tracking-widest-xl py-2 px-4 uppercase">
        New customers save 10% off
      </div>

      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-4 px-4 sm:px-6 py-4 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-6 min-w-0">
          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1 md:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <nav className="hidden md:flex items-center gap-6 text-xs tracking-widest-xl uppercase">
            {NAV_LINKS.slice(0, 3).map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-muted transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link href="/" aria-label="Fit Coder" className="justify-self-center">
          <Image
            src="/logo.svg"
            alt="Fit Coder"
            width={1000}
            height={200}
            unoptimized
            priority
            className="h-6 sm:h-8 w-auto"
          />
        </Link>

        <div className="flex items-center gap-6 min-w-0 justify-end">
          <nav className="hidden md:flex items-center gap-6 text-xs tracking-widest-xl uppercase">
            {NAV_LINKS.slice(3).map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-muted transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <button aria-label="Search" className="p-1 hover:text-muted transition-colors">
              <Search size={19} />
            </button>
            <Link href="/account" aria-label="Account" className="p-1 hover:text-muted transition-colors">
              <User size={19} />
            </Link>
            <button
              aria-label="Open cart"
              onClick={openCart}
              className="relative p-1 hover:text-muted transition-colors"
            >
              <ShoppingBag size={19} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-foreground text-background text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden flex flex-col gap-1 px-4 pb-4 text-sm tracking-widest-xl uppercase border-t border-border pt-4">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="py-2 hover:text-muted transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
