"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, X, Loader } from "lucide-react";

interface UserData {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  subscription: {
    tier: string;
    quotaMonth: number;
    quotaResetDate: string;
  };
}

interface QuotaInfo {
  tier: string;
  quotaMonth: number;
  quotaUsed: number;
  quotaRemaining: number;
  quotaResetDate: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserData | null>(null);
  const [quota, setQuota] = useState<QuotaInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated") {
      fetchUserData();
    }
  }, [status, router]);

  const fetchUserData = async () => {
    try {
      const [userRes, quotaRes] = await Promise.all([
        fetch("/api/user"),
        fetch("/api/quota"),
      ]);

      if (userRes.ok) {
        setUser(await userRes.json());
      }

      if (quotaRes.ok) {
        setQuota(await quotaRes.json());
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setError("加载用户信息失败");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (priceId: string) => {
    setCheckingOut(true);
    try {
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
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "升级失败，请重试");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("升级失败，请重试");
    } finally {
      setCheckingOut(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[image:var(--gradient-soft)]">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto text-[hsl(var(--brand-coral))]" />
          <p className="mt-4 text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user || !quota) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[image:var(--gradient-soft)]">
        <div className="text-center">
          <p className="text-red-600 mb-4">加载失败</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-[hsl(var(--brand-coral))] text-white rounded-lg hover:opacity-90"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const resetDate = new Date(quota.quotaResetDate);
  const isPro = quota.tier === "pro";
  const isBasic = quota.tier === "basic";
  const isFree = quota.tier === "free";

  return (
    <div className="min-h-screen bg-[image:var(--gradient-soft)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 用户信息卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[hsl(var(--glass-bg))] backdrop-blur-md border border-[hsl(var(--glass-border))] rounded-2xl shadow-card p-8 mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {user.name || user.email}
              </h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">当前套餐</p>
              <p className="text-2xl font-bold text-[hsl(var(--brand-coral))] capitalize">
                {quota.tier === "free" ? "免费版" : quota.tier === "basic" ? "基础版" : "专业版"}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {error}
            </div>
          )}
        </motion.div>

        {/* 配额统计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[hsl(var(--glass-bg))] backdrop-blur-md border border-[hsl(var(--glass-border))] rounded-2xl shadow-card p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">配额统计</h2>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
              <p className="text-sm text-muted-foreground mb-2">每月限额</p>
              <p className="text-3xl font-bold text-blue-600">{quota.quotaMonth}</p>
            </div>
            <div className="bg-green-50/50 rounded-lg p-4 border border-green-100">
              <p className="text-sm text-muted-foreground mb-2">已使用</p>
              <p className="text-3xl font-bold text-green-600">{quota.quotaUsed}</p>
            </div>
            <div className="bg-purple-50/50 rounded-lg p-4 border border-purple-100">
              <p className="text-sm text-muted-foreground mb-2">剩余</p>
              <p className="text-3xl font-bold text-purple-600">{quota.quotaRemaining}</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">使用进度</span>
              <span className="text-sm text-muted-foreground">
                {((quota.quotaUsed / quota.quotaMonth) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-[image:var(--gradient-warm)] h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min((quota.quotaUsed / quota.quotaMonth) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            下次重置日期：{resetDate.toLocaleDateString("zh-CN")}
          </p>
        </motion.div>

        {/* 升级建议 */}
        {isFree && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[image:var(--gradient-warm)] rounded-2xl shadow-lg p-8 mb-8 text-white"
          >
            <h3 className="text-2xl font-bold mb-2">升级你的账户</h3>
            <p className="text-white/90 mb-6">
              获得更高的配额、更高的分辨率和优先队列
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleUpgrade(process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC || "")}
                disabled={checkingOut}
                className="px-6 py-3 bg-white text-[hsl(var(--brand-coral))] rounded-lg font-semibold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {checkingOut ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    处理中...
                  </>
                ) : (
                  <>
                    升级到基础版
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <button
                onClick={() => handleUpgrade(process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || "")}
                disabled={checkingOut}
                className="px-6 py-3 bg-white/20 text-white rounded-lg font-semibold border border-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                升级到专业版
              </button>
            </div>
          </motion.div>
        )}

        {/* 套餐对比 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[hsl(var(--glass-bg))] backdrop-blur-md border border-[hsl(var(--glass-border))] rounded-2xl shadow-card p-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">套餐对比</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-4 px-4 font-semibold text-foreground">功能</th>
                  <th className="text-center py-4 px-4 font-semibold text-foreground">免费版</th>
                  <th className="text-center py-4 px-4 font-semibold text-foreground">基础版</th>
                  <th className="text-center py-4 px-4 font-semibold text-foreground">专业版</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-4 px-4 text-foreground">月生成次数</td>
                  <td className="text-center py-4 px-4 text-muted-foreground">5</td>
                  <td className="text-center py-4 px-4 text-muted-foreground">50</td>
                  <td className="text-center py-4 px-4 text-muted-foreground">无限制</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-4 px-4 text-foreground">分辨率</td>
                  <td className="text-center py-4 px-4 text-muted-foreground">512×512</td>
                  <td className="text-center py-4 px-4 text-muted-foreground">768×768</td>
                  <td className="text-center py-4 px-4 text-muted-foreground">1024×1024</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-4 px-4 text-foreground">优先队列</td>
                  <td className="text-center py-4 px-4">
                    <X className="w-5 h-5 mx-auto text-red-500" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 mx-auto text-green-500" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 mx-auto text-green-500" />
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-4 px-4 text-foreground">自定义提示词</td>
                  <td className="text-center py-4 px-4">
                    <X className="w-5 h-5 mx-auto text-red-500" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 mx-auto text-green-500" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 mx-auto text-green-500" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-foreground">价格</td>
                  <td className="text-center py-4 px-4 font-bold text-foreground">免费</td>
                  <td className="text-center py-4 px-4 font-bold text-foreground">￥29/月</td>
                  <td className="text-center py-4 px-4 font-bold text-foreground">￥99/月</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* 页脚链接 */}
        <div className="mt-12 text-center">
          <Link href="/" className="text-[hsl(var(--brand-coral))] hover:text-[hsl(var(--brand-pink))] font-medium transition-colors">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
