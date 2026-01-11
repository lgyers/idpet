import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-soft px-4 py-20">
      <div className="container max-w-6xl mx-auto text-center">
        <div className="space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/30 backdrop-blur-sm border border-secondary/50 text-secondary-foreground text-sm font-medium mb-4 animate-scale-in">
            <Sparkles className="w-4 h-4" />
            AI 驱动的宠物创意照片
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
            让你的爱宠
            <br />
            <span className="bg-gradient-warm bg-clip-text text-transparent">
              绽放独特魅力
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            上传宠物照片，AI 瞬间生成专业证件照、职业造型、文化风格等创意照片
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              variant="hero" 
              size="lg"
              className="text-lg px-8 py-6 rounded-full"
            >
              立即开始创作
            </Button>
            <Button 
              variant="glass" 
              size="lg"
              className="text-lg px-8 py-6 rounded-full text-foreground"
            >
              查看案例
            </Button>
          </div>
          
          <div className="pt-12 text-sm text-muted-foreground">
            已为 10,000+ 位宠物主人生成创意照片
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
    </section>
  );
};

export default Hero;
