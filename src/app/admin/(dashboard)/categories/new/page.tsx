import CategoryForm from "@/components/admin/CategoryForm";
import { createCategory } from "@/lib/actions/categories";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="font-display text-2xl uppercase mb-8">Add Category</h1>
      <CategoryForm action={createCategory} />
    </div>
  );
}
