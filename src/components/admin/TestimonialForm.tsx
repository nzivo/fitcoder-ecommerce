"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import type { Testimonial } from "@/types/database";
import SubmitButton from "@/components/admin/SubmitButton";

type ActionResult = { error: string | null } | undefined | void;

export default function TestimonialForm({
  testimonial,
  action,
}: {
  testimonial?: Testimonial;
  action: (formData: FormData) => Promise<ActionResult>;
}) {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    const result = await action(formData);
    setSubmitting(false);
    if (result?.error) toast.error(result.error);
  }

  return (
    <form action={handleSubmit} className="max-w-lg space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block text-xs">
          <span className="text-muted">Customer name</span>
          <input
            name="customer_name"
            required
            defaultValue={testimonial?.customer_name}
            className="mt-1 w-full bg-surface border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
          />
        </label>
        <label className="block text-xs">
          <span className="text-muted">Product (optional)</span>
          <input
            name="product_name"
            defaultValue={testimonial?.product_name ?? ""}
            className="mt-1 w-full bg-surface border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
          />
        </label>
      </div>

      <label className="block text-xs">
        <span className="text-muted">Quote</span>
        <textarea
          name="quote"
          rows={3}
          required
          defaultValue={testimonial?.quote}
          className="mt-1 w-full bg-surface border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
        />
      </label>

      <div className="grid grid-cols-2 gap-4 max-w-xs">
        <label className="block text-xs">
          <span className="text-muted">Rating (1–5)</span>
          <input
            name="rating"
            type="number"
            min={1}
            max={5}
            defaultValue={testimonial?.rating ?? 5}
            className="mt-1 w-full bg-surface border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
          />
        </label>
        <label className="block text-xs">
          <span className="text-muted">Sort order</span>
          <input
            name="sort_order"
            type="number"
            defaultValue={testimonial?.sort_order ?? 0}
            className="mt-1 w-full bg-surface border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_active" defaultChecked={testimonial?.is_active ?? true} />
        Active (visible on homepage)
      </label>

      <SubmitButton
        submitting={submitting}
        label={testimonial ? "Save Changes" : "Create Testimonial"}
      />
    </form>
  );
}
