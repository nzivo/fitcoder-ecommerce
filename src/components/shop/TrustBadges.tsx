import { Gift, Truck, Wallet } from "lucide-react";

const BADGES = [
  { icon: Gift, title: "New Customers Get 10% Off", sub: "On your first purchase" },
  { icon: Truck, title: "Free Shipping", sub: "On orders over KES 10,000" },
  { icon: Wallet, title: "Pay Your Way", sub: "M-Pesa, card, or bank" },
];

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border border-y border-border">
      {BADGES.map(({ icon: Icon, title, sub }) => (
        <div key={title} className="flex flex-col items-center text-center gap-2 py-8 px-4">
          <Icon size={22} />
          <p className="text-xs tracking-widest-xl uppercase">{title}</p>
          <p className="text-xs text-muted">{sub}</p>
        </div>
      ))}
    </div>
  );
}
