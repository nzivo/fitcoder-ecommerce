"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import type { Product } from "@/types/database";
import { formatMoney } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";

export default function ProductDetail({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(product.sizes[0] ?? null);
  const [color, setColor] = useState(product.colors[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.open);

  const onSale = product.compare_at_price != null && product.compare_at_price > product.price;
  const images = product.images.length > 0 ? product.images : [null];

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
            <button className="px-3 py-2" onClick={() => setQuantity((q) => q + 1)}>
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleAddToBag}
          disabled={product.stock <= 0}
          className="w-full bg-accent text-accent-foreground py-3 text-xs tracking-widest-xl uppercase disabled:opacity-40"
        >
          {product.stock > 0 ? "Add to Bag" : "Sold Out"}
        </button>

        <p className="text-xs text-muted mt-4">
          {product.stock > 0 ? `${product.stock} in stock` : "Currently unavailable"}
        </p>
      </div>
    </div>
  );
}
