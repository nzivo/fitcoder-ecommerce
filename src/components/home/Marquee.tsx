const ITEMS = [
  "Dope Beyond",
  "Lifestyle of Legends",
  "Shop Trending",
  "New Drops",
  "Shop Best Sellers",
];

export default function Marquee() {
  const track = [...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div className="bg-surface border-y border-border overflow-hidden py-3">
      <div className="flex gap-8 whitespace-nowrap animate-[marquee_28s_linear_infinite] w-max">
        {track.map((item, i) => (
          <span key={i} className="flex items-center gap-8 text-xs tracking-widest-xl uppercase text-muted">
            {item}
            <span className="text-foreground">•</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
