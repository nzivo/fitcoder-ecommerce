import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatMoney } from "@/lib/format";
import StatusPill from "@/components/admin/StatusPill";
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
        <div className="border border-border overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-widest-xl text-muted">
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-surface">
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
              ))}
            </tbody>
          </table>
        </div>
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
