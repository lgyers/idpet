"use client";

import { useEffect, useRef, useState } from "react";

const photos = [
  {
    id: 1,
    image: "/assets/pet-business.jpg",
    title: "职业证件照",
    description: "专业商务形象，适合办公场景使用",
  },
  {
    id: 2,
    image: "/assets/pet-chef.jpg",
    title: "职业角色 - 大厨",
    description: "化身专业厨师，展现萌宠的烹饪天赋",
  },
  {
    id: 3,
    image: "/assets/pet-traditional.jpg",
    title: "传统文化风格",
    description: "中国风汉服造型，尽显东方韵味",
  },
  {
    id: 4,
    image: "/assets/pet-astronaut.jpg",
    title: "太空宇航员",
    description: "探索星辰大海，开启宇宙之旅",
  },
];

const PhotoGallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const scrollPosition = window.scrollY;
      const containerTop = container.offsetTop;
      const windowHeight = window.innerHeight;
      
      // Calculate which photo should be active based on scroll
      const scrollOffset = scrollPosition - containerTop + windowHeight / 2;
      const photoHeight = windowHeight * 0.8;
      const newIndex = Math.max(0, Math.min(photos.length - 1, Math.floor(scrollOffset / photoHeight)));
      
      setActiveIndex(newIndex);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={containerRef} className="relative bg-background py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            AI 创意照片展示
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            每一张都是独一无二的艺术作品
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Sticky image container */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-soft">
              <img
                src={photos[activeIndex].image}
                alt={photos[activeIndex].title}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">{photos[activeIndex].title}</h3>
                <p className="text-white/90">{photos[activeIndex].description}</p>
              </div>
            </div>
          </div>

          {/* Scrolling content */}
          <div className="space-y-8">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className={`min-h-[80vh] flex items-center transition-opacity duration-500 ${
                  activeIndex === index ? "opacity-100" : "opacity-40"
                }`}
              >
                <div className="space-y-6">
                  <div className="inline-block">
                    <span className="text-6xl font-bold text-[hsl(var(--brand-pink))]/20">0{photo.id}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-foreground">{photo.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {photo.description}
                  </p>
                  <div className="pt-4">
                    <button className="inline-flex items-center gap-2 text-[hsl(var(--brand-pink))] hover:text-[hsl(var(--brand-pink))]/80 transition-colors cursor-pointer">
                      <span className="text-sm font-medium">了解更多</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;