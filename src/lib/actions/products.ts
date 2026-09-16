"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { uploadImages, getFiles } from "@/lib/actions/upload";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function csvToArray(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

async function productPayload(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim();

  const existingImages = csvToArray(formData.get("images_existing"));
  const newImages = await uploadImages(getFiles(formData, "images_new"), "products");

  return {
    name,
    slug: rawSlug ? slugify(rawSlug) : slugify(name),
    description: String(formData.get("description") ?? "").trim() || null,
    price: Number(formData.get("price") ?? 0),
    compare_at_price: formData.get("compare_at_price")
      ? Number(formData.get("compare_at_price"))
      : null,
    category_id: categoryId || null,
    images: [...existingImages, ...newImages],
    sizes: csvToArray(formData.get("sizes")),
    colors: csvToArray(formData.get("colors")),
    stock: Number(formData.get("stock") ?? 0),
    is_active: formData.get("is_active") === "on",
    is_featured: formData.get("is_featured") === "on",
  };
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  let payload;
  try {
    payload = await productPayload(formData);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload failed" };
  }

  const { error } = await supabase.from("products").insert(payload);
  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await createClient();

  let payload;
  try {
    payload = await productPayload(formData);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload failed" };
  }

  const { error } = await supabase.from("products").update(payload).eq("id", productId);
  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  return { error: null };
}
