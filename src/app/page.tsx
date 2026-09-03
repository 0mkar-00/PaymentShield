import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import ProductVisual from "@/components/landing/ProductVisual";
import FeatureCards from "@/components/landing/FeatureCards";
import ForFreelancers from "@/components/landing/ForFreelancers";
import TrustBanner from "@/components/landing/TrustBanner";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ProductVisual />
        <FeatureCards />
        <ForFreelancers />
        <TrustBanner />
      </main>
      <Footer />
    </>
  );
}
