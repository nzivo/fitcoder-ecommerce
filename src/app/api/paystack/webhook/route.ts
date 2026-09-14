import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Paystack webhook. Configure this URL (https://<your-domain>/api/paystack/webhook)
 * in the Paystack dashboard. Signature verification per Paystack docs:
 * https://paystack.com/docs/payments/webhooks/
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret) {
    console.error("PAYSTACK_SECRET_KEY is not set");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const expected = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  if (!signature || signature !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as {
    event: string;
    data: { reference: string; status: string };
  };

  if (event.event === "charge.success" && event.data.status === "success") {
    const admin = createAdminClient();
    const reference = event.data.reference;

    const { data: order } = await admin
      .from("orders")
      .select("id, status")
      .eq("paystack_reference", reference)
      .single();

    if (order && order.status === "pending") {
      await admin.from("orders").update({ status: "paid" }).eq("id", order.id);

      const { data: items } = await admin
        .from("order_items")
        .select("product_id, quantity")
        .eq("order_id", order.id);

      for (const item of items ?? []) {
        if (!item.product_id) continue;
        await admin.rpc("decrement_stock", {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
