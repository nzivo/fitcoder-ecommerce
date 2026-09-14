import Link from "next/link";

export default function WinterBanner() {
  return (
    <section
      className="relative bg-cover bg-center min-h-[420px] flex items-end"
      style={{ backgroundImage: "url('/lifestyle/winter.svg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 py-12 w-full">
        <p className="text-xs tracking-widest-xl uppercase text-white/70 mb-2">New Drop</p>
        <h2 className="font-display text-3xl sm:text-5xl uppercase text-white mb-5">
          Winter Collections
        </h2>
        <Link
          href="/shop"
          className="inline-block bg-white text-black px-6 py-3 text-xs tracking-widest-xl uppercase"
        >
          Shop the Collection
        </Link>
      </div>
    </section>
  );
}
