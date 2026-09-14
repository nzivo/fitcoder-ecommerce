"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import { deleteProduct } from "@/lib/actions/products";

export default function DeleteProductButton({ productId, name }: { productId: string; name: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return;
    startTransition(async () => {
      const result = await deleteProduct(productId);
      if (result?.error) toast.error(result.error);
      else toast.success("Product deleted");
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-xs text-danger hover:underline disabled:opacity-50"
    >
      Delete
    </button>
  );
}
