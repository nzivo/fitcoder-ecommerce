import Link from "next/link";
import type { SiteSection } from "@/types/database";
import { withDefaults } from "@/lib/site-content";

const DEFAULTS = {
  eyebrow: "Lifestyle of Legends",
  title: "Built for those who move different",
  subtitle: "Heavyweight streetwear designed for those who create their own path.",
  image_url: "/lifestyle/hero.svg",
  cta_label: "Shop Now",
  cta_href: "/shop",
  cta2_label: "Explore Collection",
  cta2_href: "/shop",
};

export default function Hero({ section }: { section: SiteSection | null }) {
  const content = withDefaults(DEFAULTS, section);

  return (
    <section
      data-theme="dark"
      className="relative bg-cover bg-center min-h-[560px] sm:min-h-[680px] lg:min-h-[820px] flex items-center overflow-hidden text-foreground"
      style={{ backgroundImage: `url('${content.image_url}')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 pt-14 pb-24 text-center w-full">
        <p className="text-xs tracking-widest-xl uppercase text-muted mb-4">{content.eyebrow}</p>
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl uppercase leading-[0.95] max-w-4xl mx-auto">
          {content.title}
        </h1>
        <p className="text-sm sm:text-base text-muted max-w-md mx-auto mt-5">{content.subtitle}</p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Link
            href={content.cta_href}
            className="bg-accent text-accent-foreground px-7 py-3 text-xs tracking-widest-xl uppercase"
          >
            {content.cta_label}
          </Link>
          <Link
            href={content.cta2_href}
            className="border border-foreground px-7 py-3 text-xs tracking-widest-xl uppercase"
          >
            {content.cta2_label}
          </Link>
        </div>

        <Link
          href="/shop"
          className="inline-block mt-16 bg-background text-foreground px-6 py-3 text-xs tracking-widest-xl uppercase whitespace-nowrap"
        >
          Shop Best Sellers
        </Link>
      </div>
    </section>
  );
}
