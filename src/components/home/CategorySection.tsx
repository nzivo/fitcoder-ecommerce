import Link from "next/link";
import type { Category } from "@/types/database";

const FALLBACK_CATEGORIES: Pick<Category, "name" | "slug" | "image_url">[] = [
  { name: "Angel Collection", slug: "angel-collection", image_url: "/categories/angel-collection.svg" },
  { name: "Hoodies", slug: "hoodies", image_url: "/categories/hoodies.svg" },
  { name: "Sweatpants", slug: "sweatpants", image_url: "/categories/sweatpants.svg" },
  { name: "Jackets", slug: "jackets", image_url: "/categories/jackets.svg" },
];

export default function CategorySection({ categories }: { categories: Category[] }) {
  const list = categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  return (
    <section className="bg-surface py-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <p className="text-xs tracking-widest-xl uppercase text-muted mb-2">Explore</p>
          <h2 className="font-display text-2xl sm:text-3xl uppercase">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {list.map((c) => (
            <Link key={c.slug} href={`/shop?category=${c.slug}`} className="group block">
              <div className="aspect-[3/4] bg-surface-2 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.image_url ?? `/categories/${c.slug}.svg`}
                  alt={c.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="pt-3 text-center">
                <p className="text-xs tracking-widest-xl uppercase mb-2">{c.name}</p>
                <span className="inline-block border border-foreground px-4 py-1.5 text-[10px] tracking-widest-xl uppercase">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
