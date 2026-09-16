"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import type { Category, Product } from "@/types/database";
import ImageUploadField from "@/components/admin/ImageUploadField";

type ActionResult = { error: string | null } | undefined | void;

export default function ProductForm({
  categories,
  product,
  action,
}: {
  categories: Category[];
  product?: Product;
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
    <form action={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name" name="name" defaultValue={product?.name} required />
        <Field
          label="Slug (optional — derived from name)"
          name="slug"
          defaultValue={product?.slug}
        />
      </div>

      <TextArea label="Description" name="description" defaultValue={product?.description ?? ""} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Field label="Price (KES)" name="price" type="number" step="0.01" defaultValue={product?.price} required />
        <Field
          label="Compare-at price"
          name="compare_at_price"
          type="number"
          step="0.01"
          defaultValue={product?.compare_at_price ?? ""}
        />
        <Field label="Stock" name="stock" type="number" defaultValue={product?.stock ?? 0} required />
        <label className="block text-xs">
          <span className="text-muted">Category</span>
          <select
            name="category_id"
            defaultValue={product?.category_id ?? ""}
            className="mt-1 w-full bg-surface border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ImageUploadField name="images" label="Product Images" defaultImages={product?.images ?? []} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Sizes (comma-separated)" name="sizes" defaultValue={product?.sizes.join(", ")} placeholder="S, M, L, XL" />
        <Field label="Colors (comma-separated)" name="colors" defaultValue={product?.colors.join(", ")} placeholder="Black, Grey" />
      </div>

      <div className="flex items-center gap-8">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_active" defaultChecked={product?.is_active ?? true} />
          Active (visible in shop)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_featured" defaultChecked={product?.is_featured ?? false} />
          Featured on homepage
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-foreground text-background px-6 py-3 text-xs tracking-widest-xl uppercase disabled:opacity-50"
      >
        {submitting ? "Saving…" : product ? "Save Changes" : "Create Product"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  step,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  step?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block text-xs">
      <span className="text-muted">{label}</span>
      <input
        name={name}
        type={type}
        step={step}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        className="mt-1 w-full bg-surface border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <label className="block text-xs">
      <span className="text-muted">{label}</span>
      <textarea
        name={name}
        rows={3}
        defaultValue={defaultValue}
        className="mt-1 w-full bg-surface border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
      />
    </label>
  );
}
