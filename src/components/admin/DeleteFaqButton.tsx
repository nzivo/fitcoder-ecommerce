"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import { deleteFaq } from "@/lib/actions/faqs";

export default function DeleteFaqButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("Delete this FAQ entry?")) return;
    startTransition(async () => {
      const result = await deleteFaq(id);
      if (result?.error) toast.error(result.error);
      else toast.success("FAQ deleted");
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
