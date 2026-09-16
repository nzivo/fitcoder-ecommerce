"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function testimonialPayload(formData: FormData) {
  return {
    customer_name: String(formData.get("customer_name") ?? "").trim(),
    product_name: String(formData.get("product_name") ?? "").trim() || null,
    rating: Number(formData.get("rating") ?? 5),
    quote: String(formData.get("quote") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: formData.get("is_active") === "on",
  };
}

export async function createTestimonial(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert(testimonialPayload(formData));
  if (error) return { error: error.message };

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function updateTestimonial(testimonialId: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("testimonials")
    .update(testimonialPayload(formData))
    .eq("id", testimonialId);
  if (error) return { error: error.message };

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(testimonialId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", testimonialId);
  if (error) return { error: error.message };

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  return { error: null };
}
