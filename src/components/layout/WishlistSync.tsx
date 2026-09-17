"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useWishlistStore } from "@/lib/wishlist-store";

export default function WishlistSync() {
  const setIds = useWishlistStore((s) => s.setIds);

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const userId = session?.user.id;
      if (!userId) {
        setIds([]);
        return;
      }
      supabase
        .from("wishlist_items")
        .select("product_id")
        .eq("user_id", userId)
        .then(({ data }) => setIds((data ?? []).map((row) => row.product_id)));
    });

    return () => subscription.unsubscribe();
  }, [setIds]);

  return null;
}
