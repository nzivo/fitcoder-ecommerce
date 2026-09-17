import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatMoney } from "@/lib/format";
import StatusPill from "@/components/admin/StatusPill";
import RevenueTrendChart from "@/components/admin/charts/RevenueTrendChart";
import OrdersByStatusChart from "@/components/admin/charts/OrdersByStatusChart";
import type { OrderStatus } from "@/types/database";

const ALL_STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

function lastNDays(n: number) {
  const days: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export default async function AdminHomePage() {
  const supabase = await createClient();

  const [{ data: orders }, { count: productCount }, { count: lowStockCount }] = await Promise.all([
    supabase.from("orders").select("*").order("created_at", { ascending: false }),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }).lt("stock", 5),
  ]);

  const allOrders = orders ?? [];
  const revenue = allOrders
    .filter((o) => o.status !== "pending" && o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  const pendingCount = allOrders.filter((o) => o.status === "pending").length;
  const recentOrders = allOrders.slice(0, 6);

  const days = lastNDays(14);
  const revenueByDay = new Map(days.map((d) => [d, 0]));
  for (const order of allOrders) {
    if (order.status === "pending" || order.status === "cancelled") continue;
    const day = order.created_at.slice(0, 10);
    if (revenueByDay.has(day)) {
      revenueByDay.set(day, (revenueByDay.get(day) ?? 0) + order.total);
    }
  }
  const revenueData = days.map((d) => ({
    label: new Intl.DateTimeFormat("en-KE", { month: "short", day: "numeric" }).format(new Date(d)),
    total: revenueByDay.get(d) ?? 0,
  }));

  const statusCounts = ALL_STATUSES.reduce(
    (acc, status) => ({ ...acc, [status]: 0 }),
    {} as Record<OrderStatus, number>,
  );
  for (const order of allOrders) {
    statusCounts[order.status] = (statusCounts[order.status] ?? 0) + 1;
  }

  return (
    <div>
      <h1 className="font-display text-2xl uppercase mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Revenue" value={formatMoney(revenue)} />
        <StatCard label="Total Orders" value={String(allOrders.length)} />
        <StatCard label="Pending Orders" value={String(pendingCount)} />
        <StatCard label="Low Stock Items" value={String(lowStockCount ?? 0)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
        <div className="border border-border p-5">
          <h2 className="text-sm tracking-widest-xl uppercase mb-4">Revenue — Last 14 Days</h2>
          <RevenueTrendChart data={revenueData} />
        </div>
        <div className="border border-border p-5">
          <h2 className="text-sm tracking-widest-xl uppercase mb-4">Orders by Status</h2>
          <OrdersByStatusChart counts={statusCounts} />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm tracking-widest-xl uppercase">Recent Orders</h2>
        <Link href="/admin/orders" className="text-xs underline">
          View all
        </Link>
      </div>

      {recentOrders.length === 0 ? (
        <p className="text-sm text-muted">
          No orders yet. Orders appear here once a customer completes checkout.
        </p>
      ) : (
        <div className="border border-border divide-y divide-border">
          {recentOrders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="flex items-center justify-between px-4 py-3 text-sm hover:bg-surface"
            >
              <div>
                <p>{order.paystack_reference}</p>
                <p className="text-xs text-muted mt-0.5">{order.email}</p>
              </div>
              <div className="text-right">
                <p>{formatMoney(order.total, order.currency)}</p>
                <p className="text-xs text-muted mt-0.5">{formatDate(order.created_at)}</p>
              </div>
              <StatusPill status={order.status} />
            </Link>
          ))}
        </div>
      )}

      {(productCount ?? 0) === 0 && (
        <p className="text-sm text-muted mt-10">
          You don&apos;t have any products yet.{" "}
          <Link href="/admin/products/new" className="underline">
            Add your first product
          </Link>
          .
        </p>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border p-5">
      <p className="text-xs text-muted uppercase tracking-widest-xl mb-2">{label}</p>
      <p className="text-2xl">{value}</p>
    </div>
  );
}
