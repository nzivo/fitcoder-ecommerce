"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { FaqPlacement } from "@/types/database";

function faqPayload(formData: FormData) {
  return {
    placement: (String(formData.get("placement") ?? "home") as FaqPlacement),
    question: String(formData.get("question") ?? "").trim(),
    answer: String(formData.get("answer") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: formData.get("is_active") === "on",
  };
}

export async function createFaq(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("faqs").insert(faqPayload(formData));
  if (error) return { error: error.message };

  revalidatePath("/admin/faqs");
  revalidatePath("/");
  revalidatePath("/shop");
  redirect("/admin/faqs");
}

export async function updateFaq(faqId: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("faqs").update(faqPayload(formData)).eq("id", faqId);
  if (error) return { error: error.message };

  revalidatePath("/admin/faqs");
  revalidatePath("/");
  revalidatePath("/shop");
  redirect("/admin/faqs");
}

export async function deleteFaq(faqId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("faqs").delete().eq("id", faqId);
  if (error) return { error: error.message };

  revalidatePath("/admin/faqs");
  revalidatePath("/");
  revalidatePath("/shop");
  return { error: null };
}
