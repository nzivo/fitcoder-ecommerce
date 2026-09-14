import { createClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/types/database";

function supabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getCategories(): Promise<Category[]> {
  if (!supabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*").order("sort_order");
  if (error) {
    console.error("getCategories:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  if (!supabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("getFeaturedProducts:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getProducts(options: { categorySlug?: string } = {}): Promise<Product[]> {
  if (!supabaseConfigured()) return [];
  const supabase = await createClient();
  let query = supabase.from("products").select("*, categories!inner(slug)").eq("is_active", true);

  if (options.categorySlug) {
    query = query.eq("categories.slug", options.categorySlug);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) {
    console.error("getProducts:", error.message);
    return [];
  }
  return (data ?? []) as unknown as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!supabaseConfigured()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (error) return null;
  return data;
}
