import { useEffect, useRef, useState } from "react";
import galleryDoctor from "@/assets/gallery-doctor.jpg";
import galleryPilot from "@/assets/gallery-pilot.jpg";
import galleryMusician from "@/assets/gallery-musician.jpg";
import galleryModel from "@/assets/gallery-model.jpg";
import galleryFirefighter from "@/assets/gallery-firefighter.jpg";
import galleryTeacher from "@/assets/gallery-teacher.jpg";
import galleryArtist from "@/assets/gallery-artist.jpg";
import galleryScientist from "@/assets/gallery-scientist.jpg";
import galleryPolice from "@/assets/gallery-police.jpg";

const leftColumn = [
  { image: galleryDoctor, label: "医生" },
  { image: galleryMusician, label: "音乐家" },
  { image: galleryFirefighter, label: "消防员" },
];

const centerColumn = [
  { image: galleryPilot, label: "飞行员" },
  { image: galleryModel, label: "时尚模特" },
  { image: galleryTeacher, label: "教师" },
];

const rightColumn = [
  { image: galleryArtist, label: "艺术家" },
  { image: galleryScientist, label: "科学家" },
  { image: galleryPolice, label: "警察" },
];

const StickyFeatures = () => {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollProgress = Math.max(0, -rect.top);
        setScrollY(scrollProgress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="relative py-20 bg-muted/20 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            创意照片画廊
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            探索无限可能，让你的宠物成为任何角色
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Left column - scrolls down */}
          <div 
            className="space-y-6 transition-transform duration-100 ease-linear"
            style={{ 
              transform: `translateY(-${scrollY * 0.15}px)` 
            }}
          >
            {leftColumn.map((item, index) => (
              <div
                key={index}
                className="relative group rounded-2xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold">{item.label}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Center column - fixed (no scroll) */}
          <div className="space-y-6">
            {centerColumn.map((item, index) => (
              <div
                key={index}
                className="relative group rounded-2xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold">{item.label}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Right column - scrolls up */}
          <div 
            className="space-y-6 transition-transform duration-100 ease-linear"
            style={{ 
              transform: `translateY(${scrollY * 0.15}px)` 
            }}
          >
            {rightColumn.map((item, index) => (
              <div
                key={index}
                className="relative group rounded-2xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold">{item.label}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StickyFeatures;
