import Hero from "@/components/Hero";
import StickyFeatures from "@/components/StickyFeatures";
import PhotoGallery from "@/components/PhotoGallery";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <StickyFeatures />
      <PhotoGallery />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
