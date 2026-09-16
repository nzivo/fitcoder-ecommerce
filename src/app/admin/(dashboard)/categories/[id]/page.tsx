import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CategoryForm from "@/components/admin/CategoryForm";
import { updateCategory } from "@/lib/actions/categories";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase.from("categories").select("*").eq("id", id).single();

  if (!category) notFound();

  const boundUpdate = updateCategory.bind(null, category.id);

  return (
    <div>
      <h1 className="font-display text-2xl uppercase mb-8">Edit Category</h1>
      <CategoryForm category={category} action={boundUpdate} />
    </div>
  );
}
