"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { Category, Product, ProductVariant } from "@/types/database";
import ImageUploadField from "@/components/admin/ImageUploadField";
import SubmitButton from "@/components/admin/SubmitButton";

type ActionResult = { error: string | null } | undefined | void;

function csvToList(value: string) {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export default function ProductForm({
  categories,
  product,
  variants = [],
  action,
}: {
  categories: Category[];
  product?: Product;
  variants?: ProductVariant[];
  action: (formData: FormData) => Promise<ActionResult>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [sizesInput, setSizesInput] = useState(product?.sizes.join(", ") ?? "");
  const [colorsInput, setColorsInput] = useState(product?.colors.join(", ") ?? "");

  const variantCombos = useMemo(() => {
    const sizes = csvToList(sizesInput);
    const colors = csvToList(colorsInput);
    const pairs: { size: string; color: string }[] =
      sizes.length === 0 && colors.length === 0
        ? [{ size: "", color: "" }]
        : sizes.length === 0
          ? colors.map((color) => ({ size: "", color }))
          : colors.length === 0
            ? sizes.map((size) => ({ size, color: "" }))
            : sizes.flatMap((size) => colors.map((color) => ({ size, color })));

    return pairs.map((pair) => {
      const existing = variants.find((v) => v.size === pair.size && v.color === pair.color);
      return { ...pair, stock: existing?.stock ?? 0 };
    });
  }, [sizesInput, colorsInput, variants]);

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

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field label="Price (KES)" name="price" type="number" step="0.01" defaultValue={product?.price} required />
        <Field
          label="Compare-at price"
          name="compare_at_price"
          type="number"
          step="0.01"
          defaultValue={product?.compare_at_price ?? ""}
        />
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
        <Field
          label="Sizes (comma-separated)"
          name="sizes"
          value={sizesInput}
          onChange={setSizesInput}
          placeholder="S, M, L, XL"
        />
        <Field
          label="Colors (comma-separated)"
          name="colors"
          value={colorsInput}
          onChange={setColorsInput}
          placeholder="Black, Grey"
        />
      </div>

      <div>
        <p className="text-xs text-muted mb-2">
          Stock by {csvToList(sizesInput).length > 0 && csvToList(colorsInput).length > 0
            ? "size & color"
            : csvToList(sizesInput).length > 0
              ? "size"
              : csvToList(colorsInput).length > 0
                ? "color"
                : "variant"}
        </p>
        <div className="border border-border divide-y divide-border max-w-md">
          {variantCombos.map(({ size, color, stock }) => (
            <div
              key={`${size}|${color}`}
              className="flex items-center justify-between gap-4 px-3 py-2"
            >
              <span className="text-sm">
                {[size, color].filter(Boolean).join(" / ") || "Total stock"}
              </span>
              <input
                type="number"
                min={0}
                name={`variant|${encodeURIComponent(size)}|${encodeURIComponent(color)}`}
                defaultValue={stock}
                className="w-24 bg-surface border border-border px-3 py-1.5 text-sm text-right focus:outline-none focus:border-foreground"
              />
            </div>
          ))}
        </div>
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

      <SubmitButton submitting={submitting} label={product ? "Save Changes" : "Create Product"} />
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  value,
  onChange,
  type = "text",
  step,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  value?: string;
  onChange?: (value: string) => void;
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
        {...(value !== undefined
          ? { value, onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value) }
          : { defaultValue: defaultValue ?? "" })}
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
