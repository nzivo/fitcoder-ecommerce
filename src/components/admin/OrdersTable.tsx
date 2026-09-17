"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { formatDate, formatMoney } from "@/lib/format";
import StatusPill from "@/components/admin/StatusPill";
import type { Order, OrderItem } from "@/types/database";

export default function OrdersTable({
  orders,
  itemsByOrder,
}: {
  orders: Order[];
  itemsByOrder: Record<string, OrderItem[]>;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="border border-border overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-widest-xl text-muted">
            <th className="px-4 py-3 w-8" />
            <th className="px-4 py-3">Reference</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((order) => {
            const isOpen = expanded.has(order.id);
            const items = itemsByOrder[order.id] ?? [];
            return (
              <Fragment key={order.id}>
                <tr className="hover:bg-surface">
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggle(order.id)}
                      aria-label={isOpen ? "Collapse items" : "Expand items"}
                      aria-expanded={isOpen}
                      className="text-muted hover:text-foreground"
                    >
                      {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="underline">
                      {order.paystack_reference}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{order.email}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(order.created_at)}</td>
                  <td className="px-4 py-3">{formatMoney(order.total, order.currency)}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={order.status} />
                  </td>
                </tr>
                {isOpen && (
                  <tr className="bg-surface">
                    <td colSpan={6} className="px-4 py-3">
                      {items.length === 0 ? (
                        <p className="text-xs text-muted">No items recorded for this order.</p>
                      ) : (
                        <div className="divide-y divide-border border border-border bg-background">
                          {items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 px-4 py-2.5">
                              <div className="w-10 h-12 bg-surface-2 overflow-hidden shrink-0">
                                {item.product_image && (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={item.product_image}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="flex-1 text-sm">
                                <p>{item.product_name}</p>
                                <p className="text-muted text-xs mt-0.5">
                                  {[item.size, item.color].filter(Boolean).join(" / ")} ×{" "}
                                  {item.quantity}
                                </p>
                              </div>
                              <p className="text-sm">
                                {formatMoney(item.price * item.quantity, order.currency)}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
