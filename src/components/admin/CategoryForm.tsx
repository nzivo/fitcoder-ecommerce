"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import type { Category } from "@/types/database";
import ImageUploadField from "@/components/admin/ImageUploadField";

type ActionResult = { error: string | null } | undefined | void;

export default function CategoryForm({
  category,
  action,
}: {
  category?: Category;
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
          <span className="text-muted">Name</span>
          <input
            name="name"
            required
            defaultValue={category?.name}
            className="mt-1 w-full bg-surface border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
          />
        </label>
        <label className="block text-xs">
          <span className="text-muted">Slug (optional — derived from name)</span>
          <input
            name="slug"
            defaultValue={category?.slug}
            className="mt-1 w-full bg-surface border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
          />
        </label>
      </div>

      <label className="block text-xs w-32">
        <span className="text-muted">Sort order</span>
        <input
          name="sort_order"
          type="number"
          defaultValue={category?.sort_order ?? 0}
          className="mt-1 w-full bg-surface border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
        />
      </label>

      <ImageUploadField
        name="image"
        label="Category Image"
        defaultImages={category?.image_url ? [category.image_url] : []}
        multiple={false}
      />

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_active" defaultChecked={category?.is_active ?? true} />
        Active (visible in shop)
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="bg-foreground text-background px-6 py-3 text-xs tracking-widest-xl uppercase disabled:opacity-50"
      >
        {submitting ? "Saving…" : category ? "Save Changes" : "Create Category"}
      </button>
    </form>
  );
}
