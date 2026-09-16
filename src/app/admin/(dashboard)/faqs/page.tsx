import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeleteFaqButton from "@/components/admin/DeleteFaqButton";
import type { FaqPlacement } from "@/types/database";

export default async function AdminFaqsPage({
  searchParams,
}: {
  searchParams: Promise<{ placement?: string }>;
}) {
  const { placement } = await searchParams;
  const active: FaqPlacement = placement === "shop" ? "shop" : "home";

  const supabase = await createClient();
  const { data: faqs } = await supabase
    .from("faqs")
    .select("*")
    .eq("placement", active)
    .order("sort_order");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl uppercase">FAQs</h1>
        <Link
          href="/admin/faqs/new"
          className="bg-foreground text-background px-5 py-2.5 text-xs tracking-widest-xl uppercase"
        >
          Add FAQ
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        <Tab href="/admin/faqs?placement=home" active={active === "home"} label="Homepage" />
        <Tab href="/admin/faqs?placement=shop" active={active === "shop"} label="Shop Page" />
      </div>

      {!faqs || faqs.length === 0 ? (
        <p className="text-sm text-muted">No FAQs for this page yet.</p>
      ) : (
        <div className="border border-border divide-y divide-border max-w-3xl">
          {faqs.map((f) => (
            <div key={f.id} className="flex items-start justify-between gap-4 px-4 py-4">
              <div className="min-w-0">
                <p className="text-sm">{f.question}</p>
                <p className="text-xs text-muted mt-1 line-clamp-2">{f.answer}</p>
                <span
                  className={`inline-block mt-2 text-[10px] uppercase tracking-widest-xl border px-2 py-1 ${
                    f.is_active ? "border-success text-success" : "border-border text-muted"
                  }`}
                >
                  {f.is_active ? "Active" : "Hidden"}
                </span>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <Link href={`/admin/faqs/${f.id}`} className="text-xs underline">
                  Edit
                </Link>
                <DeleteFaqButton id={f.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Tab({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`text-xs uppercase tracking-widest-xl px-3 py-1.5 border ${
        active ? "bg-foreground text-background border-foreground" : "border-border text-muted"
      }`}
    >
      {label}
    </Link>
  );
}
