"use client";

import { Loader2 } from "lucide-react";

export default function SubmitButton({
  submitting,
  label,
  submittingLabel = "Saving…",
}: {
  submitting: boolean;
  label: string;
  submittingLabel?: string;
}) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 text-xs tracking-widest-xl uppercase disabled:opacity-50"
    >
      {submitting && <Loader2 size={14} className="animate-spin" />}
      {submitting ? submittingLabel : label}
    </button>
  );
}
