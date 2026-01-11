"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
    name: "免费版",
    price: "¥0",
    period: "每月",
    description: "适合初次体验的用户",
    features: [
      "每月5次生成",
      "基础场景模板",
      "标准分辨率",
      "社区支持",
      "生成历史保存7天",
    ],
    buttonText: "开始使用",
    tier: "free",
  },
  {
    name: "基础版",
    price: "¥29",
    period: "每月",
    description: "适合轻度使用的用户",
    features: [
      "每月50次生成",
      "全部场景模板",
      "高清分辨率",
      "优先处理",
      "生成历史保存30天",
      "邮件支持",
    ],
    buttonText: "立即订阅",
    featured: true,
    tier: "basic",
  },
  {
    name: "专业版",
    price: "¥99",
    period: "每月",
    description: "适合专业用户和商家",
    features: [
      "每月200次生成",
      "全部场景模板",
      "4K超高清分辨率",
      "优先处理 + 批量生成",
      "生成历史永久保存",
      "24/7专属客服",
      "API访问权限",
      "自定义模板",
    ],
    buttonText: "立即订阅",
    tier: "pro",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
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
    <div className="min-h-screen bg-[image:var(--gradient-soft)] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-foreground mb-6">选择适合你的套餐</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            从免费版开始体验，或选择高级套餐解锁更多功能
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={[
                "relative rounded-2xl shadow-card overflow-hidden backdrop-blur-sm transition-all duration-300",
                plan.featured
                  ? "border-2 border-[hsl(var(--brand-pink))] bg-[hsl(var(--glass-bg))] transform scale-105 z-10"
                  : "border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass-bg))] hover:bg-muted/50"
              ].filter(Boolean).join(" ")}
            >
              {plan.featured && (
                <div className="absolute top-0 left-0 right-0 bg-[image:var(--gradient-warm)] text-white text-center py-2 text-sm font-semibold">
                  推荐
                </div>
              )}

              <div className={`p-8 ${plan.featured ? "pt-12" : ""}`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-[hsl(var(--brand-coral))] mr-3 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelect(plan)}
                  disabled={loading === plan.tier}
                  className={[
                    "w-full py-3 px-6 rounded-xl font-semibold transition-all shadow-lg",
                    plan.featured
                      ? "bg-[image:var(--gradient-warm)] text-white hover:opacity-90 shadow-[hsl(var(--brand-coral))]/20"
                      : "bg-background text-foreground border border-border hover:bg-muted",
                    loading === plan.tier ? "opacity-50 cursor-not-allowed" : ""
                  ].filter(Boolean).join(" ")}
                >
                  {loading === plan.tier ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      处理中...
                    </span>
                  ) : (
                    plan.buttonText
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-4">不满意？我们提供30天无理由退款保证</p>
          <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
            <span>✓ 随时升级或降级</span>
            <span>✓ 安全支付</span>
            <span>✓ 24/7客户支持</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}