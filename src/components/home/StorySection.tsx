import Link from "next/link";
import type { SiteSection } from "@/types/database";
import { withDefaults } from "@/lib/site-content";

const DEFAULTS = {
  eyebrow: "Our Story",
  title: "Move with Fit Coder Forever",
  body: "Fit Coder creates exclusive streetwear pieces designed for individuals who embrace creativity, confidence, and originality.",
  image_url: "/lifestyle/story-1.svg",
  image_url_2: "/lifestyle/story-2.svg",
  cta_label: "Our Story",
  cta_href: "/contact",
};

export default function StorySection({ section }: { section: SiteSection | null }) {
  const content = withDefaults(DEFAULTS, section);

  return (
    <section id="our-story" className="bg-background py-16 sm:py-24">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="relative h-[340px] sm:h-[420px]">
          <div className="absolute left-0 top-0 w-2/3 h-4/5 bg-surface-2 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={content.image_url} alt="Fit Coder lifestyle" className="w-full h-full object-cover" />
          </div>
          <div className="absolute right-0 bottom-0 w-2/3 h-4/5 bg-surface-2 overflow-hidden border-4 border-background">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={content.image_url_2} alt="Fit Coder lifestyle" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="max-w-md">
          <p className="text-xs tracking-widest-xl uppercase text-muted mb-3">{content.eyebrow}</p>
          <h2 className="font-display text-3xl sm:text-4xl uppercase leading-tight mb-5">{content.title}</h2>
          <p className="text-sm text-muted mb-7">{content.body}</p>
          <Link
            href={content.cta_href}
            className="inline-block border border-foreground px-6 py-3 text-xs tracking-widest-xl uppercase"
          >
            {content.cta_label}
          </Link>
        </div>
      </div>
    </section>
  );
}
