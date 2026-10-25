import CategorySlider from '@/components/section/home/category-slider';
import FlashSale from '@/components/section/home/flash-sale';
import TrustFeatures from '@/components/section/home/trust-features';
import BestSellers from '@/components/section/home/best-sellers';
import PopularBrands from '@/components/section/home/popular-brands';
import FAQSection from '@/components/section/home/faq-section';
import FeaturedProducts from '@/components/section/home/featured-products';
import TopRatedProducts from '@/components/section/home/top-rated-products';
import HeroBanner from '@/components/section/home/hero-banner';
import NewArrivalsPage from '@/components/section/home/new-arrivals';
import SectionBanner from '@/components/section/home/section-banner';
import JustForYouSection from '@/components/section/home/Justforyousection';


export default function HomePage() {
  return (
    <main>
      <HeroBanner />

      <TrustFeatures />

      <CategorySlider />

      <SectionBanner placement="FLASH_SALE" />
      <FlashSale />

      <SectionBanner placement="NEW_ARRIVALS" />
      <NewArrivalsPage />

      <SectionBanner placement="BEST_SELLERS" />
      <BestSellers />

      <SectionBanner placement="FEATURED_PRODUCTS" />
      <FeaturedProducts />

      <SectionBanner placement="TOP_RATED_PRODUCTS" />
      <TopRatedProducts />
 <JustForYouSection/>
      <PopularBrands />
     

      <FAQSection />
    </main>
  );
}