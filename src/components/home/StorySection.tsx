import Link from "next/link";

export default function StorySection() {
  return (
    <section id="our-story" className="bg-background py-16 sm:py-24">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="relative h-[340px] sm:h-[420px]">
          <div className="absolute left-0 top-0 w-2/3 h-4/5 bg-surface-2 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/lifestyle/story-1.svg" alt="Dope Beyond lifestyle" className="w-full h-full object-cover" />
          </div>
          <div className="absolute right-0 bottom-0 w-2/3 h-4/5 bg-surface-2 overflow-hidden border-4 border-background">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/lifestyle/story-2.svg" alt="Dope Beyond lifestyle" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="max-w-md">
          <p className="text-xs tracking-widest-xl uppercase text-muted mb-3">Our Story</p>
          <h2 className="font-display text-3xl sm:text-4xl uppercase leading-tight mb-5">
            Move with Dope Forever
          </h2>
          <p className="text-sm text-muted mb-7">
            Dope Beyond creates exclusive streetwear pieces designed for individuals who embrace
            creativity, confidence, and originality.
          </p>
          <Link
            href="/contact"
            className="inline-block border border-foreground px-6 py-3 text-xs tracking-widest-xl uppercase"
          >
            Our Story
          </Link>
        </div>
      </div>
    </section>
  );
}
