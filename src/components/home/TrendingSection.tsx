import Link from "next/link";
import type { Product } from "@/types/database";
import ProductCard from "@/components/ProductCard";

export default function TrendingSection({ products }: { products: Product[] }) {
  return (
    <section className="max-w-[1600px] mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs tracking-widest-xl uppercase text-muted mb-2">This Season</p>
          <h2 className="font-display text-2xl sm:text-3xl uppercase">Trending This Season</h2>
        </div>
        <Link href="/shop" className="hidden sm:block text-xs tracking-widest-xl uppercase border border-border px-4 py-2 hover:border-foreground">
          Shop All Trending
        </Link>
      </div>

      {products.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-border py-16 text-center text-sm text-muted">
      No products yet — add some from the{" "}
      <Link href="/admin/products" className="underline">
        admin dashboard
      </Link>
      .
    </div>
  );
}
