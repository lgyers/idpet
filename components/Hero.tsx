import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[image:var(--gradient-soft)] px-4 py-24">
      <div className="container max-w-4xl mx-auto text-center">
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