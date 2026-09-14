import Link from "next/link";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTransaction } from "@/lib/paystack";
import { formatMoney } from "@/lib/format";
import ClearCartOnMount from "@/components/shop/ClearCartOnMount";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;

  if (!reference) {
    return (
      <StatusView icon={<XCircle size={40} />} title="No order reference found">
        <Link href="/shop" className="underline text-sm">
          Return to shop
        </Link>
      </StatusView>
    );
  }

  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("*")
    .eq("paystack_reference", reference)
    .single();

  if (!order) {
    return (
      <StatusView icon={<XCircle size={40} />} title="We couldn't find that order">
        <Link href="/shop" className="underline text-sm">
          Return to shop
        </Link>
      </StatusView>
    );
  }

  // If the webhook hasn't landed yet, verify directly with Paystack as a fallback.
  if (order.status === "pending") {
    try {
      const verified = await verifyTransaction(reference);
      if (verified.status === "success") {
        await admin.from("orders").update({ status: "paid" }).eq("id", order.id);
        order.status = "paid";
      }
    } catch {
      // Ignore — webhook will reconcile shortly.
    }
  }

  const paid = order.status !== "pending" && order.status !== "cancelled";

  return (
    <StatusView
      icon={
        paid ? (
          <CheckCircle2 size={40} className="text-success" />
        ) : (
          <Clock size={40} className="text-muted" />
        )
      }
      title={paid ? "Thank you — your order is confirmed" : "Payment processing"}
    >
      {paid && <ClearCartOnMount />}
      <p className="text-sm text-muted mt-2">Order reference: {order.paystack_reference}</p>
      <p className="text-lg mt-4">{formatMoney(order.total, order.currency)}</p>
      <p className="text-xs text-muted mt-1 uppercase tracking-widest-xl">Status: {order.status}</p>
      <Link
        href="/shop"
        className="inline-block mt-8 border border-foreground px-6 py-3 text-xs tracking-widest-xl uppercase"
      >
        Continue Shopping
      </Link>
    </StatusView>
  );
}

function StatusView({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="flex justify-center mb-5">{icon}</div>
      <h1 className="text-xl">{title}</h1>
      {children}
    </div>
  );
}
