"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { toggleWishlist } from "@/lib/actions/wishlist";
import { useWishlistStore } from "@/lib/wishlist-store";

export default function WishlistButton({
  productId,
  redirectTo,
  className,
  size = 15,
}: {
  productId: string;
  redirectTo: string;
  className?: string;
  size?: number;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const wishlisted = useWishlistStore((s) => s.ids.includes(productId));
  const add = useWishlistStore((s) => s.add);
  const remove = useWishlistStore((s) => s.remove);

  async function handleClick() {
    if (pending) return;
    setPending(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setPending(false);
      toast.error("Sign in to save items to your wishlist");
      router.push(`/account?redirectedFrom=${encodeURIComponent(redirectTo)}`);
      return;
    }

    const wasWishlisted = wishlisted;
    if (wasWishlisted) remove(productId);
    else add(productId);

    const result = await toggleWishlist(productId);
    setPending(false);

    if (result.error) {
      if (wasWishlisted) add(productId);
      else remove(productId);
      toast.error(result.error);
      return;
    }

    toast.success(wasWishlisted ? "Removed from wishlist" : "Saved to wishlist");
  }

  return (
    <button
      type="button"
      aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
      onClick={handleClick}
      disabled={pending}
      className={className}
    >
      <Heart size={size} fill={wishlisted ? "currentColor" : "none"} />
    </button>
  );
}
