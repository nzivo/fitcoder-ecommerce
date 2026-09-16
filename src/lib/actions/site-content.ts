"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadImages, getFiles } from "@/lib/actions/upload";
import type { SiteSectionId } from "@/types/database";

function textOrNull(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  return value || null;
}

export async function updateSiteSection(id: SiteSectionId, formData: FormData) {
  const supabase = await createClient();

  let newImage1: string | undefined;
  let newImage2: string | undefined;
  try {
    [newImage1] = await uploadImages(getFiles(formData, "image_new"), `content/${id}`);
    [newImage2] = await uploadImages(getFiles(formData, "image2_new"), `content/${id}`);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload failed" };
  }

  const existingImage1 = textOrNull(formData, "image_existing");
  const existingImage2 = textOrNull(formData, "image2_existing");

  const payload = {
    eyebrow: textOrNull(formData, "eyebrow"),
    title: textOrNull(formData, "title"),
    subtitle: textOrNull(formData, "subtitle"),
    body: textOrNull(formData, "body"),
    image_url: newImage1 ?? existingImage1,
    image_url_2: newImage2 ?? existingImage2,
    cta_label: textOrNull(formData, "cta_label"),
    cta_href: textOrNull(formData, "cta_href"),
    cta2_label: textOrNull(formData, "cta2_label"),
    cta2_href: textOrNull(formData, "cta2_href"),
  };

  const { error } = await supabase.from("site_sections").update(payload).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/content");
  revalidatePath("/");
  return { error: null, success: true };
}
