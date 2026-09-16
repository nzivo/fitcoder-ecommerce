import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("sort_order");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl uppercase">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="bg-foreground text-background px-5 py-2.5 text-xs tracking-widest-xl uppercase"
        >
          Add Category
        </Link>
      </div>

      {!categories || categories.length === 0 ? (
        <p className="text-sm text-muted">No categories yet.</p>
      ) : (
        <div className="border border-border overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-widest-xl text-muted">
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Sort</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-surface">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-12 bg-surface-2 overflow-hidden shrink-0">
                      {c.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.image_url} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <Link href={`/admin/categories/${c.id}`} className="underline">
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{c.sort_order}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] uppercase tracking-widest-xl border px-2 py-1 ${
                        c.is_active ? "border-success text-success" : "border-border text-muted"
                      }`}
                    >
                      {c.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteCategoryButton categoryId={c.id} name={c.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
