import Link from "next/link";
import type { SiteSection } from "@/types/database";
import { withDefaults } from "@/lib/site-content";

const DEFAULTS = {
  title: "The Lifestyle of Legends",
  subtitle: "Heavyweight streetwear. Designed in Canada. Shipped worldwide.",
  image_url: "/lifestyle/lifestyle-footer.svg",
  cta_label: "Shop All",
  cta_href: "/shop",
};

export default function LifestyleBanner({ section }: { section: SiteSection | null }) {
  const content = withDefaults(DEFAULTS, section);

  return (
    <section
      className="relative bg-cover bg-center min-h-[380px] flex items-center justify-center text-center"
      style={{ backgroundImage: `url('${content.image_url}')` }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative px-4">
        <h2 className="font-display text-3xl sm:text-5xl uppercase text-white mb-3">{content.title}</h2>
        <p className="text-sm text-white/70 mb-6">{content.subtitle}</p>
        <Link
          href={content.cta_href}
          className="inline-block bg-accent text-accent-foreground px-7 py-3 text-xs tracking-widest-xl uppercase"
        >
          {content.cta_label}
        </Link>
      </div>
    </section>
  );
}
