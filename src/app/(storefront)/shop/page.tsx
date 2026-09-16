import ProductCard from "@/components/ProductCard";
import SortSelect from "@/components/shop/SortSelect";
import TrustBadges from "@/components/shop/TrustBadges";
import FaqAccordion from "@/components/FaqAccordion";
import { getFaqs, getProducts } from "@/lib/data";
import type { Product } from "@/types/database";

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
  const [rawProducts, faqs] = await Promise.all([
    getProducts({ categorySlug: category }),
    getFaqs("shop"),
  ]);
  const products = sortProducts(rawProducts, sort);

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
            sizing, shipping, or returns, the Fit Coder team is here to help you live the Lifestyle of
            Legends without the hassle.
          </p>
          <p className="text-sm text-muted mt-3">
            Need immediate assistance? Reach us via{" "}
            <a href="mailto:support@fitcoder.com" className="underline">
              support@fitcoder.com
            </a>
          </p>
        </div>
        <FaqAccordion items={faqs.map((f) => ({ q: f.question, a: f.answer }))} />
      </div>

      <TrustBadges />
    </div>
  );
}
