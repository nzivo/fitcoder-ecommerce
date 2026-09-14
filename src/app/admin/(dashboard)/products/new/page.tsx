import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";
import { createProduct } from "@/lib/actions/products";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("sort_order");

  return (
    <div>
      <h1 className="font-display text-2xl uppercase mb-8">Add Product</h1>
      <ProductForm categories={categories ?? []} action={createProduct} />
    </div>
  );
}
