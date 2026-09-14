import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { initializeTransaction } from "@/lib/paystack";
import type { ShippingAddress } from "@/types/database";

interface CheckoutItem {
  productId: string;
  name: string;
  image: string | null;
  price: number;
  quantity: number;
  size: string | null;
  color: string | null;
}

interface CheckoutBody {
  items: CheckoutItem[];
  shippingAddress: ShippingAddress;
}

export async function POST(request: Request) {
  const body = (await request.json()) as CheckoutBody;
  const { items, shippingAddress } = body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Your bag is empty" }, { status: 400 });
  }
  if (!shippingAddress?.email || !shippingAddress?.full_name || !shippingAddress?.phone) {
    return NextResponse.json({ error: "Missing required shipping details" }, { status: 400 });
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = subtotal >= 10000 ? 0 : 500;
  const total = subtotal + shippingFee;
  const reference = `DB-${Date.now()}-${randomUUID().slice(0, 8)}`;

  const userClient = await createClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();

  const admin = createAdminClient();

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      email: shippingAddress.email,
      status: "pending",
      subtotal,
      shipping_fee: shippingFee,
      total,
      currency: "KES",
      paystack_reference: reference,
      shipping_address: shippingAddress,
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error("checkout order insert failed:", orderError?.message);
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }

  const { error: itemsError } = await admin.from("order_items").insert(
    items.map((i) => ({
      order_id: order.id,
      product_id: i.productId,
      product_name: i.name,
      product_image: i.image,
      price: i.price,
      quantity: i.quantity,
      size: i.size,
      color: i.color,
    })),
  );

  if (itemsError) {
    console.error("checkout order_items insert failed:", itemsError.message);
    await admin.from("orders").delete().eq("id", order.id);
    return NextResponse.json({ error: "Could not create order items" }, { status: 500 });
  }

  try {
    const origin = new URL(request.url).origin;
    const { authorization_url } = await initializeTransaction({
      email: shippingAddress.email,
      amountKobo: Math.round(total * 100),
      reference,
      currency: "KES",
      callbackUrl: `${origin}/order/confirmation?reference=${reference}`,
      metadata: { order_id: order.id },
    });

    return NextResponse.json({ authorizationUrl: authorization_url, reference });
  } catch (err) {
    console.error("Paystack initialize failed:", err);
    await admin.from("orders").delete().eq("id", order.id);
    return NextResponse.json({ error: "Could not start payment" }, { status: 500 });
  }
}
