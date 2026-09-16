import "server-only";
import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";

/**
 * Uploads image files to the public "media" Storage bucket under the given
 * folder and returns their public URLs, in the same order as the input.
 * Runs with the caller's session — Storage RLS only allows admins to write.
 */
export async function uploadImages(files: File[], folder: string): Promise<string[]> {
  const usable = files.filter((f) => f && f.size > 0);
  if (usable.length === 0) return [];

  const supabase = await createClient();
  const urls: string[] = [];

  for (const file of usable) {
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
    const path = `${folder}/${randomUUID()}.${ext}`;

    const { error } = await supabase.storage.from("media").upload(path, file, {
      contentType: file.type || "application/octet-stream",
      cacheControl: "31536000",
    });

    if (error) throw new Error(`Image upload failed: ${error.message}`);

    const { data } = supabase.storage.from("media").getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return urls;
}

/** Pulls every non-empty File out of a FormData entry that may hold several files under one field name. */
export function getFiles(formData: FormData, field: string): File[] {
  return formData.getAll(field).filter((v): v is File => v instanceof File);
}
