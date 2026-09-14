import { Star } from "lucide-react";

const REVIEWS = [
  {
    name: "Owen Clarke",
    product: "Signature 555 Angel Number",
    quote: "If you're into manifestation and angel numbers this is a must cop. Grey is clean and versatile with everything.",
  },
  {
    name: "Tyrese Hamilton",
    product: "Signature 444 Heavyweight",
    quote: "Not usually a yellow guy but I saw this on socials and had to try. Got compliments on this all night.",
  },
  {
    name: "Andre Whitfield",
    product: "Signature 555 Angel Number",
    quote: "Brown shade is perfect, not too dark not too light either. Quality is good, heavy cotton, well made.",
  },
  {
    name: "Miguel Santos",
    product: "Signature 222 Heavyweight",
    quote: "The red caught my eye so I locked up with 222 meaning. Quality is legit impressive, heavyweight, well made.",
  },
];

export default function Testimonials() {
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
            <span>4.82 · 274 Reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((r) => (
            <div key={r.name} className="border border-border p-5">
              <span className="flex text-foreground mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} fill="currentColor" />
                ))}
              </span>
              <p className="text-sm text-muted mb-4">&ldquo;{r.quote}&rdquo;</p>
              <p className="text-sm">{r.name}</p>
              <p className="text-xs text-muted">{r.product}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
