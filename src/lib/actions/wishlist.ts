"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleWishlist(productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sign in to save items to your wishlist.", wishlisted: false };
  }

  const { data: existing } = await supabase
    .from("wishlist_items")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("wishlist_items").delete().eq("id", existing.id);
    if (error) return { error: error.message, wishlisted: true };
    revalidatePath("/account/wishlist");
    return { error: null, wishlisted: false };
  }

  const { error } = await supabase
    .from("wishlist_items")
    .insert({ user_id: user.id, product_id: productId });
  if (error) return { error: error.message, wishlisted: false };

  revalidatePath("/account/wishlist");
  return { error: null, wishlisted: true };
}
