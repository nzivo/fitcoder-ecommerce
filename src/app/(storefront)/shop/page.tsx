import ProductCard from "@/components/ProductCard";
import SortSelect from "@/components/shop/SortSelect";
import TrustBadges from "@/components/shop/TrustBadges";
import FaqAccordion from "@/components/FaqAccordion";
import { getProducts } from "@/lib/data";
import type { Product } from "@/types/database";

const FAQS = [
  {
    q: "How long does it take to get my products?",
    a: "Standard delivery within Kenya takes 2–4 business days. International orders take 7–14 business days depending on destination.",
  },
  {
    q: "Do you offer refunds or exchanges?",
    a: "Yes — unworn items in original condition can be returned or exchanged within 14 days of delivery.",
  },
  {
    q: "How do Dope Beyond clothes fit?",
    a: "Our pieces run true to size with a relaxed, heavyweight streetwear fit. Check the size guide on each product page if you're between sizes.",
  },
  {
    q: "How do I keep my gear fresh? (Care Instructions)",
    a: "Machine wash cold, inside out, with like colors. Tumble dry low or hang dry to preserve print and fabric quality.",
  },
];

function sortProducts(products: Product[], sort: string | undefined) {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const { category, sort } = await searchParams;
  const products = sortProducts(await getProducts({ categorySlug: category }), sort);

  return (
    <div>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-10 pb-6 text-center">
        <h1 className="font-display text-2xl sm:text-3xl uppercase">Shop All</h1>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex items-center justify-between pb-6">
        <SortSelect />
        <p className="text-xs text-muted uppercase tracking-wide">{products.length} products</p>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 pb-16">
        {products.length === 0 ? (
          <div className="border border-dashed border-border py-20 text-center text-sm text-muted">
            No products found. Add products from the admin dashboard to see them here.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4">
            Frequently Asked Question
          </h2>
          <p className="text-sm text-muted max-w-sm">
            Got questions about your gear? Don&apos;t worry, we&apos;ve got you covered. Whether it&apos;s
            sizing, shipping, or returns, the Dope Beyond team is here to help you live the Lifestyle of
            Legends without the hassle.
          </p>
          <p className="text-sm text-muted mt-3">
            Need immediate assistance? Reach us via{" "}
            <a href="mailto:support@dopebeyond.com" className="underline">
              support@dopebeyond.com
            </a>
          </p>
        </div>
        <FaqAccordion items={FAQS} />
      </div>

      <TrustBadges />
    </div>
  );
}
