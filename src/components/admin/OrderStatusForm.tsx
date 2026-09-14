"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import { updateOrderStatus } from "@/lib/actions/orders";
import type { OrderStatus } from "@/types/database";

const STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

export default function OrderStatusForm({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [isPending, startTransition] = useTransition();

  function handleChange(next: string) {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, next as OrderStatus);
      if (result.error) toast.error(result.error);
      else toast.success(`Order marked as ${next}`);
    });
  }

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => handleChange(e.target.value)}
      className="bg-surface border border-border px-3 py-2 text-xs uppercase tracking-widest-xl focus:outline-none focus:border-foreground disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
