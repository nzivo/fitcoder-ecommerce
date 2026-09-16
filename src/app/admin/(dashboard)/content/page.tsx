import Link from "next/link";
import type { SiteSectionId } from "@/types/database";

const SECTIONS: { id: SiteSectionId; label: string; description: string }[] = [
  { id: "hero", label: "Homepage Hero", description: "Headline, subtext, hero image, and both call-to-action buttons." },
  { id: "story", label: "Our Story Section", description: "Two stacked images plus the 'Move with Fit Coder Forever' copy." },
  { id: "winter_banner", label: "Seasonal Collection Banner", description: "Full-width banner below Shop by Category." },
  { id: "lifestyle_banner", label: "Lifestyle Banner", description: "Full-width banner above the footer." },
];

export default function AdminContentPage() {
  return (
    <div>
      <h1 className="font-display text-2xl uppercase mb-8">Homepage Content</h1>
      <div className="border border-border divide-y divide-border max-w-2xl">
        {SECTIONS.map((s) => (
          <Link
            key={s.id}
            href={`/admin/content/${s.id}`}
            className="flex items-center justify-between px-4 py-4 hover:bg-surface"
          >
            <div>
              <p className="text-sm">{s.label}</p>
              <p className="text-xs text-muted mt-1">{s.description}</p>
            </div>
            <span className="text-xs text-muted">Edit →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
