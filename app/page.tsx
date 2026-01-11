import Hero from "@/components/Hero";
import StickyFeatures from "@/components/StickyFeatures";
import PhotoGallery from "@/components/PhotoGallery";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <StickyFeatures />
      <PhotoGallery />
      <Pricing />
      <FAQ />
    </div>
  );
}
