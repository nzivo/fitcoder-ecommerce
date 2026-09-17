import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center gap-2 py-24 text-muted">
      <Loader2 size={18} className="animate-spin" />
      <span className="text-xs tracking-widest-xl uppercase">Loading…</span>
    </div>
  );
}
