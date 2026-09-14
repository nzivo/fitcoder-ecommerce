const COLORS: Record<string, string> = {
  pending: "text-muted border-border",
  paid: "text-success border-success",
  processing: "text-foreground border-foreground",
  shipped: "text-foreground border-foreground",
  delivered: "text-success border-success",
  cancelled: "text-danger border-danger",
  refunded: "text-danger border-danger",
};

export default function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`text-[10px] uppercase tracking-widest-xl border px-2 py-1 shrink-0 ${
        COLORS[status] ?? "border-border"
      }`}
    >
      {status}
    </span>
  );
}
