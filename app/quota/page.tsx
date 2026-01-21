"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface QuotaInfo {
  tier: string;
  quotaMonth: number;
  quotaUsed: number;
  quotaRemaining: number;
  quotaResetDate: string;
}

export default function QuotaPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [quotaInfo, setQuotaInfo] = useState<QuotaInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated") {
      fetchQuotaInfo();
    }
  }, [status, router]);

  const fetchQuotaInfo = async () => {
    try {
      const response = await fetch("/api/quota");
      const data = await response.json();

      if (response.ok) {
        setQuotaInfo(data);
      } else {
        setError(data.error || "获取配额信息失败");
      }
    } catch (err) {
      setError("获取配额信息失败");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  if (!quotaInfo) {
    return null;
  }

  const usagePercentage = (quotaInfo.quotaUsed / quotaInfo.quotaMonth) * 100;
  const isLowQuota = quotaInfo.quotaRemaining <= 2;
  const isOutOfQuota = quotaInfo.quotaRemaining <= 0;

  const getTierName = (tier: string) => {
    const tierNames: Record<string, string> = {
      free: "免费版",
      basic: "基础版",
      pro: "专业版",
      enterprise: "企业版",
    };
    return tierNames[tier] || tier;
  };

  const getTierColor = (tier: string) => {
    const tierColors: Record<string, string> = {
      free: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
      basic: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
      pro: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200",
      enterprise: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
    };
    return tierColors[tier] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">我的配额</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">查看和管理你的生成配额</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 配额概览卡片 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">配额概览</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(quotaInfo.tier)}`}>
                {getTierName(quotaInfo.tier)}
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span>本月已使用</span>
                  <span>{quotaInfo.quotaUsed} / {quotaInfo.quotaMonth} 次</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      isOutOfQuota
                        ? "bg-red-500"
                        : isLowQuota
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{quotaInfo.quotaRemaining}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">剩余次数</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{quotaInfo.quotaMonth}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">月度总额</div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>重置日期：</strong>
                  {new Date(quotaInfo.quotaResetDate).toLocaleDateString("zh-CN")}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                  配额将在每月此日期重置
                </p>
              </div>

              {isLowQuota && (
                <div
                  className={`p-4 rounded-lg ${
                    isOutOfQuota ? "bg-red-50 dark:bg-red-950/40" : "bg-yellow-50 dark:bg-yellow-950/40"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      isOutOfQuota ? "text-red-800 dark:text-red-200" : "text-yellow-800 dark:text-yellow-200"
                    }`}
                  >
                    {isOutOfQuota
                      ? "你的配额已用完，请升级套餐以继续生成"
                      : "你的配额即将用完，考虑升级套餐获得更多额度"}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* 套餐信息卡片 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">套餐升级</h2>

            <div className="space-y-4">
              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">免费版</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">适合偶尔使用</p>
                  </div>
                  {quotaInfo.tier === "free" && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 text-xs rounded-full">
                      当前
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  ¥0<span className="text-sm font-normal text-gray-600 dark:text-gray-300">/月</span>
                </div>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>每月5次生成</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>基础模板</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>标准质量</li>
                </ul>
                {quotaInfo.tier !== "free" && (
                  <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    降级
                  </button>
                )}
              </div>

              <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50 dark:bg-blue-950/40">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">基础版</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">适合经常使用</p>
                  </div>
                  {quotaInfo.tier === "basic" && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 text-xs rounded-full">
                      当前
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  ¥29<span className="text-sm font-normal text-gray-600 dark:text-gray-300">/月</span>
                </div>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>每月50次生成</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>全部模板</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>高质量输出</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>优先处理</li>
                </ul>
                {quotaInfo.tier !== "basic" ? (
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    升级
                  </button>
                ) : (
                  <button className="w-full px-4 py-2 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-200 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30">
                    管理订阅
                  </button>
                )}
              </div>

              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">专业版</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">适合专业用户</p>
                  </div>
                  {quotaInfo.tier === "pro" && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 text-xs rounded-full">
                      当前
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  ¥99<span className="text-sm font-normal text-gray-600 dark:text-gray-300">/月</span>
                </div>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>无限生成</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>全部模板</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>超高画质</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>最快处理</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>API访问</li>
                </ul>
                {quotaInfo.tier !== "pro" ? (
                  <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    升级
                  </button>
                ) : (
                  <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    管理订阅
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>需要帮助？</strong> 联系我们的客服团队获取更多信息。
              </p>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                联系客服 →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
