const IMAGES = [
  { file: "community-1", likes: "2.4k" },
  { file: "community-2", likes: "1.8k" },
  { file: "community-3", likes: "3.1k" },
  { file: "community-4", likes: "1.2k" },
  { file: "community-5", likes: "4.6k" },
  { file: "community-6", likes: "2.9k" },
];

export default function CommunitySection() {
  return (
    <section className="bg-surface py-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <p className="text-xs tracking-widest-xl uppercase text-muted mb-2">
            Tag @dopebeyond for a chance to be featured
          </p>
          <h2 className="font-display text-2xl sm:text-3xl uppercase">Join Our Community</h2>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {IMAGES.map((img) => (
            <div key={img.file} className="relative aspect-[3/4] bg-surface-2 overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/lifestyle/${img.file}.svg`}
                alt="Community post"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute bottom-2 left-2 text-[10px] text-white flex items-center gap-1">
                ♥ {img.likes}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
