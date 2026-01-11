import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "体验版",
    price: "19",
    description: "适合初次尝试的宠物主人",
    features: [
      "5 张 AI 创意照片",
      "2 种风格选择",
      "标准画质输出",
      "3 天交付",
      "基础客服支持",
    ],
    popular: false,
  },
  {
    name: "标准版",
    price: "49",
    description: "最受欢迎的套餐选择",
    features: [
      "20 张 AI 创意照片",
      "5 种风格选择",
      "高清画质输出",
      "1 天交付",
      "优先客服支持",
      "免费重制 1 次",
    ],
    popular: true,
  },
  {
    name: "专业版",
    price: "99",
    description: "适合追求极致品质的用户",
    features: [
      "50 张 AI 创意照片",
      "所有风格无限制",
      "超高清画质输出",
      "当天交付",
      "1 对 1 专属客服",
      "免费重制 3 次",
      "赠送实体照片 5 张",
    ],
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section className="relative py-20 bg-[image:var(--gradient-soft)]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            灵活的价格方案
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            选择最适合你的套餐，开始创作独特的宠物照片
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative p-8 rounded-2xl transition-all duration-300 hover:shadow-soft bg-card ${
                plan.popular
                  ? "border-2 border-transparent shadow-[var(--shadow-soft)] scale-[1.02]"
                  : "border border-[hsl(var(--brand-pink))]/20 hover:border-2 hover:border-transparent hover:bg-[image:linear-gradient(var(--background),_var(--background)),_var(--gradient-warm)] hover:[background-origin:border-box] hover:[background-clip:padding-box,_border-box] hover:shadow-[var(--shadow-soft)] hover:scale-[1.02]"
              }`}
              style={
                plan.popular
                  ? {
                      backgroundImage:
                        "linear-gradient(var(--background), var(--background)), var(--gradient-warm)",
                      backgroundOrigin: "border-box",
                      backgroundClip: "padding-box, border-box",
                      border: "2px solid transparent",
                    }
                  : undefined
              }
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-block px-4 py-1 rounded-full bg-[image:var(--gradient-warm)] text-white text-sm font-medium shadow-[var(--shadow-card)]">
                    最受欢迎
                  </span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-foreground">
                    ¥{plan.price}
                  </span>
                  <span className="text-muted-foreground">/次</span>
                </div>

                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-foreground"
                    >
                      <Check className="w-5 h-5 text-[hsl(var(--brand-pink))] mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.popular ? (
                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full rounded-full cursor-pointer"
                  >
                    {`选择${plan.name}`}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full rounded-full bg-white border-[hsl(var(--brand-pink))]/30 cursor-pointer"
                  >
                    {`选择${plan.name}`}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;