import FaqAccordion from "@/components/FaqAccordion";

const FAQS = [
  {
    q: "How long does delivery take?",
    a: "Standard delivery within Kenya takes 2–4 business days. International orders take 7–14 business days depending on destination.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes — unworn items in original condition can be returned within 14 days of delivery for a full refund.",
  },
  {
    q: "How do I care for my clothing?",
    a: "Machine wash cold, inside out, with like colors. Tumble dry low or hang dry to preserve print and fabric quality.",
  },
  {
    q: "Where can I track my order?",
    a: "Once your order ships you'll receive a tracking link by email. You can also view order status from your account page.",
  },
];

export default function FaqSection() {
  return (
    <section className="bg-surface py-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4">
            Find Your Luxury — Everyday.
          </h2>
          <p className="text-sm text-muted max-w-sm">
            Questions about your order? We&apos;re here to help. Whether it&apos;s sizing, shipping, or
            returns, the Fit Coder team has you covered.
          </p>
          <p className="text-sm text-muted mt-3">
            Reach us via{" "}
            <a href="mailto:support@fitcoder.com" className="underline">
              support@fitcoder.com
            </a>
          </p>
        </div>
        <FaqAccordion items={FAQS} />
      </div>
    </section>
  );
}
