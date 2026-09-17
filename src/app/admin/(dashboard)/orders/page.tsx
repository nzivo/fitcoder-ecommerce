import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import OrdersTable from "@/components/admin/OrdersTable";
import type { OrderItem, OrderStatus } from "@/types/database";

const STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();

  const isValidStatus = (value: string): value is OrderStatus =>
    (STATUSES as string[]).includes(value);

  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (status && isValidStatus(status)) query = query.eq("status", status);
  const { data: orders } = await query;

  const orderIds = (orders ?? []).map((o) => o.id);
  const itemsByOrder: Record<string, OrderItem[]> = {};
  if (orderIds.length > 0) {
    const { data: items } = await supabase
      .from("order_items")
      .select("*")
      .in("order_id", orderIds);
    for (const item of items ?? []) {
      (itemsByOrder[item.order_id] ??= []).push(item);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl uppercase mb-6">Orders</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <FilterPill href="/admin/orders" active={!status} label="All" />
        {STATUSES.map((s) => (
          <FilterPill key={s} href={`/admin/orders?status=${s}`} active={status === s} label={s} />
        ))}
      </div>

      {!orders || orders.length === 0 ? (
        <p className="text-sm text-muted">No orders found.</p>
      ) : (
        <OrdersTable orders={orders} itemsByOrder={itemsByOrder} />
      )}
    </div>
  );
}

function FilterPill({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`text-xs uppercase tracking-widest-xl px-3 py-1.5 border ${
        active ? "bg-accent text-accent-foreground border-accent" : "border-border text-muted"
      }`}
    >
      {label}
    </Link>
  );
}
