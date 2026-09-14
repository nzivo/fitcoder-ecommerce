import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatMoney } from "@/lib/format";
import OrderStatusForm from "@/components/admin/OrderStatusForm";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: order }, { data: items }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).single(),
    supabase.from("order_items").select("*").eq("order_id", id),
  ]);

  if (!order) notFound();

  const address = order.shipping_address;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-2xl uppercase">{order.paystack_reference}</h1>
          <p className="text-sm text-muted mt-1">{formatDate(order.created_at)}</p>
        </div>
        <OrderStatusForm orderId={order.id} status={order.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
        <div>
          <p className="text-xs tracking-widest-xl uppercase text-muted mb-3">Shipping To</p>
          <p className="text-sm">{address.full_name}</p>
          <p className="text-sm text-muted">{address.phone}</p>
          <p className="text-sm text-muted">{address.email}</p>
          <p className="text-sm text-muted mt-2">
            {address.address_line1}
            {address.address_line2 ? `, ${address.address_line2}` : ""}
          </p>
          <p className="text-sm text-muted">
            {address.city}, {address.country} {address.postal_code}
          </p>
        </div>

        <div>
          <p className="text-xs tracking-widest-xl uppercase text-muted mb-3">Payment</p>
          <p className="text-sm">Paystack reference: {order.paystack_reference}</p>
          <p className="text-sm text-muted mt-1">
            Subtotal: {formatMoney(order.subtotal, order.currency)}
          </p>
          <p className="text-sm text-muted">
            Shipping: {formatMoney(order.shipping_fee, order.currency)}
          </p>
          <p className="text-sm mt-1">Total: {formatMoney(order.total, order.currency)}</p>
        </div>
      </div>

      <p className="text-xs tracking-widest-xl uppercase text-muted mb-3">Items</p>
      <div className="border border-border divide-y divide-border">
        {(items ?? []).map((item) => (
          <div key={item.id} className="flex items-center gap-4 px-4 py-3">
            <div className="w-14 h-16 bg-surface-2 overflow-hidden shrink-0">
              {item.product_image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.product_image} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 text-sm">
              <p>{item.product_name}</p>
              <p className="text-muted text-xs mt-0.5">
                {[item.size, item.color].filter(Boolean).join(" / ")} × {item.quantity}
              </p>
            </div>
            <p className="text-sm">{formatMoney(item.price * item.quantity, order.currency)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
