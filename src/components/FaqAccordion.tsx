"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-border border-t border-border">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.q}>
            <button
              className="w-full flex items-center justify-between py-4 text-left text-sm"
              onClick={() => setOpenIndex(open ? null : i)}
            >
              <span className="uppercase tracking-wide text-xs sm:text-sm">{item.q}</span>
              <ChevronDown
                size={16}
                className={`transition-transform shrink-0 ml-4 ${open ? "rotate-180" : ""}`}
              />
            </button>
            {open && <p className="pb-4 text-sm text-muted max-w-lg">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
