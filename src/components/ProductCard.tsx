"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import type { Product } from "@/types/database";
import { formatMoney } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";

export default function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const image = product.images[0] ?? null;
  const onSale = product.compare_at_price != null && product.compare_at_price > product.price;

  function quickAdd() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image,
      price: product.price,
      size: product.sizes[0] ?? null,
      color: product.colors[0] ?? null,
      quantity: 1,
    });
    toast.success(`${product.name} added to bag`);
  }

  return (
    <div className="group">
      <div className="relative bg-surface-2 aspect-[4/5] overflow-hidden">
        <Link href={`/product/${product.slug}`}>
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full" />
          )}
        </Link>
        {onSale && (
          <span className="absolute top-3 left-3 bg-danger text-white text-[10px] tracking-widest-xl uppercase px-2 py-1">
            Sale
          </span>
        )}
        <button
          aria-label="Save to wishlist"
          onClick={() => setLiked((v) => !v)}
          className="absolute top-3 right-3 bg-background/80 rounded-full p-1.5"
        >
          <Heart size={15} fill={liked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="pt-3 space-y-1">
        <Link href={`/product/${product.slug}`} className="text-sm block leading-snug hover:text-muted">
          {product.name}
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <span>{formatMoney(product.price)}</span>
          {onSale && (
            <span className="text-muted line-through text-xs">
              {formatMoney(product.compare_at_price!)}
            </span>
          )}
        </div>
        <button
          onClick={quickAdd}
          disabled={product.stock <= 0}
          className="mt-2 w-full border border-foreground py-2 text-[11px] tracking-widest-xl uppercase hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          {product.stock > 0 ? "Add to Bag" : "Sold Out"}
        </button>
      </div>
    </div>
  );
}
