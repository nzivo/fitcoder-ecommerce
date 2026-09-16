import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import TrendingSection from "@/components/home/TrendingSection";
import CategorySection from "@/components/home/CategorySection";
import StorySection from "@/components/home/StorySection";
import WinterBanner from "@/components/home/WinterBanner";
import CommunitySection from "@/components/home/CommunitySection";
import Testimonials from "@/components/home/Testimonials";
import FaqSection from "@/components/home/FaqSection";
import LifestyleBanner from "@/components/home/LifestyleBanner";
import { getCategories, getFaqs, getFeaturedProducts, getSiteSections, getTestimonials } from "@/lib/data";

export default async function HomePage() {
  const [products, categories, sections, testimonials, faqs] = await Promise.all([
    getFeaturedProducts(4),
    getCategories(),
    getSiteSections(),
    getTestimonials(),
    getFaqs("home"),
  ]);

  return (
    <>
      <Hero section={sections.hero ?? null} />
      <Marquee />
      <TrendingSection products={products} />
      <CategorySection categories={categories} />
      <StorySection section={sections.story ?? null} />
      <WinterBanner section={sections.winter_banner ?? null} />
      <CommunitySection />
      <Testimonials testimonials={testimonials} />
      <FaqSection faqs={faqs} />
      <LifestyleBanner section={sections.lifestyle_banner ?? null} />
    </>
  );
}
