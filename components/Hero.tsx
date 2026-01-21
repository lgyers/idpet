import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const heroMosaicImages = [
  "/assets/examples/haimati/baityanzhao/cat-british-shorthair-v2.png",
  "/assets/examples/haimati/baityanzhao/cat-siamese-v1.png",
  "/assets/examples/haimati/baityanzhao/dog-chinese-rural-v4.png",
  "/assets/examples/haimati/baityanzhao/dog-corgi-v3.png",
  "/assets/examples/haimati/blue-id/cat-british-shorthair-v2.png",
  "/assets/examples/haimati/blue-id/cat-zhonghua-tianyuan-v1.png",
  "/assets/examples/haimati/blue-id/dog-corgi-v3.png",
  "/assets/examples/haimati/blue-id/dog-labrador-v4.png",
  "/assets/examples/haimati/doctor/cat-siamese-v2.png",
  "/assets/examples/haimati/doctor/cat-zhonghua-tianyuan-v1.png",
  "/assets/examples/haimati/doctor/dog-corgi-v4.png",
  "/assets/examples/haimati/doctor/dog-golden-retriever-v3.png",
  "/assets/examples/haimati/golden-wedding/cat-british-shorthair-v2.png",
  "/assets/examples/haimati/golden-wedding/cat-siamese-v1.png",
  "/assets/examples/haimati/golden-wedding/dog-corgi-v3.png",
  "/assets/examples/haimati/golden-wedding/dog-labrador-v4.png",
  "/assets/examples/haimati/graduation/cat-ragdoll-v2.png",
  "/assets/examples/haimati/graduation/cat-siamese-v1.png",
  "/assets/examples/haimati/graduation/dog-chinese-rural-v3.png",
  "/assets/examples/haimati/graduation/dog-corgi-v4.png",
  "/assets/examples/haimati/ironman/cat-british-shorthair-v2.png",
  "/assets/examples/haimati/ironman/cat-zhonghua-tianyuan-v1.png",
  "/assets/examples/haimati/ironman/dog-corgi-v3.png",
  "/assets/examples/haimati/ironman/dog-labrador-v4.png",
  "/assets/examples/haimati/japanese-kawaii/cat-ragdoll-v2.png",
  "/assets/examples/haimati/japanese-kawaii/cat-siamese-v1.png",
  "/assets/examples/haimati/japanese-kawaii/dog-chinese-rural-v3.png",
  "/assets/examples/haimati/japanese-kawaii/dog-corgi-v4.png",
  "/assets/examples/haimati/oriental-aesthetic/cat-british-shorthair-v2.png",
  "/assets/examples/haimati/oriental-aesthetic/cat-ragdoll-v1.png",
  "/assets/examples/haimati/oriental-aesthetic/dog-golden-retriever-v4.png",
  "/assets/examples/haimati/oriental-aesthetic/dog-labrador-v3.png",
  "/assets/examples/haimati/tangzhuang/cat-ragdoll-v1.png",
  "/assets/examples/haimati/tangzhuang/cat-siamese-v2.png",
  "/assets/examples/haimati/tangzhuang/dog-corgi-v3.png",
  "/assets/examples/haimati/tangzhuang/dog-golden-retriever-v4.png",
  "/assets/examples/haimati/wedding/cat-ragdoll-v1.png",
  "/assets/examples/haimati/wedding/cat-siamese-v2.png",
  "/assets/examples/haimati/wedding/dog-golden-retriever-v4.png",
  "/assets/examples/haimati/wedding/dog-labrador-v3.png",
  "/assets/examples/haimati/white-collar/cat-ragdoll-v1.png",
  "/assets/examples/haimati/white-collar/cat-zhonghua-tianyuan-v2.png",
  "/assets/examples/haimati/white-collar/dog-chinese-rural-v4.png",
  "/assets/examples/haimati/white-collar/dog-labrador-v3.png",
];

const Hero = () => {
  return (
    <section className="relative isolate min-h-screen flex items-center justify-center bg-[image:var(--gradient-soft)] px-4 py-24 overflow-hidden">
      <div aria-hidden className="absolute inset-0">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 -rotate-6 scale-110">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-1 opacity-55">
              {heroMosaicImages.map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  className="relative w-full h-28 sm:h-32 md:h-36 lg:h-40 xl:h-44"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 14vw, (min-width: 1024px) 16vw, (min-width: 768px) 20vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 18% 18%, hsl(var(--brand-pink) / 0.22), transparent 55%), radial-gradient(circle at 78% 62%, hsl(var(--brand-coral) / 0.18), transparent 58%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/55 via-background/80 to-background" />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.10) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            maskImage: "radial-gradient(circle at center, black, transparent 68%)",
            WebkitMaskImage: "radial-gradient(circle at center, black, transparent 68%)",
          }}
        />
      </div>

      <div className="container max-w-4xl mx-auto text-center relative z-10">
        <div className="space-y-8">
          {/* 顶部徽标/标签 */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--brand-pink))]/20 border border-[hsl(var(--brand-pink))]/30 text-[hsl(var(--brand-coral))] text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI 驱动的宠物创意照片
          </div>

          {/* 标题 */}
          <h1 className="text-[40px] sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            让你的爱宠
            <br />
            <span className="bg-[image:var(--gradient-warm)] bg-clip-text text-transparent">
              绽放独特魅力
            </span>
          </h1>

          {/* 副标题文案 */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            上传宠物照片，AI 瞬间生成专业证件照、职业造型、文化风格等创意照片
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/upload">
              <Button
                variant="hero"
                size="lg"
                className="text-base sm:text-lg px-8 py-6 rounded-full"
              >
                立即开始创作
              </Button>
            </Link>
            <Button
              variant="glass"
              size="lg"
              className="text-base sm:text-lg px-8 py-6 rounded-full text-foreground"
            >
              查看案例
            </Button>
          </div>

          {/* 数据背书 */}
          <div className="pt-10 text-sm text-muted-foreground">
            已为 10,000+ 位宠物主人生成创意照片
          </div>
        </div>
      </div>

      {/* 装饰元素（轻量） */}
      <div className="absolute top-24 left-8 w-20 h-20 bg-[hsl(var(--brand-coral))]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-24 right-8 w-32 h-32 bg-[hsl(var(--brand-pink))]/10 rounded-full blur-3xl" />
    </section>
  );
};

export default Hero;
