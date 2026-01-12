"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  featured?: boolean;
  tier: string;
}

const pricingPlans: PricingPlan[] = [
  {
    name: "注册用户",
    price: "¥0",
    period: "每月",
    description: "先体验再决定，按天领取积分",
    features: [
      "每日赠送 1 积分（当日有效）",
      "1K（标准模型）：1 积分/张",
      "Banana Pro（2K/4K）不可用",
      "图片尺寸固定：1:1",
      "基础模板与功能",
    ],
    buttonText: "开始体验",
    tier: "free",
  },
  {
    name: "基础会员",
    price: "¥9.9",
    period: "每月",
    description: "¥9.9 起步，轻度使用更划算",
    features: [
      "每月赠送 20 积分",
      "分辨率（画质）：1K / 2K / 4K",
      "图片尺寸（长宽比）：1:1 / 3:4 / 9:16 等",
      "模型：Banana",
      "会员专享：可加购积分",
    ],
    buttonText: "立即订阅",
    featured: true,
    tier: "basic",
  },
  {
    name: "Pro 会员",
    price: "¥19.9",
    period: "每月",
    description: "更高额度，适合更频繁使用",
    features: [
      "每月赠送 60 积分",
      "分辨率（画质）：1K / 2K / 4K",
      "图片尺寸（长宽比）：1:1 / 3:4 / 9:16 等",
      "模型：Banana / Banana Pro / GPT-Img",
      "会员专享：可加购积分",
    ],
    buttonText: "立即订阅",
    tier: "pro",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState<string | null>(null);

  const handlePlanSelect = async (plan: PricingPlan) => {
    if (status !== "authenticated") {
      router.push("/auth/login?redirect=/pricing");
      return;
    }

    if (plan.tier === "free") {
      // 免费版直接跳转到上传页面
      router.push("/upload");
      return;
    }

    setLoading(plan.tier);

    try {
      // 获取价格ID
      let priceId = "";
      if (plan.tier === "basic") {
        priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC || "";
      } else if (plan.tier === "pro") {
        priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || "";
      }

      if (!priceId) {
        console.error("Price ID not configured for tier:", plan.tier);
        alert("支付配置错误，请稍后重试");
        return;
      }

      // 创建checkout session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          successUrl: "/dashboard",
          cancelUrl: "/pricing",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "支付失败，请重试");
        return;
      }

      // 重定向到Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("获取支付链接失败");
      }
    } catch (error) {
      console.error("订阅失败:", error);
      alert("订阅失败，请重试");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[image:var(--gradient-soft)]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[hsl(var(--brand-pink))]/15 blur-3xl" />
          <div className="absolute -top-28 left-24 h-[320px] w-[320px] rounded-full bg-[hsl(var(--brand-coral))]/15 blur-3xl" />
          <div className="absolute -top-40 right-16 h-[360px] w-[360px] rounded-full bg-[hsl(var(--brand-sage))]/15 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-20 pb-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass-bg))] backdrop-blur-md text-sm text-muted-foreground">
              按月订阅 · 积分消耗 · 分辨率阶梯计费
            </div>
            <h1 className="mt-6 text-5xl md:text-6xl font-bold text-foreground tracking-tight">
              选择适合你的套餐
            </h1>
            <p className="mt-5 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              分辨率与模型可选，消耗积分会随选择变化；默认以更省积分的配置开始。
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <Button variant="hero" size="lg" className="rounded-full" onClick={() => router.push("/upload")}>
                立即开始体验
              </Button>
              <Button variant="glass" size="lg" className="rounded-full" onClick={() => router.push("/generate")}>
                去生成页
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
        >
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + index * 0.08 }}
              className={[
                "relative rounded-2xl p-8 shadow-card backdrop-blur-md transition-all duration-300",
                plan.featured
                  ? "border-2 border-transparent bg-[hsl(var(--glass-bg))] scale-[1.02]"
                  : "border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass-bg))] hover:bg-muted/40",
              ].join(" ")}
              style={
                plan.featured
                  ? {
                      backgroundImage:
                        "linear-gradient(var(--background), var(--background)), var(--gradient-warm)",
                      backgroundOrigin: "border-box",
                      backgroundClip: "padding-box, border-box",
                    }
                  : undefined
              }
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-block px-4 py-1 rounded-full bg-[image:var(--gradient-warm)] text-white text-sm font-medium shadow-[var(--shadow-card)]">
                    推荐
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                </div>
              </div>

              <div className="mt-6 flex items-end gap-2">
                <div className="text-5xl font-bold text-foreground">{plan.price}</div>
                <div className="pb-1 text-sm text-muted-foreground">{plan.period}</div>
              </div>

              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-foreground/90">
                    <Check className="mt-0.5 h-5 w-5 text-[hsl(var(--brand-coral))] flex-shrink-0" />
                    <div className="text-sm leading-relaxed">{feature}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button
                  variant={plan.featured ? "hero" : "glass"}
                  size="lg"
                  className="w-full rounded-xl"
                  onClick={() => handlePlanSelect(plan)}
                  disabled={loading === plan.tier}
                >
                  {loading === plan.tier ? "处理中..." : plan.buttonText}
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 max-w-6xl mx-auto"
        >
          <div className="rounded-2xl border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass-bg))] backdrop-blur-md p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-2xl font-bold text-foreground">权益对比</div>
                <div className="mt-2 text-sm text-muted-foreground">基础会员与 Pro 会员支持更多选择。</div>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <div className="min-w-[760px] overflow-hidden rounded-xl border border-[hsl(var(--glass-border))] bg-background/30">
                <table className="w-full text-sm">
                  <thead className="bg-background/40">
                    <tr className="text-left">
                      <th className="px-4 py-3 font-semibold text-muted-foreground">项目</th>
                      <th className="px-4 py-3 font-semibold text-foreground">注册用户</th>
                      <th className="px-4 py-3 font-semibold text-foreground">基础会员</th>
                      <th className="px-4 py-3 font-semibold text-foreground">Pro 会员</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:not(:last-child)]:border-b [&_tr:not(:last-child)]:border-[hsl(var(--glass-border))]">
                    <tr>
                      <td className="px-4 py-3 font-medium text-muted-foreground">月度积分</td>
                      <td className="px-4 py-3 text-foreground">—</td>
                      <td className="px-4 py-3 text-foreground">20</td>
                      <td className="px-4 py-3 text-foreground">60</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-muted-foreground">每日赠送</td>
                      <td className="px-4 py-3 text-foreground">1（当日有效）</td>
                      <td className="px-4 py-3 text-foreground">—</td>
                      <td className="px-4 py-3 text-foreground">—</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-muted-foreground">分辨率（画质）</td>
                      <td className="px-4 py-3 text-foreground">仅 1K</td>
                      <td className="px-4 py-3 text-foreground">1K / 2K / 4K</td>
                      <td className="px-4 py-3 text-foreground">1K / 2K / 4K</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-muted-foreground">图片尺寸（长宽比）</td>
                      <td className="px-4 py-3 text-foreground">固定 1:1，不可更改</td>
                      <td className="px-4 py-3 text-foreground">1:1 / 3:4 / 9:16 等</td>
                      <td className="px-4 py-3 text-foreground">1:1 / 3:4 / 9:16 等</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-muted-foreground">模型选择</td>
                      <td className="px-4 py-3 text-foreground">Banana</td>
                      <td className="px-4 py-3 text-foreground">Banana</td>
                      <td className="px-4 py-3 text-foreground">Banana / Banana Pro / GPT-Img</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-muted-foreground">Banana Pro</td>
                      <td className="px-4 py-3 text-foreground">—</td>
                      <td className="px-4 py-3 text-foreground">—</td>
                      <td className="px-4 py-3 text-foreground">
                        <span className="inline-flex items-center gap-2">
                          <Check className="h-4 w-4 text-[hsl(var(--brand-sage))]" />
                          可用
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-muted-foreground">GPT-Img</td>
                      <td className="px-4 py-3 text-foreground">—</td>
                      <td className="px-4 py-3 text-foreground">—</td>
                      <td className="px-4 py-3 text-foreground">
                        <span className="inline-flex items-center gap-2">
                          <Check className="h-4 w-4 text-[hsl(var(--brand-sage))]" />
                          可用
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-muted-foreground">可加购积分</td>
                      <td className="px-4 py-3 text-foreground">—</td>
                      <td className="px-4 py-3 text-foreground">
                        <span className="inline-flex items-center gap-2">
                          <Check className="h-4 w-4 text-[hsl(var(--brand-sage))]" />
                          会员专享
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        <span className="inline-flex items-center gap-2">
                          <Check className="h-4 w-4 text-[hsl(var(--brand-sage))]" />
                          会员专享
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="mt-12 max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-2xl border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass-bg))] backdrop-blur-md p-8">
            <div>
              <div className="text-lg font-semibold text-foreground">积分消耗规则</div>
              <div className="mt-2 text-sm text-muted-foreground">分辨率越高消耗越多积分。</div>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-[hsl(var(--glass-border))] bg-background/40 p-4">
                <div className="text-sm font-semibold text-foreground">1K（标准模型）</div>
                <div className="mt-2 text-2xl font-bold text-foreground">1</div>
                <div className="text-xs text-muted-foreground">积分 / 张</div>
              </div>
              <div className="rounded-xl border border-[hsl(var(--glass-border))] bg-background/40 p-4">
                <div className="text-sm font-semibold text-foreground">2K</div>
                <div className="mt-2 text-2xl font-bold text-foreground">4</div>
                <div className="text-xs text-muted-foreground">积分 / 张</div>
              </div>
              <div className="rounded-xl border border-[hsl(var(--glass-border))] bg-background/40 p-4">
                <div className="text-sm font-semibold text-foreground">4K</div>
                <div className="mt-2 text-2xl font-bold text-foreground">5</div>
                <div className="text-xs text-muted-foreground">积分 / 张</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="mt-12 max-w-6xl mx-auto"
        >
          <div className="rounded-2xl border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass-bg))] backdrop-blur-md p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-2xl font-bold text-foreground">常见问题</div>
                <div className="mt-2 text-sm text-muted-foreground">关于积分、订阅与加购的说明。</div>
              </div>
            </div>

            <div className="mt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-[hsl(var(--glass-border))]">
                  <AccordionTrigger>每日赠送的 1 积分可以提现吗？会累积吗？</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    不可提现。每日赠送积分当日有效，不累积到次日。
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-[hsl(var(--glass-border))]">
                  <AccordionTrigger>成为会员后还会继续每日赠送 1 积分吗？</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    不会。会员按月发放会员积分，为避免叠加导致成本不可控，会员有效期内不再领取每日赠送。
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-[hsl(var(--glass-border))]">
                  <AccordionTrigger>为什么 2K/4K 消耗更多积分？</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    2K/4K 会调用成本更高的 Banana Pro 模型，因此使用更高的积分消耗用于覆盖成本与控量。
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" className="border-[hsl(var(--glass-border))]">
                  <AccordionTrigger>积分不够了怎么办？</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    会员可加购积分包；也可以升级到更高档位获得更多月度积分。
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5" className="border-[hsl(var(--glass-border))]">
                  <AccordionTrigger>订阅可以提现吗？可以随时取消吗？</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    支持随时取消订阅，取消后在当前周期内仍可使用已发放的会员权益与积分。
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 max-w-6xl mx-auto"
        >
          <div className="rounded-2xl border border-[hsl(var(--glass-border))] bg-[image:var(--gradient-warm)] p-10 text-white shadow-card">
            <div className="text-3xl font-bold">准备好开始了吗？</div>
            <div className="mt-3 text-white/90">上传一张宠物照片，选择模板，几步生成。</div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button variant="default" size="lg" className="rounded-full bg-white text-black hover:bg-white/90" onClick={() => router.push("/upload")}>
                立即上传
              </Button>
              <Button variant="glass" size="lg" className="rounded-full border-white/30 text-white hover:!text-white" onClick={() => router.push("/generate")}>
                去生成页
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
