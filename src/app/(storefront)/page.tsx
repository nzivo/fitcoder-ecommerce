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
import { getCategories, getFeaturedProducts } from "@/lib/data";

export default async function HomePage() {
  const [products, categories] = await Promise.all([getFeaturedProducts(4), getCategories()]);

  return (
    <>
      <Hero />
      <Marquee />
      <TrendingSection products={products} />
      <CategorySection categories={categories} />
      <StorySection />
      <WinterBanner />
      <CommunitySection />
      <Testimonials />
      <FaqSection />
      <LifestyleBanner />
    </>
  );
}
