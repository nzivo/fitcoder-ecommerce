"use client";

import { useTransition } from "react";
import toast from "react-hot-toast";
import { deleteTestimonial } from "@/lib/actions/testimonials";

export default function DeleteTestimonialButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Delete the testimonial from "${name}"?`)) return;
    startTransition(async () => {
      const result = await deleteTestimonial(id);
      if (result?.error) toast.error(result.error);
      else toast.success("Testimonial deleted");
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
