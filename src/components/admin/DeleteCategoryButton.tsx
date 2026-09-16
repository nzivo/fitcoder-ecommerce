"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import { deleteCategory } from "@/lib/actions/categories";

export default function DeleteCategoryButton({ categoryId, name }: { categoryId: string; name: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Delete "${name}"? Products in this category will become uncategorized.`)) return;
    startTransition(async () => {
      const result = await deleteCategory(categoryId);
      if (result?.error) toast.error(result.error);
      else toast.success("Category deleted");
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
