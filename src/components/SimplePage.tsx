export default function SimplePage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-display text-2xl sm:text-3xl uppercase mb-6">{title}</h1>
      <div className="text-sm text-muted space-y-4 leading-relaxed">{children}</div>
    </div>
  );
}
