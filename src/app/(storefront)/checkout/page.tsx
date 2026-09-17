"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCartStore, cartTotal } from "@/lib/cart-store";
import { formatMoney } from "@/lib/format";
import type { ShippingAddress } from "@/types/database";

const EMPTY: ShippingAddress = {
  full_name: "",
  phone: "",
  email: "",
  address_line1: "",
  address_line2: "",
  city: "",
  country: "Kenya",
  postal_code: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const [form, setForm] = useState<ShippingAddress>(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cartTotal(items);
  const shippingFee = subtotal >= 10000 || subtotal === 0 ? 0 : 500;
  const total = subtotal + shippingFee;

  function update<K extends keyof ShippingAddress>(key: K, value: ShippingAddress[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            image: i.image,
            price: i.price,
            quantity: i.quantity,
            size: i.size,
            color: i.color,
          })),
          shippingAddress: form,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Checkout failed");

      window.location.href = json.authorizationUrl;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-sm text-muted mb-5">Your bag is empty.</p>
        <button
          onClick={() => router.push("/shop")}
          className="border border-foreground px-6 py-3 text-xs tracking-widest-xl uppercase"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h1 className="font-display text-2xl uppercase mb-2">Checkout</h1>

        <div>
          <p className="text-xs tracking-widest-xl uppercase mb-3">Contact</p>
          <Input label="Email" type="email" required value={form.email} onChange={(v) => update("email", v)} />
        </div>

        <div>
          <p className="text-xs tracking-widest-xl uppercase mb-3">Shipping Address</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Full name" required value={form.full_name} onChange={(v) => update("full_name", v)} />
            <Input label="Phone (for M-Pesa)" required value={form.phone} onChange={(v) => update("phone", v)} />
            <Input
              label="Address"
              required
              value={form.address_line1}
              onChange={(v) => update("address_line1", v)}
              className="sm:col-span-2"
            />
            <Input
              label="Apartment, suite, etc. (optional)"
              value={form.address_line2 ?? ""}
              onChange={(v) => update("address_line2", v)}
              className="sm:col-span-2"
            />
            <Input label="City" required value={form.city} onChange={(v) => update("city", v)} />
            <Input label="Country" required value={form.country} onChange={(v) => update("country", v)} />
            <Input
              label="Postal code (optional)"
              value={form.postal_code ?? ""}
              onChange={(v) => update("postal_code", v)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-accent text-accent-foreground py-3 text-xs tracking-widest-xl uppercase disabled:opacity-50"
        >
          {submitting ? "Redirecting to Paystack…" : `Pay ${formatMoney(total)}`}
        </button>
        <p className="text-xs text-muted text-center">
          Secure payment via Paystack — card, M-Pesa, bank, or USSD.
        </p>
      </form>

      <div className="bg-surface p-6 h-fit space-y-4">
        {items.map((item) => (
          <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between text-sm gap-3">
            <div>
              <p>{item.name}</p>
              <p className="text-muted text-xs">
                {[item.size, item.color].filter(Boolean).join(" / ")} × {item.quantity}
              </p>
            </div>
            <span>{formatMoney(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="border-t border-border pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Subtotal</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Shipping</span>
            <span>{shippingFee === 0 ? "Free" : formatMoney(shippingFee)}</span>
          </div>
          <div className="flex justify-between text-base pt-2 border-t border-border">
            <span>Total</span>
            <span>{formatMoney(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block text-xs ${className}`}>
      <span className="text-muted">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-surface border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
      />
    </label>
  );
}
