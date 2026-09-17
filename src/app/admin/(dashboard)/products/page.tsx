import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/format";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl uppercase">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-accent text-accent-foreground px-5 py-2.5 text-xs tracking-widest-xl uppercase"
        >
          Add Product
        </Link>
      </div>

      {!products || products.length === 0 ? (
        <p className="text-sm text-muted">No products yet.</p>
      ) : (
        <div className="border border-border overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-widest-xl text-muted">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-surface">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-12 bg-surface-2 overflow-hidden shrink-0">
                      {p.images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <Link href={`/admin/products/${p.id}`} className="underline">
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{formatMoney(p.price, p.currency)}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] uppercase tracking-widest-xl border px-2 py-1 ${
                        p.is_active ? "border-success text-success" : "border-border text-muted"
                      }`}
                    >
                      {p.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteProductButton productId={p.id} name={p.name} />
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
