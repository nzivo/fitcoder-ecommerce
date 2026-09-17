"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import type { Product, ProductVariant } from "@/types/database";
import { formatMoney } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";
import WishlistButton from "@/components/WishlistButton";

export default function ProductDetail({
  product,
  variants,
}: {
  product: Product;
  variants: ProductVariant[];
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(product.sizes[0] ?? null);
  const [color, setColor] = useState(product.colors[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.open);

  const onSale = product.compare_at_price != null && product.compare_at_price > product.price;
  const images = product.images.length > 0 ? product.images : [null];

  // Products with variant rows are tracked per size/color; products without
  // any (e.g. no sizes or colors) fall back to the product's own stock count.
  const trackingVariants = variants.length > 0;
  const selectedVariant = variants.find(
    (v) => v.size === (size ?? "") && v.color === (color ?? ""),
  );
  const availableStock = trackingVariants ? (selectedVariant?.stock ?? 0) : product.stock;
  const inStock = availableStock > 0;

  function handleAddToBag() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: images[0],
      price: product.price,
      size,
      color,
      quantity,
    });
    toast.success(`${product.name} added to bag`);
    openCart();
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <div className="aspect-[4/5] bg-surface-2 overflow-hidden mb-3">
          {images[activeImage] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images[activeImage]!} alt={product.name} className="w-full h-full object-cover" />
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-20 bg-surface-2 overflow-hidden border ${
                  activeImage === i ? "border-foreground" : "border-transparent"
                }`}
              >
                {img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt="" className="w-full h-full object-cover" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-md">
        <h1 className="text-xl sm:text-2xl mb-2">{product.name}</h1>
        <div className="flex items-center gap-2 text-lg mb-5">
          <span>{formatMoney(product.price)}</span>
          {onSale && (
            <span className="text-muted line-through text-sm">
              {formatMoney(product.compare_at_price!)}
            </span>
          )}
        </div>

        {product.description && <p className="text-sm text-muted mb-6">{product.description}</p>}

        {product.sizes.length > 0 && (
          <div className="mb-6">
            <p className="text-xs tracking-widest-xl uppercase mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`w-11 h-11 text-xs border ${
                    size === s ? "bg-accent text-accent-foreground border-accent" : "border-border"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.colors.length > 0 && (
          <div className="mb-6">
            <p className="text-xs tracking-widest-xl uppercase mb-2">Color</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`px-4 h-11 text-xs border ${
                    color === c ? "bg-accent text-accent-foreground border-accent" : "border-border"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <p className="text-xs tracking-widest-xl uppercase mb-2">Quantity</p>
          <div className="flex items-center border border-border w-fit">
            <button className="px-3 py-2" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
              −
            </button>
            <span className="px-4 text-sm">{quantity}</span>
            <button
              className="px-3 py-2 disabled:opacity-40"
              disabled={quantity >= availableStock}
              onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-stretch gap-2">
          <button
            onClick={handleAddToBag}
            disabled={!inStock}
            className="flex-1 bg-accent text-accent-foreground py-3 text-xs tracking-widest-xl uppercase disabled:opacity-40"
          >
            {inStock ? "Add to Bag" : "Sold Out"}
          </button>
          <WishlistButton
            productId={product.id}
            redirectTo={`/product/${product.slug}`}
            size={18}
            className="shrink-0 w-12 flex items-center justify-center border border-border hover:border-foreground transition-colors disabled:opacity-50"
          />
        </div>

        <p className="text-xs text-muted mt-4">
          {inStock
            ? `${availableStock} in stock${trackingVariants ? " for this size/color" : ""}`
            : trackingVariants
              ? "Sold out in this size/color"
              : "Currently unavailable"}
        </p>
      </div>
    </div>
  );
}
