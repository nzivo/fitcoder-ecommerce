"use client";

import Link from "next/link";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, cartTotal, lineKey } from "@/lib/cart-store";
import { formatMoney } from "@/lib/format";

export default function CartDrawer() {
  const { items, isOpen, close, removeItem, setQuantity } = useCartStore();
  const total = cartTotal(items);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-surface z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-xs tracking-widest-xl uppercase">Your Bag ({items.length})</p>
          <button onClick={close} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-muted text-sm">Your bag is empty.</p>
            <button
              onClick={close}
              className="border border-foreground px-5 py-2 text-xs tracking-widest-xl uppercase"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {items.map((item) => {
                const key = lineKey(item);
                return (
                  <div key={key} className="flex gap-3">
                    <div className="w-20 h-24 bg-surface-2 shrink-0 overflow-hidden">
                      {item.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-tight">{item.name}</p>
                      <p className="text-xs text-muted mt-1">
                        {[item.size, item.color].filter(Boolean).join(" / ")}
                      </p>
                      <p className="text-sm mt-1">{formatMoney(item.price)}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-border">
                          <button
                            className="p-1.5"
                            onClick={() => setQuantity(key, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs w-6 text-center">{item.quantity}</span>
                          <button
                            className="p-1.5"
                            onClick={() => setQuantity(key, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          className="text-muted hover:text-foreground"
                          onClick={() => removeItem(key)}
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border px-5 py-5 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span>{formatMoney(total)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={close}
                className="block text-center bg-foreground text-background py-3 text-xs tracking-widest-xl uppercase"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
