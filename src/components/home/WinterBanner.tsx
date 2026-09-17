import Link from "next/link";
import type { SiteSection } from "@/types/database";
import { withDefaults } from "@/lib/site-content";

const DEFAULTS = {
  eyebrow: "New Drop",
  title: "Winter Collections",
  image_url: "/lifestyle/winter.svg",
  cta_label: "Shop the Collection",
  cta_href: "/shop",
};

export default function WinterBanner({ section }: { section: SiteSection | null }) {
  const content = withDefaults(DEFAULTS, section);

  return (
    <section
      className="relative bg-cover bg-center min-h-[420px] flex items-end"
      style={{ backgroundImage: `url('${content.image_url}')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 py-12 w-full">
        <p className="text-xs tracking-widest-xl uppercase text-white/70 mb-2">{content.eyebrow}</p>
        <h2 className="font-display text-3xl sm:text-5xl uppercase text-white mb-5">{content.title}</h2>
        <Link
          href={content.cta_href}
          className="inline-block bg-accent text-accent-foreground px-6 py-3 text-xs tracking-widest-xl uppercase"
        >
          {content.cta_label}
        </Link>
      </div>
    </section>
  );
}
