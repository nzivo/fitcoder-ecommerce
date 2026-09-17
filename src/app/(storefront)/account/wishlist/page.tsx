import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import ProductCard from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/server";
import { getWishlistProducts } from "@/lib/data";

export default async function WishlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-display text-2xl uppercase text-center mb-10">Wishlist</h1>
        <AuthForm redirectTo="/account/wishlist" />
      </div>
    );
  }

  const products = await getWishlistProducts();

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-2xl uppercase">Wishlist</h1>
        <Link href="/account" className="text-xs underline">
          Back to account
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-muted">
          Nothing saved yet.{" "}
          <Link href="/shop" className="underline">
            Browse the shop
          </Link>{" "}
          and tap the heart on anything you like.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
