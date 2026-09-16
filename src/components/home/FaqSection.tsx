import FaqAccordion from "@/components/FaqAccordion";
import type { Faq } from "@/types/database";

export default function FaqSection({ faqs }: { faqs: Faq[] }) {
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
        <FaqAccordion items={faqs.map((f) => ({ q: f.question, a: f.answer }))} />
      </div>
    </section>
  );
}
