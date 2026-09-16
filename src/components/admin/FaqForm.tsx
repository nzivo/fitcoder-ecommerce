"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import type { Faq } from "@/types/database";

type ActionResult = { error: string | null } | undefined | void;

export default function FaqForm({
  faq,
  action,
}: {
  faq?: Faq;
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
      <label className="block text-xs">
        <span className="text-muted">Shows on</span>
        <select
          name="placement"
          defaultValue={faq?.placement ?? "home"}
          className="mt-1 w-full bg-surface border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
        >
          <option value="home">Homepage</option>
          <option value="shop">Shop page</option>
        </select>
      </label>

      <label className="block text-xs">
        <span className="text-muted">Question</span>
        <input
          name="question"
          required
          defaultValue={faq?.question}
          className="mt-1 w-full bg-surface border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
        />
      </label>

      <label className="block text-xs">
        <span className="text-muted">Answer</span>
        <textarea
          name="answer"
          rows={4}
          required
          defaultValue={faq?.answer}
          className="mt-1 w-full bg-surface border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
        />
      </label>

      <label className="block text-xs w-32">
        <span className="text-muted">Sort order</span>
        <input
          name="sort_order"
          type="number"
          defaultValue={faq?.sort_order ?? 0}
          className="mt-1 w-full bg-surface border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_active" defaultChecked={faq?.is_active ?? true} />
        Active (visible on site)
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="bg-foreground text-background px-6 py-3 text-xs tracking-widest-xl uppercase disabled:opacity-50"
      >
        {submitting ? "Saving…" : faq ? "Save Changes" : "Create FAQ"}
      </button>
    </form>
  );
}
