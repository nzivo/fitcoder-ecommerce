import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeleteTestimonialButton from "@/components/admin/DeleteTestimonialButton";

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl uppercase">Testimonials</h1>
        <Link
          href="/admin/testimonials/new"
          className="bg-foreground text-background px-5 py-2.5 text-xs tracking-widest-xl uppercase"
        >
          Add Testimonial
        </Link>
      </div>

      {!testimonials || testimonials.length === 0 ? (
        <p className="text-sm text-muted">No testimonials yet.</p>
      ) : (
        <div className="border border-border divide-y divide-border max-w-3xl">
          {testimonials.map((t) => (
            <div key={t.id} className="flex items-start justify-between gap-4 px-4 py-4">
              <div className="min-w-0">
                <p className="text-sm">
                  {t.customer_name}
                  {t.product_name && <span className="text-muted"> · {t.product_name}</span>}
                </p>
                <p className="text-xs text-muted mt-1 line-clamp-2">{t.quote}</p>
                <span
                  className={`inline-block mt-2 text-[10px] uppercase tracking-widest-xl border px-2 py-1 ${
                    t.is_active ? "border-success text-success" : "border-border text-muted"
                  }`}
                >
                  {t.is_active ? "Active" : "Hidden"}
                </span>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <Link href={`/admin/testimonials/${t.id}`} className="text-xs underline">
                  Edit
                </Link>
                <DeleteTestimonialButton id={t.id} name={t.customer_name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
