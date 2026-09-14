import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-[#12211f] via-[#0f1614] to-background overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-14 pb-24 text-center">
        <p className="text-xs tracking-widest-xl uppercase text-muted mb-4">Lifestyle of Legends</p>
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl uppercase leading-[0.95] max-w-4xl mx-auto">
          Built for those who move different
        </h1>
        <p className="text-sm sm:text-base text-muted max-w-md mx-auto mt-5">
          Heavyweight streetwear designed for those who create their own path.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Link
            href="/shop"
            className="bg-foreground text-background px-7 py-3 text-xs tracking-widest-xl uppercase"
          >
            Shop Now
          </Link>
          <Link
            href="/shop"
            className="border border-foreground px-7 py-3 text-xs tracking-widest-xl uppercase"
          >
            Explore Collection
          </Link>
        </div>

        <div
          className="mt-16 aspect-[16/7] w-full max-w-5xl mx-auto bg-cover bg-center relative"
          style={{ backgroundImage: "url('/lifestyle/hero.svg')" }}
        >
          <Link
            href="/shop"
            className="absolute left-1/2 bottom-4 -translate-x-1/2 bg-background text-foreground px-6 py-3 text-xs tracking-widest-xl uppercase whitespace-nowrap"
          >
            Shop Best Sellers
          </Link>
        </div>
      </div>
    </section>
  );
}
