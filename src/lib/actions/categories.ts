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

async function categoryPayload(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const existingImage = String(formData.get("image_existing") ?? "").trim() || null;
  const [newImage] = await uploadImages(getFiles(formData, "image_new"), "categories");

  return {
    name,
    slug: rawSlug ? slugify(rawSlug) : slugify(name),
    sort_order: Number(formData.get("sort_order") ?? 0),
    image_url: newImage ?? existingImage,
    is_active: formData.get("is_active") === "on",
  };
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient();

  let payload;
  try {
    payload = await categoryPayload(formData);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload failed" };
  }

  const { error } = await supabase.from("categories").insert(payload);
  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin/categories");
}

export async function updateCategory(categoryId: string, formData: FormData) {
  const supabase = await createClient();

  let payload;
  try {
    payload = await categoryPayload(formData);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload failed" };
  }

  const { error } = await supabase.from("categories").update(payload).eq("id", categoryId);
  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin/categories");
}

export async function deleteCategory(categoryId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", categoryId);
  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/");
  return { error: null };
}
