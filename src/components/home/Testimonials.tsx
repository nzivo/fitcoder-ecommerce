import { Star } from "lucide-react";
import type { Testimonial } from "@/types/database";

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  const avgRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  return (
    <section className="bg-background py-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl sm:text-3xl uppercase mb-3">Customers Are Saying</h2>
          <div className="flex items-center justify-center gap-2 text-sm text-muted">
            <span className="flex text-foreground">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </span>
            <span>
              {avgRating.toFixed(2)} · {testimonials.length} Reviews
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="border border-border p-5">
              <span className="flex text-foreground mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={12} fill="currentColor" />
                ))}
              </span>
              <p className="text-sm text-muted mb-4">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-sm">{t.customer_name}</p>
              {t.product_name && <p className="text-xs text-muted">{t.product_name}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
