import Link from "next/link";

export default function LifestyleBanner() {
  return (
    <section
      className="relative bg-cover bg-center min-h-[380px] flex items-center justify-center text-center"
      style={{ backgroundImage: "url('/lifestyle/lifestyle-footer.svg')" }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative px-4">
        <h2 className="font-display text-3xl sm:text-5xl uppercase text-white mb-3">
          The Lifestyle of Legends
        </h2>
        <p className="text-sm text-white/70 mb-6">Heavyweight streetwear. Designed in Canada. Shipped worldwide.</p>
        <Link
          href="/shop"
          className="inline-block bg-white text-black px-7 py-3 text-xs tracking-widest-xl uppercase"
        >
          Shop All
        </Link>
      </div>
    </section>
  );
}
